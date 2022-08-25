import { v1 } from 'uuid';
import { treesDB } from './tree/treesDB';

export interface Panel {
  panelsDirection: 'row' | 'column';
  id: string;
  name: string;
  parentPath: string;
  hasChildren: 1 | 0;
  component: string;
  type?: 'stack' | 'tabs';
  width?: number;
  height?: number;
  title?: string;
  activePanel?: string;
  order?: number;
}

interface LayoutConfig {
  panels: Panel[];
}

const createPanel: (changes?: Partial<Panel>) => Panel = (changes = {}) => ({
  name: 'Untitled',
  id: v1(),
  panelsDirection: 'column',
  parentPath: '/',
  hasChildren: 0,
  component: '<h2>Some Component</h2>',
  ...changes,
});

const panels = [createPanel(), createPanel(), createPanel()];

export const panelsLayout: LayoutConfig = {
  panels,
};

const TREE_NAME = 'main-layout';
treesDB.on('populate', async () => {
  treesDB.transaction('rw', 'trees', 'treesItems', async () => {
    await treesDB.createNewTree(TREE_NAME, true, { id: TREE_NAME, treeName: 'פריסה מרכזית' }, {id:"root", data:{hideHeader:1}});
    const {id} = await treesDB.getRoot(TREE_NAME);
    await treesDB.treesItems.bulkAdd([
      { id: 'panel_1', parentPath: `${id}/`, treeId: TREE_NAME, leaf: 1, name: 'panel_1', data:{flex:33} },
      { id: 'panel_2', parentPath: `${id}/`, treeId: TREE_NAME, leaf: 1, name: 'panel_2', data:{flex:33} },
      { id: 'panel_3', parentPath: `${id}/`, treeId: TREE_NAME, leaf: 0, name: 'panel_3', data:{flex:33, direction:"column", hideHeader:1} },
      { id: 'panel_4', parentPath: `${id}/panel_3/`, treeId: TREE_NAME, leaf: 1, name: 'panel_4', data:{flex:75}  },
      { id: 'panel_5', parentPath: `${id}/panel_3/`, treeId: TREE_NAME, leaf: 1, name: 'panel_5', data:{flex:25} },
    ]);
    return await treesDB.treesItems.update(id, { leaf: 0 });
  });
});
