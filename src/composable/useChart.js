import * as echarts from "echarts/core";
import {
  ToolboxComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
  DatasetComponent,
  VisualMapComponent,
} from "echarts/components";
import { BarChart, LineChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { unref, watchEffect } from "vue";

echarts.use([
  ToolboxComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DatasetComponent,
  DataZoomComponent,
  VisualMapComponent,
  BarChart,
  LineChart,
  CanvasRenderer,
]);

export const useBar = ($el, bindDataset, range) => {
  const chart = echarts.init(unref($el));

  let option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    // toolbox: {
    //   show: true,
    //   feature: {
    //     restore: { show: true },
    //     saveAsImage: { show: true },
    //   },
    // },
    // grid: { containLabel: true },
    xAxis: { name: "amount" },
    yAxis: { type: "category", show: false },
    dataZoom: [
      { type: "inside", yAxisIndex: 0 },
      {
        type: "slider",
        yAxisIndex: 0,
        start: 0,
        end: 30,
      },
    ],
    visualMap: {
      orient: "horizontal",
      left: "center",
      text: ["High", "Low"],
      dimension: 1,
      inRange: {
        color: ["#65B581", "#FFCE34", "#FD665F"],
      },
    },
    series: [
      {
        type: "bar",
        markLine: {
          data: [{ type: "average", name: "Avg", valueDim: 0 }],
        },
        label: {
          position: 'right',
          show: false
        },
        encode: {
          x: 1, // X axis.
          y: 0, // Y axis
        },
      },
    ],
  };

  // 刷新 function
  function setDataset() {
    option.dataset = { source: unref(bindDataset) };
    option.visualMap.min = unref(range)[0];
    option.visualMap.max = unref(range)[1];
    chart.setOption(option);
  }

  // 封裝resize
  const resize = () => chart.resize();

  //監聽資料 刷新圖表
  watchEffect(setDataset);
  return { resize };
};


export const useLine = ($el, bindDataset) => {
  const chart = echarts.init(unref($el));

  let option = {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    // toolbox: {
    //   show: true,
    //   feature: {
    //     restore: { show: true },
    //     saveAsImage: { show: true },
    //   },
    // },
    // grid: { containLabel: true },
    xAxis: { type: "category", triggerEvent: true },
    yAxis: { name: "value" },
    series: [
      {
        type: "line",
        symbolSize: 20,
        selectedMode: 'single',
        select: {
          itemStyle: {
            color: '#000',
            borderColor: '#000'
          }
        },
        markLine: {
          data: [{ type: "average", name: "Avg", valueDim: 0 }],
        },
      },
    ],
  };

  // 刷新 function
  function setDataset() {
    option.dataset = { source: unref(bindDataset) };
    chart.setOption(option);
  }

  // 封裝resize
  const resize = () => chart.resize();
  

  //監聽資料 刷新圖表
  watchEffect(setDataset);
  return { chart, resize };
};

