import type { IShapeData } from '../shapes';
import type { Point } from '../shapes/polygon';
import type { OperatorOptions } from '../types';
import type { OperatorState } from './base';
import { HitPointType } from '../measurer';
import { Polygon, ShapeFactory } from '../shapes';
import { Operator } from './base';

export enum State {
  Drawing, // 正在绘制图形
  Editing, // 图形的编辑， 此时可以进行图形的编辑
  Idle, // 空闲状态，此时单击任意空白区域立即进入绘制状态，点击图形
  Resize, // 缩放状态(正在拖动缩放句柄移动)
  Pan, // 平移状态
}

export class PolygonEditor extends Operator<Polygon> {
  protected resizeHandle: number = -1; // resize的句柄，保存的是缩放点的index
  protected wipPoints: Point[] = []; // 正在绘制的图形
  // private drawing = false;
  protected state: State = State.Idle;
  constructor(
    canvas: HTMLCanvasElement,
    shapes: IShapeData[],
    state: OperatorState,
    options: OperatorOptions,
  ) {
    super(canvas, shapes, state, options);
    if (this.options.mode === 'edit') {
      canvas.addEventListener('mousemove', this._handleMouseMove, false);
      canvas.addEventListener('click', this._handleClick, false);
      canvas.addEventListener('dblclick', this._handleDblclick, false);
      canvas.addEventListener('mousedown', this._handleMousedown, false);
      canvas.addEventListener('mouseup', this._handleMouseup, false);
      // 监听del键
      document.addEventListener('keydown', this._handleKeydown, false);
      canvas.addEventListener('mouseleave', this._handleMouseLeave, false);
    }
  }

  // attach() {
  //   this.editorProxy = new EditorProxy(this);
  //   return this;
  // }

  select(index: number) {
    super.select(index);
    this.state = index > -1 ? State.Editing : State.Idle;
  }

  updateShapes = (shapes: IShapeData[]) => {
    // this.shapes = this.pen.transform(shapes);
    this.shapes = ShapeFactory.createShapes(shapes, this.pen.ctx, {
      ...this.options,
      scaleX: this.pen.scaleX,
      scaleY: this.pen.scaleY,
    })?.map(s => s?.transform());
    this.pen.draw(this.shapes, this.activeShapeIndex);
    if (!shapes || shapes?.length === 0) {
      this.state = State.Idle;
    }
  };

  destroy() {
    const canvas = this.canvas;
    canvas.removeEventListener('mousemove', this._handleMouseMove, false);
    canvas.removeEventListener('click', this._handleClick, false);
    canvas.removeEventListener('dblclick', this._handleDblclick, false);
    canvas.removeEventListener('mousedown', this._handleMousedown, false);
    canvas.removeEventListener('mouseup', this._handleMouseup, false);
    document.removeEventListener('keydown', this._handleKeydown, false);
    canvas.removeEventListener('mouseleave', this._handleMouseLeave, false);
    this.clear();
  }

  // 正在绘制的图形不需要变形
  private _createShape = (points: Point[]) => {
    return Polygon.create(points, this.pen.ctx, {
      ...this.options,
      scaleX: this.pen.scaleX,
      scaleY: this.pen.scaleY,
    });
  };

