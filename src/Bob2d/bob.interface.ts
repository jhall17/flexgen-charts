import { DrawFunction } from ".";

// interface for Bob the (chart) Builder
export interface IBob {
  build: () => DrawFunction;
  bind: (...fns: DrawFunction[]) => IBob;
  update: () => IBob;
}
