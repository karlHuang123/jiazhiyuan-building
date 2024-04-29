import React, { Component } from "react";
import { Modal, Icon, Tooltip, Select, message } from "antd";
import { switchVehicleStatus } from "@/api/car";
import { getUsers } from "@/api/user";
import '../style/vehicle.less'

const vehicleStatusOptions = [
    {
        value: 0,
        label: '空闲中'
    },
    {
        value: 1,
        label: '使用中'
    },
    {
        value: 2,
        label: '保养中'
    }
]
const { Option } = Select;
class GeneralCarInfo extends Component {
  state = {
    changeStatusOpen: false,
    showVehicleDetails: false,
    currentVehicleInfo: null,
    users: []
  }
  confirmChange = () => {
    switchVehicleStatus({
        id: this.state.currentVehicleInfo.id,
        state: this.state.currentVehicleInfo.type
    }).then(res => {
        if (res && res.data.status === 'OK') {
            message.success("状态修改成功")
            this.props.onChangeStatus('success')
        } else {
            message.error('修改失败，请稍后再试')
        }
        this.setState({
            changeStatusOpen: false,
            showVehicleDetails: false,
            currentVehicleInfo: null,
        })
    })
  }
  onCancel = () => {
      this.setState({
        changeStatusOpen: false,
        showVehicleDetails: false,
        currentVehicleInfo: null,
      })
  }
  formatStatus = (status) => {
      let obj = {}
      switch (status) {
          case 0:
              obj.name = '空闲中'
              obj.style = 'free'
              break;
          case 1:
              obj.name = '使用中'
              obj.style = 'in-use'
              break;
          case 2:
              obj.name = '保养中'
              obj.style = 'maintain'
              break;
          default:
              break;
      }
      return obj
  }
  findUsers = (id) => {
    const temp = this.state.users.find(item => {
        return item.label === id
    })
    if (temp) return temp.value
    return ''
}
  openDetails = (vehicle) => {
      this.setState({
        currentVehicleInfo: vehicle,
        showVehicleDetails: true
      })
  }
  getUsers = async () => {
    const result = await getUsers()
    if (result.data.status === 'OK') {
      let temp = []
      result.data.data.list.forEach(item => {
        const ele = {
          label: item.id,
          value: item.username
        }
        temp.push(ele)
      })
      this.setState({
        users: temp
      })
    }
}
  openChangeStatus = (event, vehicle) => {
      event.stopPropagation()
      this.setState({
          currentVehicleInfo: vehicle,
          changeStatusOpen: true
      })
  }
  handleVehicleStatusChange = (value) => {
      let temp = {
          ...this.state.currentVehicleInfo
      }
      temp.type = value
      this.setState({
          currentVehicleInfo: temp
      })
  }
  matchDept = (deptId, list) => {
    const obj = list.find(item => {
        return item.id === deptId
    })
    if (obj) {
        return obj.label
    }
    return ''
  }
  componentDidMount() {
    this.getUsers()
  }
  render() {
    const {
        vehicleList,
        departmentMap
    } = this.props;
    return (
        <div className="container">
            <div className="vehicle-list">
                {vehicleList.map((item, index) => {
                    return (
                        <div key={index} className="vehicle-ele"
                            style={{background: item.carImages ? `url(${item.carImages})` : '#ccc', backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}}
                            onClick={this.openDetails.bind(null, item)}>
                            <div className="btn-box">
                                <Tooltip placement="top" title={'切换车辆状态'}>
                                    <Icon className="btn" type="sync" onClick={e => this.openChangeStatus(e, item)} />
                                </Tooltip>
                                <Tooltip placement="top" title={'实时位置'}>
                                    <Icon className="btn" type="share-alt" />
                                </Tooltip>
                            </div>
                            <div className="dept-container">{this.matchDept(item.departmentId, departmentMap)}</div>
                            <div className="vehicle-info">
                                <div className="vehicle-model">
                                    <span className="model sl1">{item.model}</span>
                                    <span className={this.formatStatus(item.state).style}>{this.formatStatus(item.state).name}</span>
                                </div>
                                <div className="dirver">{item.driverId && item.driverId !== 'null' ? this.findUsers(item.driverId) : '未固定'}</div>
                            </div>
                        </div>
                    )
                })}
            </div>
            <Modal
                title="切换车辆状态"
                destroyOnClose
                visible={this.state.changeStatusOpen}
                onCancel={this.onCancel}
                onOk={this.confirmChange}
            >
                <div className="mt-20">车牌号：{this.state.currentVehicleInfo ? this.state.currentVehicleInfo.licenseNo : ''}</div>
                <div className="mt-20">车辆型号：{this.state.currentVehicleInfo ? this.state.currentVehicleInfo.model : ''}</div>
                <div className="mt-20">车辆图片：{this.state.currentVehicleInfo ? this.state.currentVehicleInfo.carImages : ''}</div>
                <div className="mt-20">
                    <span>车辆状态：</span>
                    <Select
                        style={{
                            width: 250,
                        }}
                        allowClear
                        defaultValue={this.state.currentVehicleInfo ? this.state.currentVehicleInfo.state : undefined}
                        onChange={this.handleVehicleStatusChange}
                    >
                        {vehicleStatusOptions.map((item, index) => (
                            <Option value={item.value} key={index}>{item.label}</Option>
                        ))}
                    </Select>
                </div>
            </Modal>
            <Modal
                title="车辆详情"
                destroyOnClose
                visible={this.state.showVehicleDetails}
                onCancel={this.onCancel}
                width={'50%'}
                footer={[
                    <div key={'footer'}></div>
                ]}
            >
                <div className="info-container">
                    <div className="line">
                        <div>车牌号：{this.state.currentVehicleInfo ? this.state.currentVehicleInfo.licenseNo : ''}</div>
                        <div>所属片区：{this.state.currentVehicleInfo ? this.matchDept(this.state.currentVehicleInfo.departmentId, departmentMap) : ''}</div>
                    </div>
                    <div className="line">
                        <div>车辆型号：{this.state.currentVehicleInfo ? this.state.currentVehicleInfo.model : ''}</div>
                        <div>初始里程：{this.state.currentVehicleInfo ? this.state.currentVehicleInfo.initialMileage : ''}</div>
                    </div>
                    <div className="line">
                        <div className="vehicle-images">
                            <img src={this.state.currentVehicleInfo ? this.state.currentVehicleInfo.carImages : ''} alt="" />
                        </div>
                        <div>司机：{this.state.currentVehicleInfo ? (this.state.currentVehicleInfo.driverId ? this.state.currentVehicleInfo.driverId : '未固定') : ''}</div>
                    </div>
                    <div>今日车辆轨迹：</div>
                </div>
            </Modal>
        </div>
    );
  }
}

export default GeneralCarInfo
