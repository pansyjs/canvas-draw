import type { CanvasDrawProps } from '@canvas-draw/react';
import { CanvasDraw } from '@canvas-draw/react';
import React from 'react';
import { Button, Select, Space } from 'tdesign-react';
// @ts-expect-error 忽略报错
import testImg from './assets/test.jpg';
import { ImageDraw } from './components/ImageDraw';

const buttonText = ['绘制区域', '取消绘制', '重新绘制'];

function Example() {
  const [value, setValue] = React.useState<CanvasDrawProps['value']>([]);
  const [shape, setShape] = React.useState<CanvasDrawProps['shape']>('polygon');
  const [buttonState, setButtonState] = React.useState<0 | 1 | 2>(0);

  return (
    <>
      <Space style={{ marginBottom: 12 }}>
        <Select
          value={shape}
          options={[
            { label: '多边形', value: 'polygon' },
            { label: '矩形', value: 'rectangle' },
            { label: '圆形', value: 'circle' },
          ]}
          onChange={(val) => {
            setShape(val as CanvasDrawProps['shape']);
          }}
        />
        <Button
          onClick={() => {
            if (buttonState === 0) {
              setButtonState(1);
            } else if (buttonState === 1) {
              setValue([]);
              setButtonState(0);
            } else {
              setButtonState(1);
              setValue([]);
            }
          }}
        >
          {buttonText[buttonState]}
        </Button>
      </Space>
      <ImageDraw src={testImg}>
        {(imageSize, drawAreaSize) => {
          return (
            <CanvasDraw
              mode="edit"
              value={value}
              shape={shape}
              editableMaxSize={10}
              axis={imageSize}
              width={drawAreaSize.width}
              height={drawAreaSize.height}
              onChange={(val) => {
                setButtonState(2);
                setValue(val!);
              }}
            />
          );
        }}
      </ImageDraw>
    </>
  );
};

export default Example;
