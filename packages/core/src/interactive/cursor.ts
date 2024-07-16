import Konva from 'konva';
import type { CursorMap, CursorType } from '../types';

export class Cursor {
  container: HTMLDivElement | null;
  cursor: CursorType | null = null;
  options: CursorMap;

  constructor(stage: Konva.Stage, options: CursorMap) {
    this.container = stage.getContent() as HTMLDivElement | null;
    this.options = options;
  }

  setCursor(cursor: CursorType | null) {
    if (cursor !== this.cursor && this.container) {
      this.container.style.cursor = cursor ? this.options[cursor] : '';
      this.cursor = cursor;
    }
  }

  destroy() {
    this.setCursor(null);
  }
}
