import type { Point, Regular } from '../shapes';
import { RegularEditor } from './regular-editor';

export class CircleEditor extends RegularEditor {
  protected resizeShape = (shape: Regular, p: Point, handle: number) => {
    if (shape.type === 'circle') {
      const points = this.measurer.getShapeKeyPoints(shape);
      if (points.length === 4 && handle !== -1) {
        // 首先将圆形的四个点转化为矩形
        const rect = shape.data.rect;
        if (handle === 0) {
          shape.data.rect = {
            x: rect.x,
            y: p.y,
            width: rect.width,
            height: points[2].y - p.y,
          };
        }
        else if (handle === 1) {
          shape.data.rect = {
            x: rect.x,
            y: rect.y,
            width: p.x - rect.x,
            height: rect.height,
          };
        }
        else if (handle === 2) {
          shape.data.rect = {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: p.y - rect.y,
          };
        }
        else if (handle === 3) {
          shape.data.rect = {
            x: p.x,
            y: rect.y,
            width: points[1].x - p.x,
            height: rect.height,
          };
        }
      }
    }
  };
}
