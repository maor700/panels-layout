import { Component, h, Host, State } from '@stencil/core';
import { liveQuery, Subscription } from 'dexie';
import { TreeItem } from '../../services/tree/TreeItem';
import { treesDB } from '../../services/tree/treesDB';
import { PalDragDropContextCustomEvent } from '../../components';
import { Panel, PanelSettings } from '../../services/panelsConfig';
import { FLOATED_TREE_ID, MAIN_TREE, MAP_TREE_ID, MINI_TREE_ID, ROOT_DEFAULT_SETTINGS, SECOND_TREE, WINDOW_TREE } from '../../services/dbInit';
import { createRouter, match, Route } from 'stencil-router-v2';
import '../../services/panelsConfig';
import '../../services/dbInit';
import '../../services/controller';

const Router = createRouter();

console.log(treesDB);

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
})
export class AppRoot {
  @State() minimizedPanels: TreeItem[];
  @State() windowPanels: TreeItem[];

  private activeWindows: Map<string, Window> = new Map();
  private subscriptions: Subscription[] = [];
  private lastFloatIndex = 0;

  onDropHandler = async (ev: PalDragDropContextCustomEvent<DragProccess>) => {
    const { start, end } = ev?.detail;

    if (!end && !start) return;

    if (!end?.panelId) return;

    if (end?.panelId === start?.panelId && end?.logicContainer === start?.logicContainer) return;
    return dropHandler(ev);
  };

  moveToOriginal = async ({ originalData }: Panel) => {
    await treesDB.transaction('rw', treesDB.treesItems, async () => {
      let moveToTarget = await treesDB.getParent(originalData);
      if (!moveToTarget || moveToTarget.type === 'float') {
        moveToTarget = await treesDB.getRoot(FLOATED_TREE_ID);
        const newTransform = this.correctTransform(originalData, moveToTarget);
        originalData = { ...originalData, transform: newTransform, originalData: null };
      }
      return treesDB.moveTreeItem(originalData, moveToTarget);
    });
  };

  submitTansformHandler = async ({ detail: { panelId, transform } }: PalDragDropContextCustomEvent<{ panelId: string; transform: Partial<PanelTransform> }>) => {
    const { transform: originalTransform } = await treesDB.treesItems.get(panelId);
    treesDB.treesItems.update(panelId, { transform: { ...originalTransform, ...transform } });
  };

  submitSettingsHandler = async ({ detail: { panelId, settings } }: PalDragDropContextCustomEvent<{ panelId: string; settings: Partial<PanelSettings> }>) => {
    const { settings: originalSettings } = await treesDB.treesItems.get(panelId);
    treesDB.treesItems.update(panelId, { settings: { ...originalSettings, ...settings } });
  };
  setPanelTitleHandler = async ({ detail: { panelId, title } }: PalDragDropContextCustomEvent<PanelTitlePayload>) => {
    treesDB.treesItems.update(panelId, { name: title });
  };

  componentWillLoad() {
    this.subscriptions.push(
      liveQuery(async () => {
        const root = await treesDB.getRoot(MINI_TREE_ID);
        return (await treesDB.getNodeChildrenCollection(root?.id)).toArray();
      }).subscribe(items => {
        this.minimizedPanels = items;
      }),
      location.pathname === '/'
        ? liveQuery(async () => {
            const root = await treesDB.getRoot(WINDOW_TREE);
            return (await treesDB.getNodeChildrenCollection(root?.id)).toArray();
          }).subscribe(items => {
            this.windowPanels = items;

            items.forEach(item => {
              const exist = this.activeWindows.get(item?.id);
              if (!exist) {
                var myWindow = window.open(
                  `/window/${item.id}`,
                  item.name,
                  'directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=300,height=400',
                );
                this.activeWindows.set(item.id, myWindow);
              }
            });
            treesDB.transaction('rw', treesDB.treesItems, async () => {
              [...this.activeWindows.entries()].forEach(async ([winId, windowInstance]) => {
                const exist = items.find(_ => _.id === winId);
                if (!exist) {
                  windowInstance.close();
                  this.activeWindows.delete(winId);
                }
              });
            });
          })
        : null,
    );

    // close all related windows when user close the main app.
    addEventListener('beforeunload', () => {
      [...this.activeWindows.entries()].forEach(([_, winInstance]) => {
        winInstance.close();
      });
    });
  }

