// import { Options, Point, Shape, ShapeStyle } from './types';

// export class Pen {
//   private canvas: HTMLCanvasElement;
//   private scaleX: number;
//   private scaleY: number;
//   private _width: number;
//   private _height: number;
//   private canvasWidth: number;
//   private canvasHeight: number;
//   private options: Required<Options>;
//   private dpr = window.devicePixelRatio;
//   get ctx() {
//     return this.canvas.getContext('2d')!;
//   }
//   get width() {
//     return this._width;
//   }
//   set width(value: number) {
//     this._width = value;
//   }
//   get height() {
//     return this._height;
//   }
//   set height(value: number) {
//     this._height = value;
//   }
//   constructor(canvas: HTMLCanvasElement, options: Required<Options>) {
//     this.canvas = canvas;
//     const ctx = this.canvas.getContext('2d');
//     const { width, height, shapeStyle } = options;
//     this.options = options;
//     this._width = options.axis.width;
//     this._height = options.axis.height;
//     this.scaleX = options.axis.width / width!;
//     this.scaleY = options.axis.height / height!;
//     const { width: cssWidth, height: cssHeight } = this.canvas.getBoundingClientRect();
//     this.canvasWidth = cssWidth;
//     this.canvasHeight = cssHeight;
//     if (ctx) {
//       this.canvas.style.width = width + 'px';
//       this.canvas.style.height = height + 'px';
//       this.canvas.width = this.dpr * cssWidth;
//       this.canvas.height = this.dpr * cssHeight;
//       ctx.fillStyle = shapeStyle?.fillStyle!;
//       ctx.lineWidth = shapeStyle?.lineWidth!;
//       ctx.strokeStyle = shapeStyle?.strokeStyle!;
//       ctx.scale(this.dpr, this.dpr);
//       ctx.clearRect(0, 0, canvas.width, canvas.height);
//     }
//   }

//   //直接画实线
//   public drawShape = (shape: Shape, style: ShapeStyle = this.options.shapeStyle) => {
//     const ctx = this.ctx;
//     if (ctx) {
//       ctx.save();
//       ctx.fillStyle = style?.fillStyle!;
//       ctx.lineWidth = style?.lineWidth!;
//       ctx.strokeStyle = style?.strokeStyle!;
//       const points = shape.points;
//       if (points?.length > 0) {
//         ctx.beginPath();
//         ctx.setLineDash([]);
//         ctx.moveTo(points[0].x, points[0].y);
//         points.forEach((point, index) => {
//           if (index > 0) {
//             ctx.lineTo(point.x, point.y);
//           }
//         });
//         ctx.closePath();
//         ctx.stroke();
//         ctx.fill();
//       }
//       ctx.restore();
//     }
//   };

//   public drawActiveShape(shape: Shape, activeKeyPoint: number = -1) {
//     const ctx = this.ctx;
//     if (ctx) {
//       this.drawShape(shape, this.options.activeShapeStyle);
//       //画关键点
//       ctx.save();
//       if (shape?.points?.length > 0) {
//         shape?.points.forEach((p, idx) => {
//           const r =
//             idx === activeKeyPoint
//               ? this.options.activeShapeStyle?.circleRadius! + 2
//               : this.options.activeShapeStyle?.circleRadius!;
//           ctx.fillStyle = this.options.activeShapeStyle?.strokeStyle!;
//           ctx.strokeStyle = '#FFF';
//           ctx.lineWidth = 1;
//           ctx.setLineDash([]);
//           //画圆
//           ctx.beginPath();
//           ctx.arc(p.x, p.y, r, 0, 2 * Math.PI, true);
//           ctx.fill();
//           //画边框
//           ctx.beginPath();
//           ctx.arc(p.x, p.y, r, 0, 2 * Math.PI);
//           ctx.stroke();
//         });
//       }
//       //画中间点
//       if (shape?.points?.length > 1) {
//         shape?.points.forEach((p, idx) => {
//           const nextPoint = shape?.points?.[(idx + 1) % shape.points.length];
//           const center = {
//             x: (p.x + nextPoint.x) / 2,
//             y: (p.y + nextPoint.y) / 2
//           };
//           const r = this.options.shapeStyle?.circleRadius!;
//           //画圆
//           ctx.beginPath();
//           ctx.arc(center.x, center.y, r - 1, 0, 2 * Math.PI, true);
//           ctx.fill();
//         });
//       }
//       ctx.restore();
//     }
//   }
//   //实现和虚线混合
//   private _drawWipShape = (shape: Shape) => {
//     const ctx = this.ctx;
//     if (ctx) {
//       ctx.save();
//       ctx.fillStyle = this.options.activeShapeStyle?.fillStyle!;
//       ctx.lineWidth = this.options.activeShapeStyle?.lineWidth!;
//       ctx.strokeStyle = this.options.activeShapeStyle?.strokeStyle!;
//       const points = shape.points;
//       //画实线, 只有3个点以上才会出现实线
//       if (points.length > 2) {
//         ctx.beginPath();
//         ctx.setLineDash([]);
//         ctx.moveTo(points[0].x, points[0].y);
//         points?.slice(0, points.length - 1).forEach((point, index) => {
//           if (index > 0) {
//             ctx.lineTo(point.x, point.y);
//           }
//         });
//         ctx.stroke();
//         ctx.fill();
//       }
//       //画虚线
//       if (points.length > 1) {
//         ctx.beginPath();
//         ctx.setLineDash([4, 4]);
//         const lastPoint = points[points.length - 1];
//         const firstPoint = points[0];
//         ctx.moveTo(firstPoint.x, firstPoint.y);
//         ctx.lineTo(lastPoint.x, lastPoint.y);
//         if (points.length > 2) {
//           const secondPoint = points[points.length - 2];
//           ctx.lineTo(secondPoint.x, secondPoint.y);
//         }
//         ctx.stroke();
//       }
//       ctx.restore();
//       //画圆圈
//       ctx.save();
//       if (points?.length > 0) {
//         const activePointIndex = points.length > 1 ? points.length - 2 : 0;
//         points?.slice(0, points.length - 1).forEach((p, idx) => {
//           const defaultRadio = this.options?.shapeStyle?.circleRadius!;
//           const r = idx === activePointIndex ? defaultRadio + 2 : defaultRadio;
//           ctx.fillStyle = this.options.activeShapeStyle?.strokeStyle!;
//           ctx.strokeStyle = '#FFF';
//           ctx.lineWidth = 1;
//           ctx.setLineDash([]);
//           //画圆
//           ctx.beginPath();
//           ctx.arc(p.x, p.y, r, 0, 2 * Math.PI, true);
//           ctx.fill();
//           //画边框
//           ctx.beginPath();
//           ctx.arc(p.x, p.y, r, 0, 2 * Math.PI);
//           ctx.stroke();
//         });
//       }
//       ctx.restore();
//     }
//   };

