import { CanvasDraw } from '@canvas-draw/react';
import { Button } from 'antd';
import React from 'react';
// @ts-expect-error 忽略报错
import testImg from './assets/test.jpg';
import { ImageDraw } from './components/ImageDraw';

import 'tdesign-react/es/style/index.css';

const buttonText = ['绘制区域', '取消绘制', '重新绘制'];

function Example() {
  return (
    <>
      <ImageDraw src={testImg} />
    </>
  );
};

export default Example;
