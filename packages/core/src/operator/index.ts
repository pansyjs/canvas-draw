import { CircleEditor } from './circle-editor';
import { PolygonEditor } from './polygon-editor';
import { RegularEditor } from './regular-editor';

export { Operator } from './base';
export * from './circle-editor';
export { CircleEditor } from './circle-editor';
export * from './polygon-editor';
export * from './regular-editor';
export { Selecter } from './selecter';

export const operatorsMap = {
  rectangle: RegularEditor,
  polygon: PolygonEditor,
  circle: CircleEditor
};
