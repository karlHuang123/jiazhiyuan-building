import React, { Component } from "react";
import { Form, Input, Modal, DatePicker, Select, Button } from "antd";
import { getUsers } from "@/api/user";
import moment from "moment";
const { Option } = Select

class EditProjectTask extends Component {
  state = {
      currentTaskData: null,
      users: [],
      useCarInfosNeo: [
          {
            car_id: '',
            driver_id: '',
            id: 0
          }
      ]
  }
  getUsersFun = async () => {
    const result = await getUsers()
    if (result.data.status === 'OK') {
      let temp = []
      result.data.data.list.forEach(item => {
        const ele = {
            label: item.name,
            value: parseInt(item.id)
        }
        temp.push(ele)
      })
      this.setState({
        users: temp
      })
    }
  }
  handleCheckDateChange = (date, dateString) => {
      let tempObj = this.state.currentTaskData
      tempObj.checkDate = moment(date).format('YYYY-MM-DD')
      this.setState({
          currentTaskData: tempObj
      })
  }
  handleCarChange = (key, e) => {
      let temp = this.state.useCarInfosNeo
      temp[key].car_id = e
      this.setState({
          useCarInfosNeo: temp
      })
  }
  handleDriverChange = (key, e) => {
    let temp = this.state.useCarInfosNeo
    temp[key].driver_id = e
    this.setState({
        useCarInfosNeo: temp
    })
}
  handleAssemblePlaceChange = (key, e) => {
    let tempObj = this.state.currentTaskData
    if (key === 'groupMembersNeo' || key === 'groupLeadersNeo') {
        tempObj[key] = e
    } else {
        tempObj[key] = e.target.value
    }
    this.setState({
        currentTaskData: tempObj
    })
  }
  addCar = () => {
    let temp = this.state.useCarInfosNeo
    temp.push({
        car_id: '',
        driver_id: '',
        id: temp.length
    })
    this.setState({
        useCarInfosNeo: temp
    })
  }
  deleteCar = (id) => {
      const temp = this.state.useCarInfosNeo.filter(item => {
          return item.id !== id
      })
      this.setState({
        useCarInfosNeo: temp
    })
  }
  componentDidUpdate(prevProps) {
      if (this.props.currentTaskData && this.props.currentTaskData.projectId !== prevProps?.currentTaskData?.projectId) {
          let temp = this.props.currentTaskData
          temp.groupLeadersNeo = []
          temp.groupMembersNeo = []
          temp.groupLeaders.forEach(item => {
              const ele = parseInt(item.id)
              temp.groupLeadersNeo.push(ele)
          })
          temp.groupMembers.forEach(item => {
            const ele = parseInt(item.id)
            temp.groupMembersNeo.push(ele)
        })
          this.setState({
            currentTaskData: temp
        })
        if (this.props.currentTaskData.useCarInfos.length > 0) {
            let temp = []
            this.props.currentTaskData.useCarInfos.forEach((item, index) => {
                const ele = {
                    driver_id: item.driverId ? item.driverId : '',
                    car_id: item.id,
                    id: index
                }
                temp.push(ele)
            })
            this.setState({
                useCarInfosNeo: temp
            })
        }
        this.getUsersFun()
      }
  }
  render() {
    const { visible, projectName, onCancel, vehicleList } = this.props;
    return (
        <Modal
            title={projectName}
            visible={visible}
            onCancel={onCancel}
            title={projectName}
            destroyOnClose
            onOk={() => {
                let temp = JSON.parse(JSON.stringify(this.state.currentTaskData))
                temp.useCarInfos = this.state.useCarInfosNeo
                temp.useCarInfos.forEach(item => {
                    delete item.id
                })
                this.props.onSubmit(temp)
            }}>
            <div className="mb-30">
                <strong>检查时间：</strong><DatePicker value={this.state.currentTaskData ? moment(this.state.currentTaskData.checkDate, 'YYYY-MM-DD') : null} onChange={this.handleCheckDateChange} />
            </div>
            <div className="mb-30">
                <strong>集合地点：</strong><Input value={this.state.currentTaskData ? this.state.currentTaskData.assemblePlace : ''} onChange={this.handleAssemblePlaceChange.bind(null, 'assemblePlace')} />
            </div>
            <div className="mb-30" style={{width: '80%'}}>
                <strong>组长：</strong>
                <br />
                <Select
                    style={{width: '100%'}}
                    allowClear
                    mode="multiple"
                    maxTagCount={5}
                    value={this.state.currentTaskData ? this.state.currentTaskData.groupLeadersNeo : []}
                    onChange={this.handleAssemblePlaceChange.bind(null, 'groupLeadersNeo')}
                >
                    {this.state.users.map((item, index) => (
                        <Option value={item.value} key={index}>{item.label}</Option>
                    ))}
                </Select>
            </div>
            <div className="mb-30" style={{width: '80%'}}>
                <strong>组员：</strong>
                <br />
                <Select
                    style={{width: '100%'}}
                    allowClear
                    mode="multiple"
                    maxTagCount={5}
                    value={this.state.currentTaskData ? this.state.currentTaskData.groupMembersNeo : []}
                    onChange={this.handleAssemblePlaceChange.bind(null, 'groupMembersNeo')}
                >
                    {this.state.users.map((item, index) => (
                        <Option value={item.value} key={index}>{item.label}</Option>
                    ))}
                </Select>
            </div>
            <div className="car-list">
                {this.state.useCarInfosNeo.map((item, indexC) => (
                    <div key={indexC} className="mb-30">
                        <div className="flex mb-10 align-center">
                            <div style={{width: '45px'}}>车辆：</div>
                            <Select
                                style={{width: '60%'}}
                                allowClear
                                value={item.car_id}
                                onChange={this.handleCarChange.bind(null, item.id)}
                            >
                                {vehicleList.map((item, index) => (
                                    <Option value={item.value} key={index}>{item.label}</Option>
                                ))}
                            </Select>
                            {indexC === 0 ? (
                                <Button style={{marginLeft: '10px'}} type="primary" onClick={this.addCar}>添加车辆</Button>
                            ) : (
                                <Button style={{marginLeft: '10px'}} type="danger" onClick={this.deleteCar.bind(null, item.id)}>删除</Button>
                            )}
                        </div>
                        <div className="flex align-center">
                            <div style={{width: '45px'}}>司机：</div>
                            <Select
                                style={{width: '60%'}}
                                allowClear
                                value={item.driver_id}
                                onChange={this.handleDriverChange.bind(null, item.id)}
                            >
                                {this.state.users.map((item, index) => (
                                    <Option value={item.value} key={index}>{item.label}</Option>
                                ))}
                            </Select>
                        </div>
                    </div>
                ))}
            </div>
        </Modal>
    );
  }
}

export default EditProjectTask;
