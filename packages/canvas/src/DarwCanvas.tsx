import type { DarwCanvasProps } from './types';
import * as React from 'react';
import { useCanvas } from './use-canvas';

export function DarwCanvas(props: DarwCanvasProps) {
  const { className, style, width, height, children } = props;

  const containerRef = React.useRef(null);
  const { ref } = useCanvas(props);

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
      {/* eslint-disable-next-line react/no-children-map */}
      {React.Children.map(children, (child: any) =>
        // eslint-disable-next-line react/no-clone-element
        React.cloneElement(child, { style: { position: 'absolute' } }))}
    </div>
  );
}

DarwCanvas.defaultProps = {
  editableMaxSize: 1,
  minPoint: 3,
  maxPoint: 10,
  mode: 'default',
  axis: {
    width: 1920,
    height: 1080,
  },
};
