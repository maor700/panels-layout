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
            <div class="content" style={{height:"100%"}}>
              <div class="panel-content">
                {/* <div>TEST</div> */}
                <iframe src="https://omny.fm/shows/kan-4240/4-12-2022/embed?style=cover&size=square&image=1&share=0&download=0&description=0&subscribe=0&foreground=6d4d8f&background=f7f7f7&highlight=000000&ttag=ad:ipbc&dist=kan" frameborder="0"></iframe>
                </div>
              <div class="snaps">
                    <pal-drag-drop-snap direction={'top'} treeId={this?.panelData?.treeId} panelId={this.panelId} logicContainer={this.logicContainer}></pal-drag-drop-snap>
                    <pal-drag-drop-snap direction={'right'} treeId={this?.panelData?.treeId} panelId={this.panelId} logicContainer={this.logicContainer}></pal-drag-drop-snap>
                    <pal-drag-drop-snap direction={'left'} treeId={this?.panelData?.treeId} panelId={this.panelId} logicContainer={this.logicContainer}></pal-drag-drop-snap>
                    <pal-drag-drop-snap
                      direction={'bottom'}
                      treeId={this?.panelData?.treeId}
                      panelId={this.panelId}
                      logicContainer={this.logicContainer}
                    ></pal-drag-drop-snap>
                <pal-drag-drop-snap direction={'center'} treeId={this?.panelData?.treeId} panelId={this.panelId} logicContainer={this.logicContainer}></pal-drag-drop-snap>
              </div>
            </div>
          </div>
          <div class="footer"></div>
        </div>
      </Host>
    );
  }
}