  disconnectedCallback() {
    this.subscriptions.forEach(subscription => subscription?.unsubscribe?.());
  }

  correctTransform = (itemToTransfer, floatedRoot) => {
    let { top, left, width, height } = itemToTransfer.transform ?? {};
    let { width: parentWidth, height: parentHeight } = floatedRoot.transform ?? {};
    if (left + width > parentWidth || top + height > parentHeight) {
      top = undefined;
      left = undefined;
    }
    if (top === undefined && left === undefined) {
      top = this.lastFloatIndex * 50 || 0;
      left = this.lastFloatIndex * 50 || 0;
      this.lastFloatIndex++;
    }
    return { ...itemToTransfer, top, left };
  };

  render() {
    return (
      <Host>
        <pal-drag-drop-context
          class="pal-grid-stick-layout"
          onTabDroped={this.onDropHandler}
          onChangePanelDisplayMode={this.changeDisplayHandler}
          onTabClose={({ detail: apnelId }) => closeHandler(apnelId)}
          onSubmitTransform={this.submitTansformHandler}
          onSubmitSettings={this.submitSettingsHandler}
          onSetPanelTitle={this.setPanelTitleHandler}
        >
          <Router.Switch>
            <Route path={match('/window/:id')} render={({ id }) => <pal-window-panel panelId={id} />} />
            <Route path={match('/')}>
              <header class="pal-grid-header">
                <h3>Layout System</h3>
              </header>

              <main class="pal-grid-main" style={{ overflow: 'hidden' }}>
                <pal-layout-tree style={{ width: '100%', height: '100%' }} treesDb={treesDB} treeId={MAP_TREE_ID} />
                <pal-layout-tree collapseTo="bottom" treesDb={treesDB} treeId={MAIN_TREE} />
                <pal-layout-tree collapseTo="right" treesDb={treesDB} treeId={SECOND_TREE} />
                <pal-layout-tree treesDb={treesDB} treeId={FLOATED_TREE_ID} />
              </main>
              <div class="pal-grid-footer">
                <div class="minimized-con">
                  {this.minimizedPanels?.map((p: Panel) => {
                    return (
                      <div
                        onClick={() => {
                          this.moveToOriginal(p);
                        }}
                        style={{ borderTopColor: `${p?.color}` }}
                        class="mini-panel"
                      >
                        {p.name}
                      </div>
                    );
                  })}
                </div>
              </div>
            </Route>
          </Router.Switch>
        </pal-drag-drop-context>
      </Host>
    );
  }

  //@ts-ignore
  private changeDisplayHandler: (ev: PalDragDropContextCustomEvent<DisplayModeChange>) => void = async ({ detail }) => {
    const { panelId, displayMode } = detail;
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
          const correctedTransform = this.correctTransform(itemToTransfer, floatedRoot);
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
}

const closeHandler = (panelId: string) => {
  treesDB.deleteNode(panelId);
};

const DIRECTION_LOOKUP = {
  ltr: { left: -1, top: -1, right: 1, bottom: 1 },
  rtl: { left: 1, top: -1, right: -1, bottom: 1 },
};

// Drop on center - create a new tabs panel (or use the exist one) and move the original + moved panel to the tabs panel;
const dropHandler = async ({ detail }: PalDragDropContextCustomEvent<DragProccess>) => {
  const { start, end } = detail;
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
    const changes = await removeEmptyRecursive(node, toMove, toDelete);
    console.log(changes);
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
