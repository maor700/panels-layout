import { Component, Host, h, Prop } from '@stencil/core';
import sapui5IconsMap from '../../assets/fonts/sap-icons';
import sapui5TNTIconsMap from '../../assets/fonts/sap-tnt-icons';
import ui5BusinessSuite from '../../assets/fonts/ui5BusinessSuite';

const LIBS_MAPS = {
  'sap':sapui5IconsMap,
  'tnt':sapui5TNTIconsMap,
  'suite':ui5BusinessSuite,
}

@Component({
  tag: 'pal-ui5-icon',
  styleUrl: 'pal-ui5-icon.css',
})
export class PalUi5Icon {
  @Prop() icon: string;
  @Prop() lib: 'sap' | 'tnt' | 'suite';
  @Prop() hoverStyle: boolean;

  render() {
    const number = LIBS_MAPS[this.lib]?.[this.icon];
    const symbol = String.fromCharCode(number);
    return <Host class={`${this.lib} icon-div ${this.hoverStyle ? 'hover-style' : ''}`} data-sap-ui-icon-content={symbol}></Host>;
  }
}
