import type { EditorOptions, IShapeData, Options, SelectData } from '@canvas-draw/core';
import type React from 'react';

export interface CanvasDrawProps extends Options, SelectData, EditorOptions {
  className?: string;
  style?: React.CSSProperties;
  width: number;
  height: number;
  value?: IShapeData[];
  onChange?: (value?: IShapeData[]) => void;
  children?: React.ReactNode;
}
