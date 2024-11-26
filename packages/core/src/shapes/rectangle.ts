import type { ShapeStyle } from '../types';
import type { IShapeOptions } from './base';
import type { Rect } from './regular';
import { Regular } from './regular';

export class Rectangle extends Regular {
  public static create(rect: Rect, ctx: CanvasRenderingContext2D, options: IShapeOptions) {
    return new Rectangle(
      {
        type: 'rectangle',
        data: {
          rect,
        },
      },
      ctx,
      options,
    );
  }

  draw(style?: ShapeStyle, lineDash?: boolean): void {
    const ctx = this.ctx;
    const rect = this?.data?.rect;
    if (ctx && rect) {
      ctx.save();
      ctx.fillStyle = style?.fillStyle!;
      ctx.lineWidth = style?.lineWidth!;
      ctx.strokeStyle = style?.strokeStyle!;
      ctx.setLineDash(lineDash ? [4, 4] : []);
      ctx.beginPath();
      ctx.roundRect(rect.x, rect.y, rect.width, rect.height, 0);
      ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
      ctx.stroke();
      ctx.restore();
    }
  }

  drawActive(activeKeyPoint?: number, lineDash?: boolean): void {
    const ctx = this.ctx;
    const rect = this?.data?.rect;
    if (ctx && rect) {
      this.draw(this.options.activeShapeStyle, lineDash);
      // 画关键点
      ctx.save();
      // 计算关键点
      const points = [
        { x: rect.x, y: rect.y },
        { x: rect.x + rect.width, y: rect.y },
        { x: rect.x + rect.width, y: rect.y + rect.height },
        { x: rect.x, y: rect.y + rect.height },
      ];
      if (points?.length > 0) {
        points.forEach((p, idx) => {
          const r
            = idx === activeKeyPoint
              ? this.options.activeShapeStyle?.circleRadius! + 2
              : this.options.activeShapeStyle?.circleRadius!;
          ctx.fillStyle = this.options.activeShapeStyle?.strokeStyle!;
          ctx.strokeStyle = '#FFF';
          ctx.lineWidth = 1;
          ctx.setLineDash([]);
          // 画圆
          ctx.beginPath();
          ctx.arc(p.x, p.y, r, 0, 2 * Math.PI, true);
          ctx.fill();
          // 画边框
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
