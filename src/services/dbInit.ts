import { treesDB } from "./tree/treesDB";

// init
const TREE_NAME = 'main-layout';
treesDB.on('populate', async () => {
    await treesDB.createNewTree(TREE_NAME, true, { id: TREE_NAME, treeName: 'פריסה מרכזית' }, { id: 'root', leaf:0, data: { hideHeader: 1 } });
    const { id } = await treesDB.getRoot(TREE_NAME);
    await treesDB.treesItems.bulkPut([
      { id: 'panel_1', parentPath: `${id}/`, treeId: TREE_NAME, leaf: 1, name: 'panel_1', data: { flex: 33 } },
      { id: 'panel_2', parentPath: `${id}/`, treeId: TREE_NAME, leaf: 1, name: 'panel_2', data: { flex: 33 } },
      { id: 'panel_3', parentPath: `${id}/`, treeId: TREE_NAME, leaf: 0, name: 'panel_3', data: { flex: 33, direction: 'column', hideHeader: 1 } },
      { id: 'panel_4', parentPath: `${id}/panel_3/`, treeId: TREE_NAME, leaf: 1, name: 'panel_4', data: { flex: 75 } },
      { id: 'panel_5', parentPath: `${id}/panel_3/`, treeId: TREE_NAME, leaf: 1, name: 'panel_5', data: { flex: 25 } },
    ]);
});

treesDB.on('ready', async () => {
    await treesDB.app.bulkPut([
        {key:"appIsDirt", value:0},
        {key:"dragProccess", value:{start:null, end:null}},
        {key:"activeDrag", value:""},
    ]);
});

