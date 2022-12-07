import { PanelTypes } from './panelsConfig';
import { treesDB } from './tree/treesDB';

// init
export const MAIN_TREE = 'main-layout';
export const SECOND_TREE = 'second-tree';
export const FLOATED_TREE_ID = 'floated-tree';
export const MINI_TREE_ID = 'minimized-tree';
export const WINDOW_TREE = 'window-tree';

treesDB.on('populate', async () => {
  treesDB.transaction('rw', treesDB.trees, treesDB.treesItems, async () => {
    await treesDB.treesItems.clear();
    await treesDB.trees.clear();
    await treesDB.createNewTree(MAIN_TREE, true, { id: MAIN_TREE, treeName: 'פריסה מרכזית' }, { id: 'root', persistContainer:1, leaf: 0, hideHeader: 1, type: PanelTypes.row, order: 100 });
    const { id } = await treesDB.getRoot(MAIN_TREE);

    await treesDB.createNewTree(
      SECOND_TREE,
      true,
      { id: SECOND_TREE, treeName: 'פריסה מרכזית' },
      { id: 'second-root', persistContainer:1, leaf: 0, hideHeader: 1, type: PanelTypes.column, order: 100 },
    );
    const { id: secondTreeId } = await treesDB.getRoot(SECOND_TREE);

    await treesDB.createNewTree(
      MINI_TREE_ID,
      true,
      { id: MINI_TREE_ID, treeName: 'חלונות ממוזערים' },
      { id: 'minimized-root', persistContainer:1, leaf: 0, hideHeader: 1, type: PanelTypes.column, order: 100 },
    );
    const { id: miniTreeId } = await treesDB.getRoot(MINI_TREE_ID);

    await treesDB.createNewTree(
      FLOATED_TREE_ID,
      true,
      { id: FLOATED_TREE_ID, treeName: 'חלונות צפים' },
      { id: 'floated-root', persistContainer:1, leaf: 0, hideHeader: 1, type: PanelTypes.float, order: 100 },
    );
    
    const { id: floatedTreeId } = await treesDB.getRoot(FLOATED_TREE_ID);
    
    await treesDB.createNewTree(WINDOW_TREE, true, { id: WINDOW_TREE, treeName: 'חלונות' }, { id: 'window-root', leaf: 0, hideHeader: 1, type: PanelTypes.window });
    const { id: x } = await treesDB.getRoot(WINDOW_TREE);
    console.log({ x });

    await treesDB.treesItems.bulkPut([
      { id: 'panel_1', color: 'red', order: 100, parentPath: `${id}/`, treeId: MAIN_TREE, leaf: 1, type: PanelTypes.content, name: 'panel_1', flex: 33 },
      { id: 'panel_2', color: 'blue', order: 200, parentPath: `${id}/`, treeId: MAIN_TREE, leaf: 1, name: 'panel_2', type: PanelTypes.content, flex: 33 },
      { id: 'panel_4', color: 'pink', order: 10, parentPath: `${floatedTreeId}/`, treeId: FLOATED_TREE_ID, leaf: 1, name: 'panel_4', type: PanelTypes.content, flex: 50 },
      { id: 'panel_5', color: 'gold', order: 20, parentPath: `${floatedTreeId}/`, treeId: FLOATED_TREE_ID, leaf: 1, name: 'panel_5', type: PanelTypes.content, flex: 25 },
      { id: 'panel_6', color: 'gray', order: 30, parentPath: `${floatedTreeId}/`, treeId: FLOATED_TREE_ID, leaf: 1, name: 'panel_6', type: PanelTypes.content, flex: 25 },

      {
        id: 'second_panel_1',
        color: 'orange',
        order: 100,
        parentPath: `${secondTreeId}/`,
        treeId: SECOND_TREE,
        leaf: 1,
        name: 'second_panel_1',
        type: PanelTypes.content,
        flex: 50,
      },
      {
        id: 'second_panel_2',
        color: 'purple',
        order: 200,
        parentPath: `${secondTreeId}/`,
        treeId: SECOND_TREE,
        leaf: 1,
        name: 'second_panel_2',
        type: PanelTypes.content,
        flex: 50,
      },

      {
        originalData: {
          id: 'mini_panel_1',
          color: 'gold',
          order: 200,
          parentPath: `${id}/`,
          treeId: MINI_TREE_ID,
          leaf: 1,
          name: 'מעקב חשודים',
          type: PanelTypes.content,
          flex: 50,
        },
        id: 'mini_panel_1',
        color: 'gold',
        order: 200,
        parentPath: `${miniTreeId}/`,
        treeId: MINI_TREE_ID,
        leaf: 1,
        name: 'מעקב חשודים',
        type: PanelTypes.content,
        flex: 50,
      },
      {
        id: 'mini_panel_2',
        originalData: {
          id: 'mini_panel_2',
          color: 'green',
          order: 200,
          parentPath: `${id}/`,
          treeId: MINI_TREE_ID,
          leaf: 1,
          name: 'אינדיקציות',
          type: PanelTypes.content,
          flex: 50,
        },
        color: 'green',
        order: 200,
        parentPath: `${miniTreeId}/`,
        treeId: MINI_TREE_ID,
        leaf: 1,
        name: 'אינדיקציות',
        type: PanelTypes.content,
        flex: 50,
      },
    ]);
  });
});

treesDB.on('ready', async () => {
  await treesDB.app.bulkPut([
    { key: 'appIsDirt', value: 0 },
    { key: 'dragProccess', value: { start: null, end: null } },
    { key: 'activeDrag', value: '' },
  ]);
});
