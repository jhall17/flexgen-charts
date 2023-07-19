"use client";
import {
  BaseChart,
  Bob2d,
  AxisDirection,
  AxisType,
  DrawFunction,
  ZoomPanModifierType,
  addAxis,
  addLine,
  withContext,
  addZoomPanModifier,
  addRolloverModifier,
  addLegendModifier,
  addOverview,
} from "./";
import {
  AUTO_COLOR,
  ELegendPlacement,
  IXyDataSeriesOptions,
  NumberRange,
  SciChartSurface,
  TSciChart,
  EllipsePointMarker,
} from "scichart";
import { useEffect, useRef, useState } from "react";
import { uid } from "uid";

const rawData = {
  x: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  lines: {
    "Line 1": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    "Line 2": [10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
    "Line 3": [4, 2, 7, 3, 3, 7, 4, 2, 0, 3],
    "Line 4": [2, 4, 6, 8, 10, 8, 6, 4, 2, 0],
  },
};

const SampleChart = () => {
  const [draw, setDraw] = useState<DrawFunction>(
    () => (surface: SciChartSurface, wasmContext: TSciChart) => ({
      surface,
      wasmContext,
    })
  );
  const overviewRef = useRef<HTMLDivElement>(null);

  const dataSeries: IXyDataSeriesOptions[] = Object.entries(rawData.lines).map(
    ([name, yVals]) => ({
      xValues: rawData.x,
      yValues: yVals,
      dataSeriesName: name,
      dataIsSortedInX: true,
      dataEvenlySpacedInX: true,
      containsNaN: false,
    })
  );

  useEffect(() => {
    const newBob = Bob2d.new().bind(
      addAxis(AxisDirection.X, AxisType.Numeric, {
        visibleRange: new NumberRange(0, 10),
        visibleRangeLimit: new NumberRange(-2, 12),
        axisTitle: "X",
        drawMajorGridLines: false,
      }),
      addAxis(AxisDirection.Y, AxisType.Numeric, {
        visibleRangeLimit: new NumberRange(-2, 12),
        visibleRange: new NumberRange(0, 10),
      }),
      withContext(({ wasmContext }) => [
        ...dataSeries.map((individualSeries) =>
          addLine(individualSeries, {
            stroke: AUTO_COLOR,
            strokeThickness: 4,
            pointMarker: new EllipsePointMarker(wasmContext, {
              fill: AUTO_COLOR,
              height: 10,
              width: 10,
            }),
          })
        ),
      ]),
      addZoomPanModifier(ZoomPanModifierType.MouseWheelZoomPan),
      addZoomPanModifier(ZoomPanModifierType.ZoomPan),
      addRolloverModifier(),
      addLegendModifier({
        showCheckboxes: true,
        showSeriesMarkers: true,
        showLegend: true,
        placement: ELegendPlacement.TopRight,
      }),
      addOverview(overviewRef.current!)
    );

    const firstDraw = newBob.build();

    setDraw(() => firstDraw);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
      }}
    >
      <BaseChart
        divStyle={{ height: "90%" }}
        draw={draw}
        surfaceOptions={{ title: "Test Chart" }}
      />
      {/* I don't know why but we need any arbitrary ID for overview to render */}
      <div ref={overviewRef} style={{ height: "10%" }} id={uid()} />
    </div>
  );
};

export default SampleChart;
