import { IShapeData, IShapeOptions, ReactiveShape, ShapeStyle } from './base';

export interface Point {
  x: number;
  y: number;
}

export interface PolygonData {
  points: Point[];
}

export class Polygon extends ReactiveShape<PolygonData> {
  constructor(
    data: IShapeData<PolygonData>,
    ctx: CanvasRenderingContext2D,
    options: IShapeOptions
  ) {
    //兼容老数据
    let fixData = data;
    if (!data?.type) {
      fixData.type = 'polygon';
      fixData.data = data as unknown as PolygonData;
    }
    super(fixData, ctx, options);
  }

  public static create(points: Point[], ctx: CanvasRenderingContext2D, options: IShapeOptions) {
    return new Polygon(
      {
        type: 'polygon',
        data: {
          points
        }
      },
      ctx,
      options
    );
  }

  // override
  draw(style?: ShapeStyle) {
    const ctx = this.ctx;
    if (ctx) {
      ctx.save();
      ctx.fillStyle = style?.fillStyle!;
      ctx.lineWidth = style?.lineWidth!;
      ctx.strokeStyle = style?.strokeStyle!;
      const points = this.data.points;
      if (points?.length > 0) {
        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.moveTo(points[0].x, points[0].y);
        points.forEach((point, index) => {
          if (index > 0) {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
      }
      ctx.restore();
    }
  }
  drawActive(activeKeyPoint: number = -1) {
    const ctx = this.ctx;
    if (ctx) {
      this.draw(this.options.activeShapeStyle);
      //画关键点
      ctx.save();
      if (this.data?.points?.length > 0) {
        this.data?.points.forEach((p, idx) => {
          const r =
            idx === activeKeyPoint
              ? this.options.activeShapeStyle?.circleRadius! + 2
              : this.options.activeShapeStyle?.circleRadius!;
          ctx.fillStyle = this.options.activeShapeStyle?.strokeStyle!;
          ctx.strokeStyle = '#FFF';
          ctx.lineWidth = 1;
          ctx.setLineDash([]);
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
      //画中间点
      if (this.data?.points?.length > 1) {
        this.data?.points.forEach((p, idx) => {
          const nextPoint = this.data?.points?.[(idx + 1) % this.data.points.length];
          const center = {
            x: (p.x + nextPoint.x) / 2,
            y: (p.y + nextPoint.y) / 2
          };
          const r = this.options.shapeStyle?.circleRadius!;
          //画圆
          ctx.beginPath();
          ctx.arc(center.x, center.y, r - 1, 0, 2 * Math.PI, true);
          ctx.fill();
        });
      }
      ctx.restore();
    }
  }

  drawWip() {
    const ctx = this.ctx;
    if (ctx) {
      ctx.save();
      ctx.fillStyle = this.options?.activeShapeStyle?.fillStyle!;
      ctx.lineWidth = this.options?.activeShapeStyle?.lineWidth!;
      ctx.strokeStyle = this.options?.activeShapeStyle?.strokeStyle!;
      const points = this.data.points;
      //画实线, 只有3个点以上才会出现实线
      if (points.length > 2) {
        ctx.beginPath();
        ctx.setLineDash([]);
        ctx.moveTo(points[0].x, points[0].y);
        points?.slice(0, points.length - 1).forEach((point, index) => {
          if (index > 0) {
            ctx.lineTo(point.x, point.y);
          }
        });
        ctx.stroke();
        ctx.fill();
      }
      //画虚线
      if (points.length > 1) {
        ctx.beginPath();
        ctx.setLineDash([4, 4]);
        const lastPoint = points[points.length - 1];
        const firstPoint = points[0];
        ctx.moveTo(firstPoint.x, firstPoint.y);
        ctx.lineTo(lastPoint.x, lastPoint.y);
        if (points.length > 2) {
          const secondPoint = points[points.length - 2];
          ctx.lineTo(secondPoint.x, secondPoint.y);
        }
        ctx.stroke();
      }
      ctx.restore();
      //画圆圈
      ctx.save();
      if (points?.length > 0) {
        const activePointIndex = points.length > 1 ? points.length - 2 : 0;
        points?.slice(0, points.length - 1).forEach((p, idx) => {
          const defaultRadio = this.options?.shapeStyle?.circleRadius!;
          const r = idx === activePointIndex ? defaultRadio + 2 : defaultRadio;
          ctx.fillStyle = this.options?.activeShapeStyle?.strokeStyle!;
          ctx.strokeStyle = '#FFF';
          ctx.lineWidth = 1;
          ctx.setLineDash([]);
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

  transform() {
    this._data = {
      points: this.data?.points?.map((p) => ({
        x: p.x / this.options.scaleX,
        y: p.y / this.options.scaleY
      }))
    };
    return this;
  }
  recover() {
    return {
      points: this.data?.points?.map((p) => ({
        x: parseInt(String(p.x * this.options.scaleX), 10),
        y: parseInt(String(p.y * this.options.scaleY), 10)
      }))
    };
  }
}
