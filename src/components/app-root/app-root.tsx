import { Component, h, Host, State } from '@stencil/core';
import { liveQuery, Subscription } from 'dexie';
import { TreeItem } from '../../services/tree/TreeItem';
import { treesDB } from '../../services/tree/treesDB';
import '../../services/panelsConfig';
import '../../services/dbInit';
import '../../services/controller';
// import { PanelTypes } from '../../services/panelsConfig';

console.log(treesDB);

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
})
export class AppRoot {
  @State() root: TreeItem;
  @State() scondRoot: TreeItem;
  private subscriptions: Subscription[] = [];

  componentWillLoad() {
    this.subscriptions.push(
      liveQuery(() => treesDB.getRoot('main-layout')).subscribe(root => {
        this.root = root;
      }),
      liveQuery(() => treesDB.getRoot('second-tree')).subscribe(scondRoot => {
        this.scondRoot = scondRoot;
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
          onTabDroped={async ({ detail }) => {
            const { start, end } = detail;
            if (!end && !start) return;

            if (!end?.panelId) return;
            if (end?.treeId === start?.treeId && end?.panelId === start?.panelId) return;
            // get ItemToTransfer
            const [ItemToTransfer, targetItem] = await treesDB.treesItems.bulkGet([start?.panelId, end?.panelId]);

            if (end?.treeId === start?.treeId && end?.panelId === start?.panelId) return;
            // create new node
            // move the new node to the parent of the target node
            const targetItemParents = targetItem?.parentPath.split('/');
            const ItemToTransferParents = ItemToTransfer?.parentPath.split('/');
            const targetItemParentId = targetItemParents?.[targetItemParents?.length - 2];
            const ItemToTransferParentId = ItemToTransferParents?.[ItemToTransferParents?.length - 2];
            const ItemToTransferGrandpaId = ItemToTransferParents?.[ItemToTransferParents?.length - 3];
            //if they sibilings and the direction is the same as parent,  return;
            const targetItemParent = await treesDB.treesItems.get(targetItemParentId);
            const translatedDirections = end?.direction === 'bottom' || end?.direction === 'top' ? 'column' : 'row';
            if (targetItem.treeId === ItemToTransfer.treeId && targetItem?.parentPath === ItemToTransfer?.parentPath && targetItemParent.type === translatedDirections) return;

            treesDB.transaction('rw', 'trees', 'treesItems', async () => {
              const parentChildrenBeforeMove = await (await (await treesDB.getNodeChildrenCollection(targetItemParentId)).sortBy('order')).reverse();
              console.log({parentChildrenBeforeMove});
              
              const indexTarget = parentChildrenBeforeMove.findIndex(_ => _.id === end.panelId);
              console.log({ indexTarget });
              let finalOrder = ItemToTransfer?.order ?? 0;
              if (end.direction === 'left') {
                const targetOrder = parentChildrenBeforeMove[indexTarget].order;
                const childBefore = parentChildrenBeforeMove?.[indexTarget - 1]?.order ?? 0;
                const max = Math.max(childBefore, targetOrder);
                const min = Math.min(childBefore, targetOrder);
                finalOrder = min + (max - min) / 2;
              }

              // check if target parent have the same type, if so dont create another container panel;

              const containerId =
                targetItemParent?.type === translatedDirections
                  ? targetItemParent?.id
                  : await treesDB.addChildNode(targetItem.treeId, 'container', targetItemParentId, { flex: 20, type: translatedDirections, hideHeader: 1 });
              const container = await treesDB.treesItems.get(containerId);
              // move the two nodes to be the children of the new node;
              await treesDB.moveTreeItem(ItemToTransfer, container);
              const [_, baseParentChildern] = await treesDB.getNodeAndChildren(ItemToTransferParentId);
              if (baseParentChildern?.length <= 1) {
                const [lastChild] = baseParentChildern;
                const granGrandpa = ItemToTransferGrandpaId && (await treesDB.treesItems.get(ItemToTransferGrandpaId));
                if (lastChild && granGrandpa) {
                  await treesDB.moveTreeItem(lastChild, granGrandpa);
                  ItemToTransferParentId && (await treesDB.deleteNode(ItemToTransferParentId));
                }
              }
              //in case the parent of the ItemToTransfer is container with just one child. move the last child to the grandpa and remove the container.
              await treesDB.moveTreeItem(ItemToTransfer, container);
              await treesDB.treesItems.update(ItemToTransfer?.id, {order:finalOrder})

            });
          }}
        >
          <main class="main">
            {this.root ? <pal-panel panelData={this.root} panelId={this.root.id} title={this.root.name} key={this.root.id}></pal-panel> : null}
            <div style={{ width: '5px' }} class="divider"></div>
            {this.scondRoot ? <pal-panel panelData={this.scondRoot} panelId={this.scondRoot.id} title={this.scondRoot.name} key={this.scondRoot.id}></pal-panel> : null}
          </main>
        </pal-drag-drop-context>
        <div class="footer">Footer</div>
      </Host>
    );
  }
}
