import { Component, h, Host, State } from '@stencil/core';
import { liveQuery, Subscription } from 'dexie';
import { TreeItem } from '../../services/tree/TreeItem';
import { treesDB } from '../../services/tree/treesDB';
import { PalDragDropContextCustomEvent } from '../../components';
import { Panel } from '../../services/panelsConfig';
import { FLOATED_TREE_ID, MAIN_TREE, MINI_TREE_ID, SECOND_TREE, WINDOW_TREE } from '../../services/dbInit';
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
  @State() root: TreeItem;
  @State() scondRoot: TreeItem;
  @State() floatedRoot: TreeItem;
  @State() minimizedPanels: TreeItem[];
  @State() windowPanels: TreeItem[];

  private activeWindows: Map<string, Window> = new Map();
  private subscriptions: Subscription[] = [];

  onDropHandler = async (ev: PalDragDropContextCustomEvent<DragProccess>) => {
    const { start, end } = ev?.detail;
    console.log({ start, end });

    if (!end && !start) return;

    if (!end?.panelId) return;

    if (end?.treeId === start?.treeId && end?.panelId === start?.panelId) return;
    return dropHandler(ev);
  };

  moveToOriginal = async ({ originalData }: Panel) => {
    await treesDB.transaction('rw', treesDB.treesItems, async () => {
      const originalContainer = await treesDB.getParent(originalData);
      return treesDB.moveTreeItem(originalData, originalContainer);
    });
  };

  componentWillLoad() {
    this.subscriptions.push(
      liveQuery(() => treesDB.getRoot(MAIN_TREE)).subscribe(root => {
        this.root = root;
      }),
      liveQuery(() => treesDB.getRoot(SECOND_TREE)).subscribe(scondRoot => {
        this.scondRoot = scondRoot;
      }),
      liveQuery(() => treesDB.getRoot(FLOATED_TREE_ID)).subscribe(floatedRoot => {
        this.floatedRoot = floatedRoot;
      }),
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

  render() {
    return (
      <Host>
        <pal-drag-drop-context
          class="grid-stick-layout"
          onTabDroped={this.onDropHandler}
          onChangePanelDisplayMode={this.changeDisplayHandler()}
          onTabClose={({ detail: apnelId }) => closeHandler(apnelId)}
        >
          <Router.Switch>
            <Route path={match('/window/:id')} render={({ id }) => <pal-window-panel panelId={id} />} />
            <Route path={match('/')}>
              <header class="header">
                <h3>Stencil App Starter</h3>
              </header>

              <main class="main">
                {this.root ? <pal-panel panelData={this.root} panelId={this.root.id} title={this.root.name} key={this.root.id}></pal-panel> : null}
                <div style={{ width: '5px' }} class="divider"></div>
                {this.scondRoot ? <pal-panel panelData={this.scondRoot} panelId={this.scondRoot.id} title={this.scondRoot.name} key={this.scondRoot.id}></pal-panel> : null}
                <div class="floated-tree">
                  {this.floatedRoot ? (
                    <pal-panel panelData={this.floatedRoot} panelId={this.floatedRoot.id} title={this.floatedRoot.name} key={this.floatedRoot.id}></pal-panel>
                  ) : null}
                </div>
              </main>
              <div class="footer">
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
  private changeDisplayHandler(): (event: PalDragDropContextCustomEvent<DisplayModeChange>) => void {
    return async ({ detail }) => {
      const { panelId, displayMode } = detail;

      let itemToTransfer = await treesDB.treesItems.get(panelId);
      itemToTransfer = { ...itemToTransfer, originalData: itemToTransfer };

      switch (displayMode) {
        case 'minimize':
          await treesDB.transaction('rw', treesDB.treesItems, async () => {
            const target = await treesDB.getRoot(MINI_TREE_ID);
            return treesDB.moveTreeItem(itemToTransfer, target);
          });
          break;
        case 'dettach':
          await treesDB.transaction('rw', treesDB.treesItems, async () => {
            const target = await treesDB.getRoot(FLOATED_TREE_ID);
            return treesDB.moveTreeItem(itemToTransfer, target);
          });
          break;
        case 'window':
          await treesDB.transaction('rw', treesDB.treesItems, async () => {
            const target = await treesDB.getRoot(WINDOW_TREE);
            return treesDB.moveTreeItem(itemToTransfer, target);
          });
          break;
        case 'close':
          console.log('close', panelId);

          await treesDB.transaction('rw', treesDB.treesItems, async () => {
            return closeHandler(panelId);
          });
          break;

        default:
          break;
      }
    };
  }
}

const closeHandler = (panelId: string) => {
  treesDB.deleteNode(panelId);
};

// Drop on center - create a new tabs panel (or use the exist one) and move the original + moved panel to the tabs panel;
const dropHandler = async ({ detail }: PalDragDropContextCustomEvent<DragProccess>) => {
  const { start, end } = detail;
  const translatedType = end?.direction === 'center' ? 'tabs' : end?.direction === 'bottom' || end?.direction === 'top' ? 'column' : 'row';

  // get ItemToTransfer
  let [ItemToTransfer, targetItem, toTransferLogicContainer, targetLogicContainer] = await treesDB.treesItems.bulkGet([
    start?.panelId,
    end?.panelId,
    start?.logicContainer,
    end?.logicContainer,
  ]);

  // if (targetLogicContainer.type === 'tabs' && end?.direction !== 'center') {
  //   targetLogicContainer = await treesDB.getParent(targetLogicContainer);
  // }

  const ItemToTransferGrandpa = await treesDB.getParent(toTransferLogicContainer);
  // move the new node to the parent of the target node

  treesDB.transaction('rw', 'trees', 'treesItems', async () => {
    const parentChildrenBeforeMove = await (await treesDB.getNodeChildrenCollection(targetLogicContainer?.id)).sortBy('order');
    const indexTarget = parentChildrenBeforeMove.findIndex(_ => _.id === end.panelId);
    const isLast = indexTarget === parentChildrenBeforeMove?.length - 1;
    const isfirst = indexTarget === 0;
    let finalOrder = ItemToTransfer?.order ?? 0;
    const orderFactor = end.direction === 'left' || end.direction === 'top' ? -1 : 1;
    const targetOrder = parentChildrenBeforeMove[indexTarget]?.order;
    const childBefore = parentChildrenBeforeMove?.[indexTarget + 1 * orderFactor]?.order ?? (isLast !== isfirst ? targetOrder + 10 * orderFactor : 0);
    const max = Math.max(childBefore, targetOrder);
    const min = Math.min(childBefore, targetOrder);
    finalOrder = min + (max - min) / 2;

    // if direction is center use exist tabs container or create new one
    // else if the parent type is tabs use the parent as target item;

    let container;
    container = targetLogicContainer;
    const sameType = targetLogicContainer?.type === translatedType;

    if (!sameType) {
      const id = await treesDB.addChildNode(targetItem.treeId, 'container', targetLogicContainer.id, {
        flex: targetItem.flex,
        order: targetItem?.order,
        type: translatedType,
        hideHeader: 1,
      });
      container = await treesDB.treesItems.get(id);
    }
    // move the two nodes to be the children of the new node;
    await treesDB.moveTreeItem(ItemToTransfer, container);
    !sameType && (await treesDB.moveTreeItem(targetItem, container));
    await treesDB.treesItems.update(ItemToTransfer?.id, { order: finalOrder });
    await treesDB.treesItems.update(container?.id, { activeTab: ItemToTransfer?.id });

    //in case the parent of the ItemToTransfer is container with just one child. move the last child to the grandpa and remove the container.
    const [_, baseParentChildern] = await treesDB.getNodeAndChildren(toTransferLogicContainer.id);
    if (baseParentChildern?.length <= 1) {
      const [lastChild] = baseParentChildern;
      if (lastChild && ItemToTransferGrandpa) {
        const order = toTransferLogicContainer?.order;
        await treesDB.moveTreeItem({ ...lastChild, order }, ItemToTransferGrandpa);
        toTransferLogicContainer?.id && (await treesDB.deleteNode(toTransferLogicContainer.id));
      }
    }
  });
};

const removeEmptyContainers = async (treesIds: string[]) => {
  // find all containers with children <= 1;
  treesDB.transaction('rw', treesDB.treesItems, async () => {
    const toMove: { who: Panel; to: Panel }[] = [];
    const toDelete: Panel[] = [];

    for (let treeId of treesIds) {
      const node = await treesDB.getRoot(treeId);
      await removeEmptyRecursive(node, toMove, toDelete);
    }

    console.log({ toDelete, toMove });

    const idsToDelete = toDelete.map(({ id }) => id);

    toMove.forEach(async ({ who, to }) => {
      await treesDB.moveTreeItem(who, to);
    });

    console.log({ idsToDelete });
    await treesDB.treesItems.bulkDelete(idsToDelete);
  });

  //for each of them, if children === 0 remove.
  // if children ===1 , in check his parent.
  //if the parent with the same type, remove the container.else do nothing
};

const removeEmptyRecursive = async (node: Panel, toMove: { who: Panel; to: Panel }[] = [], toDelete: Panel[] = []) => {
  const parent = await treesDB.getParent(node);
  const isContainerType = node.type !== 'content';

  if (!isContainerType) return [toMove, toDelete];

  const children = await (await treesDB.getNodeChildrenCollection(node.id))?.toArray();

  if (node.persistContainer !== 1) {
    if (children?.length === 0) {
      toDelete.push(node);
    } else if (children?.length == 1) {
      toDelete.push(node);
      const childToMove = children.map(child => ({ who: child, to: parent }));
      toMove.push(...childToMove);
    }
  }

  for (let child of children) {
    await removeEmptyRecursive(child, toMove, toDelete);
  }

  return [toMove, toDelete];
};

console.log(removeEmptyContainers);
