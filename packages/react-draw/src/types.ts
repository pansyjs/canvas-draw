import type React from 'react';
import type { EditorOptions, IShapeData, Options, SelectData } from './core/types';

export interface DrawProps extends Options, SelectData, EditorOptions {
  className?: string;
  style?: React.CSSProperties;
  width: number;
  height: number;
  value?: IShapeData[];
  onChange?: (value?: IShapeData[]) => void;
  children?: React.ReactNode;
}