//   private _drawShapes = (shapes: Shape[], activeIndex: number, activeKeyPoint: number = -1) => {
//     shapes.forEach((shape, idx) => {
//       if (idx !== activeIndex) {
//         this.drawShape(shape);
//       }
//     });
//     //提升激活状态下的层级
//     if (shapes?.[activeIndex]) {
//       this.drawActiveShape(shapes[activeIndex], activeKeyPoint);
//     }
//   };

//   public transform = (shapes: Shape[]): Shape[] => {
//     return shapes?.map((s) => {
//       return {
//         ...s,
//         points: s.points?.map((p) => ({
//           x: p.x / this.scaleX,
//           y: p.y / this.scaleY
//         }))
//       };
//     });
//   };

//   public recover = (shapes: Shape[]) => {
//     return shapes?.map((s) => {
//       return {
//         ...s,
//         points: s.points?.map((p) => ({
//           x: parseInt(String(p.x * this.scaleX), 10),
//           y: parseInt(String(p.y * this.scaleY), 10)
//         }))
//       };
//     });
//   };
//   public physicalToCanvas = (p: Point) => {
//     return {
//       x: p.x * this.dpr,
//       y: p.y * this.dpr
//     };
//   };

//   public draw = (shapes: Shape[], activeIndex: number, shape?: Shape) => {
//     const ctx = this.ctx;
//     if (ctx) {
//       ctx.clearRect(0, 0, this.width, this.height);
//       this._drawShapes(shapes, activeIndex);
//       if (shape && activeIndex === -1) {
//         this._drawWipShape(shape);
//       }
//     }
//   };

//   //这个和draw的区别是，这个方法是专门用来绘制选中状态的图形，不会绘制正在绘制的图形
//   public drawActive = (shapes: Shape[], activeIndex: number, activeKeyPoint: number = -1) => {
//     const ctx = this.ctx;
//     if (ctx) {
//       ctx.clearRect(0, 0, this.width, this.height);
//       this._drawShapes(shapes, activeIndex, activeKeyPoint);
//     }
//   };

//   private _drawRoundRectPath = (width: number, height: number, radius: number) => {
//     const cxt = this.ctx;
//     if (cxt) {
//       cxt.beginPath();
//       //从右下角顺时针绘制，弧度从0到1/2PI
//       cxt.arc(width - radius, height - radius, radius, 0, Math.PI / 2);
//       //矩形下边线
//       cxt.lineTo(radius, height);
//       //左下角圆弧，弧度从1/2PI到PI
//       cxt.arc(radius, height - radius, radius, Math.PI / 2, Math.PI);
//       //矩形左边线
//       cxt.lineTo(0, radius);
//       //左上角圆弧，弧度从PI到3/2PI
//       cxt.arc(radius, radius, radius, Math.PI, (Math.PI * 3) / 2);
//       //上边线
//       cxt.lineTo(width - radius, 0);
//       //右上角圆弧
//       cxt.arc(width - radius, radius, radius, (Math.PI * 3) / 2, Math.PI * 2);
//       //右边线
//       cxt.lineTo(width, height - radius);
//       cxt.closePath();
//     }
//   };

//   //需要确保tooltip出现在能看见的位置
//   public drawTooltip = (x: number, y: number, hintText: string) => {
//     const ctx = this.ctx;
//     if (ctx) {
//       ctx.save();
//       ctx.font = '12px';
//       ctx.textBaseline = 'top';
//       ctx.fillStyle = '#0D1014';
//       //绘制ToolTip背景
//       const width = ctx.measureText(hintText).width + 16;
//       const height = 24;
//       //让tooltip向下偏移12像素，防止被遮挡
//       const dx = x + 6;
//       const dy = y + 16;
//       let rx = dx;
//       let ry = dy;

//       if (dx + width > this.canvasWidth) {
//         rx = x - width;
//       }
//       if (dy + height > this.canvasHeight) {
//         ry = y - height;
//       }

//       ctx.save();
//       ctx.translate(rx, ry);
//       //绘制圆角矩形的各个边
//       this._drawRoundRectPath(width, height, 4);
//       ctx.fillStyle = 'rgba(10, 27, 57, 0.8)'; //若是给定了值就用给定的值否则给予默认值
//       ctx.fill();
//       ctx.restore();
//       //绘制ToolTip文字
//       ctx.fillStyle = '#fff';
//       ctx.fillText(hintText, rx + 8, ry + 7);
//       ctx.restore();
//     }
//   };
// }
