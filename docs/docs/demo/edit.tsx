import { CanvasDraw } from '@canvas-draw/react';
// @ts-expect-error 忽略报错
import testImg from './assets/test.jpg';
import { ImageDraw } from './components/ImageDraw';

function Example() {
  return (
    <>
      <ImageDraw src={testImg}>
        {(imageSize, drawAreaSize) => {
          return (
            <CanvasDraw
              mode="edit"
              shape="rectangle"
              axis={imageSize}
              width={drawAreaSize.width}
              height={drawAreaSize.height}
            />
          );
        }}
      </ImageDraw>
    </>
  );
};

export default Example;
