import { Component, Host, h, State, Element, EventEmitter, Event, Prop, Watch } from '@stencil/core';
import { firstValueFrom } from 'rxjs';
import { OverlayMouseMovement } from '../../services/overlayMovementService';
import { treesDB } from '../../services/tree/treesDB';

const THRESHOLD = 0.8;

@Component({
  tag: 'pal-floatable',
  styleUrl: 'pal-floatable.css',
})
export class PalFloatable {
  @Prop() panelId: string;
  @Prop() position: PanelPosition;
  @Prop() intresectionObserver: IntersectionObserver;
  @State() movements: number[] = [0, 0];
  @State() ctrlPressed: boolean = false;
  @Event({ bubbles: true, composed: true, cancelable: true }) requestOverlay: EventEmitter<{ status: boolean; clearance?: () => void }>;
  @Event({ bubbles: true, composed: true, cancelable: true }) submitTransform: EventEmitter<{ panelId: string; transform: Partial<PanelTransform> }>;
  @Event({ bubbles: true, composed: true, cancelable: true }) changePanelDisplayMode: EventEmitter<DisplayModeChange>;
  @Element() floatableElm: HTMLDivElement;
  private isMouseDown: boolean;
  private moveStarted = false;
  private startX: number;
  private startY: number;
  private moverHeight: number;
  private overlayMovementService: OverlayMouseMovement;
  private intersectionObserver = new IntersectionObserver(
    entries => {
      console.log(entries);
      entries.forEach(this.calcIntersectionCorrection);
    },
    { threshold: THRESHOLD },
  );
  container: HTMLElement;
  moverElm: HTMLElement;

  ctrlPrfessedHandler = event => {
    this.ctrlPressed = event.ctrlKey;
  };

  @Watch('position')
  updateMovements(position: PanelPosition) {
    if ((position && position?.left !== this.movements?.[0]) || position?.top !== this.movements?.[1]) {
      this.movements = [position?.left, position?.top];
    }
  }

  componentWillLoad() {
    this.updateMovements(this.position);
    this.container = this.floatableElm.closest('.main');
  }

  componentDidLoad() {
    this.intersectionObserver?.observe(this.floatableElm);
    window.addEventListener('keydown', this.ctrlPrfessedHandler, false);
    window.addEventListener('keyup', this.ctrlPrfessedHandler, false);
    this.moverHeight = this.moverElm.clientHeight;
    this.floatableElm.addEventListener('tabDrag', ev => {
      !this.ctrlPressed && ev.stopPropagation();
    });
  }

  disconnectedCallback() {
    this.intersectionObserver?.unobserve(this.floatableElm);
    this.floatableElm.removeEventListener('keydown', this.ctrlPrfessedHandler);
    this.floatableElm.removeEventListener('keyup', this.ctrlPrfessedHandler);
    this.clearance();
  }

  // Events
  mouseDownHandler = (event: MouseEvent) => {
    if (event.ctrlKey) return;
    this.isMouseDown = true;
    document.addEventListener('mousemove', this.mouseMoveHandler);
    document.addEventListener('mouseup', this.mouseUpHandler);

    this.requestOverlay.emit({ status: true });
    this.startX = event.clientX - this.floatableElm.getBoundingClientRect().left;
    this.startY = event.clientY - this.floatableElm.getBoundingClientRect().top + this.moverHeight;
  };

  mouseMoveHandler = ({ movementX, movementY, ctrlKey }: MouseEvent) => {
    const majoreMove = Math.abs((movementX || 1) * (movementY || 1)) > 2;
    if (ctrlKey) {
      return;
    }
    if (this.isMouseDown && majoreMove && !this.moveStarted) {
      this.moveStarted = true;
      this.overlayMovementService = new OverlayMouseMovement(this.panelId);
      this.overlayMovementService.start();
      const moveSubs = this.overlayMovementService.movements$.subscribe(this.moveLogic);
      firstValueFrom(this.overlayMovementService.moveEnd$).then(() => {
        console.log('end');
        this.mouseUpHandler();
        moveSubs.unsubscribe();
      });
    }
  };

  private moveLogic = (event: MouseEvent) => {
    const x = event.clientX - this.startX;
    const y = event.clientY - this.startY;
    const maxX = this.container.clientWidth - this.floatableElm.clientWidth;
    const maxY = this.container.clientHeight - this.floatableElm.clientHeight;
    const newX = Math.min(Math.max(x, 0), maxX);
    const newY = Math.min(Math.max(y, 0), maxY);
    this.movements = [newX, newY];
  };

  mouseUpHandler = () => {
    this.overlayMovementService?.stop();
    this.clearance();
    const { offsetTop, offsetLeft } = this.floatableElm;
    const transform: PanelPosition = { top: offsetTop, left: offsetLeft };
    this.submitTransform.emit({ panelId: this.panelId, transform });
  };

  clearance = () => {
    document.removeEventListener('mousemove', this.mouseMoveHandler);
    document.removeEventListener('mouseup', this.mouseUpHandler);
    this.isMouseDown = false;
    this.moveStarted = false;
  };

  private calcIntersectionCorrection = async ({ isIntersecting, target }) => {
    if (isIntersecting) return;
    const panelId = target.panelId;
    const panelData = await treesDB.treesItems.get(panelId);
    this.changePanelDisplayMode.emit({ panelId, treeId: panelData.treeId, displayMode: 'minimize' });
  };

  render() {
    const [x, y] = this.movements;
    const style = { top: y + 'px', left: x + 'px' };
    return (
      <Host id="container" style={style}>
        <div
          ref={el => {
            this.moverElm = el;
          }}
          onMouseDown={this.mouseDownHandler}
          id="mover"
        >
          <slot name="draggable-header">Window</slot>
          <span class="dot" style={{ background: '#ED594A' }}></span>
        </div>
        <slot name="content">Content</slot>
      </Host>
    );
  }
}
