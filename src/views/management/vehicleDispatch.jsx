import React, { Component } from "react";
import { Card, Button, Cascader, DatePicker, Input, Modal } from "antd";
import { getCarList, getCarStat, getCarListByDate } from "@/api/car";
import { getDepartmentList } from "@/api/department";
import moment from 'moment'
import VehicleGeneralInfo from "./vehicleComponent/general"
import VehicleManagement from "./vehicleComponent/vehicleManagement";
import G2BarChart from "./vehicleComponent/g2LineChart";
import './style/vehicle.less'

const { RangePicker } = DatePicker;
class VehicleDispatch extends Component {
  state = {
    vehicleStatus: {
      todayInUseCount: 0,
      total: 0,
      freeCount: 0,
      maintainCount: 0,
    },
    currentDate: moment(),
    currentDeptId: null,
    departmentList: [],
    departmentMap: [],
    licenseNo: '',
    vehicleList: [],
    isGeneral: true,
    addModalOpen: false,
    showStastical: false,
    startDate: moment().startOf('months'),
    endDate: moment().endOf('months'),
    chartData: {
      dateList: [],
      totalVehicleList: [],
      useVehicleList: []
    }
  };

  getCarListFun = (data) => {
    getCarList(data).then(res => {
      if (res.data.status === 'OK') {
        this.setState({
          vehicleList: res.data.data.list
        })
      }
    })
  }

  getDepartmentList = async () => {
    const result = await getDepartmentList()
    if (result.data.status === 'OK') {
      this.setState({
        departmentList: this.formatList(result.data.data),
        departmentMap: this.formatDept(result.data.data)
      })
    }
  }

  formatList = (list) => { // 格式化数据
    let temp = []
    list.map(item => {
      let obj = {
        ...item
      }
      obj.key = item.id;
      obj.children = item.children ? this.formatList(item.children) : null;
      temp.push(obj)
    })
    return temp
  } 

  formatDept = (list) => {
    let temp = []
    list.map(item => {
        let obj = {
            label: item.label,
            id: item.id
        }
        if (item.children) {
          temp = temp.concat(this.formatDept(item.children))
        }
        temp.push(obj)
    })
    return temp
}

getCarStatFun = () => {
  getCarStat().then(res => {
    if (res && res.status === 200) {
      this.setState({
        vehicleStatus: res.data.data
      })
    }
  })
}

getCarListByDateFun = () => {
  getCarListByDate({startDate: this.state.startDate.format('YYYY-MM-DD'), endDate: this.state.endDate.format('YYYY-MM-DD')}).then(res => {
    if (res.status === 200 && res.data && res.data.status === 'OK') {
      let dateList = [], totalVehicleList = [], useVehicleList = []
      res.data.data.forEach(item => {
        dateList.push(item.date)
        totalVehicleList.push(item.totalCount)
        useVehicleList.push(item.useCount)
      })
      this.setState({
        chartData: {
          dateList: dateList,
          totalVehicleList: totalVehicleList,
          useVehicleList: useVehicleList
        }
      })
    }
  })
}
  
