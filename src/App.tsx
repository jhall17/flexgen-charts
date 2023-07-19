import SampleChart from "./SampleChart";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "styled-components";
import { ThemeType, lightTheme } from "@flexgen/storybook";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <div style={{ height: "100vh", width: "100vw" }}>
    <ThemeProvider theme={lightTheme as ThemeType}>
      <SampleChart />
    </ThemeProvider>
  </div>
);
