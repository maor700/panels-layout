import { PanelSettings, PanelTypes } from './panelsConfig';
import { treesDB } from './tree/treesDB';

// init
export const MAIN_TREE = 'main-layout';
export const SECOND_TREE = 'second-tree';
export const FLOATED_TREE_ID = 'floated-tree';
export const MINI_TREE_ID = 'minimized-tree';
export const WINDOW_TREE = 'window-tree';
export const MAP_TREE_ID = 'map-tree';
export const DEFALTE_PANEL_SETTINGS: PanelSettings = {
  transform: { resize: true, move: true },
  displayModes: { tabs: true, flex: true, dettached: true, minimized: true, newWindow: true },
  flexDrop: { center: true, left: true, right: true, top: true, bottom: true },
  misc: {
    hideHeader: false,
    showLock: false,
    editableHeaderName: true,
  },
};

export const ROOT_DEFAULT_SETTINGS = { ...DEFALTE_PANEL_SETTINGS, misc: { ...DEFALTE_PANEL_SETTINGS.misc, hideHeader: true } };

// const HTML1 = `<div>TEST_1<div/>`;
// const HTML2 = `<div>TEST_2<div/>`;
// const HTML3 = `<div>TEST_3<div/>`;
const HTML1 = `<iframe src='https://omny.fm/shows/kan-4240/4-12-2022/embed?style=cover&size=square&image=1&share=0&download=0&description=0&subscribe=0&foreground=6d4d8f&background=f7f7f7&highlight=000000&ttag=ad:ipbc&dist=kan' frameborder=0 height="100%" width="100%" />`;
const HTML2 = `<iframe src='https://moridimtv.com/Movie/%D7%94%D7%A4%D7%A0%D7%AA%D7%A8-%D7%94%D7%A9%D7%97%D7%95%D7%A8-%D7%95%D7%95%D7%90%D7%A7%D7%A0%D7%93%D7%94-%D7%9C%D7%A0%D7%A6%D7%97_13195.html' frameborder=0 height="100%" width="100%" />`;
const HTML3 = `<iframe src='https://omny.fm/shows/kan-news/7551d8f3-99a1-4222-ab13-afb500740d67/embed?size=square&ttag=ad:ipbc&dist=kan&download=0' frameborder=0 height="100%" width="100%" />`;
const MAP_HTML = `<div class="map-con">MAP</div>`;

