import { Component, Host, h, State, Element, EventEmitter, Event, Prop, Watch } from '@stencil/core';

@Component({
  tag: 'pal-floatable',
  styleUrl: 'pal-floatable.css',
})
export class PalFloatable {
  @Prop() panelId: string;
  @Prop() position: PanelPosition;
  @State() movements: number[] = [0, 0];
  @State() ctrlPressed: boolean = false;
  @Event({ bubbles: true, composed: true, cancelable: true }) requestOverlay: EventEmitter<{ status: boolean; clearance?: () => void }>;
  @Event({ bubbles: true, composed: true, cancelable: true }) submitTransform: EventEmitter<{ panelId: string; transform: Partial<PanelTransform> }>;
  @Element() floatableElm: HTMLDivElement;
  private isMouseDown: boolean;
  private startX: number;
  private startY: number;

  container: HTMLElement;

  ctrlPrfessedHandler = event => {
    this.ctrlPressed = event.ctrlKey;
  };

  @Watch('position')
  updateMovements(position: PanelPosition) {
    console.log({ position });

    if (position && position?.left !== this.movements?.[0] && position?.top !== this.movements?.[1]) {
      this.movements = [position?.left, position?.top];
    }
  }

  componentWillLoad() {
    this.updateMovements(this.position);
    this.container = this.floatableElm.closest('.main');
    console.log({ container: this.container });

    document.addEventListener('mousemove', this.mouseMoveHandler);
    document.addEventListener('mouseup', this.mouseUpHandler);
  }

  componentDidLoad() {
    window.addEventListener('keydown', this.ctrlPrfessedHandler, false);

    window.addEventListener('keyup', this.ctrlPrfessedHandler, false);

    this.floatableElm.addEventListener('tabDrag', ev => {
      !this.ctrlPressed && ev.stopPropagation();
    });
  }

  disconnectedCallback() {
    this.floatableElm.removeEventListener('keydown', this.ctrlPrfessedHandler);
    this.floatableElm.removeEventListener('keyup', this.ctrlPrfessedHandler);
    this.clearance();
  }

  clearance = () => {
    document.removeEventListener('mousemove', this.mouseMoveHandler);
    document.removeEventListener('mouseup', this.mouseUpHandler);
  };

  // Events
  mouseDownHandler = (event: MouseEvent) => {
    if (this.ctrlPressed) return;
    this.isMouseDown = true;
    this.requestOverlay.emit({ status: true });
    this.startX = event.clientX - this.floatableElm.getBoundingClientRect().left;
    this.startY = event.clientY - this.floatableElm.getBoundingClientRect().top;
  };

  private mouseMoveHandler = (event: MouseEvent) => {
    if (!this.isMouseDown || this.ctrlPressed) {
      return;
    }
    const x = event.clientX - this.startX;
    const y = event.clientY - this.startY;
    const maxX = this.container.clientWidth - this.floatableElm.clientWidth;
    const maxY = this.container.clientHeight - this.floatableElm.clientHeight;
    const newX = Math.min(Math.max(x, 0), maxX);
    const newY = Math.min(Math.max(y, 0), maxY);
    this.movements = [newX, newY];
  };

  mouseUpHandler = () => {
    this.requestOverlay.emit({ status: false });
    this.isMouseDown = false;
    const { offsetTop, offsetLeft } = this.floatableElm;
    const transform: PanelPosition = { top: offsetTop, left: offsetLeft };
    this.submitTransform.emit({ panelId: this.panelId, transform });
  };

  render() {
    const [x, y] = this.movements;
    const style = { top: y + 'px', left: x + 'px' };
    return (
      <Host id="container" style={style}>
        <div onMouseDown={this.mouseDownHandler} id="mover">
          <slot name="draggable-header">Window</slot>
          <span class="dot" style={{ background: '#ED594A' }}></span>
        </div>
        <slot name="content">Content</slot>
      </Host>
    );
  }
}
