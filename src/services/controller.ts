import { liveQuery } from 'dexie';
import { treesDB } from './tree/treesDB';

liveQuery(() => {
  return treesDB.getAppPropVal<DragProccess>('dragProccess');
}).subscribe(async ({ start, end }) => {
  //   treesDB.transaction('rw', treesDB.treesItems, async () => {
  const activeDrag = await treesDB.getAppPropVal('activeDrag');
  if(activeDrag){
    return;
  }
  
  if (!end && !start) return;

  if (start?.panelId) {
    treesDB.setAppPropVal('activeDrag', start.treeId);
  }

  if (!end?.panelId) return;
  // get ItemToTransfer
  const [ItemToTransfer, targetItem] = await treesDB.treesItems.bulkGet([start?.panelId, end?.panelId]);
  // create new node
  // move the new node to the parent of the target node
  const parents = targetItem?.parentPath.split('/');
  const targetItemParentId = parents?.[parents?.length - 2];
  const containerId = await treesDB.addChildNode(targetItem.treeId, 'container', targetItemParentId, { flex:20, direction: 'column', hideHeader: 1 });
  const container = await treesDB.treesItems.get(containerId);
  // move the two nodes to be the children of the new node;
  await treesDB.moveTreeItem(ItemToTransfer, container);
  await treesDB.moveTreeItem(targetItem, container);
  treesDB.setAppPropVal('activeProccess', { start: null, end: null });
  treesDB.setAppPropVal('activeDrag', '');
  //   });
});
