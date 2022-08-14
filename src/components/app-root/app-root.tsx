import { Component, h, Host } from '@stencil/core';
import { panelsLayout } from '../../services/panelsConfig';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
})
export class AppRoot {
  render() {
    return (
      <Host class="grid-stick-layout">
        <header class="header">
          <h1>Stencil App Starter</h1>
        </header>
        <main class="main">
          <pal-panels-container>
          {panelsLayout.panels.map(({title, id, component})=>{
            return <pal-panel title={title} key={id}>
              {id}
            </pal-panel>
          })}
          </pal-panels-container>
        </main>
        <div class="footer">Footer</div>
      </Host>
    );
  }
}
