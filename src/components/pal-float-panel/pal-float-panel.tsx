import { Component, Host, h, Prop } from '@stencil/core';
import { Panel } from '../../services/panelsConfig';
import { treesDB } from '../../services/tree/treesDB';
import "@deckdeckgo/drag-resize-rotate";

@Component({
  tag: 'pal-float-panel',
  styleUrl: 'pal-float-panel.css',
})
export class PalFloatPanel {
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
        <div class="grid-stick-layout">
          <div class="main">
            <div class={`content ${this.panelData.type}`}>
              {this.panels?.map((p, i) => (
                <deckgo-drr rotation={false} style={{"--width":"40%", "--height":"60%", "--deckgo-drr-anchor-background":"transparent"}}>
                  <pal-panel-stack-header
                  logicContainer={this.panelData?.id}
                  panelId={p.id}
                  treeId={p?.treeId}
                  key={p.id}
                  panelTitle={p.name}
                  title={p.name}
                  active={p.id === activeTab.id}
                  onClick={() => this.setActive(p)}
                ></pal-panel-stack-header>
                  <pal-panel style={{width:"40%", height:"60%"}} logicContainer={this.panelData?.id} index={i} panelData={p} panelId={p.id} key={p.id}></pal-panel>
                </deckgo-drr>
              ))}
            </div>
          </div>
          {/* <div class="footer panels-container-header">
            {this.panels.map(p => {
              return (
                <pal-panel-stack-header
                  logicContainer={this.panelData?.id}
                  panelId={p.id}
                  treeId={p?.treeId}
                  key={p.id}
                  panelTitle={p.name}
                  title={p.name}
                  active={p.id === activeTab.id}
                  onClick={() => this.setActive(p)}
                ></pal-panel-stack-header>
              );
            })}
          </div> */}
        </div>
      </Host>
    );
  }
}
