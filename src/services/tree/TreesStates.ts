import { TreeClass } from "./Tree";
import { TreeItem } from "./TreeItem";
import {v1} from "uuid";


export class TreesStates {
    id: string = v1();
    stateName?: string;
    trees!: TreeClass[];
    treesItems!: TreeItem[]
}