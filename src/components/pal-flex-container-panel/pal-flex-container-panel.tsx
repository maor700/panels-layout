import { Component, Host, h, Prop, Watch, Element, State} from '@stencil/core';
import { Subscription, liveQuery } from 'dexie';
import { Panel, PanelTypes } from '../../services/panelsConfig';
import { treesDB } from '../../services/tree/treesDB';

@Component({
  tag: 'pal-flex-container-panel',
  styleUrl: 'pal-flex-container-panel.css',
})
export class PalFlexContainerPanel {
  @Prop() flexDirection: PanelTypes.column | PanelTypes.row;
  @State() panels: Panel[] = [];
  @State() isContainer: boolean;
  @State() flexFactor = 1;
  @Element() elm: HTMLElement;

  @Prop() panelId: string;
  @State() active: string;
  @State() panelData: Panel;
  @State() mouseHover: boolean;
  @State() headers: Panel[] = [];
  @State() type: PanelTypes = PanelTypes.row;

  private subscriptions: Subscription[] = [];
  private conAxis: string;
  private conSize: number;

  @Watch('panels')
  isContainerWatcher(panels) {
    const isContainer = !!panels?.length;
    this.isContainer = isContainer;
    const level = this.panelData?.parentPath.split('/')?.length;
    this.headers = isContainer && level === 1 ? panels : [];
    this.active = this.active ?? this.panelData?.name;
  }

  @Watch('panels')
  setupFlex(panels) {
    if (!this.flexDirection) return;
    const con = this.elm;
    const isContainer = !!panels?.length;
    this.isContainer = isContainer;
    this.conAxis = this.flexDirection === 'column' ? 'offsetHeight' : 'offsetWidth';
    this.conSize = con[this.conAxis];
    this.flexFactor = 100 / this.conSize;
  }

  componentWillLoad() {
    this.subscriptions.push(
      liveQuery(() => treesDB.getNodeAndChildren(this.panelId)).subscribe(([panel, panels]) => {
        this.panelData = panel;
        this.panels = panels.sort((a, b) => b?.order - a?.order);
      }),
    );
  }

  componentDidUpdate() {
    this.type = this.panelData?.type;
  }

  disconnectedCallback() {
    this.subscriptions.forEach(subscription => subscription?.unsubscribe?.());
  }

  dividerMoveHandler = async (event: CustomEvent<{ sibiling: string[]; movementX: number; movementY: number }>) => {
    const { sibiling, movementX, movementY } = event?.detail;

    const [sibilingL, sibilingR] = await treesDB.treesItems.bulkGet(sibiling);
    const rightWinW = sibilingR?.flex as number;
    const leftWinW = sibilingL?.flex as number;
    const movementAxis = this.conAxis === 'offsetWidth' ? movementX : movementY;
    const leftPanelNewSize = leftWinW + movementAxis * this.flexFactor;
    const rightPanelNewSize = rightWinW - movementAxis * this.flexFactor;

    treesDB.treesItems.bulkPut([
      { ...sibilingL, flex: leftPanelNewSize },
      { ...sibilingR, flex: rightPanelNewSize },
    ]);
  };

  setActive = (panelName: string) => {
    this.active = panelName;
  };

  render() {
    console.log(this.panels);

    return (
      <Host
        style={{ '--flex-factor': this.flexFactor + '', 'flex': this.panelData?.flex + '' }}
        class={`panel ${this.isContainer ? 'is-container' : ''} ${this.panelData?.hideHeader ? 'no-padding' : ''} ${this.mouseHover ? 'mouse-hover' : ''}`}
      >
        <div class="grid-stick-layout">
          {this.panelData && !this.panelData?.hideHeader ? (
            <div class="header panels-container-header">
              <pal-panel-stack-header
                panelId={this.panelId}
                treeId={this.panelData?.treeId}
                key={this.panelData.id}
                panelTitle={this.panelData.name}
                onClick={() => this.setActive(this.panelData.name)}
                active={this.active === this.panelData.name}
                title={this.panelData.name}
              ></pal-panel-stack-header>
            </div>
          ) : null}
          <div class="main">
            <div class="content" style={{'flexDirection': this.flexDirection}}>
              {this.panels
                ?.map((p, i) => [
                  <pal-panel panelData={p} panelId={p.id} key={p.id}></pal-panel>,
                  i !== this.panels?.length - 1 ? (
                    <pal-divider
                      flexDirection={this.flexDirection}
                      sibiling={[this.panels?.[i]?.id, this.panels?.[i + 1]?.id]}
                      onDividerMove={this.dividerMoveHandler}
                    ></pal-divider>
                  ) : null,
                ])
                .flat()}
            </div>
          </div>
        </div>
      </Host>
    );
  }
}
