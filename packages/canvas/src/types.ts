import type { EditorOptions, IShapeData, Options, SelectData } from '@pansy/darw-core';

export interface DarwCanvasProps extends Options, SelectData, EditorOptions {
  className?: string;
  style?: React.CSSProperties;
  width: number;
  height: number;
  value?: IShapeData[];
  onChange?: (value?: IShapeData[]) => void;
  children?: React.ReactNode;
}
