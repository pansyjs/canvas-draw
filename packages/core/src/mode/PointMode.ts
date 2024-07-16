import { BaseMode } from './BaseMode';
import { PointRender } from '../render';
import { RenderEvent } from '../constant';
import { transPositionToArray, getPosition, createPointFeature, updateTargetFeature } from '../utils'
import type { BaseModeOptions, PointFeature, PositionArray, FeatureUpdater } from '../types';

export abstract class PointMode<
  T extends BaseModeOptions,
> extends BaseMode<T> {
  /**
   * 获取point类型对应的render
   * @protected
   */
  protected get pointRender(): PointRender | undefined {
    return this.render.point;
  }

  /**
   * 获取点数据
   */
  getPointData() {
    return [];
  }

  /**
   * 获取正在被拖拽的结点
   * @protected
   */
  protected get dragPoint() {
    return [];
    // return this.getPointData().find((feature) => feature.properties.isDrag);
  }

  /**
   * 当前高亮的结点
   * @protected
   */
  protected get editPoint() {
    return [];
    // return this.getPointData().find((feature) => {
    //   return feature.properties.isActive;
    // });
  }

  enablePointRenderAction() {
    const { editable } = this.options;

    if (this.enabled) {
      this.pointRender?.enableCreate();
    }
  }

  /**
   * 设置点数据
   * @param data
   */
  setPointData(data: FeatureUpdater<PointFeature>) {
    return this.source.setRenderData('point', data);
  }

  /**
   * 创建点Feature
   * @param position
   */
  handleCreatePoint(position: PositionArray) {
    const { autoActive, editable } = this.options;
    const newFeature = createPointFeature(position);
    this.setPointData((oldData) => {
      return updateTargetFeature<PointFeature>({
        target: newFeature,
        data: [...oldData, newFeature],
        targetHandler: (item) => {
          item.properties = {
            ...item.properties,
            isHover: editable,
            isActive: autoActive && editable,
          };
        },
        otherHandler: (item) => {
          item.properties = {
            ...item.properties,
            isHover: false,
            isActive: false,
            isDrag: false,
          };
        },
      })
    })
  }

  bindEnableEvent() {
    super.bindEnableEvent();
    this.enablePointRenderAction();
  }

  bindPointRenderEvent() {
    this.pointRender?.on(RenderEvent.UnClick, this.onPointCreate.bind(this));
  }

  onPointCreate(e: any) {
    return this.handleCreatePoint(transPositionToArray(getPosition(e)));
  }
}
