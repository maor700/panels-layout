import { Component, h, Host, State } from '@stencil/core';
import { liveQuery, Subscription } from 'dexie';
import { TreeItem } from '../../services/tree/TreeItem';
import { treesDB } from '../../services/tree/treesDB';
import '../../services/panelsConfig';
import '../../services/dbInit';
import '../../services/controller';

console.log(treesDB);

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
})
export class AppRoot {
  @State() root: TreeItem;
  private subscriptions: Subscription[] = [];
  z;

  componentWillLoad() {
    this.subscriptions.push(
      liveQuery(() => treesDB.getRoot('main-layout')).subscribe(root => {
        this.root = root;
      }),
    );
  }

  disconnectedCallback() {
    this.subscriptions.forEach(subscription => subscription?.unsubscribe?.());
  }

  render() {
    return (
      <Host class="grid-stick-layout">
        <header class="header">
          <h3>Stencil App Starter</h3>
        </header>
        <pal-drag-drop-context
          onTabDrop={async ({ detail }) => {
            const { start, end } = detail;

            if (!end && !start) return;

            if (!end?.panelId) return;
            // get ItemToTransfer
            const [ItemToTransfer, targetItem] = await treesDB.treesItems.bulkGet([start?.panelId, end?.panelId]);
            // create new node
            // move the new node to the parent of the target node
            const parents = targetItem?.parentPath.split('/');
            const targetItemParentId = parents?.[parents?.length - 2];
            const targetItemGrandpaId = parents?.[parents?.length - 3];
            const targetItemGrandGrandpaId = parents?.[parents?.length - 4];
            const containerId = await treesDB.addChildNode(targetItem.treeId, 'container', targetItemParentId, { flex: 20, direction: 'column', hideHeader: 1 });
            const container = await treesDB.treesItems.get(containerId);
            // move the two nodes to be the children of the new node;
            await treesDB.moveTreeItem(ItemToTransfer, container);
            //in case the parent of the ItemToTransfer is container with just one child. move the last child to the grandpa and remove the container.
            const [_, grandpaChildern] = await treesDB.getNodeAndChildren(targetItemGrandpaId);
            if (grandpaChildern?.length <= 1) {
              const [lastChild] = grandpaChildern;
              const granGrandpa = await treesDB.treesItems.get(targetItemGrandGrandpaId);
              if (lastChild) {
                await treesDB.moveTreeItem(lastChild, granGrandpa);
                targetItemGrandpaId && (await treesDB.deleteNode(targetItemGrandpaId));
              }
            }
            await treesDB.moveTreeItem(targetItem, container);
          }}
        >
          <main class="main">{this.root ? <pal-panel panelId={this.root.id} title={this.root.name} key={this.root.id}></pal-panel> : null}</main>
        </pal-drag-drop-context>
        <div class="footer">Footer</div>
      </Host>
    );
  }
}
