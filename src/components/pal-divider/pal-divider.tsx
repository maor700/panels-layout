import { Component, h } from '@stencil/core';

@Component({
  tag: 'pal-divider',
  styleUrl: 'pal-divider.css',
})
export class PalDivider {

  render() {
    return (
      <div class="v-divider"></div>
    );
  }

}
