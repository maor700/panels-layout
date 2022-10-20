import { Component, Host, h, Event, EventEmitter, State } from '@stencil/core';

@Component({
  tag: 'pal-drag-drop-context',
  styleUrl: 'pal-drag-drop-context.css',
})
export class PalDragDropContext {
  @State() dragProccess: DragProccess = DRAG_PROCCESS_DEFAULT;
  @State() dragMode = false;
  @Event() tabDroped: EventEmitter<DragProccess>;

  render() {
    return (
      <Host
        onTabDrag={({ detail }) => {
          this.dragMode = !!detail;
          if(!this.dragMode) return;
          this.dragProccess = { ...this.dragProccess, start: detail };
        }}

        onTabDrop={({ detail }) => {
          this.dragProccess = { ...this.dragProccess, end: detail };
          this.dragMode = false;
          this.tabDroped.emit(this.dragProccess);
          this.dragProccess = DRAG_PROCCESS_DEFAULT;
        }}
        class={`${this.dragMode ? 'drag-mode' : ''}`}
      >
        <slot></slot>
      </Host>
    );
  }
}

const DRAG_PROCCESS_DEFAULT: DragProccess = { start: null, end: null };
