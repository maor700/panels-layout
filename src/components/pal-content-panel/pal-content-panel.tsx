import { Component, Host, h, Event, EventEmitter, State, Prop } from '@stencil/core';
import { Subscription, liveQuery } from 'dexie';
import { Panel } from '../../services/panelsConfig';
import { treesDB } from '../../services/tree/treesDB';

@Component({
  tag: 'pal-content-panel',
  styleUrl: 'pal-content-panel.css',
})
export class PalContentPanel {
  @Prop() panelId: string;
  @Prop() panelData: Panel;
  @State() active = true;
  @Event({ bubbles: true, composed: true, cancelable: true }) tabDrag: EventEmitter<DragStage>;
  @Event({ bubbles: true, composed: true, cancelable: true }) tabDrop: EventEmitter<DragStage>;
  

  snapDropHandler = (ev: CustomEvent<{ direction: string }>) => {
    const { direction } = ev.detail;
    this.tabDrop.emit({ treeId: this.panelData?.treeId, panelId: this.panelId, direction: direction as any });
  };

  dragHandler = (ev: any) => {
    ev.preventDefault();
    const dragActive = ev.detail;
    if (dragActive) {
      this.tabDrag.emit({ treeId: this.panelData?.treeId, panelId: this.panelId });
    } else {
      this.tabDrag.emit(null);
    }
  };

  render() {
    return (
      <Host>
        <div class="grid-stick-layout">
        {this.panelData && !this.panelData?.hideHeader ? (
            <div class="header panels-container-header">
              <pal-panel-stack-header
                panelId={this.panelId}
                treeId={this.panelData?.treeId}
                key={this.panelData.id}
                onDragTab={this.dragHandler}
                panelTitle={this.panelData.name}
                active={this.active}
                title={this.panelData.name}
              ></pal-panel-stack-header>
            </div>
          ) : null}
          <div class="main">
            <div class="content">
              <div class="panel-content">demo text</div>
              <div class="snaps">
                <pal-drag-drop-snap direction={'top'} onSnapDrop={this.snapDropHandler}></pal-drag-drop-snap>
                <pal-drag-drop-snap direction={'right'} onSnapDrop={this.snapDropHandler}></pal-drag-drop-snap>
                <pal-drag-drop-snap direction={'left'} onSnapDrop={this.snapDropHandler}></pal-drag-drop-snap>
                <pal-drag-drop-snap direction={'bottom'} onSnapDrop={this.snapDropHandler}></pal-drag-drop-snap>
                <pal-drag-drop-snap direction={'center'} onSnapDrop={this.snapDropHandler}></pal-drag-drop-snap>
              </div>
            </div>
          </div>
          <div class="footer"></div>
        </div>
      </Host>
    );
  }
}
