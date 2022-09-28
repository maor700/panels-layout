import { Component, Host, h, Event, EventEmitter, Prop } from '@stencil/core';

@Component({
  tag: 'pal-drag-drop-snap',
  styleUrl: 'pal-drag-drop-snap.css',
})
export class PalDragDropSnap {
  @Prop() direction: string | TabDropDirections;
  @Prop() panelId:string;
  @Prop() treeId:string;
  @Event({ bubbles: true, composed: true, cancelable: true }) tabDrop: EventEmitter<DragStage>;
  mouseUpHandler = (ev: DragEvent) => {
    ev.preventDefault();
    this.tabDrop.emit({ treeId: this.treeId, panelId: this.panelId, direction:this.direction as TabDropDirections });
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
