import type { IShapeData } from './shapes/base';

export interface ShapeStyle {
  fillStyle?: string;
  strokeStyle?: string;
  lineWidth?: number;
  circleRadius?: number;
}

interface SelectData {
  selectedIndex?: number;
  onSelect?: (index: number) => void;
}

interface EditorOptions {
  shape?: 'polygon' | 'rectangle' | 'circle';
  subOperator?: boolean;
}

export type Mode = 'edit' | 'select' | 'default';

export interface Options {
  // editor?: boolean;
  mode?: Mode;
  minPoint?: number;
  maxPoint?: number;
  width?: number;
  height?: number;
  shapeStyle?: ShapeStyle;
  activeShapeStyle?: ShapeStyle;
  // labelStyle?: LabelStyle;
  editableMaxSize?: number;
  // disablePolygon?: boolean;
  // textAline?: 'default' | 'center';
  axis?: {
    width: number;
    height: number;
  };
}

export type OperatorOptions = Required<Options> & SelectData & EditorOptions;

export interface DarwCanvasProps extends Options, SelectData, EditorOptions {
  className?: string;
  style?: React.CSSProperties;
  width: number;
  height: number;
  value?: IShapeData[];
  onChange?: (value?: IShapeData[]) => void;
  children?: React.ReactNode;
}
