import Konva from 'konva'
import { isArray } from '@rcuse/shared'
import { LayerRender } from './LayerRender';
import { RenderEvent, LayerEvent } from '../constant';
import {
  PointFeature,
  PointStyle,
} from '../types';

export class PointRender extends LayerRender<PointFeature, PointStyle> {
  initLayers(): Konva.Layer[] {
    const layer = new Konva.Layer();

    return [layer];
  }

  onCreate = (e: any) => {
    const type = e.target.getType();

    if (type === 'Stage') {
      this.emit(RenderEvent.UnClick, e);
    }
  };

  disableCreate() {
    this.layers[0].off(LayerEvent.UnClick, this.onCreate);
  }

  enableCreate() {
    this.disableCreate();
    this.stage.on(LayerEvent.Click, this.onCreate);
  }

  setData(features: PointFeature[]) {
    const newFeatures = [...features].sort(
      (a, b) => +a.properties.isActive! - +b.properties.isActive!,
    );
    this.data = newFeatures;
    this.layers.forEach((layer) => {
      layer.destroyChildren();

      newFeatures.forEach((feature) => {
        const { geometry, properties } = feature;
        const { isActive, isHover } = properties;

        if (geometry.type === 'Point' && isArray(geometry.coordinates)) {
          const style = isActive
            ? this.style.active
            : (isHover ? this.style.hover : this.style.normal);

          const Point = new Konva.Circle({
            x: geometry.coordinates[0],
            y: geometry.coordinates[1],
            radius: style.size,
            fill: style.color,
            ...this.style.style,
          });

          layer.add(Point);
        }
      })
    });
  }
}