  onDateChange = (date, dateString) => {
    if (!date) {
      this.setState({
        currentDate: null
      })
      this.getCarListFun({
        departmentId: this.state.currentDeptId,
        licenseNo: this.state.licenseNo,
        day: null
      })
    }
  }
  prevDay = () => {
    const prevDay = moment(this.state.currentDate ? this.state.currentDate : moment()).subtract(1,'days')
    this.setState({
      currentDate: prevDay
    }, () => {
      this.searchList()
    })
  }
  prevMonth = () => {
    this.setState({
      startDate: moment(this.state.startDate).subtract(1, 'months').startOf('month'),
      endDate: moment(this.state.endDate).subtract(1, 'months').endOf('month')
    }, () => {
      this.getCarListByDateFun()
    })
  }
  nextMonth = () => {
    this.setState({
      startDate: moment(this.state.startDate).subtract(-1, 'months').startOf('month'),
      endDate: moment(this.state.endDate).subtract(-1, 'months').endOf('month')
    }, () => {
      this.getCarListByDateFun()
    })
  }
  nextDay = () => {
    const nextDay = moment(this.state.currentDate ? this.state.currentDate : moment()).add(1,'days')
    this.setState({
      currentDate: nextDay
    }, () => {
      this.searchList()
    })
  }
  currentMonth = () => {
    this.setState({
      startDate: moment().startOf('month'),
      endDate: moment().endOf('month')
    }, () => {
      this.getCarListByDateFun()
    })
  }
  today = () => {
    const today = moment()
    this.setState({
      currentDate: today
    }, () => {
      this.searchList()
    })
  }
  handleDeptChange = (value) => {
    if (value.length > 0) {
      this.setState({
        currentDeptId: value[value.length - 1]
      }, () => {
        this.searchList()
      })
    } else {
      this.setState({
        currentDeptId: null
      }, () => {
        this.searchList()
      })
    }
  }
  searchList = () => {
    this.getCarListFun({
      departmentId: this.state.currentDeptId,
      licenseNo: this.state.licenseNo,
      day: this.state.currentDate ? moment(this.state.currentDate).format('yyyy-MM-DD') : null
    })
  }
  haneleStatusChange = (value) => {
    if (value === 'success') {
      this.searchList()
    }
  }
  handleResetVehicleList = (value) => {
    this.getCarListFun({
      departmentId: null,
      licenseNo: null,
      day: null
    })
    this.setState({
      addModalOpen: false
    })
  }
  switchBoard = (anchor) => {
    this.setState({
      isGeneral: anchor,
      currentDate: moment(),
      currentDeptId: null,
      licenseNo: '',
    })
  }
  rangeDateChange = (value, dateString) => {
    console.log(dateString)
  }
  componentDidMount() {
    this.getCarListFun({
      departmentId: null,
      licenseNo: null,
      day: null
    })
    this.getCarStatFun()
    this.getDepartmentList()
    this.getCarListByDateFun()
  }
  render() {
    const { vehicleStatus } = this.state
    const title = (
      <div className="title flex">
        <div className="info">
          <span className="info-ele">今日用车：{vehicleStatus.todayInUseCount}台</span>
          <span className="info-ele">车辆总数：{vehicleStatus.total}台</span>
          <span className="info-ele">空闲车辆：{vehicleStatus.freeCount}台</span>
          <span className="info-ele">保养车辆：{vehicleStatus.maintainCount}台</span>
        </div>
        &nbsp;
        &nbsp;
        <div className="right">
          <Button type='primary' onClick={() => this.setState({showStastical: true})}>
            <div className="bolder">
              车辆统计
            </div>
          </Button>     
        </div>
      </div>
    )
    const toolBar = (
      <div className="tool-section flex">
        <div className="flex">
          <div className="btn-group">
          <Button type='primary' className="mr-10" onClick={this.prevDay}>
            <div className="bolder">
              前一天
            </div>
          </Button>  
          <Button type='primary' className="mr-10" onClick={this.today}>
            <div className="bolder">
              今天
            </div>
          </Button>  
          <Button type='primary' className="mr-10" onClick={this.nextDay}>
            <div className="bolder">
              后一天
            </div>
          </Button>    
          </div>
          <DatePicker className="mr-10" showToday value={this.state.currentDate ? moment(this.state.currentDate) : null} onChange={this.onDateChange} />
          <div className="mr-10">
            <Cascader
              options={this.state.departmentList ? this.state.departmentList : []}
              expandTrigger="hover"
              onChange={this.handleDeptChange} />
          </div>
          <div>
            <Input 
              placeholder="请输入车牌号" 
              allowClear
              onPressEnter={this.searchList}
              onChange={(e) => {
                this.setState({
                  licenseNo: e.target.value
                })
              }} />
          </div>
        </div>
        <div className="right">
          <Button type='primary' onClick={this.switchBoard.bind(null, false)}>
            <div className="bolder">
              车辆管理
            </div>
          </Button>   
        </div>
      </div>
    )
    const managementToolBar = (
      <div className="tool-section flex">
        <div className="flex">
          <div className="mr-10">
            <Cascader
              options={this.state.departmentList ? this.state.departmentList : []}
              expandTrigger="hover"
              onChange={this.handleDeptChange} />
          </div>
          <div>
            <Input 
              placeholder="请输入车牌号" 
              onPressEnter={this.searchList}
              allowClear
              onChange={(e) => {
                this.setState({
                  licenseNo: e.target.value
                })
              }} />
          </div>
        </div>
        <div className="right">
          <Button className="mr-10">
            <div className="bolder" onClick={this.switchBoard.bind(null, true)}>
              返回
            </div>
          </Button>   
          <Button type='primary' onClick={() => {
            this.setState({
              addModalOpen: true
            })
          }}>
            <div className="bolder" >
              添加
            </div>
          </Button>   
        </div>
      </div>
    )
    const generalInfo = (
      <VehicleGeneralInfo
        departmentMap={this.state.departmentMap}
        vehicleList={this.state.vehicleList}
        onChangeStatus={this.haneleStatusChange} />
    )
    const vehicleManagement = (
      <VehicleManagement
        departmentMap={this.state.departmentMap}
        departmentList={this.state.departmentList}
        showAddModal={this.state.addModalOpen}
        resetVehicleList={this.handleResetVehicleList}
        vehicleList={this.state.vehicleList}/>
    )
    return (
      <div className="app-container">
        <Card title={title}>
          {this.state.isGeneral ? toolBar : managementToolBar}
          <div className="main-container">
            {this.state.isGeneral ? generalInfo : vehicleManagement}
          </div>
          <Modal
            title="车辆统计"
            destroyOnClose
            visible={this.state.showStastical}
            onCancel={() => {this.setState({showStastical: false})}}
            width={'50%'}
            footer={[
                <div key={'footer'}></div>
            ]}
          >
            <div className="flex">
              <div className="btn-group">
                <Button type='primary' className="mr-10" onClick={this.prevMonth}>
                  <div className="bolder">
                    上月
                  </div>
                </Button>  
                <Button type='primary' className="mr-10" onClick={this.currentMonth}>
                  <div className="bolder">
                    本月
                  </div>
                </Button>  
                <Button type='primary' className="mr-10" onClick={this.nextMonth}>
                  <div className="bolder">
                    下月
                  </div>
                </Button>    
              </div>
              <RangePicker
                value={[this.state.startDate, this.state.endDate]}
                onChange={this.rangeDateChange}/>
            </div>
            <G2BarChart chartData={this.state.chartData} />
          </Modal>
        </Card>
      </div>
    );
  }
}

export default VehicleDispatch;
