import React, { Component } from "react";
import { Button, Form, Input, Modal, Select } from "antd";
import { getModelTypeTreeList, getDeviceModelTypeTreeList } from "@/api/produce";
import '../style/plan.less'
const { TextArea } = Input
const { Option } = Select
class BasicInfoForm extends Component {
  state = {
      templateType: [],
      fuzzyExperts: [],
      scoreExperts: [],
      modelVersions: [],
      deviceScoreExperts: [],
      deviceFuzzyExperts: []
  }
  handleCheckSysChange = (e) => {
    this.getModelTypeTreeListFun({
        checkSysId: parseFloat(e)
      })
  }

  handleDeviceModelChange = (e) => {
      this.getDeviceModelTypeTreeListFun({
        deviceModelId: e
      })
  }

  getModelTypeTreeListFun = async (params) => {
      const result = await getModelTypeTreeList(params)
      if (result.data.status === 'OK') {
        let tempOne = []
        let tempTwo = []
        result.data.data.fuzzyExperts.forEach(item => {
          const ele = {
            label: item.name,
            value: item.code
          }
          tempOne.push(ele)
        })
        result.data.data.scoreExperts.forEach(item => {
            const ele = {
              label: item.name,
              value: item.code
            }
            tempTwo.push(ele)
          })
        this.setState({
            fuzzyExperts: tempOne,
            scoreExperts: tempTwo
        })
      }
  }

  getDeviceModelTypeTreeListFun = async (params) => {
    const result = await getDeviceModelTypeTreeList(params)
    if (result.data.status === 'OK') {
      let tempOne = []
      let tempTwo = []
      let tempThree = []
      result.data.data.modelVersions.forEach(item => {
        const ele = {
          label: item.name,
          value: item.code
        }
        tempOne.push(ele)
      })
      result.data.data.deviceScoreExperts.forEach(item => {
          const ele = {
            label: item.name,
            value: item.code
          }
          tempTwo.push(ele)
        })
      result.data.data.deviceFuzzyExperts.forEach(item => {
            const ele = {
                label: item.name,
                value: item.code
            }
            tempTwo.push(ele)
        })
      this.setState({
          modelVersions: tempOne,
          deviceScoreExperts: tempTwo,
          deviceFuzzyExperts: tempThree
      })
    }
  }
  
