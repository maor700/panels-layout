import { Component, Host, h, Prop, Watch, Element, State } from '@stencil/core';
import { Panel, PanelTypes } from '../../services/panelsConfig';

@Component({
  tag: 'pal-flex-container-panel',
  styleUrl: 'pal-flex-container-panel.css',
})
export class PalFlexContainerPanel {
  @Prop() flexDirection: PanelTypes.column | PanelTypes.row;
  @Prop() panels: Panel[] = [];
  @State() flexFactor = 1;
  @Element() elm: HTMLElement;
  private conAxis: string;
  private conSize: number;

  @Watch('panels')
  setupFlex() {
    if (!this.flexDirection) return;
    const con = this.elm;
    this.conAxis = this.flexDirection === 'column' ? 'offsetHeight' : 'offsetWidth';
    this.conSize = con[this.conAxis];
    this.flexFactor = 100 / this.conSize;
  }

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
