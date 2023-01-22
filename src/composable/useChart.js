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
import { thousandFormat } from "../helper/utils";

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
      formatter: (data) => {
        return `<b>${data[0].value[0]}:</b> ${thousandFormat(data[0].value[1])}`
      },
    },
    dataZoom: [
      { type: "inside", xAxisIndex: 0 },
      {
        type: "slider",
        xAxisIndex: 0,
      },
    ],
    // toolbox: {
    //   show: true,
    //   feature: {
    //     restore: { show: true },
    //     saveAsImage: { show: true },
    //   },
    // },
    // grid: { containLabel: true },
    xAxis: { type: "category" },
    yAxis: { name: "value" },
    series: [
      {
        type: "line",
        symbolSize: 20,
        showAllSymbol: true,
        selectedMode: 'single',
        color: '#117e96',
        label: {
          show: true,
          formatter: ({value}) => {
            return thousandFormat(value[1])
          }
        },
        select: {
          itemStyle: {
            color: '#117e96',
          }
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

