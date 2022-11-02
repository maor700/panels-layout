import { PanelTypes } from './panelsConfig';
import { treesDB } from './tree/treesDB';

// init
const TREE_NAME = 'main-layout';
treesDB.on('ready', async () => {
  await treesDB.treesItems.clear();
  await treesDB.trees.clear();
  await treesDB.createNewTree(TREE_NAME, true, { id: TREE_NAME, treeName: 'פריסה מרכזית' }, { id: 'root', leaf: 0, hideHeader: 1, type:PanelTypes.row, order: 100 });
  const { id } = await treesDB.getRoot(TREE_NAME);

  await treesDB.createNewTree('second-tree', true, { id: 'second-tree', treeName: 'פריסה מרכזית' }, { id: 'second-root', leaf: 0, hideHeader: 1, type:PanelTypes.column , order: 100,});
  const { id: secondTreeId } = await treesDB.getRoot('second-tree');

  await treesDB.treesItems.bulkPut([
    { id: 'panel_1', color:"red", order: 100, parentPath: `${id}/`, treeId: TREE_NAME, leaf: 1, type: PanelTypes.content, name: 'panel_1', flex: 33 },
    { id: 'panel_2', color:"blue", order: 200, parentPath: `${id}/`, treeId: TREE_NAME, leaf: 1, name: 'panel_2', type: PanelTypes.content, flex: 33 },
    { id: 'panel_3', color:"green", order: 300, parentPath: `${id}/`, treeId: TREE_NAME, leaf: 0, name: 'panel_3', activeTab:"panel_4", type: PanelTypes.float, flex: 33, hideHeader: 1 },
    { id: 'panel_4', color:"pink", order: 10, parentPath: `${id}/panel_3/`, treeId: TREE_NAME, leaf: 1, name: 'panel_4', type: PanelTypes.content, flex: 50 },
    { id: 'panel_5', color:"gold", order: 20, parentPath: `${id}/panel_3/`, treeId: TREE_NAME, leaf: 1, name: 'panel_5', type: PanelTypes.content, flex: 25 },
    { id: 'panel_6', color:"gray", order: 30, parentPath: `${id}/panel_3/`, treeId: TREE_NAME, leaf: 1, name: 'panel_6', type: PanelTypes.content, flex: 25 },

    { id: 'second_panel_1', color:"orange", order: 100, parentPath: `${secondTreeId}/`, treeId: 'second-tree', leaf: 1, name: 'second_panel_1', type: PanelTypes.content, flex: 50 },
    { id: 'second_panel_2', color:"purple", order: 200, parentPath: `${secondTreeId}/`, treeId: 'second-tree', leaf: 1, name: 'second_panel_2', type: PanelTypes.content, flex: 50 },
  ]);
});

treesDB.on('ready', async () => {
  await treesDB.app.bulkPut([
    { key: 'appIsDirt', value: 0 },
    { key: 'dragProccess', value: { start: null, end: null } },
    { key: 'activeDrag', value: '' },
  ]);
});
