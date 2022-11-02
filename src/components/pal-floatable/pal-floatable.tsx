import { Component, Host, h, State, Element } from '@stencil/core';

@Component({
  tag: 'pal-floatable',
  styleUrl: 'pal-floatable.css',
})
export class PalFloatable {
  @State() movements: number[] = [0, 0];
  @Element() cont: HTMLDivElement;

  componentDidLoad() {}

  // Events
  mouseDownHandler = _ => {
    document.addEventListener('mousemove', this.mouseMoveHandler);
    document.addEventListener('mouseup', this.mouseUpHandler);
  };

  private mouseMoveHandler = (_: MouseEvent) => {
    if ((_ as MouseEvent).ctrlKey) {
      return;
    }
    const { movementX, movementY } = _;
    const [currX, currY] = this.movements;
    this.movements = [currX + movementX, currY + movementY];
  };

  mouseUpHandler = () => {
    // const [movementX, movementY] = this.movements;
    // this.movements = [0, 0];
    document.removeEventListener('mousemove', this.mouseMoveHandler);
    document.removeEventListener('mouseup', this.mouseUpHandler);
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
        <slot name='content'>Content</slot>
      </Host>
    );
  }
}
