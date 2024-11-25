import { Operator, operatorsMap } from './operator';

type Keys = keyof typeof operatorsMap;

export class EditorProxy {
  private operator?: Operator;
  private subOperators: Operator[] = [];

  setMainOperator(operator: Operator) {
    this.operator = operator;
    Object.keys(operatorsMap).forEach((k) => {
      if (k !== this.operator?.options?.shape) {
        const OperatorClass: any = operatorsMap[k as Keys];
        this.subOperators.push(
          new OperatorClass(this.operator?.canvas, [], this.operator?.operatorState, {
            ...this.operator?.options,
            subOperator: true,
            shape: k
          })
        );
      }
    });
    this.subOperators.forEach((op) => {
      if (this.operator) {
        op.activeShapeIndex = this.operator.activeShapeIndex;
        op.shapes = this.operator.shapes;
      }
    });
  }
  destroy() {
    if (this.operator) {
      this.operator.destroy();
    }
    this.subOperators.forEach((op) => {
      op.destroy();
    });
  }
}
