import { CanvasDraw } from '@canvas-draw/react';
import { Button } from 'antd';
import React from 'react';

const buttonText = ['绘制区域', '取消绘制', '重新绘制'];

function Example() {
  const [, setEditor] = React.useState(false);
  const [value, setValue] = React.useState<any[]>([]);
  const [buttonState, setButtonState] = React.useState<0 | 1 | 2>(0);
  return (
    <div
      style={{
        width: 750,
        height: 420,
        position: 'relative',
        backgroundImage: `url(https://lins-oss-prod.sensoro.com/lsv2/lowCode/lowCode/2450925963931791372456.jpg?resourceId=1816420518512373762&secret=e0d40b12136e3c8ac4383d21c3c56b67)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <CanvasDraw
        width={750}
        height={420}
        style={{ background: 'rgba(17, 30, 54, 0.25)' }}
        mode="edit"
        value={
          value
          && value.map(i => ({
            ...i,
            title: 'test',
            labelStyle: { textStyle: 'red' },
          }))
        }
        onChange={(val) => {
          setValue(val!);
          setButtonState(2);
        }}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 10,
        }}
      >
        <div style={{ userSelect: 'none' }}></div>
        <Button
          onClick={() => {
            if (buttonState === 0) {
              setEditor(true);
              setButtonState(1);
            }
            else if (buttonState === 1) {
              setEditor(false);
              setValue([]);
              setButtonState(0);
            }
            else {
              setEditor(true);
              setButtonState(1);
              setValue([]);
            }
          }}
        >
          {buttonText[buttonState]}
        </Button>
      </div>
    </div>
  );
};

export default Example;
