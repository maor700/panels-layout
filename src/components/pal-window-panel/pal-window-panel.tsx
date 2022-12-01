import { Component, Host, h, Prop, State } from '@stencil/core';
import { liveQuery, Subscription } from 'dexie';
import { Panel } from '../../services/panelsConfig';
import { treesDB } from '../../services/tree/treesDB';

@Component({
  tag: 'pal-window-panel',
  styleUrl: 'pal-window-panel.css',
})
export class PalWindowPanel {
  @Prop() panelId: string;
  @State() panel: Panel;
  private subscriptions: Subscription[] = [];

  componentWillLoad() {
    this.subscriptions?.push(
      liveQuery(() => treesDB.treesItems.get(this.panelId)).subscribe(panel => {
        console.log({panel});
        
        this.panel = panel;
      }),
    );
  }

  disconnectedCallback() {
    this.subscriptions.forEach(subscription => subscription?.unsubscribe?.());
  }

  render() {
    return (
      <Host class="window-panel is-container">
        {this.panel ? <pal-panel panelData={this.panel} panelId={this.panelId}></pal-panel>:null}
      </Host>
    );
  }
}
