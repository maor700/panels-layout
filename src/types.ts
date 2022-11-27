enum TabDropDirections {
  top = 'top',
  bottom = 'bottom',
  left = 'left',
  right = 'right',
  center = 'center',
}
type DragStage = { treeId: string; panelId: string; direction?: TabDropDirections; logicContainer?: string };
type DragProccess = { start: DragStage; end: DragStage };
const DisplayModes = {
  minimize: 'minimize',
  maximize: 'maximize',
  dettach: 'dettach',
  close: 'close',
} as const;

type DisplayModes = typeof DisplayModes[keyof typeof DisplayModes];
type DisplayModeChange = { panelId: string; treeId: string; displayMode: DisplayModes };
