import {v1} from "uuid";

export class TreeClass {
    id: string = v1();
    treeName!: string;
    rtl?: boolean;
    lightMode?: boolean
    multiSelect?: boolean
}