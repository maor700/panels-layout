import { Component, Host, h, Prop, State } from '@stencil/core';
import { liveQuery } from 'dexie';
import { Subscription } from 'dexie';
import { from } from 'rxjs';
import { Panel, PanelTypes } from '../../services/panelsConfig';
import { TreesDB } from '../../services/tree/treesDB';

@Component({
  tag: 'pal-layout-tree',
  styleUrl: 'pal-layout-tree.css',
  scoped: true,
})
export class PalLayoutTree {
  @Prop() treeId: string;
  @Prop() treesDb: InstanceType<typeof TreesDB<Panel>>;
  @Prop({ reflect: true }) collapseTo?: 'right' | 'left' | 'top' | 'bottom';
  @Prop({ reflect: true }) isOpened?: boolean;
  @State() panelChildren: Panel[];
  @State() rootPanel: Panel;
  @State() children: Panel[];
  @State() floatedLayout: boolean;

  private panelChildren$ = from(liveQuery(() => this.treesDb.getChildren(this.rootPanel)));
  private subscriptions: Subscription[] = [];

  componentWillLoad() {
    this.subscriptions.push(
      liveQuery(() => this.treesDb.getRoot(this.treeId)).subscribe(root => {
        this.rootPanel = root;
        this.floatedLayout = this.rootPanel.type === PanelTypes.float;
      }),
      this.panelChildren$.subscribe(children => {
        this.children = children;
      }),
    );
  }

  disconnectedCallback() {
    this.subscriptions.forEach(sub => {
      sub?.unsubscribe();
    });
  }

  render() {
    return (
      <Host class={` ${this.collapseTo ? 'absolute-tree absolute-' + this.collapseTo : ''} ${!this.isOpened ? 'closed' : ''} ${this.floatedLayout?'floated-tree':''}`}>
        {this.rootPanel ? (
          <div class="layout-tree-con">
            <div
              class="btn-expender"
              role="button"
              onClick={() => {
                this.isOpened = !this.isOpened;
              }}
            >
              <div class="chevron"></div>
            </div>
            <pal-panel panelData={this.rootPanel} panelId={this.rootPanel.id} key={this.rootPanel.id}></pal-panel>
          </div>
        ) : null}
      </Host>
    );
  }
}
