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
      this.setState({
        deviceSystemTypeList: temp
      })
    }
  }
  componentWillReceiveProps(nextProps) {
    if (!this.state.deviceType) {
      this.getDeviceSystemTypeList(nextProps.currentType)
      this.setState({
        deviceType: nextProps.currentType
      })
    }
  }
  render() {
    const { visible, onCancel, onOk, form, deviceTypeList } = this.props;
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
            <Form.Item label="设备类型:">
                {getFieldDecorator("deviceType", {
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
                })(<Input style={{width: '80%'}} placeholder="请输入设备型号" />)}
            </Form.Item>
            <Form.Item label="设备编号:">
                {getFieldDecorator("deviceNumber", {
                    rules: [{ required: true, message: "请输入设备编号" }]
                })(<Input style={{width: '80%'}} placeholder="请输入设备编号" />)}
            </Form.Item>
            <Form.Item label="设备出厂日期:">
              {getFieldDecorator("deviceManufactureDate", {
                  rules: [{ required: true, message: "请选择出厂日期" }]
              })(<DatePicker style={{width: '80%'}} format={'YYYY/MM/DD'} />)}
            </Form.Item>
            <Form.Item label="出厂编号:">
                {getFieldDecorator("manufactureNumber", {
                    rules: [{ required: true, message: "请输入出厂编号" }]
                })(<Input style={{width: '80%'}} placeholder="请输入出厂编号" />)}
            </Form.Item>
            <Form.Item label="报废年限:">
                {getFieldDecorator("scrapYearLimit", {
                })(<Input style={{width: '80%'}} placeholder="请输入报废年限" />)}
            </Form.Item>
            <Form.Item label="使用单位:">
                {getFieldDecorator("userUnit", {
                })(<Input style={{width: '80%'}} placeholder="请输入使用单位" />)}
            </Form.Item>
            <Form.Item label="工程起重机械生产单位:">
                {getFieldDecorator("engineeringProductionUnit", {
                })(<Input style={{width: '80%'}} placeholder="请输入工程起重机械生产单位" />)}
            </Form.Item>
            <Form.Item label="工程起重机械租赁单位:">
                {getFieldDecorator("engineeringRentalUnit", {
                })(<Input style={{width: '80%'}} placeholder="请输入工程起重机械租赁单位" />)}
            </Form.Item>
            <Form.Item label="工程起重机械维保单位:">
                {getFieldDecorator("engineeringMaintenanceUnit", {
                })(<Input style={{width: '80%'}} placeholder="请输入工程起重机械维保单位" />)}
            </Form.Item>
            <Form.Item label="工程起重机械安拆单位:">
                {getFieldDecorator("engineeringDismantlingUnit", {
                })(<Input style={{width: '80%'}} placeholder="请输入工程起重机械安拆单位" />)}
            </Form.Item>
            <Form.Item label="工程起重机械设备备案登记证号:">
                {getFieldDecorator("engineeringDeviceRecordNumber", {
                })(<Input style={{width: '80%'}} placeholder="请输入工程起重机械设备备案登记证号" />)}
            </Form.Item>
            <Form.Item label="设备备案登记日期:">
              {getFieldDecorator("deviceRecordDate", {
              })(<DatePicker style={{width: '80%'}} format={'YYYY/MM/DD'} />)}
            </Form.Item>
            <Form.Item label="备案机构:">
                {getFieldDecorator("recordOrganization", {
                })(<Input style={{width: '80%'}} placeholder="请输入备案机构" />)}
            </Form.Item>
            <Form.Item label="设备备案登记有效期:">
              {getFieldDecorator("deviceRecordValidityPeriod", {
              })(<DatePicker style={{width: '80%'}} format={'YYYY/MM/DD'} />)}
            </Form.Item>
            <Form.Item label="设备使用登记证号:">
                {getFieldDecorator("deviceRegistrationNumber", {
                })(<Input style={{width: '80%'}} placeholder="请输入设备使用登记证号" />)}
            </Form.Item>
            <Form.Item label="使用登记日期:">
              {getFieldDecorator("registrationDate", {
              })(<DatePicker style={{width: '80%'}} format={'YYYY/MM/DD'} />)}
            </Form.Item>
            <Form.Item label="使用登记机构:">
                {getFieldDecorator("registrationOrganization", {
                })(<Input style={{width: '80%'}} placeholder="请输入使用登记机构" />)}
            </Form.Item>
            <Form.Item label="使用登记有效期截止日期:">
              {getFieldDecorator("registrationValidityDate", {
              })(<DatePicker style={{width: '80%'}} format={'YYYY/MM/DD'} />)}
            </Form.Item>
            <Form.Item label="初装高度:">
                {getFieldDecorator("initialHeight", {
                })(<Input style={{width: '80%'}} placeholder="请输入初装高度" />)}
            </Form.Item>
            <Form.Item label="最大安装高度:">
                {getFieldDecorator("maxInstallationHeight", {
                })(<Input style={{width: '80%'}} placeholder="请输入最大安装高度" />)}
            </Form.Item>
            <Form.Item label="最终安装高度:">
                {getFieldDecorator("finalInstallationHeight", {
                })(<Input style={{width: '80%'}} placeholder="请输入最终安装高度" />)}
            </Form.Item>
            <Form.Item label="验收日期:">
              {getFieldDecorator("acceptanceDate", {
              })(<DatePicker style={{width: '80%'}} format={'YYYY/MM/DD'} />)}
            </Form.Item>
            <Form.Item label="安拆人员证件号:">
                {getFieldDecorator("dismantlingPersonnelId", {
                })(<Input style={{width: '80%'}} placeholder="请输入安拆人员证件号" />)}
            </Form.Item>
        </div>
      </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "AddDeviceForm" })(AddDeviceForm);
