import { Component, Host, h, State, Prop } from '@stencil/core';
import { Panel } from '../../services/panelsConfig';

@Component({
  tag: 'pal-content-panel',
  styleUrl: 'pal-content-panel.css',
})
export class PalContentPanel {
  @Prop() panelId: string;
  @Prop() panelData: Panel;
  @Prop() logicContainer: string;
  @Prop() index: number;
  @State() active = true;

  render() {
    return (
      <Host>
        <div class="grid-stick-layout">
          {this.panelData && !this.panelData?.hideHeader ? (
            <div class="header panels-container-header">
              <pal-panel-stack-header
                panelData={this.panelData}
                logicContainer={this.logicContainer}
                panelId={this.panelId}
                treeId={this.panelData?.treeId}
                key={this.panelData.id}
                panelTitle={this.panelData.name}
                active={this.active}
                title={this.panelData.name}
              ></pal-panel-stack-header>
            </div>
          ) : null}
          <div class="main">
            <div class="content" style={{ height: '100%' }}>
              <div class="panel-content" innerHTML={this.panelData.html}></div>
              <div class="snaps">
                {
                  this.panelData?.settings?.flexDrop
                    ? Object.entries(this.panelData?.settings?.flexDrop).map(([direction, isOn]) => {
                        return isOn ? (
                          <pal-drag-drop-snap
                            direction={direction}
                            treeId={this?.panelData?.treeId}
                            panelId={this.panelId}
                            logicContainer={this.logicContainer}
                          ></pal-drag-drop-snap>
                        ) : null;
                      })
                    : null
                }
              </div>
            </div>
          </div>
          <div class="footer"></div>
        </div>
      </Host>
    );
  }
}
