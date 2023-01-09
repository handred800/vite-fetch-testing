import * as echarts from 'echarts/core';
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components';
import { BarChart, } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  BarChart,
  CanvasRenderer,
])

const usePie = ($el) => {
  const pieChart = echarts.init($el)

  const setDataset = data => {
    const option = {
      title: {
        text: '哆啦A夢人氣角色',
        subtext: '人氣角色統計',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      xAxis: {
        type: 'value'
      },
      yAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: data
    }
    return pieChart.setOption(option)
  }

  // 封裝resize，RWD會使用到
  const resize = () => pieChart.resize()

  return { setDataset, resize }
}

export default usePie