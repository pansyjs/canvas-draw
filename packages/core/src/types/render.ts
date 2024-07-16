import type { BaseStyle } from './style'

export type RenderType =
  | 'point'
  | 'line'
  | 'polygon';

export interface RenderOptions<S extends BaseStyle> {
  style: S;
}
