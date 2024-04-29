import React, { Component } from "react";
import { connect } from "react-redux";
import echarts from "@/lib/echarts";
import { debounce } from "@/utils";


class MixChart extends Component {
  state = {
    chart: null,
  };

  componentDidMount() {
    debounce(this.initChart.bind(this), 300)();
    window.addEventListener("resize", () => this.resize());
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.sidebarCollapsed !== this.props.sidebarCollapsed) {
      this.resize();
    }
  }

  componentWillUnmount() {
    this.dispose();
  }

  resize() {
    const chart = this.state.chart;
    if (chart) {
      debounce(chart.resize.bind(this), 300)();
    }
  }

  dispose() {
    if (!this.state.chart) {
      return;
    }
    window.removeEventListener("resize", () => this.resize()); // 移除窗口，变化时重置图表
    this.setState({ chart: null });
  }

  setOptions() {
    const {
        chartData
    } = this.props;
    console.log(chartData)
    this.state.chart.setOption({
    //   backgroundColor: "#344b58",
      title: {
        x: "20",
        top: "20",
        textStyle: {
          color: "#fff",
          fontSize: "22",
        },
        subtextStyle: {
          color: "#90979c",
          fontSize: "16",
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          textStyle: {
            color: "#fff",
          },
        },
      },
      grid: {
        left: "5%",
        right: "5%",
        borderWidth: 0,
        top: 150,
        bottom: 95,
        textStyle: {
          color: "#fff",
        },
      },
      legend: {
        x: "5%",
        top: "10%",
        textStyle: {
          color: "#90979c",
        },
        data: ["female", "male", "average"],
      },
      calculable: true,
      xAxis: [
        {
          type: "category",
          axisLine: {
            lineStyle: {
              color: "#90979c",
            },
          },
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          splitArea: {
            show: false,
          },
          axisLabel: {
            interval: 0,
          },
          data: chartData.dateList,
        },
      ],
      yAxis: [
        {
          type: "value",
          splitLine: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: "#90979c",
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            interval: 0,
          },
          splitArea: {
            show: false,
          },
        },
      ],
      series: [
        {
          name: "总数",
          type: "bar",
          barGap: "10%",
          itemStyle: {
            normal: {
              color: "rgba(255,144,128,1)",
              label: {
                show: true,
                textStyle: {
                  color: "#fff",
                },
                position: "insideTop",
                formatter(p) {
                  return p.value > 0 ? p.value : "";
                },
              },
            },
          },
          data: chartData.totalVehicleList
        },

        {
          name: "使用数量",
          type: "bar",
          itemStyle: {
            normal: {
              color: "rgba(0,191,183,1)",
              barBorderRadius: 0,
              label: {
                show: true,
                position: "insideTop",
                formatter(p) {
                  return p.value > 0 ? p.value : "";
                },
              },
            },
          },
          data: chartData.useVehicleList,
        },
      ],
    });
  }

  initChart() {
    if (!this.el) return;
    this.setState({ chart: echarts.init(this.el, "macarons") }, () => {
      this.setOptions();
    });
  }
  render() {
    return (
      <div
        style={{ width: "100%", height: "calc(50vh - 100px)" }}
        className="app-container"
      >
        <div
          style={{ width: "100%", height: "100%" }}
          ref={(el) => (this.el = el)}
        ></div>
      </div>
    );
  }
}

export default connect((state) => state.app)(MixChart);
