import { Component, Element, h, Host, Prop, State, Watch } from '@stencil/core';
import { liveQuery, Subscription } from 'dexie';
import { Panel } from '../../services/panelsConfig';
import { TreeItem } from '../../services/tree/TreeItem';
import { treesDB } from '../../services/tree/treesDB';

@Component({
  tag: 'pal-panel',
  styleUrl: 'pal-panel.css',
})
export class PalPanel {
  @Prop() panelId: string;
  @State() active: string;
  @State() dragMode: boolean;
  @State() panelData: TreeItem<{flex:number}>;
  @State() panels: TreeItem<Panel>[] = [];
  @State() isContainer: boolean;
  @State() headers: TreeItem[] = [];
  @Element() elm: HTMLElement;
  private content: HTMLDivElement;
  @Watch('panels')
  isContainerWatcher(panels) {
    const isContainer = !!panels?.length;
    this.isContainer = isContainer;
    const level = this.panelData?.parentPath.split('/')?.length;
    this.headers = isContainer && level === 1 ? panels : [];
    this.active = this.active ?? this.panelData?.name;
  }
  private subscriptions: Subscription[] = [];

  componentWillLoad() {
    this.subscriptions.push(
      liveQuery(() => treesDB.getNodeAndChildren(this.panelId)).subscribe(([panel, panels]) => {
        this.panelData = panel;
        this.panels = panels;
      }),
    );
  }

  componentDidLoad() {
    const con = this.content;
    const conAxis = getComputedStyle(this.content).flexDirection === 'column' ? 'offsetHeight' : 'offsetWidth';
    const conSize = con[conAxis];
    const flexFactor = 100 / conSize;
    const containerChildern: HTMLElement[] = Array.from(con.children) as any;
    const filtered = containerChildern
      .filter(_ => _.tagName === 'PAL-PANEL');
      filtered.forEach((_: HTMLElement) => {
        _.style.setProperty('flex', _[conAxis] * flexFactor + '');
      });

      console.log({filtered});
      
  }

  disconnectedCallback() {
    this.subscriptions.forEach(subscription => subscription?.unsubscribe?.());
  }

  setActive = (panelName: string) => {
    this.active = panelName;
  };

  render() {
    return (
      <Host style={{flex:this.panelData?.data?.flex + ""}} class={`panel ${this.isContainer ? 'is-container' : ''}`}>
        <div class="grid-stick-layout">
          <div class="header panels-container-header">
            {this.panelData && (
              <pal-panel-stack-header
                key={this.panelData.id}
                onDragTab={({ detail }) => {
                  this.dragMode = detail;
                }}
                panelTitle={this.panelData.name}
                onClick={() => this.setActive(this.panelData.name)}
                active={this.active === this.panelData.name}
                title={this.panelData.name}
              ></pal-panel-stack-header>
            )}
          </div>
          <div onDrop={console.log} class={`main ${this.dragMode ? 'dragg-mode' : ''}`}>
            <div
              ref={element => {
                this.content = element;
              }}
              class="content"
            >
              {this.isContainer ? (
                this.panels.map((p, i) => [<pal-panel panelId={p.id} key={p.id}></pal-panel>, i !== this.panels?.length - 1 ? <pal-divider/> : null]).flat()
              ) : (
                <div class="panel-content">{this.panelData?.name}</div>
              )}
            </div>
            {this.isContainer && (
              <div class="snaps">
                <div class="trapeze top"></div>
                <div class="trapeze right"></div>
                <div class="trapeze bottom"></div>
                <div class="trapeze left"></div>
                <div class="squar"></div>
              </div>
            )}
          </div>
          {/* <div class="footer">footer</div> */}
        </div>
      </Host>
    );
  }
}
