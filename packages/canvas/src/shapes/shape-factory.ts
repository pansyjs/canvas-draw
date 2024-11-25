import { IShapeData, IShapeOptions, Shape } from './base';
import { Circle } from './circle';
import { Polygon } from './polygon';
import { Rectangle } from './rectangle';

export class ShapeFactory {
  public static createShape<T>(
    data: IShapeData,
    ctx: CanvasRenderingContext2D,
    options: IShapeOptions
  ): T {
    switch (data.type) {
      case 'polygon':
        return new Polygon(data, ctx, options) as T;
      case 'rectangle':
        return new Rectangle(data, ctx, options) as T;
      case 'circle':
        return new Circle(data, ctx, options) as T;
      default:
        return new Polygon(data, ctx, options) as T;
    }
  }

  public static createShapes<T extends Shape>(
    data: IShapeData[],
    ctx: CanvasRenderingContext2D,
    options: IShapeOptions
  ): T[] {
    return data.map((d) => ShapeFactory.createShape(d, ctx, options)) as T[];
  }
}
