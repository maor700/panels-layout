import { TreeItem } from './tree/TreeItem';

export enum PanelTypes {
  row = 'row',
  column = 'column',
  tabs = 'tabs',
  content = 'content',
  float = 'float',
  window = 'window',
}
export class Panel extends TreeItem {
  type?: PanelTypes = PanelTypes.column;
  flex?: number;
  activeTab?: string;
  hideHeader?: 0 | 1 = 0;
  color?: string;
}
