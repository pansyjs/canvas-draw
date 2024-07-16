import Konva from 'konva'
import type { PointFeature } from './feature'
import type {
  PointRender,
} from '../render';

export type HistoryConfig = {
  maxSize: number;
};

export interface SourceData {
  point: PointFeature[];
}

/**
 * Render key => value 映射关系
 */
export type RenderMap = Partial<{
  point: PointRender;
}>;

export interface SourceOptions {
  data?: Partial<SourceData>;
  render: RenderMap;
  history?: HistoryConfig;
  stage: Konva.Stage;
}
