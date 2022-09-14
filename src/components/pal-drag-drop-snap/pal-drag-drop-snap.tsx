import { Component, Host, h, Event, EventEmitter, Prop } from '@stencil/core';

@Component({
  tag: 'pal-drag-drop-snap',
  styleUrl: 'pal-drag-drop-snap.css',
})
export class PalDragDropSnap {
  @Prop() direction: string;
  @Event() snapDrop: EventEmitter<{ direction: string }>;
  mouseUpHandler = (ev: DragEvent) => {
    ev.preventDefault();
    this.snapDrop.emit({ direction: this.direction });
  };

  render() {
    return (
      <Host
        onMouseUp={this.mouseUpHandler}
        class={`trapeze ${this.direction}`}
      ></Host>
    );
  }
}
