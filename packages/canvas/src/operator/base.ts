import { Measurer } from '../measurer';
import { Pen } from '../pen';
import { IShapeData, Shape, ShapeFactory } from '../shapes';
import { OperatorOptions } from '../types';

type ListenerType = (shapes: IShapeData[]) => void;

class Listener {
  private listeners: ListenerType[] = [];

  on = (listener?: ListenerType) => {
    if (listener) {
      const index = this.listeners.indexOf(listener);
      if (index === -1) {
        this.listeners.push(listener);
      }
    }
    return this;
  };

  off(listener?: ListenerType) {
    if (listener) {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    }
    return this;
  }

  clear() {
    this.listeners = [];
  }

  protected _dispatch = (shapes: Shape[]) =>
    this.listeners.forEach((listener) => listener(shapes?.map((shape) => shape.toJson()) ?? []));
}

interface IOperator {
  destroy: () => void;
  updateShapes: (shapes: IShapeData[]) => void;
  select: (index: number) => void;
}

export class OperatorState {
  public activeShapeIndex: number = -1;
  public shapes: Shape[] = [];
}

export class Operator<T extends Shape = Shape> extends Listener implements IOperator {
  private _canvas: HTMLCanvasElement;
  // private _shapes: T[] = []; //已经绘制的图形
  private _options: OperatorOptions;
  public operatorState: OperatorState;
  private _pen: Pen;
  private _measurer: Measurer;
  // private _activeShapeIndex: number = this.options?.selectedIndex ?? -1; //当前选中的图形索引
  private _isEnabled: boolean = true;
  get shapes() {
    // return this._shapes;
    return this.operatorState.shapes as any;
  }

  set shapes(shapes: T[]) {
    // this._shapes = shapes;
    this.operatorState.shapes = shapes;
  }

  get options() {
    return this._options;
  }

  get canvas() {
    return this._canvas;
  }

  get pen() {
    return this._pen;
  }

  get measurer() {
    return this._measurer;
  }

  get activeShapeIndex() {
    // return this._activeShapeIndex;
    return this.operatorState.activeShapeIndex;
  }

  set activeShapeIndex(index: number) {
    // this._activeShapeIndex = index;
    this.operatorState.activeShapeIndex = index;
  }

  //默认不创建editorProxy实例，因为只有在编辑模式下才需要
  attach() {
    return this;
  }

  constructor(
    canvas: HTMLCanvasElement,
    shapes: IShapeData[],
    state: OperatorState,
    options: OperatorOptions
  ) {
    super();
    this._canvas = canvas;
    // this._shapes = shapes;
    this._options = options;
    this._pen = new Pen(canvas, options);
    this._measurer = new Measurer(this._pen, options);
    this.operatorState = state;
    // this._shapes = this.createShapes(shapes)?.map((s) => s.transform() as T);
    this.operatorState.shapes = this.createShapes(shapes)?.map((s) => s.transform() as T);
    if (this.shapes?.length > 0) {
      //立即绘制
      this.pen.draw(this.shapes, this.activeShapeIndex);
    }
    canvas.oncontextmenu = (e) => {
      e.preventDefault();
    };
  }

  enable() {
    this._isEnabled = true;
  }

  disable() {
    this._isEnabled = false;
  }

  protected _createControlledListener = <T = MouseEvent>(l: (e: T) => void) => {
    return (e: T) => {
      const isEditorMode = this.options.mode === 'edit';
      //如果是子操作，则判断当前选中的图形是否是子操作类型
      let isOperatorEnable = false;
      if (this.options?.subOperator) {
        if (this?.shapes?.[this.activeShapeIndex]?.type === this.options?.shape) {
          isOperatorEnable = true;
        }
      } else {
        if (
          !this?.shapes?.[this.activeShapeIndex] ||
          this?.shapes?.[this.activeShapeIndex]?.type === this.options?.shape
        ) {
          isOperatorEnable = true;
        }
      }
      if (isEditorMode && this._isEnabled && isOperatorEnable) {
        l(e);
      }
    };
  };

  createShapes(shapes: IShapeData[]) {
    return ShapeFactory.createShapes(shapes, this.pen.ctx, {
      ...this.options,
      scaleX: this.pen.scaleX,
      scaleY: this.pen.scaleY
    }) as T[];
  }

  select(index: number) {
    this.activeShapeIndex = index;
    this.pen.draw(this.shapes, index);
    this?.options?.onSelect?.(index);
  }

  updateShapes(shapes: IShapeData[]) {
    // this._shapes = this.createShapes(shapes)?.map((s) => s.transform() as T);
    this.operatorState.shapes = this.createShapes(shapes)?.map((s) => s.transform() as T);
    this.pen.draw(this.shapes, this.activeShapeIndex);
  }

  destroy() {
    this.clear();
    this.canvas.oncontextmenu = null;
  }

  protected dispatch() {
    this._dispatch(this.shapes);
  }
}
