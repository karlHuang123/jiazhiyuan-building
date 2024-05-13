import React, { Component } from "react";
import { Form, Input, Modal, DatePicker, Select, Button } from "antd";
import { getUsers } from "@/api/user";
import moment from "moment";
const { Option } = Select

class EditProjectReview extends Component {
  state = {
      currentTaskReview: null,
      users: [],
      useCarInfosNeo: [
          {
            car_id: '',
            driver_id: '',
            id: 0
          }
      ],
      problems: [
          {label: '无隐患', value: '无隐患'},
          {label: '四级隐患', value: '四级隐患'},
          {label: '三级隐患', value: '三级隐患'},
          {label: '二级隐患', value: '二级隐患'},
          {label: '一级隐患', value: '一级隐患'}
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
      let tempObj = this.state.currentTaskReview
      tempObj.reviewDate = moment(date).format('YYYY-MM-DD')
      this.setState({
          currentTaskReview: tempObj
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
    let tempObj = this.state.currentTaskReview
    console.log(tempObj)
    if (key === 'groupMembersNeo' || key === 'groupLeadersNeo' || key === 'reviewProblems') {
        tempObj[key] = e
    } else {
        tempObj[key] = e.target.value
    }
    this.setState({
        currentTaskReview: tempObj
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
      if (this.props.currentTaskReview && this.props.currentTaskReview.projectId !== prevProps?.currentTaskReview?.projectId) {
          let temp = this.props.currentTaskReview
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
            currentTaskReview: temp
        })
        if (this.props.currentTaskReview.useCarInfos.length > 0) {
            let temp = []
            this.props.currentTaskReview.useCarInfos.forEach((item, index) => {
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
    const { visible, projectName, onCancel, vehicleList, currentTaskReview } = this.props;
    return (
        <Modal
            visible={visible}
            onCancel={onCancel}
            title={projectName}
            width={'40%'}
            destroyOnClose
            onOk={() => {
                let temp = JSON.parse(JSON.stringify(this.state.currentTaskReview))
                temp.useCarInfos = this.state.useCarInfosNeo
                temp.useCarInfos.forEach(item => {
                    delete item.id
                })
                this.props.onSubmit(temp)
            }}>
            <div className="mb-30">
                <strong>检查时间：</strong><DatePicker value={this.state.currentTaskReview && this.state.currentTaskReview.reviewDate ? moment(this.state.currentTaskReview.reviewDate, 'YYYY-MM-DD') : null} onChange={this.handleCheckDateChange} />
            </div>
            <div className="mb-30">
                <strong>集合地点：</strong><Input value={this.state.currentTaskReview ? this.state.currentTaskReview.assemblePlace : ''} onChange={this.handleAssemblePlaceChange.bind(null, 'assemblePlace')} />
            </div>
            <div className="mb-30">
                <strong>复查问题：</strong>
                <br />
                <Select
                    style={{width: '100%'}}
                    allowClear
                    mode="multiple"
                    maxTagCount={5}
                    value={this.state.currentTaskReview ? this.state.currentTaskReview.reviewProblems : []}
                    onChange={this.handleAssemblePlaceChange.bind(null, 'reviewProblems')}
                >
                    {this.state.problems.map((item, index) => (
                        <Option value={item.value} key={index}>{item.label}</Option>
                    ))}
                </Select>
            </div>
            <div className="mb-30" style={{width: '80%'}}>
                <strong>组长：</strong>
                <br />
                <Select
                    style={{width: '100%'}}
                    allowClear
                    mode="multiple"
                    maxTagCount={5}
                    value={this.state.currentTaskReview ? this.state.currentTaskReview.groupLeadersNeo : []}
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
                    value={this.state.currentTaskReview ? this.state.currentTaskReview.groupMembersNeo : []}
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

export default EditProjectReview;
