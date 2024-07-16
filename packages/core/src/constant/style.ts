import type {
  PointStyle,
  PointStyleItem,
  Style,
} from '../types';

export const NORMAL_COLOR = '#1990FF';

export const ACTIVE_COLOR = '#ED9D48';


export const DEFAULT_POINT_NORMAL_STYLE: PointStyleItem = {
  color: NORMAL_COLOR,
  shape: 'circle',
  size: 6,
};

export const DEFAULT_NODE_NORMAL_STYLE: PointStyleItem = {
  color: ACTIVE_COLOR,
  shape: 'circle',
  size: 6,
};

export const DEFAULT_MID_POINT_STYLE: PointStyleItem = {
  shape: 'circle',
  size: 6,
  color: ACTIVE_COLOR,
};

export const DEFAULT_POINT_STYLE: PointStyle = {
  normal: DEFAULT_POINT_NORMAL_STYLE,
  hover: {
    ...DEFAULT_POINT_NORMAL_STYLE,
    size: 8,
  },
  active: {
    ...DEFAULT_POINT_NORMAL_STYLE,
    size: 8,
    color: ACTIVE_COLOR,
  },
  style: {
    stroke: '#ffffff',
    strokeWidth: 1,
  },
}

export const DEFAULT_STYLE: Style = {
  point: DEFAULT_POINT_STYLE,
}
