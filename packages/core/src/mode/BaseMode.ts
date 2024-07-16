import EventEmitter from 'eventemitter3';
import Konva from 'konva';
import { merge, debounce, cloneDeep } from 'lodash-es';
import {
  DrawEvent,
  RENDER_MAP,
  StageEvent,
  RenderEvent,
  DEFAULT_CURSOR_MAP,
  DEFAULT_HISTORY_CONFIG,
  DEFAULT_STYLE,
} from '../constant'
import { StageRender } from '../render';
import { Cursor } from '../interactive'
import { Source } from '../source';
import type {
  BaseModeOptions,
  DeepPartial,
  RenderType,
  RenderMap,
  Position,
  CursorType
} from '../types'

export abstract class BaseMode<
  O extends BaseModeOptions = BaseModeOptions,
> extends EventEmitter<DrawEvent | keyof typeof DrawEvent> {
  public static instances: BaseMode[] = [];

  /**
   * Stage 实例
   */
  protected stage: Konva.Stage;

  /**
   * 数据管理中心
   */
  protected source: Source;

  /**
   * stage 相关事件管理
   * @protected
   */
  protected stageRender: StageRender;

  /**
   * 渲染器render对象
   */
  protected render: RenderMap;

  /**
   * 指针管理器
   * @protected
   */
  protected cursor: Cursor;

  /**
   * 光标在画布上的位置信息
   * @protected
   */
  protected mousePosition: Position = {
    x: 0,
    y: 0,
  };

  /**
   * Drawer 配置
   */
  protected options: O;

  /**
   * 当前Drawer是否为开启绘制状态
   */
  protected enabled = false;

  // 在 enable 时传入，用于判断当前是否支持添加操作
  protected allowCreate = false;

  /**
   * 本次enable添加的绘制物个数
   * @protected
   */
  protected addCount = 0;

  constructor(stage: Konva.Stage, options: DeepPartial<O>) {
    super();
    this.bindThis();

    this.stage = stage;
    this.stageRender = new StageRender(stage);
    this.options = merge({}, this.getDefaultOptions(options), options);
    this.render = this.initRender();

    this.source = new Source({
      render: this.render,
      history: this.options.history || undefined,
      stage,
    });
    this.cursor = new Cursor(stage, this.options.cursor);

    this.bindCommonEvent();
    this.bindEnableEvent();

    BaseMode.instances.push(this);
  }

  /**
   * 获取当前 Drawer 需要用到的 render 类型数据，避免创建无效的 Render
   */
  abstract getRenderTypes(): RenderType[];

  /**
   * 获取当前Drawer默认参数
   * @param options
   */
  abstract getDefaultOptions(options: DeepPartial<O>): O;

  getCommonOptions(options: DeepPartial<BaseModeOptions>): BaseModeOptions {
    return {
      autoActive: true,
      editable: true,
      multiple: true,
      maxCount: -1,
      style: cloneDeep(DEFAULT_STYLE),
      history: cloneDeep(DEFAULT_HISTORY_CONFIG),
      cursor: cloneDeep(DEFAULT_CURSOR_MAP),
    };
  }

  initRender(): RenderMap {
    const renderMap: RenderMap = {};
    const renderTypeList = this.getRenderTypes();

    for (const renderType of renderTypeList) {
      const Render = RENDER_MAP[renderType];
      // @ts-ignore
      const style = this.options.style[renderType];
      // @ts-ignore
      renderMap[renderType] = new Render(this.stage, {
        style,
      });
    }

    return renderMap;
  }

  saveMouseLngLat = debounce(
    (e) => {
      this.mousePosition = {
        x: e.evt.layerX,
        y: e.evt.layerY,
      };
    },
    100,
    {
      maxWait: 100,
    },
  );

  /**
   * 监听通用事件
   */
  bindEnableEvent() {
    this.stage.on<'mousemove'>(StageEvent.Mousemove, this.saveMouseLngLat);
  }

  unbindEnableEvent() {
    this.stage.off(StageEvent.Mousemove, this.saveMouseLngLat);
  }

  /**
   * 设置地图上光标样式类型
   * @param cursor
   */
  setCursor(cursor: CursorType | null) {
    this.cursor.setCursor(cursor);
  }

  /**
   * 重置光标到常规状态
   */
  resetCursor() {
    this.setCursor('draw');
  }

  /**
   * 启用 Drawer
   * @param allowCreate 是否支持添加操作
   */
  enable(allowCreate = true) {
    this.allowCreate = allowCreate;
    this.addCount = 0;
    this.enabled = true;
    this.bindEnableEvent();
    this.resetCursor();
  }

  /**
   * 获取当前是否为编辑态
   */
  isEnable() {
    return this.enabled;
  }

  bindThis() {
    this.initRender = this.initRender.bind(this);
    this.bindCommonEvent = this.bindCommonEvent.bind(this);
    this.bindEnableEvent = this.bindEnableEvent.bind(this);
    this.unbindEnableEvent = this.unbindEnableEvent.bind(this);
  }

  bindCommonEvent() {
    this.on(DrawEvent.Add, (e) => { console.log(e) });
    this.on(DrawEvent.Add, () => {
      this.addCount++;
    });
  }

  destroy() {
    Object.values(RenderEvent).forEach((EventName) => {
      this.stageRender.removeAllListeners(EventName);
    })
  }
}
