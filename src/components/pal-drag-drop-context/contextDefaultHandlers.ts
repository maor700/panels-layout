import { PalDragDropContextCustomEvent, Panel, PanelSettings } from '../../components';
import { FLOATED_TREE_ID, MINI_TREE_ID, ROOT_DEFAULT_SETTINGS, WINDOW_TREE } from '../../services/dbInit';
import { treesDB } from '../../services/tree/treesDB';

const DIRECTION_LOOKUP = {
  ltr: { left: -1, top: -1, right: 1, bottom: 1 },
  rtl: { left: 1, top: -1, right: -1, bottom: 1 },
};

export const onTabDroped = async ({ detail }: PalDragDropContextCustomEvent<DragProccess>) => {
  const { start, end } = detail;

  if (!end && !start) return;

  if (!end?.panelId) return;

  if (end?.panelId === start?.panelId && end?.logicContainer === start?.logicContainer) return;

  const translatedType = end?.direction === 'center' ? 'tabs' : end?.direction === 'bottom' || end?.direction === 'top' ? 'column' : 'row';
  const rtlLtr = end.targetDirection ?? 'ltr';
  const htmlDirection = DIRECTION_LOOKUP[rtlLtr];
  treesDB.transaction('rw', 'trees', 'treesItems', async () => {
    // get ItemToTransfer
    let [ItemToTransfer, targetItem, targetLogicContainer] = await treesDB.treesItems.bulkGet([start?.panelId, end?.panelId, end?.logicContainer]);

    const parents = await treesDB.getParents(targetItem);
    const parentWantToBeChild = parents.findIndex(someParent => someParent.id === ItemToTransfer.id) !== -1;

    if (parentWantToBeChild) return;

    if (targetLogicContainer.type === 'tabs' && end?.direction !== 'center') {
      targetLogicContainer = await treesDB.getParent(targetLogicContainer);
    }

    // move the new node to the parent of the target node
    const parentChildrenBeforeMove = await (await treesDB.getNodeChildrenCollection(targetLogicContainer?.id)).sortBy('order');
    let finalOrder = ItemToTransfer?.order ?? 0;
    if (parentChildrenBeforeMove.length) {
      const indexTarget = parentChildrenBeforeMove.findIndex(_ => _.id === end.panelId);
      const isLast = indexTarget === parentChildrenBeforeMove?.length - 1;
      const isfirst = indexTarget === 0;
      const orderFactor = htmlDirection[end.direction];
      const targetOrder = parentChildrenBeforeMove[indexTarget]?.order;
      const childBefore = parentChildrenBeforeMove?.[indexTarget + 1 * orderFactor]?.order ?? (isLast !== isfirst ? targetOrder + 10 * orderFactor : 0);
      const max = Math.max(childBefore, targetOrder);
      const min = Math.min(childBefore, targetOrder);
      finalOrder = min + (max - min) / 2;
    }

    if (Number.isNaN(finalOrder) || typeof finalOrder !== 'number') {
      finalOrder = 100;
    }
    // if direction is center use exist tabs container or create new one
    // else if the parent type is tabs use the parent as target item;

    let container;
    container = targetLogicContainer;
    const sameType = targetLogicContainer?.type === translatedType;
    const targetIsTheContainerItself = targetLogicContainer.id === targetItem.id;

    const haveToCreateNewContainer = !sameType && !targetIsTheContainerItself;

    if (haveToCreateNewContainer) {
      const id = await treesDB.addChildNode(targetItem.treeId, 'container', targetLogicContainer.id, {
        flex: targetItem.flex,
        order: targetItem?.order,
        type: translatedType,
        settings: ROOT_DEFAULT_SETTINGS,
      });
      container = await treesDB.treesItems.get(id);
    }
    // move the two nodes to be the children of the new node;
    await treesDB.moveTreeItem(ItemToTransfer, container);
    haveToCreateNewContainer && (await treesDB.moveTreeItem(targetItem, container));
    await treesDB.treesItems.update(ItemToTransfer?.id, { order: finalOrder });
    await treesDB.treesItems.update(container?.id, { activeTab: ItemToTransfer?.id });

    await removeEmptyContainers([ItemToTransfer.treeId, targetItem.treeId]);
  });
};

const removeEmptyContainers = async (treesIds: string[]) => {
  // find all containers with children <= 1  and with the same type of they parent;
  const toMove: { who: Panel; to: Panel }[] = [];
  const toDelete: Panel[] = [];

  for (let treeId of treesIds) {
    const node = await treesDB.getRoot(treeId);
    if (!node) return;
    await removeEmptyRecursive(node, toMove, toDelete);
  }

  const idsToDelete = toDelete.map(({ id }) => id);

  toMove.forEach(async ({ who, to }) => {
    await treesDB.moveTreeItem(who, to);
  });
  await treesDB.treesItems.bulkDelete(idsToDelete);
  //in any case do not remove persistContainer
  //for each of them, if children === 0 remove.
  // if children ===1 , in check his parent.
  //if the parent with the same type, remove the container.else do nothing
};

