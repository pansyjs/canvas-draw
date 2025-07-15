import { CanvasDraw } from '@canvas-draw/react';
import React from 'react';
import { Image as TImage } from 'tdesign-react';
import 'tdesign-react/es/style/index.css';
import './index.css';

interface ImageDrawProps {
  src: string;
  height?: number;
}

interface AreaSize {
  width: number;
  height: number;
}

export function ImageDraw(props: ImageDrawProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const { src, height = 450 } = props;

  const [axis, setAxis] = React.useState<AreaSize>();
  const [areaSize, setAreaSize] = React.useState<AreaSize>();

  React.useEffect(() => {
    const root = rootRef.current;

    if (!src || !root)
      return;

    const rootWidth = root.clientWidth;
    const rootHeight = root.clientHeight;

    const image = new Image();
    image.src = src;

    image.onload = function () {
      if (image.width && image.height) {
        const defaultScale = rootWidth / rootHeight;
        const scale = image.width / image.height;
        let width = rootWidth;
        let height = rootHeight;

        if (scale < defaultScale) {
          width = scale * rootHeight;
        }
        if (scale > defaultScale) {
          height = rootWidth / scale;
        }

        setAreaSize({ height, width });
        setAxis({ width: image.width, height: image.height });
      }
    };
  }, [src]);

  return (
    <div ref={rootRef} className="image-draw">
      <TImage fit="contain" src={src} style={{ height }} />
      <div className="image-draw-content">
        {axis && areaSize && (
          <CanvasDraw
            mode="edit"
            shape="rectangle"
            axis={axis}
            width={areaSize.width}
            height={areaSize.height}
          />
        )}
      </div>
    </div>
  );
}
