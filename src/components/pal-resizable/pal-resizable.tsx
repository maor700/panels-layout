import { Component, h, Host, Element, State, Event, EventEmitter, Prop } from '@stencil/core';
import { debounce } from 'lodash';
import { OverlayMouseMovement } from '../../services/overlayMovementService';



@Component({
  styleUrl: 'pal-resizable.css',
  tag: 'pal-resizable',
  shadow: true,
})
export class PalResizable {
  @Prop() panelId: string;
  @Prop() dimensions: Partial<PanelDimensions> = {width:200, height:100};
  @State() isMouseDown = false;
  @State() inResizeMode = false;
  @Element() el: HTMLElement;
  @State() moving = false;
  @Event({ bubbles: true, composed: true, cancelable: true }) requestOverlay: EventEmitter<{ status: boolean; clearance?: () => void }>;
  @Event({ bubbles: true, composed: true, cancelable: true }) submitTransform: EventEmitter<{ panelId: string; transform: Partial<PanelTransform> }>;

  resizeObserv: ResizeObserver;
  timeoutClear: NodeJS.Timeout;
  overlayMovementService: OverlayMouseMovement;

  componentDidLoad() {
    this.el.addEventListener('mousedown', this.mouseDownHandler);
    this.el.addEventListener('mouseup', this.mouseUpHandler);

    this.overlayMovementService = new OverlayMouseMovement(this.panelId);

    this.resizeObserv = new ResizeObserver(entries => {
      if (this.isMouseDown && !this.overlayMovementService.started) {
        this.overlayMovementService.start();
      }

      this.saveTransform(entries);
    });

    this.resizeObserv.observe(this.el);
  }

  disconnectedCallback() {
    this.resizeObserv.unobserve(this.el);
  }

  mouseDownHandler = (_) => {
    this.isMouseDown = true;
  };

  mouseUpHandler = _ => {
    this.isMouseDown = false;
    this.overlayMovementService.stop();
  };

  saveTransform = debounce((entries: ResizeObserverEntry[]) => {
    const [entry] = entries;
    const { borderBoxSize } = entry;
    const [size] = borderBoxSize;
    this.submitTransform.emit({ panelId: this.panelId, transform: { width: size.inlineSize, height: size.blockSize } });
  }, 200);

  render() {
    const { width, height } = this.dimensions ?? {};
    const style = width ?? height ? { width: `${width}px`, height: `${height}px` } : null;
    return (
      <Host style={style} class="resizable">
        <slot />
      </Host>
    );
  }
}
