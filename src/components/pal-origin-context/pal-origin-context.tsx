import { Component, Host, h, State, Event, EventEmitter } from '@stencil/core';
import { Subscription } from 'dexie';
import { OriginState } from './OriginState';

type State = {
  dragProccess: DragProccess;
  dragMode: 0 | 1;
};

const panelsCtx = new OriginState<State>('panelContextState');

@Component({
  tag: 'pal-origin-context',
  styleUrl: 'pal-origin-context.css',
})
export class PalOriginContext {
  @State() dragMode: 0 | 1 = 0;
  @State() dragProccess: DragProccess = DRAG_PROCCESS_DEFAULT;
  @Event() tabDroped: EventEmitter<DragProccess>;
  @Event() changePanelDisplayMode: EventEmitter<DisplayModeChange>;
  @Event() tabClose: EventEmitter<string>;

  private subscriptions: Subscription[] = [];

  componentDidLoad() {
    panelsCtx.live$('dragProccess').subscribe(dragProccess => {
      this.dragProccess = dragProccess;
    });
    panelsCtx.live$('dragMode').subscribe(dragMode => {
      this.dragMode = dragMode ? 1 : 0;
    });
  }

  disconnectedCallback() {
    this.subscriptions.forEach(subscription => subscription?.unsubscribe?.());
  }

  render() {
    return (
      <Host
        onTabDrag={async ({ detail }) => {
          const finalValue = detail === null ? 0 : 1;
          // if (!finalValue) return;
          const dragProccess = { end: this.dragProccess?.end, start: detail };
          await panelsCtx.set('dragMode', finalValue);
          await panelsCtx.set('dragProccess', dragProccess);
        }}
        onTabDrop={async ({ detail }) => {
          const dp = await panelsCtx.get("dragProccess")
          this.dragProccess = { ...dp, end: detail };
          this.tabDroped.emit(this.dragProccess);
          await panelsCtx.set('dragMode', 0);
          await panelsCtx.set('dragProccess', DRAG_PROCCESS_DEFAULT);
        }}
        class={`${this.dragMode === 1 ? 'drag-mode' : ''}`}
      >
        <slot></slot>
      </Host>
    );
  }
}

const DRAG_PROCCESS_DEFAULT: DragProccess = { start: null, end: null };
