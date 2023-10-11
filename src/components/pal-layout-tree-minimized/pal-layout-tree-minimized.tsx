import { Event, Component, Host, h, Prop, EventEmitter } from '@stencil/core';
import { Panel } from '../../components';

@Component({
  tag: 'pal-layout-tree-minimized',
  styleUrl: 'pal-layout-tree-minimized.css',
  scoped: true,
})
export class PalLayoutTreeMinimized {
  @Prop() panels: Panel[];
  @Event() minimizedClick: EventEmitter<Panel>

  render() {
    return (
      <Host>
        <div class="minimized-con">
          {this.panels?.map((p: Panel) => {
            return (
              <div
                onClick={() => {
                  this.minimizedClick.emit(p);
                }}
                style={{ borderTopColor: `${p?.color}` }}
                class="mini-panel"
              >
                {p.name}
              </div>
            );
          })}
        </div>
      </Host>
    );
  }
}
