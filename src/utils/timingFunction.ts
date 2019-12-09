import { easeExpOut, easeExpInOut, easeCircleInOut } from "d3-ease";

const f1 = easeExpOut;
const f2 = easeExpInOut;
const f3 = easeCircleInOut;

const breakpointX1 = 0.3;
const breakpointX2 = 0.5;
const breakpointY1 = 0.3;

const timingFunction = (n: number) => {
  // f1: (x: [0, bx1)) => y: [0, 1);
  if (n < breakpointX1) {
    const x = n * (1 / breakpointX1);
    return f1(x);
  }

  // f2: (x: [bx1, bx2)) => y: [1, by1);
  if (n < breakpointX2) {
    const x = (n - breakpointX1) * (1 / (breakpointX2 - breakpointX1));
    const y = f2(1 - x) * (1 - breakpointY1) + breakpointY1;

    return y;
  }

  // f3: (x: [bx2, 1)) => y: [by1, 0);
  const x = (n - breakpointX2) * (1 / (1 - breakpointX2));
  const y = f3(1 - x) * breakpointY1;

  return y;
};

export default timingFunction;
