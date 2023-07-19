import { SciChartSurface, TSciChart } from "scichart";
import { DrawFunction, IBob } from "./bob.interface";
import { SciChartCtx } from "./bob2d.types";

// implementation of Bob the (chart) Builder
class Bob2d implements IBob {
  private draw: DrawFunction[] = [];
  private drawPointer: number = -1;
  private surfaceCtx?: SciChartCtx;

  // creates a new bob, "new Bob2d()" should not be called directly by consumer
  public static new(): Bob2d {
    return new Bob2d();
  }

  // creates a draw function that can be passed to BaseChart to render the
  // chart Bob has built
  public build(): DrawFunction {
    return (surface: SciChartSurface, wasmContext: TSciChart) => {
      this.drawPointer = -1;
      this.surfaceCtx = { surface, wasmContext };
      return this.draw.reduce(
        (acc, buildFunction, curIndex) => {
          this.drawPointer = curIndex;
          if (acc.surface === undefined) {
            console.warn("Bob2d: failed to draw, surface is undefined");
            return { surface, wasmContext };
          }
          return buildFunction(acc.surface, acc.wasmContext);
        },
        { surface, wasmContext }
      );
    };
  }

  public bind(...fns: DrawFunction[]): Bob2d {
    fns.forEach((fn) => {
      this.draw.push(fn);
    });

    return this;
  }

  // if the chart has been built previously and is already on the page,
  // calling update() instead of build() will apply changes directly to your
  // current chart without rerender
  public update(): Bob2d {
    if (this.surfaceCtx === undefined) {
      console.warn(
        "Bob2d: surfaceCtx is undefined, was update called before build?"
      );
      return this;
    }
    if (this.draw.length <= this.drawPointer + 1) {
      console.warn(
        "Bob2d: drawPointer already at end of array - did you add more functions since the last update?"
      );
      return this;
    }
    this.draw.forEach((buildFunction, curIndex) => {
      if (curIndex <= this.drawPointer) {
        return;
      }

      this.drawPointer = curIndex;

      this.surfaceCtx &&
        buildFunction(this.surfaceCtx.surface, this.surfaceCtx.wasmContext);
      return;
    });
    return this;
  }
}

export default Bob2d;
