import { Component, h, Host, State } from '@stencil/core';
import { liveQuery, Subscription } from 'dexie';
import { TreeItem } from '../../services/tree/TreeItem';
import { treesDB } from '../../services/tree/treesDB';
import '../../services/panelsConfig';
import '../../services/dbInit';
import '../../services/controller';
import { PalDragDropContextCustomEvent } from '../../components';
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
  onDropHandler = async (ev: PalDragDropContextCustomEvent<DragProccess>) => {
    const { start, end } = ev?.detail;
    if (!end && !start) return;

    if (!end?.panelId) return;

    if (end?.treeId === start?.treeId && end?.panelId === start?.panelId) return;

    const direction = ev.detail?.end?.direction;
    if (direction === 'center') {
      return centerDropHandler(ev);
    } else {
      return sidesDropHandler(ev);
    }
  };

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
        <pal-drag-drop-context onTabDroped={this.onDropHandler}>
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

// Drop on center - create a new tabs panel (or use the exist one) and move the original + moved panel to the tabs panel;
const centerDropHandler = async ({ detail }: PalDragDropContextCustomEvent<DragProccess>) => {
  const { start, end } = detail;
  // get ItemToTransfer
  const [ItemToTransfer, targetItem] = await treesDB.treesItems.bulkGet([start?.panelId, end?.panelId]);
  // move the new node to the parent of the target node
  const targetItemParents = targetItem?.parentPath.split('/');
  const ItemToTransferParents = ItemToTransfer?.parentPath.split('/');
  const targetItemParentId = targetItemParents?.[targetItemParents?.length - 2];
  const ItemToTransferParentId = ItemToTransferParents?.[ItemToTransferParents?.length - 2];
  const ItemToTransferGrandpaId = ItemToTransferParents?.[ItemToTransferParents?.length - 3];
  const targetItemParent = await treesDB.treesItems.get(targetItemParentId);
  const translatedDirections = "tabs";

  treesDB.transaction('rw', 'trees', 'treesItems', async () => {
    const parentChildrenBeforeMove = await (await treesDB.getNodeChildrenCollection(targetItemParentId)).sortBy('order');
    const indexTarget = parentChildrenBeforeMove.findIndex(_ => _.id === end.panelId);
    const isLast = indexTarget === parentChildrenBeforeMove?.length - 1;
    const isfirst = indexTarget === 0;
    let finalOrder = ItemToTransfer?.order ?? 0;
    const orderFactor = end.direction === 'left' || end.direction === 'top' ? -1 : 1;
    const targetOrder = parentChildrenBeforeMove[indexTarget].order;
    const childBefore = parentChildrenBeforeMove?.[indexTarget + 1 * orderFactor]?.order ?? (isLast !== isfirst ? targetOrder + 10 * orderFactor : 0);
    const max = Math.max(childBefore, targetOrder);
    const min = Math.min(childBefore, targetOrder);
    finalOrder = min + (max - min) / 2;

    // check if target parent have the same type, if so dont create another container panel;
    const sameDirection = targetItemParent?.type === translatedDirections;
    const containerId = sameDirection
      ? targetItemParent?.id
      : await treesDB.addChildNode(targetItem.treeId, 'container', targetItemParentId, { flex: 20, order: targetItem.order, type: translatedDirections, hideHeader: translatedDirections?0:1 });
    const container = await treesDB.treesItems.get(containerId);
    // move the two nodes to be the children of the new node;
    await treesDB.moveTreeItem(ItemToTransfer, container);
    !sameDirection && (await treesDB.moveTreeItem(targetItem, container));
    await treesDB.treesItems.update(ItemToTransfer?.id, { order: finalOrder });
    await treesDB.treesItems.update(container?.id, { activeTab: ItemToTransfer?.id });

    //in case the parent of the ItemToTransfer is container with just one child. move the last child to the grandpa and remove the container.
    const [_, baseParentChildern] = await treesDB.getNodeAndChildren(ItemToTransferParentId);
    if (baseParentChildern?.length <= 1) {
      const [lastChild] = baseParentChildern;
      const granGrandpa = ItemToTransferGrandpaId && (await treesDB.treesItems.get(ItemToTransferGrandpaId));
      if (lastChild && granGrandpa) {
        await treesDB.moveTreeItem(lastChild, granGrandpa);
        ItemToTransferParentId && (await treesDB.deleteNode(ItemToTransferParentId));
      }
    }
  });
};

