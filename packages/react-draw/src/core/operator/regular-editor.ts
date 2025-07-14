import type { IShapeData, Point, Rect, Regular } from '../shapes';
import type { OperatorOptions } from '../types';
import type { OperatorState } from './base';
import { HitPointType } from '../measurer';
import { Circle, isRect, Rectangle } from '../shapes';
import { Operator } from './base';
import { State } from './polygon-editor';

export class RegularEditor extends Operator {
  protected state: State = State.Idle;
  protected resizeHandle: number = -1; // resize的句柄，保存的是缩放点的index
  protected wipRect: Partial<Rect> = {}; // 正在绘制的图形
  constructor(
    canvas: HTMLCanvasElement,
    shapes: IShapeData[],
    state: OperatorState,
    options: OperatorOptions,
  ) {
    super(canvas, shapes, state, options);
    if (this.options.mode === 'edit') {
      canvas.addEventListener('mousedown', this._handleMousedown, false);
      canvas.addEventListener('mouseup', this._handleMouseup, false);
      canvas.addEventListener('mousemove', this._handleMouseMove, false);
      canvas.addEventListener('click', this._handleClick, false);
      canvas.addEventListener('dblclick', this._handleDblClick, false);
      // 监听del键
      document.addEventListener('keydown', this._handleKeydown, false);
      document.addEventListener('click', this._handleDocumentClick, false);
      canvas.addEventListener('mouseleave', this._handleMouseLeave, false);
    }
  }

  destroy(): void {
    if (this.options.mode === 'edit') {
      this.canvas.removeEventListener('mousedown', this._handleMousedown, false);
      this.canvas.removeEventListener('mouseup', this._handleMouseup, false);
      this.canvas.removeEventListener('mousemove', this._handleMouseMove, false);
      this.canvas.removeEventListener('click', this._handleClick, false);
      this.canvas.removeEventListener('dblclick', this._handleDblClick, false);
      document.removeEventListener('keydown', this._handleKeydown, false);
      document.removeEventListener('click', this._handleDocumentClick, false);
      this.canvas.removeEventListener('mouseleave', this._handleMouseLeave, false);
    }
  }

  select(index: number) {
    super.select(index);
    this.state = index > -1 ? State.Editing : State.Idle;
  }

  protected _handleMouseLeave = this._createControlledListener((e: MouseEvent) => {
    this._handleMouseMove(e);
  });

  private _handleDocumentClick = this._createControlledListener((e: MouseEvent) => {
    if (e?.target !== this.canvas && this.state === State.Editing) {
      this.select(-1);
    }
  });

  private _handleKeydown = this._createControlledListener<KeyboardEvent>((e) => {
    if (e.code === 'Backspace' || e.code === 'Delete') {
      if (this.state === State.Editing) {
        const selectShape = this.shapes?.[this.activeShapeIndex];
        if (selectShape) {
          this.shapes.splice(this.activeShapeIndex, 1);
          this.dispatch();
          this.select(-1);
        }
      }
      else if (this.state === State.Drawing) {
        this.wipRect = {};
        this.select(-1);
      }
    }
  });

  private _handleMousedown = this._createControlledListener((e: MouseEvent) => {
    const isRightClick = e.button === 2;
    if (isRightClick) {
      // 右键结束
      if (this.state === State.Drawing) {
        this.state = State.Idle;
        this._complete();
      }
    }
    else {
      const selectShape = this.shapes?.[this.activeShapeIndex];
      const result = this.measurer.isPointInShapeKey({ x: e.offsetX, y: e.offsetY }, selectShape);
      if (result) {
        const [type, handle] = result;
        if (type === HitPointType.KeyPoint) {
          this.state = State.Resize;
          this.resizeHandle = handle;
        }
      }
    }
  });

  private _handleMouseup = this._createControlledListener(() => {
    if (this.state === State.Resize) {
      // 这个状态重置放到click事件里面去处理，不然会导致体验问题
      // this.state = State.Editing;
      this.dispatch();
    }
  });

  protected resizeShape = (shape: Regular, p: Point, handle: number) => {
    if (shape.type === 'rectangle') {
      const points = this.measurer.getShapeKeyPoints(shape);
      if (points.length === 4 && handle !== -1) {
        if (handle === 0) {
          shape.data.rect = {
            x: p.x,
            y: p.y,
            width: points[2].x - p.x,
            height: points[2].y - p.y,
          };
        }
        else if (handle === 1) {
          shape.data.rect = {
            x: points[0].x,
            y: p.y,
            width: p.x - points[0].x,
            height: points[2].y - p.y,
          };
        }
        else if (handle === 2) {
          shape.data.rect = {
            x: points[0].x,
            y: points[0].y,
            width: p.x - points[0].x,
            height: p.y - points[0].y,
          };
        }
        else if (handle === 3) {
          shape.data.rect = {
            x: p.x,
            y: points[0].y,
            width: points[2].x - p.x,
            height: p.y - points[0].y,
          };
        }
      }
    }
  };

