import { Component, Host, h, State, Element, EventEmitter, Event, Prop, Watch } from '@stencil/core';

@Component({
  tag: 'pal-floatable',
  styleUrl: 'pal-floatable.css',
})
export class PalFloatable {
  @Prop() panelId: string;
  @Prop() position: PanelPosition;
  @Prop() maxArea: PanelPosition = { top: Infinity, left: Infinity };
  @Prop() intersectObserver: IntersectionObserver;
  @Prop({reflect:true, mutable:true}) pauseDrag: boolean = false;
  @State() movements: number[] = [0, 0];
  @State() ctrlPressed: boolean = false;
  @Event({ bubbles: true, composed: true, cancelable: true }) requestOverlay: EventEmitter<{ status: boolean; clearance?: () => void }>;
  @Event({ bubbles: true, composed: true, cancelable: true }) submitTransform: EventEmitter<{ panelId: string; transform: Partial<PanelTransform> }>;
  @Element() cont: HTMLDivElement;

  ctrlPrfessedHandler = event => {
    this.ctrlPressed = event.ctrlKey;
  };

  @Watch('position')
  updateMovements(position: PanelPosition) {
    console.log({position});
    
    if (position && position?.left !== this.movements?.[0] && position?.top !== this.movements?.[1]) {
      this.movements = [position?.left, position?.top];
    }
  }

  componentWillLoad() {
    this.updateMovements(this.position);
  }

  componentDidLoad() {
    this.intersectObserver.observe(this.cont);
    window.addEventListener('keydown', this.ctrlPrfessedHandler, false);

    window.addEventListener('keyup', this.ctrlPrfessedHandler, false);

    this.cont.addEventListener('tabDrag', ev => {
      !this.ctrlPressed && ev.stopPropagation();
    });
  }

  disconnectedCallback() {
    this.cont.removeEventListener('keydown', this.ctrlPrfessedHandler);
    this.cont.removeEventListener('keyup', this.ctrlPrfessedHandler);
    this.clearance();
  }

  clearance = () => {
    document.removeEventListener('mousemove', this.mouseMoveHandler);
    document.removeEventListener('mouseup', this.mouseUpHandler);
  };
  
  // Events
  mouseDownHandler = (_: MouseEvent) => {
    this.pauseDrag = false;
    document.addEventListener('mousemove', this.mouseMoveHandler);
    document.addEventListener('mouseup', this.mouseUpHandler);
  };

  private mouseMoveHandler = (_: MouseEvent) => {
    if(this.pauseDrag) return;
    !this.ctrlPressed && this.requestOverlay.emit({ status: true, clearance: this.mouseUpHandler });
    _.stopPropagation();
    _.preventDefault();
    if ((_ as MouseEvent).ctrlKey) {
      return;
    }
    const { movementX, movementY } = _;
    const [currX, currY] = this.movements;
    this.movements = [currX + movementX, currY + movementY];
  };

  mouseUpHandler = () => {
    if(this.pauseDrag) return;
    this.clearance();
    const { offsetTop, offsetLeft } = this.cont;
    const transform: PanelPosition = { top: offsetTop, left: offsetLeft };
    this.submitTransform.emit({ panelId: this.panelId, transform });
  };

  render() {
    const [x, y] = this.movements;
    const style = { top: y + 'px', left: x + 'px' };
    return (
      <Host id="container"  class={`${this.pauseDrag?"pause-drag":""}`}style={style}>
        <div onMouseDown={this.mouseDownHandler} id="mover">
          <slot name="draggable-header">Window</slot>
          <span class="dot" style={{ background: '#ED594A' }}></span>
        </div>
        <slot name="content">Content</slot>
      </Host>
    );
  }
}
