import { Component, Host, h, Event, EventEmitter, State, Listen } from '@stencil/core';
import { PanelSettings } from '../../components';

@Component({
  tag: 'pal-drag-drop-context',
  styleUrl: 'pal-drag-drop-context.css',
  shadow: true,
})
export class PalDragDropContext {
  @State() dragProccess: DragProccess = DRAG_PROCCESS_DEFAULT;
  @State() dragMode = false;
  @State() showOverlay = false;

  @Event() tabClose: EventEmitter<string>;
  @Event() tabDroped: EventEmitter<DragProccess>;
  @Event() requestOverlay: EventEmitter<boolean>;
  @Event() changePanelDisplayMode: EventEmitter<DisplayModeChange>;
  @Event() submitTransform: EventEmitter<{ panelId: string; transform: Partial<PanelTransform> }>;
  @Event() submitSettings: EventEmitter<{ panelId: string; settings: Partial<PanelSettings> }>;
  @Event({ bubbles: true, composed: true, cancelable: true }) setPanelTitle: EventEmitter<PanelTitlePayload>;

  @Listen('changePanelDisplayMode_internal')
  changePanelDisplayModeHandler(ev: CustomEvent<DisplayModeChange>) {
    ev.stopPropagation();
    const { detail } = ev;
    this.changePanelDisplayMode.emit({ ...detail, lastFloatZindex: this.lastFloatZindex, increaseLastFloatZindex: this.increaseLastFloatZindex });
  }
  
  overlayElm: HTMLDivElement;
  clearance = null;
  private lastFloatZindex = 0;
  private increaseLastFloatZindex = () => {
    this.lastFloatZindex++;
  };

  render() {
    return (
      <Host
        onTabDrag={({ detail }) => {
          this.dragMode = !!detail;
          if (!this.dragMode) return;
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
