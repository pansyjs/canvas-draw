import type { HistoryConfig } from './source'
import type { Style } from './style'

/**
 * 鼠标指针类型
 */
export type CursorType =
  | 'draw'
  | 'pointHover'
  | 'pointDrag'
  | 'lineHover'
  | 'lineDrag'
  | 'polygonHover'
  | 'polygonDrag';

export type CursorMap = Record<CursorType, string>;

export interface BaseModeOptions {
  /**
   * 是否支持二次编辑
   * @default true
   */
  editable: boolean;
  /**
   * 新创建的是否展示为激活态
   * @default true
   */
  autoActive: boolean;
  /**
   * 否支持绘制多个绘制物
   * @default true
   */
  multiple: boolean;
  /**
   * 当前绘制实例支持绘制的最大元素个数
   */
  maxCount: number;
  cursor: CursorMap;
  history: HistoryConfig | false;
  style: Style;
}
