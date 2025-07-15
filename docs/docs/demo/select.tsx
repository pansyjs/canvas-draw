import type { CanvasDrawProps } from '@canvas-draw/react';
import { CanvasDraw } from '@canvas-draw/react';
import React from 'react';
// @ts-expect-error 忽略报错
import testImg from './assets/test.jpg';
import { ImageDraw } from './components/ImageDraw';

const data = [
  {
    points: [
      { x: 1082, y: 443 },
      { x: 1086, y: 1022 },
      { x: 1839, y: 1041 },
      { x: 1881, y: 513 },
      { x: 1766, y: 262 },
    ],
  },
  {
    type: 'rectangle',
    data: {
      rect: { x: 5, y: 5, width: 200, height: 400 },
    },
  },
  {
    type: 'circle',
    data: {
      rect: { x: 100, y: 100, width: 200, height: 300 },
    },
  },
];

function Example() {
  const [value] = React.useState(data as CanvasDrawProps['value']);
  const [selectedIndex, setSelectedIndex] = React.useState<number>(1);

  const onSelect = (index: number) => {
    setSelectedIndex(index);
  };

  return (
    <>
      <ImageDraw src={testImg}>
        {(imageSize, drawAreaSize) => {
          return (
            <CanvasDraw
              mode="select"
              axis={imageSize}
              width={drawAreaSize.width}
              height={drawAreaSize.height}
              value={value}
              selectedIndex={selectedIndex}
              onSelect={onSelect}
            />
          );
        }}
      </ImageDraw>
    </>
  );
};

export default Example;