const sidesDropHandler = async ({ detail }: PalDragDropContextCustomEvent<DragProccess>) => {
  const { start, end } = detail;
  // get ItemToTransfer
  const [ItemToTransfer, targetItem] = await treesDB.treesItems.bulkGet([start?.panelId, end?.panelId]);
  // move the new node to the parent of the target node
  const targetItemParents = targetItem?.parentPath.split('/');
  const ItemToTransferParents = ItemToTransfer?.parentPath.split('/');
  const targetItemParentId = targetItemParents?.[targetItemParents?.length - 2];
  const ItemToTransferParentId = ItemToTransferParents?.[ItemToTransferParents?.length - 2];
  const ItemToTransferGrandpaId = ItemToTransferParents?.[ItemToTransferParents?.length - 3];
  const targetItemParent = await treesDB.treesItems.get(targetItemParentId);
  const translatedDirections = end?.direction === 'bottom' || end?.direction === 'top' ? 'column' : 'row';

  treesDB.transaction('rw', 'trees', 'treesItems', async () => {
    const parentChildrenBeforeMove = await (await treesDB.getNodeChildrenCollection(targetItemParentId)).sortBy('order');
    const indexTarget = parentChildrenBeforeMove.findIndex(_ => _.id === end.panelId);
    const isLast = indexTarget === parentChildrenBeforeMove?.length - 1;
    const isfirst = indexTarget === 0;
    let finalOrder = ItemToTransfer?.order ?? 0;
    const orderFactor = end.direction === 'left' || end.direction === 'top' ? -1 : 1;
    const targetOrder = parentChildrenBeforeMove[indexTarget].order;
    const childBefore = parentChildrenBeforeMove?.[indexTarget + 1 * orderFactor]?.order ?? (isLast !== isfirst ? targetOrder + 10 * orderFactor : 0);
    const max = Math.max(childBefore, targetOrder);
    const min = Math.min(childBefore, targetOrder);
    finalOrder = min + (max - min) / 2;

    // check if target parent have the same type, if so dont create another container panel;
    const sameDirection = targetItemParent?.type === translatedDirections;
    const containerId = sameDirection
      ? targetItemParent?.id
      : await treesDB.addChildNode(targetItem.treeId, 'container', targetItemParentId, { flex: 20, order: targetItem.order, type: translatedDirections, hideHeader: 1 });
    const container = await treesDB.treesItems.get(containerId);
    // move the two nodes to be the children of the new node;
    await treesDB.moveTreeItem(ItemToTransfer, container);
    !sameDirection && (await treesDB.moveTreeItem(targetItem, container));
    await treesDB.treesItems.update(ItemToTransfer?.id, { order: finalOrder });

    //in case the parent of the ItemToTransfer is container with just one child. move the last child to the grandpa and remove the container.
    const [_, baseParentChildern] = await treesDB.getNodeAndChildren(ItemToTransferParentId);
    if (baseParentChildern?.length <= 1) {
      const [lastChild] = baseParentChildern;
      const granGrandpa = ItemToTransferGrandpaId && (await treesDB.treesItems.get(ItemToTransferGrandpaId));
      if (lastChild && granGrandpa) {
        await treesDB.moveTreeItem(lastChild, granGrandpa);
        ItemToTransferParentId && (await treesDB.deleteNode(ItemToTransferParentId));
      }
    }
  });
};
