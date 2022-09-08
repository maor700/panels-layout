import { Component, h, Host, Event, EventEmitter, State, Element, Prop } from '@stencil/core';

@Component({
  tag: 'pal-divider',
  styleUrl: 'pal-divider.css',
})
export class PalDivider {
  @Prop() sibiling?: string[] = [];
  @Prop() flexDirection:string;
  @State() focused = false;
  @State() movements:number[] = [0,0];
  @Event() dividerMove: EventEmitter<{ sibiling; movementX; movementY }>;
  @Element() elm;

  mouseDownHandler = (_: MouseEvent) => {
    this.focused = true;
    document.addEventListener('mousemove', this.mouseMoveHandler);
    document.addEventListener('mouseup', this.mouseUpHandler);
  };

  private mouseMoveHandler = (_: MouseEvent) => {
    const { movementX, movementY } = _;
    const [currX, currY] = this.movements;
    this.movements = [currX+movementX, currY+movementY];
  };
  
  private mouseUpHandler = () => {
    this.focused = false;
    const [movementX, movementY] = this.movements;
    this.dividerMove.emit({ sibiling: this.sibiling, movementX, movementY });
    this.movements = [0,0];
    document.removeEventListener('mousemove', this.mouseMoveHandler);
    document.removeEventListener('mouseup', this.mouseUpHandler);
  };

  render() {
    const [x, y] = this.movements;
    const style = this.flexDirection==="column"?{top:y+"px", left:"0"}:{top:"0", left:x+"px"};
    return <Host style={style} onMouseDown={this.mouseDownHandler} class={`v-divider ${this.focused ? 'focused' : ''}`}></Host>;
  }
}
