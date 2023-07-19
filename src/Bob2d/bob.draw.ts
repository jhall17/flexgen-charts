import { DrawFunction } from "./bob.interface";
import {
  AnnotationType,
  AxisDirection,
  AxisType,
  ZoomPanModifierType,
} from "./bob2d.enums";
import { AnnotationMap, AxisMap, ZoomPanModifierMap } from "./bob2d.maps";
import {
  AnnotationOptions,
  AxisOptions,
  ZoomPanModifierOptions,
  withContextCb,
} from "./bob2d.types";
import {
  IXyDataSeriesOptions,
  IFastLineRenderableSeriesOptions,
  XyDataSeries,
  FastLineRenderableSeries,
  RolloverModifier,
  IRolloverModifierOptions,
  CursorModifier,
  ICursorModifierOptions,
  LegendModifier,
  ILegendModifierOptions,
  SciChartOverview,
} from "scichart";

export const withContext = (fn: withContextCb): DrawFunction => {
  return (surface, wasmContext) => {
    fn({ surface, wasmContext }).forEach((buildFn) =>
      buildFn(surface, wasmContext)
    );
    return { surface, wasmContext };
  };
};

export const addAxis = (
  direction: AxisDirection,
  valueType: AxisType,
  options: AxisOptions = {}
): DrawFunction => {
  return (surface, wasmContext) => {
    const newAxis = new AxisMap[valueType](wasmContext, options);
    direction === AxisDirection.X
      ? surface.xAxes.add(newAxis)
      : surface.yAxes.add(newAxis);

    return { surface, wasmContext };
  };
};

export const addLine = (
  dataOptions: IXyDataSeriesOptions,
  line: IFastLineRenderableSeriesOptions = {}
): DrawFunction => {
  // check each line for 'containsNan', 'dataEvenlySpacedInX', 'dataIsSortedInX',
  // warn if not present
  !("containsNaN" in dataOptions) &&
    console.warn(
      `${
        dataOptions.dataSeriesName ?? "Data"
      }: Help this chart perform faster, add 'containsNaN' to the data options!`
    );
  !("dataEvenlySpacedInX" in dataOptions) &&
    console.warn(
      `${
        dataOptions.dataSeriesName ?? "Data"
      }: Help this chart perform faster, add 'dataEvenlySpacedInX' to the data options!`
    );
  !("dataIsSortedInX" in dataOptions) &&
    console.warn(
      `${
        dataOptions.dataSeriesName ?? "Data"
      }: Help this chart perform faster, add 'dataIsSortedInX' to the data options!`
    );

  return (surface, wasmContext) => {
    const dataSeries = new XyDataSeries(wasmContext, dataOptions);
    const lineSeries = new FastLineRenderableSeries(wasmContext, {
      dataSeries,
      ...line,
    });
    surface.renderableSeries.add(lineSeries);
    return { surface, wasmContext };
  };
};

export const addAnnotation = (
  annotationType: AnnotationType,
  options: AnnotationOptions = {}
): DrawFunction => {
  return (surface, wasmContext) => {
    surface.annotations.add(new AnnotationMap[annotationType](options));
    return { surface, wasmContext };
  };
};

export const addZoomPanModifier = (
  modifierType: ZoomPanModifierType,
  options: ZoomPanModifierOptions = {}
): DrawFunction => {
  return (surface, wasmContext) => {
    surface.chartModifiers.add(new ZoomPanModifierMap[modifierType](options));
    return { surface, wasmContext };
  };
};

export const addRolloverModifier = (
  options: IRolloverModifierOptions = {}
): DrawFunction => {
  return (surface, wasmContext) => {
    surface.chartModifiers.add(new RolloverModifier(options));
    return { surface, wasmContext };
  };
};

export const addCursorModifier = (
  options: ICursorModifierOptions = {}
): DrawFunction => {
  return (surface, wasmContext) => {
    surface.chartModifiers.add(new CursorModifier(options));
    return { surface, wasmContext };
  };
};

export const addLegendModifier = (
  options: ILegendModifierOptions = {}
): DrawFunction => {
  return (surface, wasmContext) => {
    surface.chartModifiers.add(new LegendModifier(options));
    return { surface, wasmContext };
  };
};

export const addOverview = (ref: HTMLDivElement): DrawFunction => {
  return (surface, wasmContext) => {
    SciChartOverview.create(surface, ref).then((res) =>
      res.overviewSciChartSurface.applyTheme(surface.themeProvider)
    );
    return { surface, wasmContext };
  };
};
