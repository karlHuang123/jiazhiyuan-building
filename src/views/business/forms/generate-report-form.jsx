import React, { Component } from "react";
import { Form, Input, Modal, Select, Button } from "antd";
import { reqValidatUserID } from "@/api/user";
import { getTemplateDetails, getClosedProject } from "@/api/report";
const { Option } = Select
class GenerateReportForm extends Component {
  state = {
      templateType: [],
      tempModule: [
          {
              label: '第三方评估报告',
              value: 'c'
          }
      ],
      projectOptionsNeo: []
  }
  handleTemplateChange = async (value) => {
    const result = await getTemplateDetails({
      templateId: value
    })
    this.props.templateSelect(result.data.data.templateConfig)
  }
  handlePlanChange = async (value) => {
    const result = await getClosedProject({
      planId: value
    })
    if (result.status === 200) {
      let temp = []
      result.data.data.forEach(item => {
        const ele = {
          value: item.code,
          label: item.name
        }
        temp.push(ele)
      })
      this.setState({
        projectOptionsNeo: temp
      })
    }
  }
  validatUserID = async (rule, value, callback) => {
    if (value) {
      if (!/^[a-zA-Z0-9]{1,6}$/.test(value)) {
        callback("委托方ID必须为1-6位数字或字母组合");
      }
      let res = await reqValidatUserID(value);
      const { status } = res.data;
      if (status) {
        callback("该委托方ID已存在");
      }
    } else {
      callback("请输入委托方ID");
    }
    callback();
  };
  render() {
    const { visible, onOk, form, confirmLoading, templateOptions, planOptions } = this.props;
    const { getFieldDecorator } = form;
    const { projectOptionsNeo } = this.state
    return (
      <Modal
        title={'生成报告'}
        visible={visible}
        onCancel={() => this.props.onCancel('hey')}
        destroyOnClose
        confirmLoading={confirmLoading}
        footer={[
            <div className="" style={{margin: '0 auto'}} key={'footer'}>
                <Button onClick={() => {this.props.onCancel('hey')}}>取消</Button>
                <Button type="primary" onClick={() => {this.props.onOk('hey')}}>
                  生成报告
                </Button>
            </div>
          ]}
      >
        <Form>
          <Form.Item label="计划:">
            {getFieldDecorator("planId", {
              rules: [{ required: true, message: "请选择报告类型!" }],
            })(
                <Select
                width={'100%'}
                allowClear
                onChange={this.handlePlanChange}
              >
                {planOptions.map((item, index) => (
                  <Option value={item.value} key={index}>{item.label}</Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="项目:">
            {getFieldDecorator("projectId", {
              rules: [{ required: true, message: "请选择项目!" }],
            })(
                <Select
                width={'100%'}
                allowClear
                disabled={projectOptionsNeo.length === 0}
              >
                {projectOptionsNeo.map((item, index) => (
                  <Option value={item.value} key={index}>{item.label}</Option>
                ))}
              </Select>
            )}
          </Form.Item>
          {/* <Form.Item label="模版类型:">
            {getFieldDecorator("templatetModelId", {
              rules: [{ required: true, message: "请选择模版类型!" }],
            })(
                <Select
                width={'100%'}
                allowClear
              >
                {this.state.tempModule.map((item, index) => (
                  <Option value={item.value} key={index}>{item.label}</Option>
                ))}
              </Select>
            )}
          </Form.Item> */}
          <Form.Item label="模版:">
            {getFieldDecorator("templateId", {
              rules: [{ required: true, message: "请选择模版类型!" }],
            })(
                <Select
                width={'100%'}
                allowClear
                onChange={this.handleTemplateChange}
              >
                {templateOptions.map((item, index) => (
                  <Option value={item.value} key={index}>{item.label}</Option>
                ))}
              </Select>
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "GenerateReportForm" })(GenerateReportForm);
