import { v1 } from "uuid";

interface Panel {
  panelsDirection: "row" | "column";
  id: string;
  name: string;
  parentPath: string;
  hasChildren: 1 | 0;
  component: string;
  type?: "stack" | "tabs";
  width?: number;
  height?: number;
  title?: string;
  activePanel?: string;
  order?: number;
}

interface LayoutConfig {
  panels: Panel[];
}

const createPanel:(changes?:Partial<Panel>)=>Panel = (changes = {})=>({
    name:"Untitled",
    id: v1(),
    panelsDirection:"column",
    parentPath:"/",
    hasChildren:0,
    component: "<h2>Some Component</h2>",
    ...changes
})

const panels = [createPanel(), createPanel(), createPanel()];

export const panelsLayout: LayoutConfig = {
    panels
};
