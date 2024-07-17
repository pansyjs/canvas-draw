import Konva from 'konva'
import { debounce, fill } from 'lodash-es'
import { isArray } from '@rcuse/shared'
import { LayerRender } from './LayerRender';
import { RenderEvent, LayerEvent, StageEvent } from '../constant';
import {
  PointFeature,
  PointStyle,
} from '../types';

export class PointRender extends LayerRender<PointFeature, PointStyle> {
  initLayers(): Konva.Layer[] {
    const layer = new Konva.Layer({
      draggable: true
    });

    return [layer];
  }

  onCreate = (e: any) => {
    const type = e.target.getType();

    if (type === 'Stage') {
      this.emit(RenderEvent.UnClick, e);
    }
  };

  onMouseMove = (e: any) => {
    const type = e.target.getType();

    if (type !== 'Stage') {
      const layer = e.target.parent;
      if (this.layers[0]?.id === layer.id) {
        this.emit(RenderEvent.Mousemove, e);
      }
    }
  };

  onMouseOut = (e: any) => {
    const type = e.target.getType();

    if (type !== 'Stage') {
      const layer = e.target.parent;
      if (this.layers[0]?.id === layer.id) {
        this.emit(RenderEvent.Mouseout, e);
      }
    }
  };

  onClick = (e: any) => {
    this.emit(RenderEvent.Click, e);
  };

  onDragging = (e: any) => {
    console.log(e)
    this.emit(RenderEvent.Dragging, e);
  };

  onDragEnd = debounce((e: any) => {
    this.emit(RenderEvent.Dragend, e);
  }, 0);

  onMouseDown = (e: any) => {
    const type = e.target.getType();

    if (type !== 'Stage') {
      const layer = e.target.parent;
      if (this.layers[0]?.id === layer.id) {
        this.emit(RenderEvent.Dragstart, e);
      }
    }
  };

  disableCreate() {
    this.stage.off(LayerEvent.UnClick, this.onCreate);
  }

  enableCreate() {
    this.disableCreate();
    this.stage.on(LayerEvent.Click, this.onCreate);
  }

  enableClick() {
    this.disableClick();
    this.layers[0].on(LayerEvent.Click, this.onClick);
  }

  disableClick() {
    this.layers[0].off(LayerEvent.Click, this.onClick);
  }

  enableHover() {
    this.disableHover();
    this.stage.on(LayerEvent.Mousemove, this.onMouseMove);
    this.stage.on(LayerEvent.Mouseout, this.onMouseOut);
  }

  disableHover() {
    this.stage.off(LayerEvent.Mousemove, this.onMouseMove);
    this.stage.off(LayerEvent.Mouseout, this.onMouseOut);
  }

  enableDrag() {
    this.disableDrag();
    this.stage.on(LayerEvent.Mousedown, this.onMouseDown);
    this.stage.on(StageEvent.Dragging, this.onDragging);
    this.stage.on(StageEvent.Mouseup, this.onDragEnd);
    this.stage.on(StageEvent.Dragend, this.onDragEnd);
  }

  disableDrag() {
    this.stage.off(LayerEvent.Mousedown, this.onMouseDown);
    this.stage.off(StageEvent.Dragging, this.onDragging);
    this.stage.off(StageEvent.Mouseup, this.onDragEnd);
    this.stage.off(StageEvent.Dragend, this.onDragEnd);
  }

  setData(features: PointFeature[]) {
    const newFeatures = [...features].sort(
      (a, b) => +a.properties.isActive! - +b.properties.isActive!,
    );
    this.data = newFeatures;
    this.layers.forEach((layer) => {
      const points = layer.children || [];

      newFeatures.forEach((feature) => {
        const { geometry, properties } = feature;
        const { isActive, isHover } = properties;

        let currntPoint = points.find((p) => p.attrs.feature.properties.id === properties.id) as Konva.Circle;
        const style = isActive
          ? this.style.active
          : (isHover ? this.style.hover : this.style.normal);

        const isNewPoint = !currntPoint;

        if (!currntPoint) {
          currntPoint = new Konva.Circle({
            draggable: true,
          });
        }

        if (isNewPoint) {
          currntPoint.x(geometry.coordinates[0]);
          currntPoint.y(geometry.coordinates[1]);
        }

        currntPoint.fill(style.color);
        currntPoint.radius(style.size);
        currntPoint.stroke(this.style.style.stroke);
        currntPoint.strokeWidth(this.style.style.strokeWidth);

        currntPoint.setAttr('feature', feature)

        layer.add(currntPoint);
      })
    });
  }
}
