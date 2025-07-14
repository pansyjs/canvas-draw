import type { IShapeData, IShapeOptions } from './base';
import { ReactiveShape } from './base';

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface RegularData {
  rect: Rect;
}

export function isRect(data: any): data is Rect {
  return (
    data
    && typeof data.x === 'number'
    && typeof data.y === 'number'
    && typeof data.width === 'number'
    && typeof data.height === 'number'
  );
}

export abstract class Regular extends ReactiveShape<RegularData> {
  constructor(
    data: IShapeData<RegularData>,
    ctx: CanvasRenderingContext2D,
    options: IShapeOptions,
  ) {
    super(data, ctx, options);
  }

  transform() {
    this._data = {
      rect: {
        x: this.data?.rect?.x / this.options.scaleX,
        y: this.data?.rect?.y / this.options.scaleY,
        width: this.data?.rect?.width / this.options.scaleX,
        height: this.data?.rect?.height / this.options.scaleY,
      },
    };
    return this;
  }

  recover() {
    return {
      rect: {
        x: this.data?.rect?.x * this.options.scaleX,
        y: this.data?.rect?.y * this.options.scaleY,
        width: this.data?.rect?.width * this.options.scaleX,
        height: this.data?.rect?.height * this.options.scaleY,
      },
    };
  }
}
