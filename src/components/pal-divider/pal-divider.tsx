import { Component, h, Host } from '@stencil/core';

@Component({
  tag: 'pal-divider',
  styleUrl: 'pal-divider.css',
})
export class PalDivider {
  render() {
    return (
      <Host class="v-divider"></Host>
    );
  }
}
