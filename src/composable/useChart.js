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
  CalendarComponent,
  MarkLineComponent,
} from "echarts/components";
import { BarChart, LineChart, PieChart, HeatmapChart, ScatterChart } from "echarts/charts";
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
  CalendarComponent,
  MarkLineComponent,
  BarChart,
  LineChart,
  PieChart,
  HeatmapChart,
  ScatterChart,
  CanvasRenderer,
]);

const colorPalette = ['#117e96', '#06d6a0', '#99d98c', '#ef476f', '#ffd166', '#0079FF'];

export const useBar = ($el, bindDataset, range) => {
  const chart = echarts.init(unref($el));

  let option = {
    toolbox: {
      feature: {
        saveAsImage: {
          // name: '下載圖片',
          title: '下載圖片',
        }
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
    },
    xAxis: { type: "category", show: false, triggerEvent: true },
    yAxis: { name: "value", triggerEvent: true },
    dataZoom: [
      { 
        type: "inside",
        xAxisIndex: 0,
        filterMode: 'none'
      },
      {
        type: "slider",
        xAxisIndex: 0,
      },
    ],
    series: [
      {
        type: "bar",
        color: '#117e96',
        selectedMode: 'single',
        label: {
          position: 'right',
          show: false
        },
        select: {
          itemStyle: {
            color: '#F44336',
            borderColor: '#F44336',
          }
        },
        encode: {
          x: 0, // X axis.
          y: 1, // Y axis
        },
        markLine: {
          symbol: ['none', 'none'],
          precision: 0,
          animationEasing: 'quarticOut',
          emphasis: {
            disabled: true
          },
          data: [
            { 
              type: "average",
              name: '平均值',
              lineStyle: {
                type: 'solid',
                color: '#F44336',
                width: 2,
              },
              label: {
                borderWidth: 1,
                padding: 5,
                color: '#fff',
                backgroundColor: '#F44336',
                lineHeight: 16,
                shadowColor: 'rgba(0,0,0,.15)',
                shadowBlur: 10,
                formatter: (e) => (`${e.name}\n${e.value}`),
              },
            }
          ],
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
          formatter: ({ value }) => {
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

export const usePie = ($el, bindDataset) => {
  const chart = echarts.init(unref($el));

  const option = {
    tooltip: {
      formatter: (data) => {
        console.log(data);
        return `<b>${data.value[0]}:</b> ${thousandFormat(data.value[1])}`
      },
    },
    legend: {
      orient: 'vertical',
      bottom: 'bottom'
    },
    series: [
      {
        type: 'pie',
        radius: '65%',
        color: colorPalette,
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1
        },
        label: {
          lineHeight: 20,
          fontSize: 16,
          alignTo: 'labelLine',
          formatter: ({ value, percent }) => {
            return `【${value[0]}】\n${percent}%`
          }
        }
      }
    ]
  }

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
}

export const useCalendarMap = ($el, bindDataset, range, time) => {
  const chart = echarts.init(unref($el));
  const option = {
    visualMap: {
      show: false,
      type: 'piecewise',
      orient: 'horizontal',
      left: 'center',
      inRange: {
        color: ["#65B581", "#FFCE34", "#F44336"],
      },
    },
    tooltip: {
      formatter: (res) => {
        const { data, marker } = res;
        return `<b>${data[0]}</b><br>
                ${marker}${thousandFormat(data[1])}`
      },
    },
    calendar: {
      left: 30,
      right: 20,
      cellSize: ['auto', 20],
      yearLabel: { show: false }
    },
    series: [
      {
        type: 'heatmap',
        coordinateSystem: 'calendar',
      },
    ],
  }

  // 刷新 function
  function setDataset() {
    option.dataset = { source: unref(bindDataset) };
    option.visualMap.min = unref(range)[0];
    option.visualMap.max = unref(range)[1];
    option.calendar.range = unref(time);
    chart.setOption(option);
  }

  // 封裝resize
  const resize = () => chart.resize();

  //監聽資料 刷新圖表
  watchEffect(setDataset);
  return { chart, resize };
}

