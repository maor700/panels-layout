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
  @State() panelData: TreeItem<{ flex: number; direction: 'row' | 'column'; hideHeader: 1 | 0 }>;
  @State() panels: TreeItem<Panel>[] = [];
  @State() isContainer: boolean;
  @State() headers: TreeItem[] = [];
  @State() flexFactor = 1;
  @State() flexDirection: 'row' | 'column';
  @Element() elm: HTMLElement;
  private conAxis: string;
  private conSize: number;
  private content: HTMLDivElement;
  private subscriptions: Subscription[] = [];

  @Watch('panels')
  isContainerWatcher(panels) {
    const isContainer = !!panels?.length;
    this.isContainer = isContainer;
    const level = this.panelData?.parentPath.split('/')?.length;
    this.headers = isContainer && level === 1 ? panels : [];
    this.active = this.active ?? this.panelData?.name;
  }

  @Watch('panels')
  setupFlex() {
    if (!this.content) return;
    const con = this.content;
    this.conAxis = this.flexDirection === 'column' ? 'offsetHeight' : 'offsetWidth';
    this.conSize = con[this.conAxis];
    this.flexFactor = 100 / this.conSize;
  }

  componentWillLoad() {
    this.subscriptions.push(
      liveQuery(() => treesDB.getNodeAndChildren(this.panelId)).subscribe(([panel, panels]) => {
        this.panelData = panel;
        this.panels = panels;
      }),
    );
  }

  componentDidUpdate() {
    this.flexDirection = this.panelData?.data?.direction ?? (getComputedStyle(this.content).flexDirection as 'row' | 'column');
  }

  disconnectedCallback() {
    this.subscriptions.forEach(subscription => subscription?.unsubscribe?.());
  }

  setActive = (panelName: string) => {
    this.active = panelName;
  };

  dividerMoveHandler = async (event: CustomEvent<{ sibiling: string[]; movementX: number; movementY: number }>) => {
    const { sibiling, movementX, movementY } = event?.detail;

    const [sibilingL, sibilingR] = await treesDB.treesItems.bulkGet(sibiling);
    const rightWinW = sibilingR.data?.flex as number;
    const leftWinW = sibilingL.data?.flex as number;
    const movementAxis = this.conAxis === 'offsetWidth' ? movementX : movementY;
    const leftPanelNewSize = leftWinW + movementAxis * this.flexFactor;
    const rightPanelNewSize = rightWinW + movementAxis * this.flexFactor;
    console.log({ leftPanelNewSize, rightPanelNewSize });

    treesDB.treesItems.bulkPut([
      { ...sibilingL, data: { ...sibilingL?.data, flex: leftWinW + movementAxis * this.flexFactor } },
      { ...sibilingR, data: { ...sibilingR?.data, flex: rightWinW - movementAxis * this.flexFactor } },
    ]);
  };

  render() {
    return (
      <Host style={{ '--flex-factor': this.flexFactor + '', 'flex': this.panelData?.data?.flex + '' }} class={`panel ${this.isContainer ? 'is-container' : ''} ${this.panelData?.data?.hideHeader?"no-padding":""}`}>
        <div class="grid-stick-layout">
          {this.panelData && !this.panelData?.data?.hideHeader ? (
            <div class="header panels-container-header">
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
            </div>
          ) : null}
          <div onDrop={console.log} class={`main ${this.dragMode ? 'dragg-mode' : ''}`}>
            <div
              ref={element => {
                this.content = element;
              }}
              style={{ flexDirection: this.flexDirection }}
              class="content"
            >
              {this.isContainer ? (
                this.panels
                  .map((p, i) => [
                    <pal-panel panelId={p.id} key={p.id}></pal-panel>,
                    i !== this.panels?.length - 1 ? (
                      <pal-divider sibiling={[this.panels?.[i]?.id, this.panels?.[i + 1]?.id]} onDividerMove={this.dividerMoveHandler}></pal-divider>
                    ) : null,
                  ])
                  .flat()
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
