import type { IShapeData, Shape } from '../shapes';
import type { OperatorOptions } from '../types';
import type { OperatorState } from './base';
import { Operator } from './base';

export class Selecter extends Operator {
  constructor(
    canvas: HTMLCanvasElement,
    shapes: IShapeData[],
    state: OperatorState,
    options: OperatorOptions,
  ) {
    super(canvas, shapes, state, options);
    if (this.options.mode === 'select') {
      canvas.addEventListener('mousemove', this._handleMouseMove, false);
      canvas.addEventListener('click', this._handleClick, false);
      canvas.addEventListener('mouseleave', this._handleMouseLeave, false);
    }
  }

  private _handleMouseLeave = () => {
    this._drawShapes(this.shapes, this.activeShapeIndex);
  };

  destroy(): void {
    if (this.options.mode === 'select') {
      this.canvas.removeEventListener('mousemove', this._handleMouseMove, false);
      this.canvas.removeEventListener('click', this._handleClick, false);
      this.canvas.removeEventListener('mouseleave', this._handleMouseLeave, false);
    }
  }

  select(index: number): void {
    this.activeShapeIndex = index;
    this._drawShapes(this.shapes, this.activeShapeIndex);
    this.options.onSelect?.(index);
  }

  private _drawShapes(shapes: Shape[], activeIndex: number) {
    this.pen.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    shapes.forEach((shape, idx) => {
      if (idx !== activeIndex) {
        this.pen.drawShape(shape, this.options.shapeStyle);
      }
    });
    // 提升激活状态下的层级
    if (shapes?.[activeIndex]) {
      this.pen.drawShape(shapes?.[activeIndex], this.options.activeShapeStyle);
    }
  }

  _handleClick = (e: MouseEvent) => {
    if (this.pen) {
      const hits = this.measurer.isPointInPath({ x: e.layerX, y: e.layerY }, this.shapes);
      if (hits.length > 0) {
        if (this.activeShapeIndex === hits[0]) {
          this.select(-1);
        }
        else {
          this.select(hits[0]);
        }
      }
      else {
        // this._drawShapes(this.shapes, this.activeShapeIndex);
        this.select(this.activeShapeIndex);
      }
    }
  };

  _handleMouseMove = (e: MouseEvent) => {
    if (this.pen) {
      const hits = this.measurer.isPointInPath({ x: e.layerX, y: e.layerY }, this.shapes);
      if (hits.length > 0) {
        this.canvas.style.cursor = 'pointer';
        this._drawShapes(this.shapes, this.activeShapeIndex);
        this.pen.drawTooltip(
          e.layerX,
          e.layerY,
          hits[0] === this.activeShapeIndex ? '单击面取消选中' : '单击面可选中',
        );
      }
      else {
        this.canvas.style.cursor = 'default';
        this._drawShapes(this.shapes, this.activeShapeIndex);
      }
      // this.pen.draw(this.shapes, this.activeShapeIndex);
    }
  };
}
