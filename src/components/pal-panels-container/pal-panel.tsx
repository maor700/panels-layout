import { Component, Element, h, Host, Prop, State } from '@stencil/core';
import { Panel, PanelTypes } from '../../services/panelsConfig';
@Component({
  tag: 'pal-panel',
  styleUrl: 'pal-panel.css',
})
export class PalPanel {
  @Prop() panelId: string;
  @Prop() panelData: Panel;

  @Element() elm: HTMLElement;

  render() {
    return (
      <Host class={`panel`} style={{flex:this.panelData?.flex+""}}>
        {this.panelData?.type === PanelTypes.row || this.panelData?.type === PanelTypes.column ? (
          <pal-flex-container-panel panelId={this.panelId} flexDirection={ this.panelData?.type}></pal-flex-container-panel>
        ) : (
          this.panelData?.type === PanelTypes.content ? <pal-content-panel panelData={this.panelData} panelId={this.panelId} /> : null
        )}
      </Host>
    );
  }
}
