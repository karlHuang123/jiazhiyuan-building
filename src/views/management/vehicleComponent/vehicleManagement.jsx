import React, { Component } from "react";
import { Icon, Tooltip, Select, message, Popconfirm } from "antd";
import { getUsers } from "@/api/user";
import { editVehicle, addVehicle, deleteVehicle } from "@/api/car";
import AddVehicleForm from "./add-vehicle-form";
import EditVehicleForm from "./edit-vehicle-form";
import '../style/vehicle.less'

class VehicleManagement extends Component {
  state = {
    showVehicleDetails: false,
    showAddVehicle: false,
    currentVehicleInfo: null,
    users: [],
    currentRowData: {},
    vehicleImageName: ''
  }
  handleEditCancel = () => {
      this.setState({
        showVehicleDetails: false,
        currentVehicleInfo: null,
        vehicleImageName: ''
      })
      this.props.resetVehicleList('reset')
  }
  handleEditOk = () => {
    const { form } = this.editVehicleFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      console.log(values)
      const body = {
        id: values.id,
        licenseNo: values.licenseNo ? values.licenseNo : '', // 必填
        model: values.model ? values.model : '',
        departmentId: values.allDepartments && values.allDepartments.length > 0 ? parseInt(values.allDepartments[values.allDepartments.length - 1]) : '',
        allDepartments: values.allDepartments ? values.allDepartments : [],
        driverId:  values.driverId ? values.driverId.key : '',
        carImages: this.state.vehicleImageName ? [this.state.vehicleImageName] : [values.carImages[0].url],
        trackId: values.trackId ? values.trackId : '',
        initialMileage: values.initialMileage ? values.initialMileage : ''
      }
      editVehicle(body).then((response) => {
        form.resetFields();
        this.setState({ 
            showVehicleDetails: false,
            currentVehicleInfo: null,
            vehicleImageName: ''
         });
        message.success("编辑成功!")
        this.props.resetVehicleList('reset')
      }).catch(e => {
        message.success("编辑失败,请重试!")
      })
    });
  }
  handleAddOk = () => {
    const { form } = this.addVehicleFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const body = {
        licenseNo: values.licenseNo ? values.licenseNo : '', // 必填
        model: values.model ? values.model : '',
        departmentId: values.allDepartments && values.allDepartments.length > 0 ? parseInt(values.allDepartments[values.allDepartments.length - 1]) : '',
        allDepartments: values.allDepartments ? values.allDepartments : [],
        driverId:  values.driverId ? values.driverId.key : '',
        carImages: this.state.vehicleImageName ? [this.state.vehicleImageName] : [],
        trackId: values.trackId ? values.trackId : '',
        initialMileage: values.initialMileage ? values.initialMileage : ''
      }
      addVehicle(body).then((response) => {
        form.resetFields();
        this.setState({ 
            showVehicleDetails: false,
            currentVehicleInfo: null,
            vehicleImageName: ''
         });
         if (response.data.status === 'OK') {
            message.success("添加成功!")
         } else {
            message.error("添加失败,请重试!")
         }
        this.props.resetVehicleList('reset')
      }).catch(e => {
        message.error("添加失败,请重试!")
      })
    });
  }
  deleteVehicle = (id) => {
    deleteVehicle({id: id}).then(res => {
        if (res.status === 200 && res.data.status === 'OK') {
            message.success('删除成功')
            this.props.resetVehicleList('reset')
        } else {
            message.error("删除失败,请重试!")
        }
    })
  }
  handleUpdateVehicleImage = (value) => {
      this.setState({
        vehicleImageName: value
      })
  }
  handleRemoveImage = () => {
      this.setState({
        vehicleImageName: ''
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
  matchDept = (deptId, list) => {
    const obj = list.find(item => {
        return item.id === deptId
    })
    if (obj) {
        return obj.label
    }
    return '未固定'
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
  openEdit = (item) => {
      this.setState({
          currentRowData: item
      }, () => {
          this.setState({
            showVehicleDetails: true
          })
      })
  }
  componentDidMount() {
      this.getUsers()
  }
  render() {
    const {
        vehicleList,
        departmentMap,
        departmentList,
        showAddModal
    } = this.props;
    return (
        <div className="container">
            <div className="vehicle-list">
                {vehicleList.map((item, index) => {
                    return (
                        <div key={index} 
                            className="vehicle-ele" 
                            style={{background: item.carImages ? `url(${item.carImages})` : '#ccc', backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}}>
                            <div className="btn-box">
                                <Tooltip placement="top" title={'编辑'}>
                                    <Icon className="btn" type="edit" onClick={this.openEdit.bind(null, item)}/>
                                </Tooltip>
                                <Tooltip placement="top" title={'删除'}>
                                    <Popconfirm
                                        placement="top"
                                        title={'确定要删除该车辆吗？'}
                                        onConfirm={this.deleteVehicle.bind(null, item.id)}
                                        okText="是"
                                        cancelText="否"
                                    >
                                        <Icon style={{color: 'red'}} className="btn" type="delete" />
                                    </Popconfirm>
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
            <AddVehicleForm 
                wrappedComponentRef={formRef => this.addVehicleFormRef = formRef}
                visible={showAddModal}
                onCancel={this.handleEditCancel}
                onOk={this.handleAddOk}
                updateVehicleImage={this.handleUpdateVehicleImage}
                removeImage={this.handleRemoveImage}
                users={this.state.users}
                departmentList={departmentList}
            />
            <EditVehicleForm 
                wrappedComponentRef={formRef => this.editVehicleFormRef = formRef}
                visible={this.state.showVehicleDetails}
                onCancel={this.handleEditCancel}
                onOk={this.handleEditOk}
                updateVehicleImage={this.handleUpdateVehicleImage}
                removeImage={this.handleRemoveImage}
                users={this.state.users}
                departmentList={departmentList}
                currentRowData={this.state.currentRowData}
            />
        </div>
    );
  }
}

export default VehicleManagement
