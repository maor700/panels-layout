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
  html?: string;
  transform?: PanelTransform;
  originalData?: Panel;
  persistContainer?: 1 | 0;
  settings?: PanelSettings;
}

export interface PanelSettings {
  transform?: { resize: boolean; move: boolean };
  displayModes?: { tabs: boolean; flex: boolean; minimized: boolean; dettached: boolean, newWindow:boolean };
  flexDrop?: { center: boolean; top: boolean; bottom: boolean; left: boolean; right: boolean };
  showLock?: boolean;
  editableHeaderName?: boolean;
}
