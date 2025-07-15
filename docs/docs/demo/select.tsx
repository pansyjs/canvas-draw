import type { CanvasDrawProps } from '@canvas-draw/react';
import { CanvasDraw } from '@canvas-draw/react';
import React from 'react';
// @ts-expect-error 忽略报错
import testImg from './assets/test.jpg';
import { ImageDraw, type SizeInfo, type ImageDrawProps } from './components/ImageDraw';

const data: CanvasDrawProps['value'] = [
  {
    type: 'polygon',
    data: {
      points: [
        { x: 1082, y: 443 },
        { x: 1086, y: 1022 },
        { x: 1839, y: 1041 },
        { x: 1881, y: 513 },
        { x: 1766, y: 262 },
      ],
    }
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
  const [value] = React.useState(data);
  const [selectedIndex, setSelectedIndex] = React.useState<number>(1);
  const [sizeInfo, setSizeInfo] = React.useState<{
    image: SizeInfo,
    drawArea: SizeInfo
  }>();

  const onSelect = (index: number) => {
    setSelectedIndex(index);
  };

  const onImageLoad: ImageDrawProps['onLoad'] = (data) => {
    setSizeInfo(data);
  }

  const canvasDraw = React.useMemo(() => {
    if (!sizeInfo) return null;

    const { image, drawArea } = sizeInfo;

    return (
      <CanvasDraw
        value={value}
        editableMaxSize={10}
        axis={image}
        mode="select"
        selectedIndex={selectedIndex}
        width={drawArea.width}
        height={drawArea.height}
        onSelect={onSelect}
      />
    )
  }, [sizeInfo, value, selectedIndex]);

  return (
    <ImageDraw src={testImg} onLoad={onImageLoad}>
      {canvasDraw}
    </ImageDraw>
  );
};

export default Example;
