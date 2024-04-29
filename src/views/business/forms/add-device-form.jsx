import React, { Component } from "react";
import { Form, Input, Modal, Select, DatePicker } from "antd";
import { getDeviceSystemTypeList, getDeviceQueryList } from '@/api/projects'
import moment from "moment";
const { Option } = Select;
const handleChange = (value) => {
  console.log(value);
}
const deviceStatusOptions = [
  { value: '未备案', label: '未备案' },
  { value: '使用中', label: '使用中' },
  { value: '已报停', label: '已报停' }
]
class AddDeviceForm extends Component {
  state = {
    deviceSystemTypeList: [],
    deviceQueryList: [],
    deviceType: '',
    deviceSystemType: '',
    yearCheckDate: false,
    useHeight: false,
    setupHeight: false,
    fallingAvaliableDate: false,
    jackingCount: false,
    lastestJackingDate: false,
    lastestTopJackingDate: false,
    topJackingCount: false,
    infoPeopleId: false,
    crossOver: false,
    jackingPeopleId: false,
    latestPullUpDate: false,
    acceptanceDate: false,
    saveLockGoalDate: false,
    deviceCount: false
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
        deviceSystemTypeList: temp,
        deviceSystemType: temp[0].value
      }, () => {
        this.getDeviceQueryList({deviceType: deviceType, deviceSystemType: temp[0].value})
      })
      // if (this.state.deviceType) {
      //   this.setState({
      //     deviceSystemTypeList: temp,
      //     deviceSystemType: temp[0].value
      //   })
      // } else {
      //   this.setState({
      //     deviceSystemTypeList: temp,
      //     deviceSystemType: temp[0].value
      //   }, () => {
      //     this.getDeviceQueryList({deviceType: deviceType, deviceSystemType: temp[0].value})
      //   })
      // }
    }
  }
  yearCheckDateFun = (type) => { // 年检日期
    if (type === 'TOWER_CRANE' 
        || type === 'CONSTRUCTION_LIFT' 
        || type === 'BRIDGE_CRANE'
        || type === 'SUSPENDED_SCAFFOLDING'
        || type === 'GANTRY_CRANE') {
      this.setState({
        yearCheckDate: true
      })
    } else {
      this.setState({
        yearCheckDate: false
      }) 
    }
  }
  setupHeightFun = (type) => { // 安装高度
    if (type === 'TOWER_CRANE'|| type === 'MATERIAL_HOIST') {
      this.setState({
        setupHeight: true
      })
    } else {
      this.setState({
        setupHeight: false
      })
    }
  }
  useHeightFun = (type) => { // 使用高度
    if (type === 'CONSTRUCTION_LIFT' || type === 'OTHER') {
      this.setState({
        useHeight: true
      })
    } else {
      this.setState({
        useHeight: false
      })
    }
  }
  fallingAvaliableDateFun = (type) => { // 防坠器可用期限
    if (type === 'CONSTRUCTION_LIFT') {
      this.setState({
        fallingAvaliableDate: true
      })
    } else {
      this.setState({
        fallingAvaliableDate: false
      })
    }
  }
  jackingCountFun = (type) => { // 加节次数
    if (type === 'CONSTRUCTION_LIFT') {
      this.setState({
        jackingCount: true
      })
    } else {
      this.setState({
        jackingCount: false
      })
    }
  }
  lastestJackingDate = (type) => { // 最近一次顶升加节时间
    if (type === 'TOWER_CRANE' || type === 'OTHER') {
      this.setState({
        lastestJackingDate: true
      })
    } else {
      this.setState({
        lastestJackingDate: false
      })
    }
  }
  lastestTopJackingDateFun = (type) => { // 最近一次加节时间
    if (type === 'CONSTRUCTION_LIFT' || type === 'MATERIAL_HOIST') {
      this.setState({
        lastestTopJackingDate: true
      })
    } else {
      this.setState({
        lastestTopJackingDate: false
      })
    }
  }
  topJackingCountFun = (type) => { // 顶升加节次数
    if (type === 'TOWER_CRANE' || type === 'OTHER') {
      this.setState({
        topJackingCount: true
      })
    } else {
      this.setState({
        topJackingCount: false
      })
    }
  }
  jackingPeopleIdFun = (type) => { //每次顶升加节人员编号
    if (type === 'TOWER_CRANE' || type === 'CONSTRUCTION_LIFT' || type === 'OTHER') {
      this.setState({
        jackingPeopleId: true
      })
    } else {
      this.setState({
        jackingPeopleId: false
      }) 
    }
  }
  infoPeopleIdFun = (type) => { // 司索工id
    if (type === 'TOWER_CRANE' || type === 'BRIDGE_CRANE' || type === 'SUSPENDED_SCAFFOLDING' || type === 'OTHER' || type === 'GANTRY_CRANE') {
      this.setState({
        infoPeopleId: true
      })
    } else {
      this.setState({
        infoPeopleId: false
      })
    }
  }
  crossOverFun = (type) => { // 跨度
    if (type === 'BRIDGE_CRANE' || type === 'SUSPENDED_SCAFFOLDING' || type === 'GANTRY_CRANE' || type === 'GANTRY_TROLLEY_CRANE') {
      this.setState({
        crossOver: true
      })
    } else {
      this.setState({
        crossOver: false
      })
    }
  }
  latestPullUpDateFun = (type) => { // 最近一次提升时间
    if (type === 'SUSPENDED_SCAFFOLDING') {
      this.setState({
        latestPullUpDate: true
      })
    } else {
      this.setState({
        latestPullUpDate: false
      })
    }
  }
  acceptanceDateFun = (type) => { // 验收日期
    if (type === 'SUSPENDED_SCAFFOLDING' || type === 'MOBILE_CRANE' || type === 'HIGH_ALTITUDE_BASKET' || type === 'OTHER') {
      this.setState({
        acceptanceDate: true
      })
    } else {
      this.setState({
        acceptanceDate: false
      })
    }
  }
  saveLockGoalDateFun = (type) => {
    if (type === 'HIGH_ALTITUDE_BASKET') {
      this.setState({
        saveLockGoalDate: true
      })
    } else {
      this.setState({
        saveLockGoalDate: false
      })
    }
  }
  deviceCountFun = (type) => {
    if (type === 'HIGH_ALTITUDE_BASKET') {
      this.setState({
        deviceCount: true
      })
    } else {
      this.setState({
        deviceCount: false
      })
    }
  }
  getDeviceQueryList = async (data) => { //获取出厂编号
    const result = await getDeviceQueryList(data)
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
        deviceQueryList: temp
      })
    }
  }
  renderForm = () => {
    this.yearCheckDateFun(this.state.deviceType)
    this.setupHeightFun(this.state.deviceType)
    this.useHeightFun(this.state.deviceType)
    this.fallingAvaliableDateFun(this.state.deviceType)
    this.jackingCountFun(this.state.deviceType)
    this.lastestJackingDate(this.state.deviceType)
    this.lastestTopJackingDateFun(this.state.deviceType)
    this.topJackingCountFun(this.state.deviceType)
    this.infoPeopleIdFun(this.state.deviceType)
    this.crossOverFun(this.state.deviceType)
    this.latestPullUpDateFun(this.state.deviceType)
    this.acceptanceDateFun(this.state.deviceType)
    this.saveLockGoalDateFun(this.state.deviceType)
    this.deviceCountFun(this.state.deviceType)
  }
  componentWillReceiveProps(nextProps) {
    if (!this.state.deviceType) {
      this.getDeviceSystemTypeList(nextProps.currentType)
      this.setState({
        deviceType: nextProps.currentType
      }, () => {
        this.renderForm()
      })
    }
  }
  render() {
    const { visible, onCancel, onOk, form, deviceTypeList, currentType } = this.props;
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
          <div className="grid grid-1-1">
            <Form.Item label="设备类型:">
                {getFieldDecorator("deviceType", {
                initialValue: {key: currentType, label: currentType},
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
                      }, () => {
                        this.renderForm()
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
                initialValue: this.state.deviceSystemType ? this.state.deviceSystemType : '',
                rules: [{ required: true, message: "请选择设备体系类型" }]
                })(
                <Select
                    style={{width: '80%'}}
                    allowClear
                    onChange={(value) => {
                      this.getDeviceQueryList({deviceType: this.state.deviceType, deviceSystemType: value})
                    }}
                >
                    {this.state.deviceSystemTypeList.map((item, index) => (
                        <Option value={item.value} key={item.value}>{item.label}</Option>
                    ))}
                </Select>
                )}
            </Form.Item>
            <Form.Item label="工程起重机检测单位:">
                {getFieldDecorator("constructionCrane", {
                })(<Input style={{width: '80%'}} placeholder="请输入工程起重机检测单位" />)}
            </Form.Item>
            <Form.Item label="检测日期:">
              {getFieldDecorator("checkDate", {
              })(<DatePicker style={{width: '80%'}} format={'YYYY/MM/DD'} />)}
            </Form.Item>
            <Form.Item label="出厂编号:">
                {getFieldDecorator("outputLisence", {
                rules: [{ required: true, message: "请选择出厂编号" }]
                })(
                <Select
                    style={{width: '80%'}}
                    allowClear
                    labelInValue
                    onChange={handleChange}
                >
                    {this.state.deviceQueryList.map((item, index) => (
                        <Option value={item.value} key={item.value}>{item.label}</Option>
                    ))}
                </Select>
                )}
            </Form.Item>
            <Form.Item label="更新时间:">
              {getFieldDecorator("updateDate", {
              rules: [{ required: true, message: "请选择更新时间" }]
              })(<DatePicker style={{width: '80%'}} format={'YYYY/MM/DD'} />)}
            </Form.Item>
            {this.state.saveLockGoalDate ? (
              <Form.Item label="安全锁标定日期:">
                {getFieldDecorator("saveLockGoalDate", {
                initialValue: moment(),
                rules: [{ required: true, message: "请选择时间" }]
                })(<DatePicker style={{width: '80%'}} format={'YYYY/MM/DD'} />)}
              </Form.Item>
            ) : ('')}
            <Form.Item label="工程起重机械设备状态:">
                {getFieldDecorator("constructionCraneStatus", {
                  rules: [{ required: true, message: "请选择设备状态" }]
                })(
                  <Select
                  style={{width: '80%'}}
                  allowClear
                  onChange={handleChange}
                
                >
                  {deviceStatusOptions.map((item, index) => (
                      <Option value={item.value} key={item.value}>{item.label}</Option>
                  ))}
                </Select>)}
            </Form.Item>
            {this.state.crossOver ? (
              <Form.Item label="跨度:">
                {getFieldDecorator("crossOver", {
                })(<Input style={{width: '80%'}} placeholder="请输入跨度" />)}
              </Form.Item>
            ) : ('')}
            {this.state.latestPullUpDate ? (
              <Form.Item label="最近一次提升日期:">
                {getFieldDecorator("latestPullUpDate", {
                })(<DatePicker style={{width: '80%'}} format={'YYYY/MM/DD'} />)}
              </Form.Item>
            ) : ('')}
            {this.state.acceptanceDate ? (
              <Form.Item label="验收日期:">
                {getFieldDecorator("acceptanceDate", {
                })(<DatePicker style={{width: '80%'}} format={'YYYY/MM/DD'} />)}
              </Form.Item>
            ) : ('')}
            {this.state.fallingAvaliableDate ? (
              <Form.Item label="防坠器有效期:">
                {getFieldDecorator("fallingAvaliableDate", {
                initialValue: moment(),
                rules: [{ required: true, message: "请选择日期" }]
                })(<DatePicker style={{width: '80%'}} format={'YYYY/MM/DD'} />)}
              </Form.Item>                
            ) : ('')}
            {this.state.fallingAvaliableDate ? (
              <Form.Item label="防坠器标定日期:">
                {getFieldDecorator("fallingAvaliableGoalDate", {
                initialValue: moment(),
                rules: [{ required: true, message: "请选择日期" }]
                })(<DatePicker style={{width: '80%'}} format={'YYYY/MM/DD'} />)}
              </Form.Item>                
            ) : ('')}
            {this.state.yearCheckDate ? (
              <Form.Item label="年检日期:">
                {getFieldDecorator("yearCheckDate", {
                initialValue: moment(),
                rules: [{ required: true, message: "请选择年检日期" }]
                })(<DatePicker style={{width: '80%'}} format={'YYYY/MM/DD'} />)}
              </Form.Item>
            ) : ('')}
            {this.state.setupHeight ? (
              <Form.Item label="安装高度(米):">
                {getFieldDecorator("setupHeight", {
                })(<Input style={{width: '80%'}} placeholder="请输入安装高度" />)}
              </Form.Item>
            ) : ('')}
            {this.state.useHeight ? (
              <Form.Item label="使用高度(米):">
                {getFieldDecorator("useHeight", {
                })(<Input style={{width: '80%'}} placeholder="请输入使用高度" />)}
              </Form.Item>
            ) : ('')}
            {this.state.topJackingCount ? (
              <Form.Item label="顶升加节次数:">
                {getFieldDecorator("topJackingCount", {
                })(<Input style={{width: '80%'}} placeholder="请输入顶升加节次数" />)}
              </Form.Item>
            ) : ('')}
            {this.state.topJackingCount ? (
              <Form.Item label="最近一次顶升加节时间:">
                {getFieldDecorator("lastestTopJackingDate", {
                })(<DatePicker style={{width: '80%'}} format={'YYYY/MM/DD'} />)}
              </Form.Item>
            ) : ('')}
            {this.state.jackingCount ? (
              <Form.Item label="加节次数:">
                {getFieldDecorator("topJackingCount", {
                })(<Input style={{width: '80%'}} placeholder="请输入加节次数" />)}
              </Form.Item>
            ) : ('')}
            {this.state.lastestJackingDate ? (
              <Form.Item label="最近一次加节时间:">
                {getFieldDecorator("lastestJackingDate", {
                })(<DatePicker style={{width: '80%'}} format={'YYYY/MM/DD'} />)}
              </Form.Item>
            ) : ('')}
            {this.state.jackingPeopleId ? (
            <Form.Item label="每次顶升加节作业人员操作证证件号:">
              {getFieldDecorator("jackingPeopleId", {
              })(<Input style={{width: '80%'}} placeholder="请输入证件号" />)}
            </Form.Item>
            ) : ('')}
            {this.state.infoPeopleId ? (
              <Form.Item label="信号工、司索工证件号:">
                {getFieldDecorator("infoPeopleId", {
                })(<Input style={{width: '80%'}} placeholder="请输入证件号" />)}
              </Form.Item>
            ) : ('')}
            {this.state.deviceType !== 'HIGH_ALTITUDE_BASKET' ? (
              <Form.Item label="设备操作人员(司机)证件号:">
                  {getFieldDecorator("operatorId", {
                  })(<Input style={{width: '80%'}} placeholder="请输入证件号" />)}
              </Form.Item>
            ) : ('')}
            {this.state.deviceCount ? (
              <Form.Item label="设备数量:">
                  {getFieldDecorator("deviceCount", {
                    initialValue: '0',
                    rules: [{ required: true, message: "设备数量" }]
                  })(<Input style={{width: '80%'}} placeholder="请输入证件号" />)}
              </Form.Item>
            ) : ('')}
        </div>
      </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "AddDeviceForm" })(AddDeviceForm);
