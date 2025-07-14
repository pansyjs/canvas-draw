/* eslint-disable react/no-clone-element */
/* eslint-disable react/no-children-map */
import type { CanvasDrawProps } from './types';
import React from 'react';
import { useDraw } from './useDraw';

const defaultProps: Partial<CanvasDrawProps> = {
  editableMaxSize: 1,
  minPoint: 3,
  maxPoint: 10,
  mode: 'default',
  axis: {
    width: 1920,
    height: 1080,
  },
};

export function CanvasDraw(props: CanvasDrawProps) {
  const mergedProps = { ...defaultProps, ...props };
  const { className, style, width, height, children } = mergedProps;

  const containerRef = React.useRef(null);
  const { ref } = useDraw(mergedProps);

  return (
    <div
      className={className}
      ref={containerRef}
      style={{
        ...style,
        position: 'relative',
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      <canvas width={width} height={height} ref={ref} />
      {React.Children.map(children, (child: any) =>
        React.cloneElement(child, { style: { position: 'absolute' } }))}
    </div>
  );
}
