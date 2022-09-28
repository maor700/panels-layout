import { PanelTypes } from './panelsConfig';
import { treesDB } from './tree/treesDB';

// init
const TREE_NAME = 'main-layout';
treesDB.on('populate', async () => {
  await treesDB.createNewTree(TREE_NAME, true, { id: TREE_NAME, treeName: 'פריסה מרכזית' }, { id: 'root', leaf: 0, hideHeader: 1, type:PanelTypes.row });
  const { id } = await treesDB.getRoot(TREE_NAME);

  await treesDB.createNewTree('second-tree', true, { id: 'second-tree', treeName: 'פריסה מרכזית' }, { id: 'second-root', leaf: 0, hideHeader: 1, type:PanelTypes.column });
  const { id: secondTreeId } = await treesDB.getRoot('second-tree');

  await treesDB.treesItems.bulkPut([
    { id: 'panel_1', order: 100, parentPath: `${id}/`, treeId: TREE_NAME, leaf: 1, type: PanelTypes.content, name: 'panel_1', flex: 33 },
    { id: 'panel_2', order: 200, parentPath: `${id}/`, treeId: TREE_NAME, leaf: 1, name: 'panel_2', type: PanelTypes.content, flex: 33 },
    { id: 'panel_3', order: 300, parentPath: `${id}/`, treeId: TREE_NAME, leaf: 0, name: 'panel_3', activeTab:"panel_4", type: PanelTypes.tabs, flex: 33, hideHeader: 1 },
    { id: 'panel_4', order: 10, parentPath: `${id}/panel_3/`, treeId: TREE_NAME, leaf: 1, name: 'panel_4', type: PanelTypes.content, flex: 75 },
    { id: 'panel_5', order: 20, parentPath: `${id}/panel_3/`, treeId: TREE_NAME, leaf: 1, name: 'panel_5', type: PanelTypes.content, flex: 25 },

    { id: 'second_panel_1', order: 100, parentPath: `${secondTreeId}/`, treeId: 'second-tree', leaf: 1, name: 'second_panel_1', type: PanelTypes.content, flex: 50 },
    { id: 'second_panel_2', order: 200, parentPath: `${secondTreeId}/`, treeId: 'second-tree', leaf: 1, name: 'second_panel_2', type: PanelTypes.content, flex: 50 },
  ]);
});

treesDB.on('ready', async () => {
  await treesDB.app.bulkPut([
    { key: 'appIsDirt', value: 0 },
    { key: 'dragProccess', value: { start: null, end: null } },
    { key: 'activeDrag', value: '' },
  ]);
});
