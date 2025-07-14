import type { DrawProps } from './types';
import { EditorProxy, Operator, operatorsMap, OperatorState, Selecter } from '@canvas-draw/core';
import React from 'react';

const defaultShapeStyle = {
  fillStyle: 'rgba(255, 77, 82, 0.15)',
  strokeStyle: '#FF4D52',
  lineWidth: 2,
  circleRadius: 5,
};

// 编辑态默认样式
const defaultShapeStyle2 = {
  fillStyle: 'rgba(255, 255, 255, 0.15)',
  strokeStyle: '#FFFFFF',
  lineWidth: 2,
  circleRadius: 5,
};

const defaultActiveShapeStyle = {
  fillStyle: 'rgba(255, 161, 46, 0.15)',
  strokeStyle: '#FFA12E',
  lineWidth: 2,
  circleRadius: 5,
};

export function useDraw(props: DrawProps) {
  const ref = React.useRef<HTMLCanvasElement>(null);
  const editor = props?.mode === 'edit';
  const shapeStyle = { ...(editor ? defaultShapeStyle : defaultShapeStyle2), ...props.shapeStyle };
  const activeShapeStyle = {
    ...(editor ? defaultActiveShapeStyle : defaultShapeStyle),
    ...props.activeShapeStyle,
  };
  const axis = props.axis!;
  const {
    width,
    height,
    minPoint,
    maxPoint,
    editableMaxSize,
    value = [],
    onChange,
    selectedIndex = -1,
    onSelect,
    mode,
    shape = 'polygon',
  } = props;
  const operator = React.useRef<Operator>();
  const proxy = React.useRef<EditorProxy>();

  React.useEffect(() => {
    if (ref.current) {
      const canvas = ref.current;
      // 初始化画布
      function getOption() {
        if (mode === 'default') {
          return Operator;
        }
        else if (mode === 'select') {
          return Selecter;
        }
        else if (mode === 'edit') {
          return operatorsMap[shape];
        }
        return null;
      }
      const Op = getOption();
      if (Op) {
        const state = new OperatorState();
        operator.current = new Op(canvas, value, state, {
          shapeStyle,
          mode: props.mode!,
          activeShapeStyle,
          axis,
          width,
          height,
          minPoint: minPoint!,
          maxPoint: maxPoint!,
          editableMaxSize: editableMaxSize!,
          selectedIndex,
          shape,
          onSelect,
        }).on(onChange);
        if (mode === 'edit') {
          proxy.current = new EditorProxy();
          proxy.current.setMainOperator(operator.current);
        }
      }
    }
    return () => {
      operator.current?.destroy();
      proxy.current?.destroy();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, width, height, shape]);

  React.useEffect(() => {
    operator?.current?.updateShapes(value);
  }, [value]);

  React.useEffect(() => {
    if (selectedIndex !== operator?.current?.activeShapeIndex) {
      operator?.current?.select(selectedIndex);
    }
  }, [selectedIndex]);

  return { ref };
}