treesDB.on('populate', async () => {
  treesDB.transaction('rw', treesDB.trees, treesDB.treesItems, async () => {
    await treesDB.treesItems.clear();
    await treesDB.trees.clear();

    await treesDB.createNewTree(
      MAIN_TREE,
      true,
      { id: MAIN_TREE, treeName: 'פריסה מרכזית' },
      {
        id: 'root',
        persistContainer: 1,
        leaf: 0,
        type: PanelTypes.row,
        order: 100,
        settings: ROOT_DEFAULT_SETTINGS,
      },
    );
    const { id } = await treesDB.getRoot(MAIN_TREE);

    await treesDB.createNewTree(
      SECOND_TREE,
      true,
      { id: SECOND_TREE, treeName: 'פריסה מרכזית' },
      {
        id: 'second-root',
        persistContainer: 1,
        leaf: 0,
        type: PanelTypes.column,
        order: 100,
        settings: ROOT_DEFAULT_SETTINGS,
      },
    );
    const { id: secondTreeId } = await treesDB.getRoot(SECOND_TREE);

    await treesDB.createNewTree(
      MINI_TREE_ID,
      true,
      { id: MINI_TREE_ID, treeName: 'חלונות ממוזערים' },
      { id: 'minimized-root', persistContainer: 1, leaf: 0, type: PanelTypes.column, order: 100, settings: ROOT_DEFAULT_SETTINGS },
    );
    const { id: miniTreeId } = await treesDB.getRoot(MINI_TREE_ID);

    await treesDB.createNewTree(
      FLOATED_TREE_ID,
      true,
      { id: FLOATED_TREE_ID, treeName: 'חלונות צפים' },
      { id: 'floated-root', persistContainer: 1, leaf: 0, type: PanelTypes.float, order: 100, settings: ROOT_DEFAULT_SETTINGS },
    );

    const { id: floatedTreeId } = await treesDB.getRoot(FLOATED_TREE_ID);

    await treesDB.createNewTree(
      MAP_TREE_ID,
      true,
      { id: MAP_TREE_ID, treeName: 'מפה' },
      { id: 'map-root', persistContainer: 1, leaf: 0, type: PanelTypes.column, order: 100, settings: ROOT_DEFAULT_SETTINGS, },
    );

    const { id: mapTreeRootId } = await treesDB.getRoot(MAP_TREE_ID);

    await treesDB.createNewTree(
      WINDOW_TREE,
      true,
      { id: WINDOW_TREE, treeName: 'חלונות' },
      { id: 'window-root', leaf: 0, type: PanelTypes.window, persistContainer: 1, settings: ROOT_DEFAULT_SETTINGS, },
    );
    await treesDB.treesItems.bulkPut([
      {
        id: 'map_1',
        html: MAP_HTML,
        order: 90,
        parentPath: `${mapTreeRootId}/`,
        treeId: MAP_TREE_ID,
        leaf: 1,
        type: PanelTypes.content,
        name: 'map_1',
        flex: 100,
        settings: { ...ROOT_DEFAULT_SETTINGS, flexDrop: { ...DEFALTE_PANEL_SETTINGS.flexDrop, center: false, top: false, bottom: false } },
      },
      {
        id: 'panel_1',
        html: HTML3,
        order: 100,
        parentPath: `${id}/`,
        treeId: MAIN_TREE,
        leaf: 1,
        type: PanelTypes.content,
        name: 'panel_1',
        flex: 33,
        settings: DEFALTE_PANEL_SETTINGS,
      },
      {
        id: 'panel_2',
        html: HTML2,
        color: 'blue',
        order: 200,
        parentPath: `${id}/`,
        treeId: MAIN_TREE,
        leaf: 1,
        name: 'panel_2',
        type: PanelTypes.content,
        flex: 33,
        settings: DEFALTE_PANEL_SETTINGS,
      },
      {
        id: 'panel_4',
        html: HTML1,
        color: 'pink',
        order: 10,
        parentPath: `${floatedTreeId}/`,
        treeId: FLOATED_TREE_ID,
        leaf: 1,
        name: 'panel_4',
        type: PanelTypes.content,
        transform: { top: 50, left: 50 },
        flex: 50,
        settings: DEFALTE_PANEL_SETTINGS,
      },
      {
        id: 'panel_5',
        html: HTML2,
        color: 'gold',
        order: 20,
        parentPath: `${floatedTreeId}/`,
        treeId: FLOATED_TREE_ID,
        leaf: 1,
        name: 'panel_5',
        type: PanelTypes.content,
        transform: { top: 100, left: 100 },
        flex: 25,
        settings: DEFALTE_PANEL_SETTINGS,
      },

      {
        id: 'second_panel_1',
        color: 'orange',
        order: 100,
        parentPath: `${secondTreeId}/`,
        treeId: SECOND_TREE,
        leaf: 1,
        name: 'second_panel_1',
        type: PanelTypes.content,
        transform: { top: 150, left: 150 },
        html: HTML1,
        flex: 50,
        settings: DEFALTE_PANEL_SETTINGS,
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
        html: HTML1,
        transform: { top: 200, left: 200 },
        flex: 50,
        settings: DEFALTE_PANEL_SETTINGS,
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
          html: HTML3,
          transform: { top: 250, left: 250 },
          flex: 50,
          settings: DEFALTE_PANEL_SETTINGS,
        },
        id: 'mini_panel_1',
        color: 'gold',
        order: 200,
        parentPath: `${miniTreeId}/`,
        treeId: MINI_TREE_ID,
        leaf: 1,
        name: 'מעקב חשודים',
        type: PanelTypes.content,
        html: HTML2,
        transform: { top: 300, left: 300 },
        flex: 50,
        settings: DEFALTE_PANEL_SETTINGS,
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
          html: HTML2,
          transform: { top: 350, left: 350 },
          flex: 50,
          settings: DEFALTE_PANEL_SETTINGS,
        },
        color: 'green',
        order: 200,
        parentPath: `${miniTreeId}/`,
        treeId: MINI_TREE_ID,
        leaf: 1,
        name: 'אינדיקציות',
        type: PanelTypes.content,
        html: HTML1,
        transform: { top: 400, left: 400 },
        flex: 50,
        settings: DEFALTE_PANEL_SETTINGS,
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
