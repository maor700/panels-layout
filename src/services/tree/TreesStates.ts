import { TreeClass } from "./Tree";
import {v1} from "uuid";


export class TreesStates<T = TreeClass> {
    id: string = v1();
    stateName?: string;
    trees!: TreeClass[];
    treesItems!: T[]
}