  private _handleMouseMove = this._createControlledListener((e: MouseEvent) => {
    if (this.state === State.Drawing) {
      if (typeof this?.wipRect?.x === 'number' && typeof this?.wipRect?.y === 'number') {
        const width = e.offsetX - this.wipRect.x;
        const height = e.offsetY - this.wipRect.y;
        this.wipRect.width = width;
        this.wipRect.height = height;
        if (isRect(this.wipRect)) {
          const shape = this._createShape(this.wipRect);
          if (shape) {
            this.pen.draw(this.shapes, -1, shape);
            this.canvas.style.cursor = 'crosshair';
            this.pen.drawTooltip(e.offsetX, e.offsetY, '双击或右键结束');
          }
        }
      }
    }
    else if (this.state === State.Idle) {
      const hits = this.measurer.isPointInPath({ x: e.offsetX, y: e.offsetY }, this.shapes);
      if (this.shapes.length < this.options.editableMaxSize && hits.length === 0) {
        this.pen.drawTooltip(e.offsetX, e.offsetY, '单击绘制起点');
        this.canvas.style.cursor = 'crosshair';
      }
      else {
        if (hits.length > 0) {
          this.canvas.style.cursor = 'pointer';
          this.pen.drawTooltip(e.offsetX, e.offsetY, '单击面可选中并编辑，删除');
        }
        else {
          this.canvas.style.cursor = 'not-allowed';
          this.pen.drawTooltip(
            e.offsetX,
            e.offsetY,
            `绘制数量已达上限${this.options.editableMaxSize}个，不能继续绘制`,
          );
        }
      }
    }
    else if (this.state === State.Resize) {
      const selectShape = this.shapes?.[this.activeShapeIndex];
      if (selectShape && this.resizeHandle !== -1) {
        // this.resizeHandle代表着当前正在调整的顶点，根据顶点位置计算新的矩形
        this.resizeShape(selectShape, { x: e.offsetX, y: e.offsetY }, this.resizeHandle);
        this.pen.draw(this.shapes, this.activeShapeIndex);
        this.canvas.style.cursor = 'move';
      }
    }
    else if (this.state === State.Editing) {
      const selectShape = this.shapes?.[this.activeShapeIndex];
      if (selectShape) {
        this.pen.draw(this.shapes, this.activeShapeIndex);
        const result = this.measurer.isPointInShapeKey({ x: e.offsetX, y: e.offsetY }, selectShape);
        if (result?.[0] === HitPointType.KeyPoint) {
          this.canvas.style.cursor = 'pointer';
          this.pen.drawActive(this.shapes, this.activeShapeIndex, result[1]);
          this.pen.drawTooltip(
            e.offsetX,
            e.offsetY,
            `拖拽节点调整位置${
              selectShape?.data?.points?.length > this.options?.minPoint ? '，右键删除' : ''
            }`,
          );
        }
        else {
          this.canvas.style.cursor = 'default';
        }
      }
    }
  });

  private _handleClick = this._createControlledListener((e: MouseEvent) => {
    if (this.pen) {
      // 平移和缩放以及绘制时，暂时忽略点击事件
      if (this.state !== State.Resize && this.state !== State.Pan && this.state !== State.Drawing) {
        const hits = this.measurer.isPointInPath({ x: e.offsetX, y: e.offsetY }, this.shapes);
        // 如果点击了某个图形，则选中该图形
        if (hits.length > 0) {
          if (this.state === State.Idle || this.state === State.Editing) {
            this.select(hits[0]);
          }
        }
        else {
          if (
            (this.state === State.Idle || this.state === State.Editing)
            && this.shapes.length < this.options.editableMaxSize
          ) {
            this.wipRect = {
              x: e.offsetX,
              y: e.offsetY,
              width: 0,
              height: 0,
            };
            this.pen.draw(this.shapes, -1, this._createShape(this.wipRect as Rect)!);
            this.canvas.style.cursor = 'crosshair';
            this.pen.drawTooltip(e.offsetX, e.offsetY, '双击或右键结束');
            this.state = State.Drawing;
          }
          else if (
            this.state === State.Editing
            && this.shapes.length >= this.options.editableMaxSize
          ) {
            this.select(-1);
            this.state = State.Idle;
          }
        }
      }
      else if (this.state === State.Resize) {
        this.state = State.Editing;
      }
    }
  });

  private _handleDblClick = this._createControlledListener(() => {
    if (this.state === State.Drawing) {
      this._complete();
    }
  });

  private _complete() {
    if (isRect(this.wipRect)) {
      const shape = this._createShape(this.wipRect);
      if (shape) {
        this.shapes.push(shape);
        this.wipRect = {};
        this.select(this.shapes.length - 1);
        this.dispatch();
      }
    }
  }

  private _createShape = (rect: Rect) => {
    const shape = this.options.shape;
    if (shape === 'rectangle') {
      return Rectangle.create(rect, this.pen.ctx, {
        ...this.options,
        scaleX: this.pen.scaleX,
        scaleY: this.pen.scaleY,
      });
    }
    else if (shape === 'circle') {
      return Circle.create(rect, this.pen.ctx, {
        ...this.options,
        scaleX: this.pen.scaleX,
        scaleY: this.pen.scaleY,
      });
    }
    else {
      return null;
    }
  };
}
