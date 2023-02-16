import { Component, Host, h, Prop, Element } from '@stencil/core';
import { Panel } from '../../services/panelsConfig';
import { treesDB } from '../../services/tree/treesDB';
import '@deckdeckgo/drag-resize-rotate';
import { debounce } from 'lodash';

@Component({
  tag: 'pal-float-panel',
  styleUrl: 'pal-float-panel.css',
})
export class PalFloatPanel {
  @Prop() panelId: string;
  @Prop() panelData: Panel;
  @Prop() index: number;
  @Prop() panels: Panel[] = [];
  @Element() elm: HTMLElement;
  public floatedPanelCon: HTMLDivElement;
  public zIndexCounter = 1;

  componentDidLoad() {
    this.zIndexCounter += this.panels.length;
  }

  debouncedTransformSubmit = debounce((target, ev) => (target as HTMLElement).dispatchEvent(ev), 200);

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
            <div
              ref={el => {
                this.floatedPanelCon = el;
              }}
              class={`content ${this.panelData.type}`}
            >
              {this.panels?.map((p, i) => (
                <pal-floatable
                  onMouseDown={({ currentTarget }) => {
                    this.zIndexCounter += 1;
                    (currentTarget as HTMLDivElement).style.setProperty('z-index', this.zIndexCounter + '');
                  }}
                  panelId={p.id}
                  position={p?.transform}
                  style={{ zIndex: '1' }}
                >
                  <pal-panel-stack-header
                    slot="draggable-header"
                    logicContainer={this.panelData?.id}
                    panelId={p.id}
                    treeId={p?.treeId}
                    key={p.id}
                    panelTitle={p.name}
                    title={p.name}
                    active={p.id === activeTab.id}
                    onClick={() => this.setActive(p)}
                  />
                  <pal-resizable panelId={p.id} dimensions={p?.transform} style={{ display: 'block' }} slot="content">
                    <pal-panel style={{ width: '40%', height: '60%' }} logicContainer={this.panelData?.id} index={i} panelData={p} panelId={p.id} key={p.id}></pal-panel>
                  </pal-resizable>
                </pal-floatable>
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
