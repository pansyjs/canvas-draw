import { BaseMode } from './BaseMode';
import { PointRender } from '../render';
import { RenderEvent } from '../constant';
import { transPositionToArray, getPosition, createPointFeature, updateTargetFeature, isSameFeature } from '../utils'
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
    return this.source.getRenderData<PointFeature>('point');
  }

  /**
   * 获取正在被拖拽的结点
   * @protected
   */
  protected get dragPoint() {
    return this.getPointData().find((feature) => feature.properties.isDrag);
  }

  /**
   * 当前高亮的结点
   * @protected
   */
  protected get editPoint() {
    return this.getPointData().find((feature) => {
      return feature.properties.isActive;
    });
  }

  /**
   * 当前悬停的结点
   * @protected
   */
  protected get hoverPoint() {
    return this.getPointData().find((feature) => {
      return feature.properties.isHover;
    });
  }

  enablePointRenderAction() {
    const { editable } = this.options;

    if (this.enabled) {
      this.pointRender?.enableCreate();
    }

    this.pointRender?.enableClick();

    if (editable) {
      this.pointRender?.enableHover();
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

  handlePointHover(point: PointFeature) {
    this.setCursor('pointHover');

    if (!isSameFeature(point, this.hoverPoint)) {
      this.setPointData((features) => {
        return updateTargetFeature<PointFeature>({
          target: point,
          data: features,
          targetHandler: (item) => {
            item.properties.isHover = true;
          },
          otherHandler: (item) => {
            item.properties.isHover = false;
          },
        });
      });
    }

    return point;
  }

  handlePointUnHover(point: PointFeature) {
    this.resetCursor();

    this.setPointData((features) =>
      features.map((feature) => {
        feature.properties.isHover = false;
        return feature;
      }),
    );

    return point;
  }


  bindEnableEvent() {
    super.bindEnableEvent();
    this.enablePointRenderAction();
  }

  bindPointRenderEvent() {
    this.pointRender?.on(RenderEvent.UnClick, this.onPointCreate.bind(this));
    this.pointRender?.on(
      RenderEvent.Mousemove,
      this.onPointMouseMove.bind(this),
    );
    this.pointRender?.on(RenderEvent.Mouseout, this.onPointMouseOut.bind(this));
  }
  /**
   * 创建点回调
   */
  onPointCreate(e: any) {
    return this.handleCreatePoint(transPositionToArray(getPosition(e)));
  }

  onPointMouseMove(e: any) {
    const point = e.target.attrs.feature;

    return this.handlePointHover(point);
  }

  onPointMouseOut(e: any) {
    const point = e.target.attrs.feature;

    return this.handlePointUnHover(point);
  }
}
