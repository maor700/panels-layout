import { Component, Host, h, Event, EventEmitter, State, Prop } from '@stencil/core';

@Component({
  tag: 'pal-drag-drop-snap',
  styleUrl: 'pal-drag-drop-snap.css',
})
export class PalDragDropSnap {
  @Prop() direction: string;
  @State() draggingOver = false;
  @Event() snapDrop: EventEmitter<{ direction: string }>;
  dropHandler = (ev: DragEvent) => {
    ev.preventDefault();
    this.draggingOver = false;
    this.snapDrop.emit({ direction: this.direction });
  };

  private dragLeaveHandler = _ => {
    this.draggingOver = false;
  };

  private dragEnterHandler = ev => {
    ev.preventDefault();
    this.draggingOver = true;
  };

  private dragOverHandler = ev => {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = 'move';
  };

  render() {
    return (
      <Host
        onDragOver={this.dragOverHandler}
        onDragEnter={this.dragEnterHandler}
        onDragLeave={this.dragLeaveHandler}
        onDrop={this.dropHandler}
        class={`${this.draggingOver ? 'drag-over' : ''} trapeze ${this.direction}`}
      ></Host>
    );
  }
}
