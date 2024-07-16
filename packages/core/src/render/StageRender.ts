import Konva from 'konva'
import EventEmitter from 'eventemitter3';
import { RenderEvent } from '../constant';

export class StageRender extends EventEmitter<
RenderEvent | keyof typeof RenderEvent
> {
  /**
   * Stage 实例
   */
  protected stage: Konva.Stage;

  constructor(stage: Konva.Stage) {
    super();
    this.stage = stage;
  }
}
