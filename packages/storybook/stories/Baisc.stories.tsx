import React, { useEffect, useRef } from 'react';
import Konva from 'konva'
import { PointDrawer } from '@pansy/canvas-draw'

const meta = {
  title: 'example/Basic',
};

export default meta;

export function Basic() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      const stage = new Konva.Stage({
        container: containerRef.current,
        width: 500,
        height: 300,
      });

      const drawer = new PointDrawer(stage, {});

      drawer.enable();

      return () => {
        stage.destroy();
      }
    }
  }, [containerRef.current])

  return (
    <div ref={containerRef} style={{ background: '#ef040412', display: 'inline-block' }} />
  );
}