  private _handleMouseLeave = this._createControlledListener((e: MouseEvent) => {
    this.pen.draw(
      this.shapes,
      this.activeShapeIndex,
      this._createShape(this.wipPoints?.concat({ x: e.layerX, y: e.layerY }) || []),
    );
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
        if (this.wipPoints?.length >= this.options.minPoint - 1) {
          this.wipPoints = [];
          this.select(-1);
        }
      }
    }
  });

  private _handleMousedown = this._createControlledListener((e: MouseEvent) => {
    const selectShape = this.shapes?.[this.activeShapeIndex];
    if (this.state === State.Editing && selectShape) {
      const result = this.measurer.isPointInShapeKey({ x: e.layerX, y: e.layerY }, selectShape);
      if (result) {
        const [type, handle] = result;
        // 如果是选中关键节点，立马进入Resize状态
        if (type === HitPointType.KeyPoint) {
          const isRight = e.button === 2;
          if (isRight) {
            if (selectShape?.data?.points?.length > this.options.minPoint) {
              selectShape?.data?.points.splice(handle, 1);
              this.pen.draw(this.shapes, this.activeShapeIndex);
              this.dispatch();
            }
          }
          else {
            this.state = State.Resize;
            this.resizeHandle = handle;
          }
        }
        else if (type === HitPointType.CenterPoint) {
          // 立马生成新的图形，并直接进入Resize状态, 并直接绘制
          // 这里需要做一下限制
          if (selectShape?.data?.points?.length < this.options?.maxPoint) {
            const currentPoint = selectShape?.data?.points?.[handle];
            const nextPoint
              = selectShape?.data?.points?.[(handle + 1) % selectShape?.data?.points?.length];
            if (currentPoint && nextPoint) {
              const center = {
                x: (currentPoint.x + nextPoint.x) * 0.5,
                y: (currentPoint.y + nextPoint.y) * 0.5,
              };
              // 将center插入到selectShape的points的handle+1处
              selectShape?.data?.points.splice(handle + 1, 0, center);
              this.state = State.Resize;
              this.resizeHandle = handle + 1;
              this.pen.draw(this.shapes, this.activeShapeIndex);
            }
          }
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

  private _handleMouseMove = this._createControlledListener((e: MouseEvent) => {
    if (this.pen) {
      if (this.state === State.Drawing) {
        // this.pen.draw(this.shapes, -1, {
        //   points: this.wipPoints?.concat({ x: e.layerX, y: e.layerY })
        // });
        this.pen.draw(
          this.shapes,
          -1,
          this._createShape(this.wipPoints?.concat({ x: e.layerX, y: e.layerY })),
        );
        this.canvas.style.cursor = 'crosshair';
        // 此时的tooltip非常复杂，分这么几种情况
        /*
          1. 如果当前点数小于最小点数，则提示「单击继续绘制」
          2. 如果当前点数大于等于最小点数 & 当前鼠标不在起点位置，则提示「单击继续，双击完成，Delete删除」
          3. 如果当前点数大于等于最小点数 & 当前鼠标在起点位置，则提示「单击或双击结束绘制，Delete删除」
        */
        const getTooltipText = () => {
          if (this.wipPoints?.length < this.options?.minPoint - 1) {
            return '单击继续绘制';
          }
          else {
            const result = this.measurer.isPointInShapeKey(
              { x: e.layerX, y: e.layerY },
              {
                type: 'polygon',
                data: { points: this.wipPoints },
              },
              true,
            );
            if (result?.[0] === HitPointType.KeyPoint) {
              return '单击或双击结束绘制，Delete删除';
            }
            else {
              return '单击继续，双击完成，Delete删除';
            }
          }
        };
        this.pen.drawTooltip(e.layerX, e.layerY, getTooltipText());
      }
      else if (this.state === State.Resize) {
        const selectShape = this.shapes?.[this.activeShapeIndex];
        if (
          selectShape
          && this.resizeHandle !== -1
          && selectShape?.data?.points?.[this.resizeHandle]
        ) {
          selectShape.data.points[this.resizeHandle].x = e.layerX;
          selectShape.data.points[this.resizeHandle].y = e.layerY;
          this.pen.draw(this.shapes, this.activeShapeIndex);
          this.canvas.style.cursor = 'move';
        }
      }
      else if (this.state === State.Idle) {
        const hits = this.measurer.isPointInPath({ x: e.layerX, y: e.layerY }, this.shapes);
        if (this.shapes.length < this.options.editableMaxSize && hits.length === 0) {
          this.pen.drawTooltip(e.layerX, e.layerY, '单击绘制起点');
          this.canvas.style.cursor = 'crosshair';
        }
        else {
          if (hits.length > 0) {
            this.canvas.style.cursor = 'pointer';
            this.pen.drawTooltip(e.layerX, e.layerY, '单击面可选中并编辑，删除');
          }
        }
      }
      else if (this.state === State.Editing) {
        const selectShape = this.shapes?.[this.activeShapeIndex];
        if (selectShape) {
          this.pen.draw(this.shapes, this.activeShapeIndex);
          const result = this.measurer.isPointInShapeKey({ x: e.layerX, y: e.layerY }, selectShape);
          if (result?.[0] === HitPointType.KeyPoint) {
            this.canvas.style.cursor = 'pointer';
            this.pen.drawActive(this.shapes, this.activeShapeIndex, result[1]);
            this.pen.drawTooltip(
              e.layerX,
              e.layerY,
              `拖拽节点调整位置${
                selectShape?.data?.points?.length > this.options?.minPoint ? '，右键删除' : ''
              }`,
            );
          }
          else if (
            result?.[0] === HitPointType.CenterPoint
            && selectShape?.data?.points?.length < this.options?.maxPoint
          ) {
            this.canvas.style.cursor = 'pointer';
            this.pen.drawTooltip(e.layerX, e.layerY, '单击在该位置添加节点');
          }
          else {
            this.canvas.style.cursor = 'default';
          }
        }
        else {
          this.canvas.style.cursor = 'default';
        }
      }
      else {
        this.canvas.style.cursor = 'default';
      }
    }
  });

  private _complete() {
    this.shapes.push(this._createShape(this.wipPoints));
    this.wipPoints = [];
    this.select(this.shapes.length - 1);
    this.dispatch();
  }

  private _addPoint = (point: Point) => {
    if (this.wipPoints.length > 0) {
      const lastPoint = this.wipPoints[this.wipPoints.length - 1];
      if (Math.abs(lastPoint.x - point.x) > 3 || Math.abs(lastPoint.y - point.y) > 3) {
        this.wipPoints.push(point);
      }
    }
    else {
      this.wipPoints.push(point);
    }
    if (this.pen) {
      this.pen.draw(this.shapes, -1, this._createShape(this.wipPoints?.concat(point)));
      this.pen.drawTooltip(
        point.x,
        point.y,
        this.wipPoints?.length >= this.options?.minPoint
          ? '单击继续，双击完成，Delete删除'
          : '单击继续绘制',
      );
    }
    // 如果超过最大点数，自动完成
    if (this.wipPoints.length >= this.options?.maxPoint) {
      this._complete();
    }
  };

  private _handleClick = this._createControlledListener((e: MouseEvent) => {
    // 平移和缩放时，暂时忽略点击事件
    if (this.pen) {
      if (this.state !== State.Resize && this.state !== State.Pan) {
        if (this.state === State.Drawing) {
          // 这里需要区分一下，如果达到最小点数而且点击的是起点，那么直接结束
          if (this.wipPoints.length >= this.options?.minPoint) {
            const result = this.measurer.isPointInShapeKey(
              { x: e.layerX, y: e.layerY },
              {
                type: 'polygon',
                data: {
                  points: this.wipPoints,
                },
              },
              true,
            );
            if (result?.[0] === HitPointType.KeyPoint && result[1] === 0) {
              // 直接结束
              this._complete();
              return;
            }
          }
          this._addPoint({ x: e.layerX, y: e.layerY });
        }
        else {
          const hits = this.measurer.isPointInPath({ x: e.layerX, y: e.layerY }, this.shapes);
          if (hits.length > 0) {
            if (this.state === State.Idle || this.state === State.Editing) {
              this.select(hits[0]);
            }
          }
          else {
            if (this.state === State.Idle && this.options.editableMaxSize > this.shapes?.length) {
              this._addPoint({ x: e.layerX, y: e.layerY });
              this.state = State.Drawing;
            }
            else if (this.state === State.Editing) {
              this.select(-1);
              this.state = State.Idle;
            }
          }
        }
      }
      else if (this.state === State.Resize) {
        this.state = State.Editing;
      }
    }
  });

  private _handleDblclick = this._createControlledListener(() => {
    if (this.state === State.Drawing) {
      if (this.wipPoints.length >= this.options?.minPoint) {
        this._complete();
      }
    }
  });
}
