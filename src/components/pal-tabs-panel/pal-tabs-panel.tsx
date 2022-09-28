import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'pal-tabs-panel',
  styleUrl: 'pal-tabs-panel.css',
  shadow: true,
})
export class PalTabsPanel {

  render() {
    return (
      <Host>
        <h2>TABS</h2>
      </Host>
    );
  }

}
