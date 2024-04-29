import React, { Component } from "react";
import { Card, Button, Table, message, Divider, Input, Tooltip, Icon, Upload, Select, Popconfirm, Modal } from "antd";
import { getDevicesList, addDevice, editDevice, uploadDevices, deleteDevice } from "@/api/devices";
import AddDeviceForm from "./forms/add-device-form";
import EditDeviceForm from "./forms/edit-device-form";
import generalInfo from "../business/static/general";
import moment from "moment";
import './style/userManagement.less'
import '../business/style/clientInfo.less'
const axios = require('axios');
const { Column } = Table;
const { Option } = Select;
const inputLongStyle = {
  padding: '1px 10px',
  width: '250px'
}

class DeviceManagement extends Component {
  constructor(props) {
    super(props);
    this.uploadRef = React.createRef();
  }
  state = {
    devices: [],
    keyword: '',
    selectedDevices: [],
    getDevicesListBody: {
      currPage: 1,
      pageSize: 999,
      keyword: '',
      deviceType: null
    },
    showAddDeviceForm: false,
    showEditDeviceForm: false,
    currentRowData: null,
    openExport: false
  };
  renderConfirmContent = () => (
    <div>
      <p>导入文件？</p>
      <Button type="" size="small">
        <a href={`http://47.93.28.249:8181/admin/file/template/download?type=device`}>模版下载</a>
      </Button>
    </div>
  )
  getDevicesListFun = async () => {
    const result = await getDevicesList(this.state.getDevicesListBody)
    if (result.data.status === 'OK') {
      this.setState({
        devices: result.data.data.list
      })
    }
  }
  openEdit = (row) => {
    this.setState({
      currentRowData: row,
      showEditDeviceForm: true
    })
  }
  handleAddDevice = _ => {
    const { form } = this.addDeviceForm.props
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      let details = {}
      for(let i in values) {
        if (values[i] === undefined) {
          details[i] = ''
        } else {
          details[i] = values[i]
        }
      }
      details.deviceSystemType = values.deviceSystemType.key
      details.deviceType = values.deviceType.key
      details.deviceManufactureDate = moment(details.deviceManufactureDate).format('YYYY-MM-DD')
      details.deviceRecordDate = details.deviceRecordDate ? moment(details.deviceRecordDate).format('YYYY-MM-DD') : ''
      details.deviceRecordValidityPeriod = details.deviceRecordValidityPeriod ? moment(details.deviceRecordValidityPeriod).format('YYYY-MM-DD') : ''
      details.registrationValidityDate = details.registrationValidityDate ? moment(details.registrationValidityDate).format('YYYY-MM-DD') : ''
      details.acceptanceDate = details.acceptanceDate ? moment(details.acceptanceDate).format('YYYY-MM-DD') : ''
      details.registrationDate = details.registrationDate ? moment(details.registrationDate).format('YYYY-MM-DD') : ''
      const body = {...details}
      addDevice(body).then(res => {
        // console.log(res)
        if (res.data.status === 'OK') {
          message.success('添加成功')
          this.setState({
            showAddDeviceForm: false
          })
        } else {
          message.error(res.data.errorMsg)
        }
      })
    })
  }
  handleEditDevice = () => {
    const { form } = this.editDeviceForm.props
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      let details = {}
      for(let i in values) {
        if (values[i] === undefined) {
          details[i] = ''
        } else {
          details[i] = values[i]
        }
      }
      details.deviceSystemType = values.deviceSystemType.key
      details.deviceType = values.deviceType.key
      details.deviceManufactureDate = moment(details.deviceManufactureDate).format('YYYY-MM-DD')
      details.deviceRecordDate = details.deviceRecordDate ? moment(details.deviceRecordDate).format('YYYY-MM-DD') : ''
      details.deviceRecordValidityPeriod = details.deviceRecordValidityPeriod ? moment(details.deviceRecordValidityPeriod).format('YYYY-MM-DD') : ''
      details.registrationValidityDate = details.registrationValidityDate ? moment(details.registrationValidityDate).format('YYYY-MM-DD') : ''
      details.acceptanceDate = details.acceptanceDate ? moment(details.acceptanceDate).format('YYYY-MM-DD') : ''
      details.registrationDate = details.registrationDate ? moment(details.registrationDate).format('YYYY-MM-DD') : ''
      const body = {...details}
      editDevice(body).then(res => {
        // console.log(res)
        if (res.data.status === 'OK') {
          message.success('编辑成功')
          this.getDevicesListFun()
          this.setState({
            showEditDeviceForm: false
          })
        } else {
          message.error(res.data.errorMsg)
        }
      })
    })
  }

  deleteDeviceFun = (id) => {
    deleteDevice({ids: [id]}).then(res => {
      if (res.data.status === 'OK') {
        message.success('删除成功')
        this.getDevicesListFun()
      } else {
        message.error(res.data.errorMsg)
      }
    })
  }

  uploadVehicleFile = (data) => {
    let formData = new FormData()
    formData.append('type', 'FILE')
    formData.append('file', data.file)
    this.saveFile(formData, data)
  }
  saveFile = (formData, data) => {
    this.setState({
      uploading: true
    })
    axios.post('http://47.93.28.249:8181/admin/file/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
      if (response.data.status === 'OK') {
        data.onSuccess(response, data.file);
        message.success('上传成功')
        uploadDevices({file: response.data.data}).then(res => {
          console.log(res)
        })
        this.setState({
          uploading: false,
        })
      }
    })
  }
  confirmImport = () => {
    if (this.uploadRef.current) {
      this.uploadRef.current.click();
    }
  }
  handleDeviceChange = (value) => {
    let temp = this.state.getDevicesListBody
    temp.deviceType = value
    this.setState({
      getDevicesListBody: temp
    }, () => {
      this.getDevicesListFun()
    })
  }
  componentDidMount() {
    this.getDevicesListFun()
  }
  render() {
    const { devices, keyword } = this.state
    const title = (
      <div className="title flex">
        <div>
          <Input 
            style={inputLongStyle}
            value={keyword} 
            placeholder="请输入关键字"
            onChange={(e) => { this.setState({keyword: e.target.value}) }}
            prefix={<Icon style={{marginLeft: '4px'}} type="search" />}
            allowClear
            onPressEnter={
            (e) => {
              let body = this.state.getDevicesListBody
              body.keyword = e.target.value
              this.setState({
                getDevicesListBody: body
              })
              this.getDevicesListFun()
            }
          } />
          &nbsp;
          <Select
            style={{
              width: 250,
            }}
            placeholder="设备类型"
            allowClear
            value={this.state.getDevicesListBody.deviceType ? this.state.getDevicesListBody.deviceType : undefined}
            onChange={this.handleDeviceChange}
          >
            {generalInfo.deviceOptionsList.map((item, index) => (
              <Option value={item.value} key={index}>{item.label}</Option>
            ))}
          </Select>
          &nbsp;
          &nbsp;
        </div>
        &nbsp;
        &nbsp;
        <div className="right">
        <Popconfirm placement="top" 
          title={this.renderConfirmContent()} 
          onConfirm={this.confirmImport} 
          okText="确定" cancelText="取消">
            <Button type="">
              <Icon type="download"></Icon>&nbsp;导入
            </Button>
        </Popconfirm>
          &nbsp;
          &nbsp;
          <Button onClick={() => {
            this.setState({
              openExport: true
            })
          }}>
            <div className="bolder">
              <Icon type="upload"></Icon>&nbsp;
              导出
            </div>
          </Button>
          &nbsp;
          &nbsp;
          <Button type='primary' onClick={() => {this.setState({showAddDeviceForm: true})}}>
            <div className="bolder">
              <Icon type="plus"></Icon>&nbsp;
              添加
            </div>
          </Button>
          &nbsp;
          &nbsp;
          <Button type='primary'>
            <div className="bolder">
              <Icon type="reload"></Icon>&nbsp;
              重置
            </div>
          </Button>
          &nbsp;
          &nbsp;
          <Popconfirm
            placement="top"
            title={'确定要删除选中项吗？'}
            onConfirm={() => {
              deleteDevice({ids: this.state.selectedDevices}).then(res => {
                if (res.data.status === 'OK') {
                  message.success('删除成功')
                  this.getDevicesListFun()
                } else {
                  message.error(res.data.errorMsg)
                }
              })
            }}
            okText="是"
            cancelText="否"
          >
            <Button type='danger'>
              <div className="bolder">
                <Icon type="delete"></Icon>&nbsp;
                批量删除
              </div>
            </Button>
          </Popconfirm>
        </div>
        <Upload
            name={'file'}
            maxCount={1}
            multiple={false}
            customRequest={this.uploadVehicleFile}
            showUploadList={false}
            accept=".xlsx"
          >
            <input
              ref={this.uploadRef}
              style={{ display: 'none' }}
            />
          </Upload>
      </div>
    )
    return (
      <div className="app-container">
        <Card title={title}>
          <Table 
            bordered 
            rowKey="id" 
            dataSource={devices} 
            pagination={true}
            scroll={{x: 'max-content'}}
            rowSelection={{
                type: 'checkbox',
                onChange: (selectedRowKeys, selectedRows) => {
                  this.setState({
                    selectedDevices: selectedRows
                  })
                },
            }}>
            <Column title="设备类型" dataIndex="deviceTypeName" key="deviceTypeName" align="center"/>
            <Column title="设备体系类型" dataIndex="deviceSystemTypeName" key="deviceSystemType" align="center"/>
            <Column title="设备编号" width={125} dataIndex="deviceNumber" key="deviceNumber" align="center"/>
            <Column title="设备型号" dataIndex="deviceModel" key="deviceModel" align="center" />
            <Column title="设备出厂日期" key="deviceManufactureDate" dataIndex="deviceManufactureDate" align="center"/>
            <Column title="出厂编号" dataIndex="manufactureNumber" key="manufactureNumber" align="center" />
            <Column title="报废年限" key="scrapYearLimit" align="center" dataIndex="scrapYearLimit"/>
            <Column title="使用单位" dataIndex="userUnit" key="userUnit" align="center" />
            <Column title="工程起重机械生产单位" dataIndex="engineeringProductionUnit" key="engineeringProductionUnit" align="center" />
            <Column title="工程起重机械租赁单位" dataIndex="engineeringRentalUnit" key="engineeringRentalUnit" align="center" />
            <Column title="工程起重机械维保单位" dataIndex="engineeringMaintenanceUnit" key="engineeringMaintenanceUnit" align="center" />
            <Column title="工程起重机械安拆单位" dataIndex="engineeringDismantlingUnit" key="engineeringDismantlingUnit" align="center" />
            <Column title="工程起重机械设备备案登记证号" dataIndex="engineeringDeviceRecordNumber" key="engineeringDeviceRecordNumber" align="center" />
            <Column title="设备备案登记日期" key="deviceRecordDate" dataIndex="deviceRecordDate" align="center"/>
            <Column title="备案机构" dataIndex="recordOrganization" key="recordOrganization" align="center" />
            <Column title="设备备案登记有效期" key="deviceRecordValidityPeriod" dataIndex="deviceRecordValidityPeriod" align="center"/>
            <Column title="设备使用登记证号" dataIndex="deviceRegistrationNumber" key="deviceRegistrationNumber" align="center" />
            <Column title="使用登记日期" key="registrationDate" dataIndex="registrationDate" align="center"/>
            <Column title="使用登记机构" dataIndex="registrationOrganization" key="registrationOrganization" align="center" />
            <Column title="使用登记有效期截止日期" key="registrationValidityDate" dataIndex="registrationValidityDate" align="center"/>
            <Column title="初装高度" dataIndex="initialHeight" key="initialHeight" align="center" />
            <Column title="最大安装高度" dataIndex="maxInstallationHeight" key="maxInstallationHeight" align="center" />
            <Column title="最终安装高度" dataIndex="finalInstallationHeight" key="finalInstallationHeight" align="center" />
            <Column title="验收日期" key="acceptanceDate" align="center" dataIndex="acceptanceDate"/>
            <Column title="安拆人员证件号" dataIndex="dismantlingPersonnelId" key="dismantlingPersonnelId" align="center" />
            <Column title="操作" key="action" width={155} fixed="right" align="center" render={(text, row) => (
              <span>
                <Tooltip placement="top" title={'编辑'}>
                  <Button onClick={this.openEdit.bind(null, row)} type="primary" shape="circle" icon="edit" title="编辑"/>
                </Tooltip>
                <Divider type="vertical" />
                <Tooltip placement="top" title={'删除'}>
                  <Popconfirm
                    placement="topLeft"
                    title={'确定要删除吗？'}
                    onConfirm={this.deleteDeviceFun.bind(null, row.id)}
                    okText="是"
                    cancelText="否"
                  >
                    <Button type="primary" shape="circle" icon="delete" title="删除"/>
                  </Popconfirm>
                </Tooltip>
              </span>
            )}/>
          </Table>
        </Card>
        <AddDeviceForm
          visible={this.state.showAddDeviceForm}
          wrappedComponentRef={formRef => this.addDeviceForm = formRef}
          onOk={this.handleAddDevice}
          onCancel={() => {
            this.setState({
              showAddDeviceForm: false
            })
          }}
          deviceTypeList={generalInfo.deviceOptionsList} 
         />
         <EditDeviceForm
            visible={this.state.showEditDeviceForm}
            wrappedComponentRef={formRef => this.editDeviceForm = formRef}
            onOk={this.handleEditDevice}
            onCancel={() => {
              this.setState({
                showEditDeviceForm: false
              })
            }}
            deviceTypeList={generalInfo.deviceOptionsList} 
            currentRowData={this.state.currentRowData}
          />
          <Modal
            title="导出列表"
            visible={this.state.openExport}
            destroyOnClose
            footer={[<div className="text-right" key={'footer'}>
              <Button title="取消" onClick={() => {
                this.setState({
                  openExport: false,
                })
              }}>取消</Button>
              <Button type="primary" title="确定" onClick={() => {
                this.setState({
                  openExport: false
                })
              }}>
                <a 
                  href={`http://47.93.28.249:8181/admin/device/export?keyword=${this.state.searchKeyword}&deviceType=${this.state.getDevicesListBody.deviceType}`}>确定</a>
              </Button>
            </div>]}
            onCancel={() => {
              this.setState({
                openExport: false
              })
            }}>
              是否继续导出设备列表？
          </Modal>
      </div>
    );
  }
}

export default DeviceManagement;
