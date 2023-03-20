import { Component, Host, h, Prop, Watch, Element, State } from '@stencil/core';
import { Panel, PanelTypes } from '../../services/panelsConfig';
import { treesDB } from '../../services/tree/treesDB';

@Component({
  tag: 'pal-flex-container-panel',
  styleUrl: 'pal-flex-container-panel.css',
})
export class PalFlexContainerPanel {
  @Prop() flexDirection: PanelTypes.column | PanelTypes.row;
  @Prop() panels: Panel[] = [];
  @Prop() panelData: Panel;
  @State() isContainer: boolean;
  @State() flexFactor = 1;
  @State() active: string;
  @Element() elm: HTMLElement;
  elementDirection: 'rtl' | 'ltr';

  private conAxis: string;
  private conSize: number;

  componentDidLoad() {
    this.elementDirection = getComputedStyle(this.elm).direction as 'rtl' | 'ltr';
  }

  @Watch('panels')
  setupFlex(panels: Panel[]) {
    if (!this.flexDirection) return;
    const con = this.elm;
    const isContainer = !!panels?.length;
    this.isContainer = isContainer;
    this.conAxis = this.flexDirection === 'column' ? 'offsetHeight' : 'offsetWidth';
    this.conSize = con[this.conAxis];
    const sumOfFlex = panels.reduce((sum, curr) => {
      sum += curr.flex;
      return sum;
    }, 0);
    this.flexFactor = sumOfFlex / this.conSize;
    console.log(sumOfFlex, this.conSize);
  }

  dividerMoveHandler = async (event: CustomEvent<{ sibiling: string[]; movementX: number; movementY: number }>) => {
    const { sibiling, movementX, movementY } = event?.detail;
    const rtlOrLtrFactor = this.elementDirection === 'rtl' && this.flexDirection === 'row' ? -1 : 1;
    const [sibilingL, sibilingR] = await treesDB.treesItems.bulkGet(sibiling);
    const rightWinW = sibilingR?.flex as number;
    const leftWinW = sibilingL?.flex as number;
    const movementAxis = this.conAxis === 'offsetWidth' ? movementX : movementY;
    const leftPanelNewSize = leftWinW + movementAxis * this.flexFactor * rtlOrLtrFactor;
    const rightPanelNewSize = rightWinW - movementAxis * this.flexFactor * rtlOrLtrFactor;

    treesDB.treesItems.bulkPut([
      { ...sibilingL, flex: leftPanelNewSize },
      { ...sibilingR, flex: rightPanelNewSize },
    ]);
  };

  setActive = (panelName: string) => {
    this.active = panelName;
  };

  render() {
    const hideHeader = this.panelData?.settings?.misc?.hideHeader;

    return (
      <Host
        style={{ '--flex-factor': this.flexFactor + '', 'flex': this.panelData?.flex + '' }}
        class={`panel ${this.isContainer ? 'is-container' : ''} ${hideHeader ? 'no-padding' : ''}`}
      >
        <div class="grid-stick-layout">
          {this.panelData && !hideHeader ? (
            <div class="header panels-container-header">
              <pal-panel-stack-header
                panelData={this.panelData}
                logicContainer={this.panelData?.id}
                panelId={this.panelData?.id}
                treeId={this.panelData?.treeId}
                key={this.panelData.id}
                panelTitle={this.panelData.name}
                onClick={() => this.setActive(this.panelData.name)}
                active={this.active === this.panelData.name}
                title={this.panelData.name}
                editablePanelName={this.panelData?.settings?.misc?.editableHeaderName}
              ></pal-panel-stack-header>
            </div>
          ) : null}
          <div class="main">
            <div class="content" style={{ flexDirection: this.flexDirection }}>
              {this.panels
                ?.map((p, i) => [
                  <pal-panel logicContainer={this.panelData?.id} index={i} panelData={p} panelId={p.id} key={p.id}></pal-panel>,
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
