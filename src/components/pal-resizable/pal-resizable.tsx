import { Component, h, Host, Element, State, Event, EventEmitter, Prop } from '@stencil/core';

@Component({
  styleUrl: 'pal-resizable.css',
  tag: 'pal-resizable',
  shadow: true,
})
export class PalResizable {
  @Prop() panelId: string;
  @Prop() dimensions: PanelDimensions;
  @Element() el: HTMLElement;
  @State() moving = false;
  @Event({ bubbles: true, composed: true, cancelable: true }) requestOverlay: EventEmitter<{ status: boolean; clearance?: () => void }>;
  @Event({ bubbles: true, composed: true, cancelable: true }) submitTransform: EventEmitter<{ panelId: string; transform: Partial<PanelTransform> }>;

  componentDidLoad() {
    this.el.addEventListener('mousedown', this.mouseDownHandler);
  }

  moveHandler = _ => {
    this.requestOverlay.emit({ status: true, clearance: this.clearance });
  };

  mouseDownHandler = _ => {
    this.el.addEventListener('mousemove', this.moveHandler);
    this.el.addEventListener('mouseup', this.upHandler);
  };

  upHandler = _ => {
    this.requestOverlay.emit({ status: false, clearance: this.clearance });
    this.clearance();
  };

  clearance = () => {
    this.el.removeEventListener('mousemove', this.moveHandler);
    this.el.removeEventListener('mouseup', this.upHandler);
    const { offsetWidth, offsetHeight} = this.el;
    const transform: PanelDimensions = { width: offsetWidth, height: offsetHeight};
    this.submitTransform.emit({ panelId: this.panelId, transform });
  };

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
