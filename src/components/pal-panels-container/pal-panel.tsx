import { Component, Element, h, Host, Prop, State } from '@stencil/core';
import { liveQuery, Subscription } from 'dexie';
import { Panel, PanelTypes } from '../../services/panelsConfig';
import { treesDB } from '../../services/tree/treesDB';

@Component({
  tag: 'pal-panel',
  styleUrl: 'pal-panel.css',
})
export class PalPanel {
  @Prop() panelId: string;
  @Prop({ reflect: true }) panelData: Panel;
  @Prop() index: number;
  @Prop() logicContainer: string;
  @State() panels: Panel[] = [];
  @Element() elm: HTMLElement;
  private subscriptions: Subscription[] = [];

  componentWillLoad() {
    this.subscriptions.push(
      liveQuery(() => treesDB.getNodeAndChildren(this.panelId)).subscribe(([_, panels]) => {
        this.panels = panels.sort((a, b) => a?.order - b?.order);
      }),
    );
  }

  disconnectedCallback() {
    this.subscriptions.forEach(subscription => subscription?.unsubscribe?.());
  }

  render() {
    const isEmptyContainer = this.panels.length === 0 && this.panelData.type !== 'content';
    return (
      <Host class={`panel ${isEmptyContainer ? 'isEmpty' : ''}`} style={{ 'flex': this.panelData?.flex + '', 
      '--panel-bg': this.panelData?.color ?? 'initial' 
      }}>
        {this.panelData?.type === PanelTypes.row || this.panelData?.type === PanelTypes.column ? (
          <pal-flex-container-panel panelData={this.panelData} panels={this.panels} flexDirection={this.panelData?.type}></pal-flex-container-panel>
        ) : this.panelData?.type === PanelTypes.tabs ? (
          <pal-tabs-panel panels={this.panels} panelData={this.panelData} panelId={this.panelId} index={this.index} />
        ) : this.panelData?.type === PanelTypes.float ? (
          <pal-float-panel panels={this.panels} panelData={this.panelData} panelId={this.panelId} index={this.index} />
        ) : this.panelData?.type === PanelTypes.content ? (
          <pal-content-panel logicContainer={this.logicContainer} panelData={this.panelData} panelId={this.panelId} index={this.index} />
        ) : null}
        {this?.panelData && isEmptyContainer ? (
          <div class="snaps">
            <pal-drag-drop-snap direction={'center'} treeId={this?.panelData?.treeId} panelId={this.panelId} logicContainer={this.panelId}></pal-drag-drop-snap>
          </div>
        ) : null}
      </Host>
    );
  }
}
