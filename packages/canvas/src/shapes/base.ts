import { Options } from '../types';
export interface IShapeData<T = any> {
  type: string;
  data: T;
}

export interface IShapeOptions extends Options {
  scaleX: number;
  scaleY: number;
}

export interface ShapeStyle {
  fillStyle?: string;
  strokeStyle?: string;
  lineWidth?: number;
  circleRadius?: number;
}

export interface IReactive<T> {
  transform: (data: T) => Shape;
  recover: (data: T) => T;
}

export abstract class Shape<T = any> {
  protected _type: string;
  protected _data: T;
  protected options: IShapeOptions;
  protected ctx: CanvasRenderingContext2D;
  constructor(
    shape: IShapeData<T>,
    ctx: CanvasRenderingContext2D,
    options: IShapeOptions = { scaleX: 1, scaleY: 1 }
  ) {
    this._type = shape?.type;
    this._data = shape?.data;
    this.options = options;
    this.ctx = ctx;
  }
  get type() {
    return this._type;
  }
  get data() {
    return this._data;
  }
  //绘制正常状态的图形，用于展示
  abstract draw(style?: ShapeStyle): void;
  //绘制激活状态，用于展示选中状态
  abstract drawActive(activeKeyPoint?: number): void;
  //绘制进行中的图形，用于展示正在绘制
  abstract drawWip(): void;
  //这里主要是为了兼容老数据才这样设计
  abstract toJson(): IShapeData;
  abstract transform(): Shape;
  abstract recover(): T;
}

export abstract class ReactiveShape<T> extends Shape<T> {
  constructor(
    shape: IShapeData<T>,
    ctx: CanvasRenderingContext2D,
    options: IShapeOptions = { scaleX: 1, scaleY: 1 }
  ) {
    super(shape, ctx, options);
    // const data = this.transform(shape.data);
    // this._data = data;
  }

  toJson() {
    const data = this.recover();
    return {
      type: this.type,
      data: { ...data }
    };
  }
}
