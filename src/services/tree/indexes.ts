import { TreeItem } from "./TreeItem"

export const FIELDS_INDEXES: { [K in keyof TreeItem]: string } = {
    id: "&id",
    treeId: "treeId",
    parentPath: "parentPath",
    name: "name",
    selected: "selected",
    order: "order",
    leaf: "leaf"
}

export const INDEXES = {
    ...FIELDS_INDEXES,
    t: `[${FIELDS_INDEXES.treeId}]`,
    tp: `[${FIELDS_INDEXES.treeId}+${FIELDS_INDEXES.parentPath}]`,
    tpn: `[${FIELDS_INDEXES.treeId}+${FIELDS_INDEXES.parentPath}+${FIELDS_INDEXES.name}]`,
    tps: `[${FIELDS_INDEXES.treeId}+${FIELDS_INDEXES.parentPath}+${FIELDS_INDEXES.selected}]`,
    tpl: `[${FIELDS_INDEXES.treeId}+${FIELDS_INDEXES.parentPath}+${FIELDS_INDEXES.leaf}]`,
    ts: `[${FIELDS_INDEXES.treeId}+${FIELDS_INDEXES.selected}]`,
    tl: `[${FIELDS_INDEXES.treeId}+${FIELDS_INDEXES.leaf}]`,
}

export const STRING_INDEXES = Object.values(INDEXES).join(", ");