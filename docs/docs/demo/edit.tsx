// @ts-expect-error 忽略报错
import testImg from './assets/test.jpg';
import { ImageDraw } from './components/ImageDraw';

function Example() {
  return (
    <>
      <ImageDraw src={testImg} />
    </>
  );
};

export default Example;
