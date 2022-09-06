enum TabDropDirections {
  top = 'top',
  bottom = 'bottom',
  left = 'left',
  right = 'right',
  center = 'center',
}
type DragStage = { treeId: string; panelId: string; direction?: TabDropDirections };
type DragProccess = { start: DragStage; end: DragStage };
