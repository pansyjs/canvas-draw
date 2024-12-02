/**
 * title: 展示模式
 * description: 默认为展示模式，可通过设置 `mode` 修改为其他模式
 */
import { DarwCanvas } from '@pansy/darw-canvas-react';
import React from 'react';

const data = [
  {
    points: [
      { x: 38, y: 675 },
      { x: 26, y: 1033 },
      { x: 526, y: 1045 },
      { x: 514, y: 640 },
    ],
    title: '利星行一号楼南侧',
  },
  {
    points: [
      { x: 1278, y: 219 },
      { x: 883, y: 555 },
      { x: 1708, y: 624 },
    ],
    title: '一个神秘的地方',
  },
  {
    points: [
      { x: 1082, y: 443 },
      { x: 1086, y: 1022 },
      { x: 1839, y: 1041 },
      { x: 1881, y: 513 },
      { x: 1766, y: 262 },
    ],
    title: '艾泽拉斯大陆',
  },
  {
    type: 'rectangle',
    data: {
      rect: { x: 5, y: 5, width: 200, height: 400 },
    },
    title: '艾泽拉斯大陆',
  },
  {
    type: 'circle',
    data: {
      rect: { x: 100, y: 100, width: 200, height: 300 },
    },
    title: '艾泽拉斯大陆',
  },
];

function Example() {
  const [value] = React.useState<any[]>(data);
  return (
    <div
      style={{
        width: '750px',
        height: 420,
        position: 'relative',
        backgroundImage: `url(https://lins-oss-prod.sensoro.com/lsv2/lowCode/lowCode/2450925963931791372456.jpg?resourceId=1816420518512373762&secret=e0d40b12136e3c8ac4383d21c3c56b67)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <DarwCanvas
        width={750}
        height={420}
        shapeStyle={{
          fillStyle: 'rgba(255, 77, 82, 0.15)',
          strokeStyle: '#FF4D52',
        }}
        style={{ background: 'rgba(17, 30, 54, 0.25)' }}
        value={value}
      />
    </div>
  );
}

export default Example;
