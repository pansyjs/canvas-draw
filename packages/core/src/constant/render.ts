import {
  PointRender,
} from '../render';
import { RenderType } from '../types';

/**
 * renderType与render的映射
 */
export const RENDER_MAP: Record<
  RenderType,
  | typeof PointRender
> = {
  point: PointRender,
  line: PointRender,
  polygon: PointRender,
};
