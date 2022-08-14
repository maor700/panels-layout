import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'pal-panel',
  styleUrl: 'pal-panel.css',
})
export class PalPanel {

  render() {
    return (
      <Host class="panel">
        <slot></slot>
      </Host>
    );
  }

}
