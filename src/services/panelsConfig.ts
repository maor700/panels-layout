import { TreeItem } from './tree/TreeItem';

enum PanelTypes {
  row = 'row',
  column = 'column',
  tabs = 'tabs',
  content = 'content',
  float = 'float',
  window = 'window',
}
export class Panel extends TreeItem {
  type: PanelTypes = PanelTypes.column;
  flex: number;
  hideHeader: 0 | 1;
}
