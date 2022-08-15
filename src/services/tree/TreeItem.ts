import { v1 } from "uuid";

export class TreeItem<T = any> {
  id: string = v1();
  treeId!: string;
  name!: string;
  parentPath!: string;
  data?: T;
  selected?: 1 | 0;
  leaf: 1 | 0 = 1;
}
