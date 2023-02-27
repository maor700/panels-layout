import { Component, Element, Event, EventEmitter, h, Host, Prop, State } from '@stencil/core';

@Component({
  tag: 'pal-panel-stack-header',
  styleUrl: 'pal-panel-stack-header.css',
})
export class PalPanelStackHeader {
  @Prop() panelTitle: string;
  @Prop() active: boolean = false;
  @Prop() panelId: string;
  @Prop() logicContainer: string;
  @Prop() treeId: string;
  @Element() elm: HTMLElement;
  @State() iAmDragging = false;
  @Event({ bubbles: true, composed: true, cancelable: true }) tabDrag: EventEmitter<DragStage>;
  @Event({ bubbles: true, composed: true, cancelable: true }) tabClose: EventEmitter<string>;
  @Event({ bubbles: true, composed: true, cancelable: true }) changePanelDisplayMode: EventEmitter<DisplayModeChange>;

  moveHandler = _ => {
    this.tabDrag.emit({ treeId: this.treeId, panelId: this.panelId, logicContainer: this.logicContainer });
    this.iAmDragging = true;
  };

  upHandler = () => {
    this.tabDrag.emit(null);
    this.iAmDragging = false;
    top.document.removeEventListener('mousemove', this.moveHandler);
    top.document.removeEventListener('mouseup', this.upHandler);
  };

  render() {
    return (
      <Host
        class={`${this.iAmDragging ? 'i-am-dragging' : ''}`}
        onMouseDown={_ => {
          top.document.addEventListener('mousemove', this.moveHandler);
          top.document.addEventListener('mouseup', this.upHandler);
        }}
      >
        <div class={`${this.active ? 'active' : ''} stack-head`}>
          <pal-ui5-icon
            hoverStyle
            onClick={() => {
              this.changePanelDisplayMode.emit({ panelId: this.panelId, treeId: this.treeId, displayMode: 'close' });
            }}
            class="close stack-head-btn"
            lib="sap"
            icon="decline"
            title="סגור"
          />
          <div class="name" title="גרור כדי למקם מחדש">
            {this.panelTitle}
          </div>
          <pal-panel-header-menu panelId={this.panelId} treeId={this.treeId} />
        </div>
      </Host>
    );
  }
}
