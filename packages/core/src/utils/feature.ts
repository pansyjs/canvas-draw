import { uuid } from '@rcuse/shared'
import type { PositionArray, PointProperties, PointFeature, BaseFeature } from '../types'

/**
 * 根据id判断两个feature是否为同一feature
 * @param feature1
 * @param feature2
 */
export const isSameFeature = (
  feature1?: BaseFeature | null,
  feature2?: BaseFeature | null,
) => {
  return !!(
    feature1 &&
    feature2 &&
    feature1.properties?.id === feature2.properties?.id
  );
};

export const getDefaultPointProperties = () => {
  return {
    id: uuid(),
    isHover: false,
    isActive: false,
    isDrag: false,
    createTime: Date.now(),
  };
};

/**
 * 创建
 * @param position
 * @param properties
 */
export const createPointFeature = (
  position: PositionArray,
  properties: Partial<PointProperties> = {},
) => {
  return {
    type: 'Feature',
    properties: {
      ...getDefaultPointProperties(),
      ...properties,
    },
    geometry: {
      type: 'Point',
      coordinates: position,
    }
  } as PointFeature;
};

/**
 * 对target数据使用targetHandler，对target以外数据采用otherHandler
 * @param target
 * @param data
 * @param targetHandler
 * @param otherHandler
 */
export const updateTargetFeature = <F extends BaseFeature>({
  target,
  data,
  targetHandler,
  otherHandler,
}: {
  target: F;
  data: F[];
  targetHandler?: (item: F, index: number) => F | void;
  otherHandler?: (item: F, index: number) => F | void;
}) => {
  return data.map((item, index) => {
    const handler = isSameFeature(item, target) ? targetHandler : otherHandler;
    return handler?.(item, index) ?? item;
  });
};
