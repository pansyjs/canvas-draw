import type { Position, PositionArray } from '../types'

export const getPosition: (
  e: any,
) => Position = (e) => {
  return {
    x: e.evt.layerX,
    y: e.evt.layerY,
  }
};

/**
 * 将 position 转换为数组格式
 * @param lng
 * @param lat
 */
export const transPositionToArray: (obj: Position) => PositionArray = ({
  x,
  y,
}) => [x, y];
