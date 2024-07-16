import Konva from 'konva'
import { isArray } from '@rcuse/shared'
import { EventEmitter } from 'eventemitter3';
import { RenderEvent } from '../constant';
import type { BaseStyle, BaseFeature, RenderOptions } from '../types';

export abstract class LayerRender<
  F extends BaseFeature = BaseFeature,
  S extends BaseStyle = BaseStyle
> extends EventEmitter<RenderEvent | keyof typeof RenderEvent> {
  /**
   * Stage 实例
   */
  protected stage: Konva.Stage;

  /**
   * 样式配置
   */
  protected style: S;

  /**
   * 当前展示的数据
   */
  protected data: F[] = [];

  /**
   * 样式配置
   */
  // protected style: S;

  /**
   * 图层列表
   */
  protected layers: Konva.Layer[];

  constructor(stage: Konva.Stage, { style }: RenderOptions<S>) {
    super();

    this.stage = stage;
    this.style = style;
    this.layers = this.initLayers();

    this.layers.forEach((layer) => {
      stage.add(layer);
    });
  }

  abstract initLayers(): Konva.Layer[];

  getLayers() {
    return this.layers;
  }

  /**
   * 显示所有图层
   */
  show() {
    this.layers.forEach((layer) => {
      layer.show();
    });
  }

  /**
   * 隐藏所有图层
   */
  hide() {
    this.layers.forEach((layer) => {
      layer.hide();
    });
  }

  /**
   * 设置数据
   * @param features 设置对应的Feature数组
   */
  abstract setData(features: F[]): void;
}
