import { Component, Host, h, State, Prop } from '@stencil/core';
import { Panel } from '../../services/panelsConfig';

@Component({
  tag: 'pal-content-panel',
  styleUrl: 'pal-content-panel.css',
  scoped:true
})
export class PalContentPanel {
  @Prop() panelId: string;
  @Prop() panelData: Panel;
  @Prop() logicContainer: string;
  @Prop() index: number;
  @Prop() forceHiddenHeader = false;
  @State() active = true;

  render() {
    const hideHeader = Boolean(this.panelData?.settings?.misc?.hideHeader) || this.forceHiddenHeader;

    return (
      <Host>
        <div class="pal-grid-stick-layout">
          {this.panelData && !hideHeader ? (
            <div class="pal-grid-header">
              <pal-panel-stack-header
                panelData={this.panelData}
                logicContainer={this.logicContainer}
                panelId={this.panelId}
                treeId={this.panelData?.treeId}
                key={this.panelData.id}
                panelTitle={this.panelData.name}
                active={this.active}
                title={this.panelData.name}
                class={`${this.panelData.type}-header`}
                editablePanelName={this.panelData?.settings?.misc?.editableHeaderName}
              ></pal-panel-stack-header>
            </div>
          ) : null}
          <div class="pal-grid-main">
            <div class="content" style={{ height: '100%', with:'100%' }}>
              <div class="panel-content" innerHTML={this.panelData.html}></div>
              <div class="pal-snaps">
                {this.panelData?.settings?.flexDrop
                  ? Object.entries(this.panelData?.settings?.flexDrop).map(([direction, isOn]) => {
                      return isOn ? (
                        <pal-drag-drop-snap direction={direction} treeId={this?.panelData?.treeId} panelId={this.panelId} logicContainer={this.logicContainer}></pal-drag-drop-snap>
                      ) : null;
                    })
                  : null}
              </div>
            </div>
          </div>
          <div class="pal-grid-footer"></div>
        </div>
      </Host>
    );
  }
}
