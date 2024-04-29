import React, { useEffect, useRef } from 'react';
import echarts from 'echarts';

const LineChart = ({ data }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);

    // 提取横坐标和纵坐标数据
    const xAxisData = data.map(item => item.planName);
    const yAxisData = data.map(item => Number(item.score)); // 将score转换为数字类型
    console.log(data)

    // 配置Echarts的选项
    const options = {
      xAxis: {
        type: 'category',
        data: xAxisData
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          type: 'line',
          data: yAxisData
        }
      ]
    };

    chart.setOption(options);

    // 在组件销毁时销毁图表实例
    return () => {
      chart.dispose();
    };
  }, [data]);

  return <div ref={chartRef} style={{ width: '100%', height: '400px' }} />;
};

export default LineChart;