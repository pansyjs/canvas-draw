import type { Pen } from './pen';
import type { IShapeData, Point } from './shapes';
import type { Options } from './types';
import { ShapeFactory } from './shapes';

export enum HitPointType {
  None = -1,
  KeyPoint = 1,
  CenterPoint = 2,
}

export class Measurer {
  private pen: Pen;
  private options: Required<Options>;
  constructor(pen: Pen, options: Required<Options>) {
    this.pen = pen;
    this.options = options;
  }
  /*
   * 点击的点是否在关键路径上
   * @param point 点击的点
   * @param shapes 关键路径
   * @param wipShape 是否是正在绘制的图形
   * @returns [1 关键点| 2 非关键点 | -1 不在关键路径, index]
   */

  public isPointInShapeKey(
    point: Point,
    shape: IShapeData,
    wipShape?: boolean,
  ): [HitPointType, number] {
    // const points = shape?.data?.points;
    const points = this.getShapeKeyPoints(shape);
    if (points?.length < 3 && !wipShape) {
      return [-1, -1];
    }
    // 半径稍微大一点
    // eslint-disable-next-line ts/no-non-null-asserted-optional-chain
    const r = this.options?.shapeStyle?.circleRadius! + 1;
    for (let i = 0; i < points.length; ++i) {
      const p = points[i];
      // 盘点point是否在以r为半径，p为圆心的圆内
      if (
        Math.abs(point.x - p.x) ** 2 + Math.abs(point.y - p.y) ** 2
        <= r ** 2
      ) {
        return [1, i];
      }
      const nextPoint = points?.[(i + 1) % points.length];
      const center = {
        x: (p.x + nextPoint.x) * 0.5,
        y: (p.y + nextPoint.y) * 0.5,
      };
      if (
        Math.abs(point.x - center.x) ** 2 + Math.abs(point.y - center.y) ** 2
        <= r ** 2
      ) {
        return [2, i];
      }
    }
    return [-1, -1];
  }

  public isPointInPath(point: Point, shapes: IShapeData[]) {
    this.pen.ctx.clearRect(0, 0, this.pen.width, this.pen.height);
    return shapes?.reduce<number[]>((prev, s, idx) => {
      this.pen.drawShape(
        ShapeFactory.createShape(s, this.pen.ctx, { ...this.options, scaleX: 1, scaleY: 1 }),
      );
      const canvasPoint = this.pen.physicalToCanvas(point);
      const isInPath = this.pen.ctx.isPointInPath(canvasPoint.x, canvasPoint.y);
      if (isInPath) {
        prev.push(idx);
      }
      return prev;
    }, []);
  }

  /*
        @returns [图形索引, 关键点类型, 关键点索引]
    */
  public isPointInKeyPath(
    point: Point,
    shapes: IShapeData[],
  ): false | [number, HitPointType, number] {
    for (let i = 0; i < shapes.length; ++i) {
      const shape = shapes[i];
      const [type, index] = this.isPointInShapeKey(point, shape);
      if (type !== -1) {
        return [i, type, index];
      }
    }
    return false;
  }

  /**
   *
   * @param shape 图形
   * @returns 关键点
   */
  public getShapeKeyPoints(shape: IShapeData): Point[] {
    if (shape?.type === 'rectangle') {
      const rect = shape?.data?.rect;
      return [
        { x: rect?.x, y: rect?.y },
        { x: rect?.x + rect?.width, y: rect?.y },
        { x: rect?.x + rect?.width, y: rect?.y + rect?.height },
        { x: rect?.x, y: rect?.y + rect?.height },
      ];
    }
    else if (shape?.type === 'circle') {
      const rect = shape?.data?.rect;
      return [
        {
          x: rect?.x + rect?.width * 0.5,
          y: rect?.y,
        },
        { x: rect?.x + rect?.width, y: rect?.y + rect?.height * 0.5 },
        { x: rect?.x + rect?.width * 0.5, y: rect?.y + rect?.height },
        { x: rect?.x, y: rect?.y + rect?.height * 0.5 },
      ];
    }
    else {
      return shape?.data?.points || [];
    }
  }
}
