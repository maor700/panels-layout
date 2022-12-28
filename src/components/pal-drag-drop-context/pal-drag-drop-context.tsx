import { Component, Host, h, Event, EventEmitter, State, Element } from '@stencil/core';

@Component({
  tag: 'pal-drag-drop-context',
  styleUrl: 'pal-drag-drop-context.css',
  shadow: true,
})
export class PalDragDropContext {
  @State() dragProccess: DragProccess = DRAG_PROCCESS_DEFAULT;
  @State() dragMode = false;
  @State() showOverlay = false;
  @Event() tabDroped: EventEmitter<DragProccess>;
  @Event() changePanelDisplayMode: EventEmitter<DisplayModeChange>;
  @Event() tabClose: EventEmitter<string>;
  @Event() requestOverlay: EventEmitter<boolean>;
  @Event() submitTransform: EventEmitter<{ panelId: string; transform: Partial<PanelTransform> }>;
  @Element() elm: HTMLElement;
  overlayElm: HTMLDivElement;
  clearance = null;

  componentDidLoad() {
    this.elm.addEventListener('requestOverlay', this.requestOverlayHandler);
  }
  
  requestOverlayHandler = ({ detail }: CustomEvent<{ status: boolean; clearance?: () => void }>) => {
    const { status, clearance } = detail;
    this.showOverlay = status;
    this.clearance = clearance;
    this.overlayElm.addEventListener('mouseup', this.mouseupHandler);
  };

  mouseupHandler = () => {
    this.showOverlay = false;
    this.clearance?.();
    this.elm.removeEventListener('mouseup', this.mouseupHandler);
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
        <div
          ref={el => {
            this.overlayElm = el;
          }}
          class="resizable-overlay"
          style={{ zIndex: `${this.showOverlay ? 1000 : -10}` }}
        ></div>
        <slot></slot>
      </Host>
    );
  }
}

const DRAG_PROCCESS_DEFAULT: DragProccess = { start: null, end: null };
