/**
 * Drawer事件枚举
 */
export enum DrawEvent {
  Init = 'init',
  Destroy = 'destroy',
  Enable = 'enable',
  Disable = 'disable',
  Add = 'add',
  Edit = 'edit',
  Remove = 'remove',
  Clear = 'clear',
  Change = 'change',
  DragStart = 'dragStart',
  Dragging = 'dragging',
  DragEnd = 'dragEnd',
  Select = 'select',
  AddNode = 'addNode',
  RemoveNode = 'removeNode',
}

/**
 * Render事件枚举
 */
export enum RenderEvent {
  Click = 'click',
  UnClick = 'unclick',
  Dragstart = 'dragstart',
  Mousemove = 'mousemove',
  Mouseout = 'mouseout',
  Dragging = 'dragging',
  Dragend = 'dragend',
  DblClick = 'dblClick',
  Contextmenu = 'contextmenu',
}

export enum StageEvent {
  Mousemove = 'mousemove',
}

export enum LayerEvent {
  Mousedown = 'mousedown',
  Mouseup = 'mouseup',
  Click = 'click',
  UnClick = 'unclick',
  Mousemove = 'mousemove',
  Mouseover = 'mouseover',
  Mouseout = 'mouseout',
}

/**
 * Source事件枚举
 */
export enum SourceEvent {
  Change = 'change',
  Update = 'update',
}