  componentDidMount () {
      if (this.props.currentRowData && this.props.currentRowData.checkSysId) {
          this.getModelTypeTreeListFun({
            checkSysId: this.props.currentRowData.checkSysId
          })
      }
      if (this.props.currentRowData && this.props.currentRowData.checkSysId) {
        this.getDeviceModelTypeTreeListFun({
            deviceModelId: this.props.currentRowData.deviceModelId
        })
    }
  }
  render() {
    const { 
        form, 
        onAdd, 
        clientList, 
        modelList,
        deviceModelList,
        measurementModelList,
        currentRowData,
        planTypeList
    } = this.props;
    const { getFieldDecorator } = form;
    return (
        <div>
            <div className="add-btn mb-10">
                <Button type="primary" onClick={onAdd}>添加基本信息</Button>
            </div>
            <Form
                labelCol={{ style: { width: '100%', height: '30px' } }} //label样式
                labelAlign="left" //label样式
            >
                <div style={{height: '0', visibility: 'hidden'}}>
                    <Form.Item label="id:" style={{height: '100%'}}>
                    {getFieldDecorator("id", {
                        initialValue: currentRowData ? currentRowData.id : null
                    })(<TextArea />)}
                    </Form.Item>
                </div>
                <div className="grid grid-7">
                    <Form.Item style={{marginBottom: '2px', width: '95%'}} label="计划名称:">
                        {getFieldDecorator("name", {
                            rules: [{ required: true, message: "请输入计划名称" }],
                            initialValue: currentRowData ? currentRowData.name : '',
                        })(<Input placeholder="请输入计划名称！" />)}
                    </Form.Item>
                    <Form.Item style={{marginBottom: '2px', width: '95%'}} label="计划类型:">
                        {getFieldDecorator("type", {
                            initialValue: currentRowData ? currentRowData.type : '',
                        })(
                            <Select
                            width={'100%'}
                            allowClear
                        >
                            {planTypeList.map((item, index) => (
                                <Option value={item.value} key={index}>{item.label}</Option>
                            ))}
                        </Select>
                        )}
                    </Form.Item>
                    <Form.Item style={{marginBottom: '2px', width: '95%'}} label="委托方:">
                        {getFieldDecorator("clientId", {
                            rules: [{ required: true, message: "请选择委托方！" }],
                            initialValue: currentRowData ? currentRowData.clientId : '',
                        })(
                            <Select
                            width={'100%'}
                            allowClear
                        >
                            {clientList.map((item, index) => (
                                <Option value={item.value} key={index}>{item.label}</Option>
                            ))}
                        </Select>
                        )}
                    </Form.Item>
                    <Form.Item style={{marginBottom: '2px', width: '95%'}} label="检查体系:">
                        {getFieldDecorator("checkSysId", {
                            rules: [{ required: true, message: "请选择检查体系！" }],
                            initialValue: currentRowData ? currentRowData.checkSysId.toString() : '',
                        })(
                            <Select
                            width={'100%'}
                            allowClear
                            onChange={this.handleCheckSysChange}
                        >
                            {modelList.map((item, index) => (
                                <Option value={item.value} key={index}>{item.label}</Option>
                            ))}
                        </Select>
                        )}
                    </Form.Item>
                    <Form.Item style={{marginBottom: '2px', width: '95%'}} label="模糊数学专家:">
                        {getFieldDecorator("fuzzyExpert", {
                            initialValue: currentRowData && currentRowData.fuzzyExpert ? currentRowData.fuzzyExpert.split(',') : [],
                        })(
                            <Select
                            width={'100%'}
                            allowClear
                            mode="multiple"
                        >
                            {this.state.fuzzyExperts.map((item, index) => (
                                <Option value={item.value} key={index}>{item.label}</Option>
                            ))}
                        </Select>
                        )}
                    </Form.Item>
                    <Form.Item style={{marginBottom: '2px', width: '95%'}} label="打分表专家:">
                        {getFieldDecorator("scoreExpert", {
                            initialValue: currentRowData && currentRowData.scoreExpert ? currentRowData.scoreExpert : [],
                        })(
                            <Select
                            width={'100%'}
                            allowClear
                            mode="multiple"
                        >
                            {this.state.scoreExperts.map((item, index) => (
                                <Option value={item.value} key={index}>{item.label}</Option>
                            ))}
                        </Select>
                        )}
                    </Form.Item>
                    <Form.Item style={{marginBottom: '2px', width: '95%'}} label="实测实量模型:">
                        {getFieldDecorator("measureModelId", {
                            initialValue: currentRowData && currentRowData.measureModelId ? currentRowData.measureModelId.toString() : '',
                        })(
                            <Select
                            width={'100%'}
                            allowClear
                        >
                            {measurementModelList.map((item, index) => (
                                <Option value={item.value} key={index}>{item.label}</Option>
                            ))}
                        </Select>
                        )}
                    </Form.Item>
                    <Form.Item style={{marginBottom: '2px', width: '95%'}} label="设备体系模型:">
                        {getFieldDecorator("deviceModelId", {
                            initialValue: currentRowData && currentRowData.deviceModelId ? currentRowData.deviceModelId.toString() : '',
                        })(
                            <Select
                            width={'100%'}
                            allowClear
                            onChange={this.handleDeviceModelChange}
                        >
                            {deviceModelList.map((item, index) => (
                                <Option value={item.value} key={index}>{item.label}</Option>
                            ))}
                        </Select>
                        )}
                    </Form.Item>
                    <Form.Item style={{marginBottom: '2px', width: '95%'}} label="设备体系模型版本号:">
                        {getFieldDecorator("deviceModelVersion", {
                            initialValue: currentRowData ? currentRowData.deviceModelVersion : '',
                        })(
                            <Select
                            width={'100%'}
                            allowClear
                        >
                            {this.state.modelVersions.map((item, index) => (
                                <Option value={item.value} key={index}>{item.label}</Option>
                            ))}
                        </Select>
                        )}
                    </Form.Item>
                    <Form.Item style={{marginBottom: '2px', width: '95%'}} label="设备模糊数学专家:">
                        {getFieldDecorator("deviceFuzzyExpert", {
                            initialValue: currentRowData && currentRowData.deviceFuzzyExpert ? currentRowData.deviceFuzzyExpert.split(',') : [],
                        })(
                            <Select
                            width={'100%'}
                            allowClear
                            mode="multiple"
                        >
                            {this.state.deviceFuzzyExperts.map((item, index) => (
                                <Option value={item.value} key={index}>{item.label}</Option>
                            ))}
                        </Select>
                        )}
                    </Form.Item>
                    <Form.Item style={{marginBottom: '2px', width: '95%'}} label="设备打分表专家:">
                        {getFieldDecorator("deviceScoreExpert", {
                            initialValue: currentRowData && currentRowData.deviceScoreExpert ? currentRowData.deviceScoreExpert.split(',') : [],
                        })(
                            <Select
                            width={'100%'}
                            allowClear
                            mode="multiple"
                        >
                            {this.state.deviceScoreExperts.map((item, index) => (
                                <Option value={item.value} key={index}>{item.label}</Option>
                            ))}
                        </Select>
                        )}
                    </Form.Item>
                </div>
            </Form>
        </div>
    );
  }
}

export default Form.create({ name: "BasicInfoForm" })(BasicInfoForm);
