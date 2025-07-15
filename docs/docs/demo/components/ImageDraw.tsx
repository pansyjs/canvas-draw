import React from 'react';
import { Image as TImage } from 'tdesign-react';
import 'tdesign-react/es/style/index.css';
import './index.css';

export interface SizeInfo {
  width: number;
  height: number;
}

export interface ImageDrawProps {
  src: string;
  height?: number;
  onLoad?: (data: {
    image: SizeInfo,
    drawArea: SizeInfo
  }) => void;
  children?: React.ReactNode;
}

export function ImageDraw(props: ImageDrawProps) {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const { src, height = 450, onLoad, children } = props;

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

        onLoad?.({
          image: { width: image.width, height: image.height },
          drawArea: { height, width }
        })
      }
    };
  }, [src]);

  return (
    <div ref={rootRef} className="image-draw">
      <TImage fit="contain" src={src} style={{ height }} />
      <div className="image-draw-content">
        {children}
      </div>
    </div>
  );
}

export default ImageDraw;
