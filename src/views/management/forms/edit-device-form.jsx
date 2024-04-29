import React, { Component } from "react";
import { Form, Input, Modal, Select, DatePicker } from "antd";
import { getDeviceSystemTypeList, getDeviceQueryList } from '@/api/projects'
import moment from "moment";
import '../style/userManagement.less'
const { Option } = Select;
const handleChange = (value) => {
  console.log(value);
}
class AddDeviceForm extends Component {
  state = {
    deviceSystemTypeList: [],
    deviceQueryList: [],
    deviceType: '',
    deviceSystemType: '',
  }
  getDeviceSystemTypeList = async (deviceType) => { // 获取设备体系列表
    const result = await getDeviceSystemTypeList(deviceType)
    if (result.data.status === 'OK') {
      let temp = []
      result.data.data.forEach(item => {
          const ele = {
              value: item.code,
              label: item.name
          }
          temp.push(ele)
      })
      console.log(result.data)
      this.setState({
        deviceSystemTypeList: temp
      })
    }
  }
  componentWillReceiveProps(nextProps) {
    if (!this.state.deviceType && nextProps.currentRowData) {
      this.getDeviceSystemTypeList(nextProps.currentRowData.deviceType)
      this.setState({
        deviceType: nextProps.currentRowData.deviceType
      })
    }
  }
  render() {
    const { visible, onCancel, onOk, form, deviceTypeList, currentRowData } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        title="添加设备"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        width={'60%'}
        destroyOnClose
      >
        <Form            
          labelCol={{ style: { width: '100%', height: '30px' } }}
          labelAlign="left">
          <div className="grid grid-1-1-1">
          <Form.Item label="项目名称:" style={{height: '100%'}}>
                {getFieldDecorator("id", {
                    initialValue: currentRowData ? currentRowData.id : '',
                })(<Input/>)}
            </Form.Item>
            <Form.Item label="设备类型:">
                {getFieldDecorator("deviceType", {
                    initialValue: currentRowData ? {key: currentRowData.deviceType, label: currentRowData.deviceType} : null,
                    rules: [{ required: true, message: "请选择设备类型" }]
                })(
                <Select
                    style={{width: '80%'}}
                    allowClear
                    labelInValue
                    onChange={(value) => {
                      this.getDeviceSystemTypeList(value.key)
                      this.props.form.resetFields();
                      this.setState({
                        deviceType: value.key
                      })
                    }}
                >
                    {deviceTypeList.map((item, index) => (
                        <Option value={item.value} key={item.value}>{item.label}</Option>
                    ))}
                </Select>
                )}
            </Form.Item>
            <Form.Item label="设备体系类型:">
                {getFieldDecorator("deviceSystemType", {
                    initialValue: currentRowData ? {key: currentRowData.deviceSystemType, label: currentRowData.deviceSystemType} : null,
                    rules: [{ required: true, message: "请选择设备体系类型" }]
                })(
                <Select
                    style={{width: '80%'}}
                    allowClear
                    labelInValue
                    onChange={handleChange}
                >
                    {this.state.deviceSystemTypeList.map((item, index) => (
                        <Option value={item.value} key={item.value}>{item.label}</Option>
                    ))}
                </Select>
                )}
            </Form.Item>
            <Form.Item label="设备型号:">
                {getFieldDecorator("deviceModel", {
                    initialValue: currentRowData ? currentRowData.deviceModel : ''
                })(<Input style={{width: '80%'}} placeholder="请输入设备型号" />)}
            </Form.Item>
            <Form.Item label="设备编号:">
                {getFieldDecorator("deviceNumber", {
                    rules: [{ required: true, message: "请输入设备编号" }],
                    initialValue: currentRowData ? currentRowData.deviceNumber : ''
                })(<Input style={{width: '80%'}} placeholder="请输入设备编号" />)}
            </Form.Item>
            <Form.Item label="设备出厂日期:">
              {getFieldDecorator("deviceManufactureDate", {
                  rules: [{ required: true, message: "请选择出厂日期" }],
                  initialValue: currentRowData && currentRowData.deviceManufactureDate ? moment(currentRowData.deviceManufactureDate) : null,
              })(<DatePicker style={{width: '80%'}} format={'YYYY/MM/DD'} />)}
            </Form.Item>
            <Form.Item label="出厂编号:">
                {getFieldDecorator("manufactureNumber", {
                    rules: [{ required: true, message: "请输入出厂编号" }],
                    initialValue: currentRowData ? currentRowData.manufactureNumber : ''
                })(<Input style={{width: '80%'}} placeholder="请输入出厂编号" />)}
            </Form.Item>
            <Form.Item label="报废年限:">
                {getFieldDecorator("scrapYearLimit", {
                    initialValue: currentRowData ? currentRowData.scrapYearLimit : ''
                })(<Input style={{width: '80%'}} placeholder="请输入报废年限" />)}
            </Form.Item>
            <Form.Item label="使用单位:">
                {getFieldDecorator("userUnit", {
                    initialValue: currentRowData ? currentRowData.userUnit : ''
                })(<Input style={{width: '80%'}} placeholder="请输入使用单位" />)}
            </Form.Item>
            <Form.Item label="工程起重机械生产单位:">
                {getFieldDecorator("engineeringProductionUnit", {
                    initialValue: currentRowData ? currentRowData.engineeringProductionUnit : ''
                })(<Input style={{width: '80%'}} placeholder="请输入工程起重机械生产单位" />)}
            </Form.Item>
            <Form.Item label="工程起重机械租赁单位:">
                {getFieldDecorator("engineeringRentalUnit", {
                    initialValue: currentRowData ? currentRowData.engineeringRentalUnit : ''
                })(<Input style={{width: '80%'}} placeholder="请输入工程起重机械租赁单位" />)}
            </Form.Item>
            <Form.Item label="工程起重机械维保单位:">
                {getFieldDecorator("engineeringMaintenanceUnit", {
                    initialValue: currentRowData ? currentRowData.engineeringMaintenanceUnit : ''
                })(<Input style={{width: '80%'}} placeholder="请输入工程起重机械维保单位" />)}
            </Form.Item>
            <Form.Item label="工程起重机械安拆单位:">
                {getFieldDecorator("engineeringDismantlingUnit", {
                    initialValue: currentRowData ? currentRowData.engineeringDismantlingUnit : ''
                })(<Input style={{width: '80%'}} placeholder="请输入工程起重机械安拆单位" />)}
            </Form.Item>
            <Form.Item label="工程起重机械设备备案登记证号:">
                {getFieldDecorator("engineeringDeviceRecordNumber", {
                    initialValue: currentRowData ? currentRowData.engineeringDeviceRecordNumber : ''
                })(<Input style={{width: '80%'}} placeholder="请输入工程起重机械设备备案登记证号" />)}
            </Form.Item>
            <Form.Item label="设备备案登记日期:">
              {getFieldDecorator("deviceRecordDate", {
                  initialValue: currentRowData && currentRowData.deviceRecordDate ? moment(currentRowData.deviceRecordDate) : null,
              })(<DatePicker style={{width: '80%'}} format={'YYYY/MM/DD'} />)}
            </Form.Item>
            <Form.Item label="备案机构:">
                {getFieldDecorator("recordOrganization", {
                    initialValue: currentRowData ? currentRowData.recordOrganization : ''
                })(<Input style={{width: '80%'}} placeholder="请输入备案机构" />)}
            </Form.Item>
            <Form.Item label="设备备案登记有效期:">
              {getFieldDecorator("deviceRecordValidityPeriod", {
                  initialValue: currentRowData && currentRowData.deviceRecordValidityPeriod ? moment(currentRowData.deviceRecordValidityPeriod) : null,
              })(<DatePicker style={{width: '80%'}} format={'YYYY/MM/DD'} />)}
            </Form.Item>
            <Form.Item label="设备使用登记证号:">
                {getFieldDecorator("deviceRegistrationNumber", {
                    initialValue: currentRowData ? currentRowData.deviceRegistrationNumber : ''
                })(<Input style={{width: '80%'}} placeholder="请输入设备使用登记证号" />)}
            </Form.Item>
            <Form.Item label="使用登记日期:">
              {getFieldDecorator("registrationDate", {
                  initialValue: currentRowData && currentRowData.registrationDate ? moment(currentRowData.registrationDate) : null,
              })(<DatePicker style={{width: '80%'}} format={'YYYY/MM/DD'} />)}
            </Form.Item>
            <Form.Item label="使用登记机构:">
                {getFieldDecorator("registrationOrganization", {
                    initialValue: currentRowData ? currentRowData.registrationOrganization : ''
                })(<Input style={{width: '80%'}} placeholder="请输入使用登记机构" />)}
            </Form.Item>
            <Form.Item label="使用登记有效期截止日期:">
              {getFieldDecorator("registrationValidityDate", {
                  initialValue: currentRowData && currentRowData.registrationValidityDate ? moment(currentRowData.registrationValidityDate) : null,
              })(<DatePicker style={{width: '80%'}} format={'YYYY/MM/DD'} />)}
            </Form.Item>
            <Form.Item label="初装高度:">
                {getFieldDecorator("initialHeight", {
                    initialValue: currentRowData ? currentRowData.initialHeight : ''
                })(<Input style={{width: '80%'}} placeholder="请输入初装高度" />)}
            </Form.Item>
            <Form.Item label="最大安装高度:">
                {getFieldDecorator("maxInstallationHeight", {
                    initialValue: currentRowData ? currentRowData.maxInstallationHeight : ''
                })(<Input style={{width: '80%'}} placeholder="请输入最大安装高度" />)}
            </Form.Item>
            <Form.Item label="最终安装高度:">
                {getFieldDecorator("finalInstallationHeight", {
                    initialValue: currentRowData ? currentRowData.finalInstallationHeight : ''
                })(<Input style={{width: '80%'}} placeholder="请输入最终安装高度" />)}
            </Form.Item>
            <Form.Item label="验收日期:">
              {getFieldDecorator("acceptanceDate", {
                  initialValue: currentRowData && currentRowData.acceptanceDate ? moment(currentRowData.acceptanceDate) : null,
              })(<DatePicker style={{width: '80%'}} format={'YYYY/MM/DD'} />)}
            </Form.Item>
            <Form.Item label="安拆人员证件号:">
                {getFieldDecorator("dismantlingPersonnelId", {
                    initialValue: currentRowData ? currentRowData.dismantlingPersonnelId : ''
                })(<Input style={{width: '80%'}} placeholder="请输入安拆人员证件号" />)}
            </Form.Item>
        </div>
      </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "AddDeviceForm" })(AddDeviceForm);