type ToMove = { who: Panel; to: Panel };
const removeEmptyRecursive = async (node: Panel, toMove: ToMove[] = [], toDelete: Panel[] = []): Promise<{ toMove: ToMove[]; toDelete: Panel[] }> => {
  const parent = await treesDB.getParent(node);
  const isContainerType = node.type !== 'content';

  const [_, children] = await treesDB.getNodeAndChildren(node.id);

  if (isContainerType && node.persistContainer !== 1) {
    if (children?.length === 0) {
      toDelete.push(node);
    } else if (children?.length == 1) {
      toDelete.push(node);
      const childToMove = children.map(child => ({ who: child, to: parent }));
      toMove.push(...childToMove);
    }
  }

  for (let child of children) {
    child && (await removeEmptyRecursive(child, toMove, toDelete));
  }

  return { toMove, toDelete };
};

export const closeHandler = (panelId: string) => {
  treesDB.deleteNode(panelId);
};

export const onTabClose: (event: PalDragDropContextCustomEvent<string>) => void = ({ detail: panelId }) => {
  closeHandler(panelId);
};

export const onChangePanelDisplayMode: (ev: PalDragDropContextCustomEvent<DisplayModeChange>) => void = async ({ detail }) => {
  const { panelId, displayMode, increaseLastFloatZindex, lastFloatZindex } = detail;
  let itemToTransfer = await treesDB.treesItems.get(panelId);
  itemToTransfer = { ...itemToTransfer, originalData: itemToTransfer };

  treesDB.transaction('rw', treesDB.trees, treesDB.treesItems, async () => {
    switch (displayMode) {
      case 'minimize':
        const target1 = await treesDB.getRoot(MINI_TREE_ID);
        treesDB.moveTreeItem(itemToTransfer, target1, false);
        break;
      case 'dettach':
        const floatedRoot = await treesDB.getRoot(FLOATED_TREE_ID);
        const correctedTransform = correctTransform(itemToTransfer, floatedRoot, lastFloatZindex, increaseLastFloatZindex);
        treesDB.moveTreeItem({ ...itemToTransfer, transform: correctedTransform }, floatedRoot);
        break;
      case 'window':
        const target3 = await treesDB.getRoot(WINDOW_TREE);
        treesDB.moveTreeItem(itemToTransfer, target3);
        break;
      case 'close':
        closeHandler(panelId);
        break;
      default:
        break;
    }
    return removeEmptyContainers([itemToTransfer.treeId]);
  });
};

export const correctTransform = (itemToTransfer, floatedRoot, lastFloatIndex: number = 1, increaseLastFloatZindex?: () => void) => {
  let { top, left, width, height } = itemToTransfer.transform ?? {};
  let { width: parentWidth, height: parentHeight } = floatedRoot.transform ?? {};
  if (left + width > parentWidth || top + height > parentHeight) {
    top = undefined;
    left = undefined;
  }
  if (top === undefined && left === undefined) {
    top = lastFloatIndex * 50 || 0;
    left = lastFloatIndex * 50 || 0;
    increaseLastFloatZindex?.();
  }
  return { ...itemToTransfer, top, left };
};

export const moveToOriginal = async ({ originalData }: Panel, lastFloatIndex?: number, increaseLastFloatZindex?: () => void) => {
  await treesDB.transaction('rw', treesDB.treesItems, async () => {
    let moveToTarget = await treesDB.getParent(originalData);
    if (!moveToTarget || moveToTarget.type === 'float') {
      moveToTarget = await treesDB.getRoot(FLOATED_TREE_ID);
      const newTransform = correctTransform(originalData, moveToTarget, lastFloatIndex, increaseLastFloatZindex);
      originalData = { ...originalData, transform: newTransform, originalData: null };
    }
    return treesDB.moveTreeItem(originalData, moveToTarget);
  });
};

export const onSubmitTransform = async ({ detail: { panelId, transform } }: PalDragDropContextCustomEvent<{ panelId: string; transform: Partial<PanelTransform> }>) => {
  const { transform: originalTransform } = await treesDB.treesItems.get(panelId);
  treesDB.treesItems.update(panelId, { transform: { ...originalTransform, ...transform } });
};

export const onSubmitSettings = async ({ detail: { panelId, settings } }: PalDragDropContextCustomEvent<{ panelId: string; settings: Partial<PanelSettings> }>) => {
  const { settings: originalSettings } = await treesDB.treesItems.get(panelId);
  treesDB.treesItems.update(panelId, { settings: { ...originalSettings, ...settings } });
};

export const onSetPanelTitle = async ({ detail: { panelId, title } }: PalDragDropContextCustomEvent<PanelTitlePayload>) => {
  treesDB.treesItems.update(panelId, { name: title });
};

export const contextDefaultHandlers = {
  onTabDroped,
  onChangePanelDisplayMode,
  onSetPanelTitle,
  onSubmitSettings,
  onSubmitTransform,
  onTabClose,
};
