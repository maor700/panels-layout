import { Component, h, Host, Event, EventEmitter, State, Element, Prop } from '@stencil/core';

@Component({
  tag: 'pal-divider',
  styleUrl: 'pal-divider.css',
})
export class PalDivider {
  @Prop() sibiling?: string[] = [];
  @State() focused = false;
  @Event() dividerMove: EventEmitter<{ sibiling; movementX; movementY }>;
  @Element() elm;

  mouseDownHandler = (_: MouseEvent) => {
    this.focused = true;
    document.addEventListener('mousemove', this.mouseMoveHandler);
    document.addEventListener('mouseup', this.mouseUpHandler);
  };

  private mouseMoveHandler = (_: MouseEvent) => {
    const { movementX, movementY } = _;
    this.dividerMove.emit({ sibiling: this.sibiling, movementX, movementY });
  };
  
  private mouseUpHandler = () => {
    this.focused = false;
    document.removeEventListener('mousemove', this.mouseMoveHandler);
    document.removeEventListener('mouseup', this.mouseUpHandler);
  };

  render() {
    return <Host onMouseDown={this.mouseDownHandler} class={`v-divider ${this.focused ? 'focused' : ''}`}></Host>;
  }
}
