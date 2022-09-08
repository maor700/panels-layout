import { Component, Element, h, Host, Prop, State, Watch, Event, EventEmitter } from '@stencil/core';
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
  @State() panelData: TreeItem<{ flex: number; direction: 'row' | 'column'; hideHeader: 1 | 0 }>;
  @State() panels: TreeItem<Panel>[] = [];
  @State() isContainer: boolean;
  @State() headers: TreeItem[] = [];
  @State() flexFactor = 1;
  @State() flexDirection: 'row' | 'column';
  @Event({ bubbles: true, composed: true, cancelable: true }) tabDrag: EventEmitter<DragStage>;
  @Event({ bubbles: true, composed: true, cancelable: true }) tabDrop: EventEmitter<DragStage>;
  @Element() elm: HTMLElement;
  private conAxis: string;
  private conSize: number;
  private content: HTMLDivElement;
  private subscriptions: Subscription[] = [];

  snapDropHandler = (ev: CustomEvent<{ direction: string }>) => {
    const { direction } = ev.detail;
    this.tabDrop.emit({ treeId: this.panelData?.treeId, panelId: this.panelId, direction: direction as any });
  };

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
        this.panels = panels.sort((a, b) => a?.order - b?.order);
      }),
    );
  }

  componentDidUpdate() {
    this.flexDirection = this.panelData?.data?.direction ?? (getComputedStyle(this.content).flexDirection as 'row' | 'column');
  }

  disconnectedCallback() {
    this.subscriptions.forEach(subscription => subscription?.unsubscribe?.());
  }

  dragHandler = (ev: any) => {
    ev.preventDefault();
    const dragActive = ev.detail;
    if (dragActive) {
      this.tabDrag.emit({ treeId: this.panelData?.treeId, panelId: this.panelId });
    } else {
      this.tabDrag.emit(null);
    }
  };

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
    const rightPanelNewSize = rightWinW - movementAxis * this.flexFactor;

    treesDB.treesItems.bulkPut([
      { ...sibilingL, data: { ...sibilingL?.data, flex: leftPanelNewSize } },
      { ...sibilingR, data: { ...sibilingR?.data, flex: rightPanelNewSize } },
    ]);
  };

  render() {
    return (
      <Host
        style={{ '--flex-factor': this.flexFactor + '', 'flex': this.panelData?.data?.flex + '' }}
        class={`panel ${this.isContainer ? 'is-container' : ''} ${this.panelData?.data?.hideHeader ? 'no-padding' : ''}`}
      >
        <div class="grid-stick-layout">
          {this.panelData && !this.panelData?.data?.hideHeader ? (
            <div class="header panels-container-header">
              <pal-panel-stack-header
                panelId={this.panelId}
                treeId={this.panelData?.treeId}
                key={this.panelData.id}
                onDragTab={this.dragHandler}
                panelTitle={this.panelData.name}
                onClick={() => this.setActive(this.panelData.name)}
                active={this.active === this.panelData.name}
                title={this.panelData.name}
              ></pal-panel-stack-header>
            </div>
          ) : null}
          <div class="main">
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
                      <pal-divider flexDirection={this.flexDirection} sibiling={[this.panels?.[i]?.id, this.panels?.[i + 1]?.id]} onDividerMove={this.dividerMoveHandler}></pal-divider>
                    ) : null,
                  ])
                  .flat()
              ) : (
                <div class="panel-content">{this.panelData?.name}</div>
              )}
              {!this.isContainer && (
                <div class="snaps">
                  <pal-drag-drop-snap direction={'top'} onSnapDrop={this.snapDropHandler}></pal-drag-drop-snap>
                  <pal-drag-drop-snap direction={'right'} onSnapDrop={this.snapDropHandler}></pal-drag-drop-snap>
                  <pal-drag-drop-snap direction={'left'} onSnapDrop={this.snapDropHandler}></pal-drag-drop-snap>
                  <pal-drag-drop-snap direction={'bottom'} onSnapDrop={this.snapDropHandler}></pal-drag-drop-snap>
                  <pal-drag-drop-snap direction={'center'} onSnapDrop={this.snapDropHandler}></pal-drag-drop-snap>
                </div>
              )}
            </div>
          </div>
          {/* <div class="footer">footer</div> */}
        </div>
      </Host>
    );
  }
}
