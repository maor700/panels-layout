import { Component, h, Host, State } from '@stencil/core';
import { liveQuery, Subscription } from 'dexie';
import { TreeItem } from '../../services/tree/TreeItem';
import { treesDB } from '../../services/tree/treesDB';
import { FLOATED_TREE_ID, MAIN_TREE, MAP_TREE_ID, MINI_TREE_ID, SECOND_TREE, WINDOW_TREE } from '../../services/dbInit';
import { createRouter, match, Route } from 'stencil-router-v2';
import '../../services/panelsConfig';
import '../../services/dbInit';
import '../../services/controller';
import { contextDefaultHandlers, moveToOriginal } from '../pal-drag-drop-context/contextDefaultHandlers';

const Router = createRouter();

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
})
export class AppRoot {
  @State() minimizedPanels: TreeItem[];
  @State() windowPanels: TreeItem[];

  private activeWindows: Map<string, Window> = new Map();
  private subscriptions: Subscription[] = [];

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

  render() {
    return (
      <Host>
        <pal-drag-drop-context class="pal-grid-stick-layout" {...contextDefaultHandlers}>
          <Router.Switch>
            
            <Route path={match('/window/:id')} render={({ id }) => <pal-window-panel panelId={id} />} />
            <Route path={match('/')}>
              
              <header class="pal-grid-header">
                <h3>Layout System</h3>
              </header>

              <main class="pal-grid-main" style={{ overflow: 'hidden' }}>
                <pal-layout-tree style={{ width: '100%', height: '100%' }} treesDb={treesDB} treeId={MAP_TREE_ID} />
                <pal-layout-tree collapseTo="top" treesDb={treesDB} treeId={MAIN_TREE} />
                <pal-layout-tree collapseTo="bottom" treesDb={treesDB} treeId={MAIN_TREE} />
                <pal-layout-tree collapseTo="right" treesDb={treesDB} treeId={SECOND_TREE} />
                <pal-layout-tree treesDb={treesDB} treeId={FLOATED_TREE_ID} />
              </main>

              <div class="pal-grid-footer">
                <pal-layout-tree-minimized
                  panels={this.minimizedPanels}
                  onMinimizedClick={({ detail: panel }) => {
                    moveToOriginal(panel);
                  }}
                />
              </div>

            </Route>
          </Router.Switch>
        </pal-drag-drop-context>
      </Host>
    );
  }
}
