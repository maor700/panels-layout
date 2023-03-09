import { Component, Host, h, Event, EventEmitter, Prop, Element } from '@stencil/core';

@Component({
  tag: 'pal-drag-drop-snap',
  styleUrl: 'pal-drag-drop-snap.css',
})
export class PalDragDropSnap {
  @Prop() direction: string | TabDropDirections;
  @Prop() panelId: string;
  @Prop() treeId: string;
  @Prop() logicContainer: string;
  @Event({ bubbles: true, composed: true, cancelable: true }) tabDrop: EventEmitter<DragStage>;
  @Element() elm;

  mouseUpHandler = (ev: DragEvent) => {
    ev.preventDefault();
    const elmDir = getComputedStyle(this.elm).direction;
    this.tabDrop.emit({
      treeId: this.treeId,
      panelId: this.panelId,
      direction: this.direction as TabDropDirections,
      logicContainer: this.logicContainer,
      targetDirection: elmDir,
    });
  };

  render() {
    return <Host onMouseUp={this.mouseUpHandler} class={`trapeze ${this.direction}`}></Host>;
  }
}
