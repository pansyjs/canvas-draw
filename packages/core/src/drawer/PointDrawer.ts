import Konva from 'konva'
import { PointMode } from '../mode'
import type {
  DeepPartial,
  BaseModeOptions,
  RenderType
} from '../types'

export interface PointDrawerOptions extends BaseModeOptions {}

export class PointDrawer extends PointMode<PointDrawerOptions> {
  constructor(stage: Konva.Stage, options: DeepPartial<PointDrawerOptions>) {
    super(stage, options);

    this.bindPointRenderEvent();
  }

  protected get dragItem() {
    return this.dragPoint;
  }

  protected get editItem() {
    return this.editPoint;
  }

  getDefaultOptions(options: DeepPartial<PointDrawerOptions>) {
    const defaultOptions = {
      ...this.getCommonOptions(options)
    }

    return defaultOptions;
  }

  getRenderTypes(): RenderType[] {
    return ['point'];
  }

  onPointCreate(e: any) {
    const newFeature = super.onPointCreate(e);
  }

  bindThis() {
    super.bindThis();
    this.bindPointRenderEvent = this.bindPointRenderEvent.bind(this);
  }

  resetFeatures() {
    this.setPointData((features) => {
      return features.map((feature) => {
        feature.properties = {
          ...feature.properties,
          isDrag: false,
          isActive: false,
          isHover: false,
        };
        return feature;
      });
    });
  }
}
