import { TreesStates } from "./TreesStates";

export class AppState {
  key!: string;
  value!: any;
}

export interface AppStateProps {
  dragProcess: DragProccess;
  activeDrag: string;
  appIsDirt: 0 | 1;
  selectedState: TreesStates
}
