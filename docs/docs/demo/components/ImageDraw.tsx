import React from 'react';
import { Image as TImage } from 'tdesign-react';
import 'tdesign-react/es/style/index.css';
import './index.css';

interface AreaSize {
  width: number;
  height: number;
}

interface ImageDrawProps {
  src: string;
  height?: number;
  children?: (imageSize: AreaSize, drawAreaSize: AreaSize) => React.ReactElement;
}

export function ImageDraw(props: ImageDrawProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const { src, height = 450, children } = props;

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

  const renderChildren = React.useMemo(() => {
    if (!areaSize || !axis)
      return null;

    return children?.(axis, areaSize);
  }, [axis, areaSize]);

  return (
    <div ref={rootRef} className="image-draw">
      <TImage fit="contain" src={src} style={{ height }} />
      <div className="image-draw-content">
        {renderChildren}
      </div>
    </div>
  );
}

export default ImageDraw;
