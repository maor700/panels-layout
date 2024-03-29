import { Component, Host, h, Prop } from '@stencil/core';
import { Panel } from '../../services/panelsConfig';
import { treesDB } from '../../services/tree/treesDB';

@Component({
  tag: 'pal-tabs-panel',
  styleUrl: 'pal-tabs-panel.css',
  scoped:true
})
export class PalTabsPanel {
  @Prop() panelId: string;
  @Prop() panelData: Panel;
  @Prop() index: number;
  @Prop() panels: Panel[] = [];

  setActive(panel: Panel) {
    treesDB.treesItems.update(this.panelId, { activeTab: panel?.id });
  }

  render() {
    const activeTab =
      this.panels?.find(({ id }) => {
        return this.panelData?.activeTab === id;
      }) ?? this.panels?.[0];

    return (
      <Host class={`panel ${this.panelData.type} `}>
        <div class="pal-grid-stick-layout">
          <div class="pal-grid-header panels-container-header">
            {this.panels.map(p => {
              return (
                <pal-panel-stack-header
                  panelData={p}
                  logicContainer={this.panelData?.id}
                  panelId={p.id}
                  treeId={p?.treeId}
                  key={p.id}
                  panelTitle={p.name}
                  title={p.name}
                  active={p.id === activeTab.id}
                  onClick={() => this.setActive(p)}
                  showSettingsBtn={false}
                  class={`${this.panelData.type}-header`}
                  editablePanelName={this.panelData?.settings?.misc?.editableHeaderName}
                ></pal-panel-stack-header>
              );
            })}
          </div>
          <div class="pal-grid-main">
            <div class="content">{activeTab ? <pal-panel logicContainer={this.panelData?.id} panelData={activeTab} panelId={activeTab?.id} /> : null}</div>
          </div>
        </div>
      </Host>
    );
  }
}
