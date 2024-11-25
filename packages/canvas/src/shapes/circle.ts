import { IShapeOptions, ShapeStyle } from './base';
import { Point } from './polygon';
import { Rect, Regular } from './regular';

export class Circle extends Regular {
  public static create(rect: Rect, ctx: CanvasRenderingContext2D, options: IShapeOptions) {
    return new Circle(
      {
        type: 'circle',
        data: {
          rect
        }
      },
      ctx,
      options
    );
  }

  private _getKeyPoints(): Point[] {
    const rect = this?.data?.rect;
    return [
      {
        x: rect?.x + rect?.width * 0.5,
        y: rect?.y
      },
      { x: rect?.x + rect?.width, y: rect?.y + rect?.height * 0.5 },
      { x: rect?.x + rect?.width * 0.5, y: rect?.y + rect?.height },
      { x: rect?.x, y: rect?.y + rect?.height * 0.5 }
    ];
  }

  private _getCenterAndRadius() {
    const rect = this?.data?.rect;
    const center = { x: rect?.x + rect?.width * 0.5, y: rect?.y + rect?.height * 0.5 };
    // const radius = Math.sqrt(Math.pow(rect?.width * 0.5, 2) + Math.pow(rect?.height * 0.5, 2));
    const radiusX = Math.abs(rect?.width * 0.5);
    const radiusY = Math.abs(rect?.height * 0.5);
    return { center, radiusX, radiusY };
  }

  draw(style?: ShapeStyle, lineDash?: boolean): void {
    const ctx = this.ctx;
    const rect = this?.data?.rect;
    if (ctx && rect) {
      //计算中心点和半径
      const { center, radiusX, radiusY } = this._getCenterAndRadius();
      ctx.save();
      ctx.fillStyle = style?.fillStyle!;
      ctx.lineWidth = style?.lineWidth!;
      ctx.strokeStyle = style?.strokeStyle!;
      ctx.setLineDash(lineDash ? [4, 4] : []);
      ctx.beginPath();
      ctx.ellipse(center.x, center.y, radiusX, radiusY, 0, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
      ctx.restore();
    }
  }
  drawActive(activeKeyPoint?: number, lineDash?: boolean): void {
    const ctx = this.ctx;
    const rect = this?.data?.rect;
    if (ctx && rect) {
      this.draw(this.options.activeShapeStyle, lineDash);
      //画关键点
      ctx.save();
      //计算关键点
      const points = this._getKeyPoints();
      if (points?.length > 0) {
        points.forEach((p, idx) => {
          const r =
            idx === activeKeyPoint
              ? this.options.activeShapeStyle?.circleRadius! + 2
              : this.options.activeShapeStyle?.circleRadius!;
          ctx.fillStyle = this.options.activeShapeStyle?.strokeStyle!;
          ctx.strokeStyle = '#FFF';
          ctx.lineWidth = 1;
          //画圆
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, 2 * Math.PI, true);
          ctx.fill();
          //画边框
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, 2 * Math.PI);
          ctx.stroke();
        });
      }
      ctx.restore();
    }
  }
  drawWip(): void {
    // throw new Error('Method not implemented.');
    this.drawActive(-1, true);
  }
}
