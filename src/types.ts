enum TabDropDirections {
  top = 'top',
  bottom = 'bottom',
  left = 'left',
  right = 'right',
  center = 'center',
}
type DragStage = { treeId: string; panelId: string; direction?: TabDropDirections, logicContainer?:string };
type DragProccess = { start: DragStage; end: DragStage };
