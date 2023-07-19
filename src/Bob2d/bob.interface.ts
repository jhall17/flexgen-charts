import {
  SciChartSurface,
  TSciChart,
} from "scichart/Charting/Visuals/SciChartSurface";

export type DrawFunction = (
  surface: SciChartSurface,
  wasmContext: TSciChart
) => { surface: SciChartSurface; wasmContext: TSciChart };

export type BuildFunction = (...x: any[]) => DrawFunction;

// interface for Bob the (chart) Builder
export interface IBob {
  build: () => DrawFunction;
  bind: (...fns: DrawFunction[]) => IBob;
  update: () => IBob;
}
