export interface BaseStyle<ItemType = any> {
  normal: ItemType;
  style?: any;
}

export interface ComplexStyle<ItemType = any> extends BaseStyle<ItemType> {
  hover: ItemType;
  active: ItemType;
}

export interface PointStyleItem {
  color: string;
  shape: string;
  size: number;
}

export type PointStyle = ComplexStyle<PointStyleItem>;

export interface Style {
  point: PointStyle;
}
