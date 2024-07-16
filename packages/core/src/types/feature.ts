import type { Geometry, Feature, Point } from 'geojson'

export interface BaseProperties {
  id: string;
  isDraw?: boolean;
  isActive?: boolean;
  multiIndex?: number;
  [key: string]: any;
}

export interface BaseFeature<
  G extends Geometry = Geometry,
  P extends BaseProperties = BaseProperties,
> extends Feature {
  type: 'Feature';
  geometry: G;
  properties: P;
}

// 点类型
export interface PointProperties extends BaseProperties {
  isHover?: boolean;
  isDrag?: boolean;
  createTime: number;
}
export type PointFeature = BaseFeature<Point, PointProperties>;

export type FeatureUpdater<F extends BaseFeature> =
  | F[]
  | ((newFeatures: F[]) => F[]);
