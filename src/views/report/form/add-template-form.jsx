import React, { Component } from "react";
import { Form, Input, Modal, Select } from "antd";
import { reqValidatUserID } from "@/api/user";
const { TextArea } = Input
const { Option } = Select
class AddTemplateForm extends Component {
  state = {
      templateType: []
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
    const { visible, onCancel, onOk, form, confirmLoading, templateOptions } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        title={'新增模版'}
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        destroyOnClose
        confirmLoading={confirmLoading}
      >
        <Form>
          <Form.Item label="模版类型:">
            {getFieldDecorator("templateType", {
              rules: [{ required: true, message: "请选择类型!" }],
            })(
                <Select
                width={'100%'}
                allowClear
              >
                {templateOptions.map((item, index) => (
                  <Option value={item.value} key={index}>{item.label}</Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item style={{marginBottom: '2px'}} label="模版编号:">
            {getFieldDecorator("templateNo", {
                rules: [{ required: true, message: "请输入模版编号!" }]
            })(<Input placeholder="请输入模版编号" />)}
          </Form.Item>
          <Form.Item style={{marginBottom: '2px'}} label="模版子编号:">
            {getFieldDecorator("templateSubNo", {
                rules: [{ required: true, message: "请输入模版子编号!" }]
            })(<Input placeholder="请输入模版子编号" />)}
          </Form.Item>
          <Form.Item style={{marginBottom: '2px'}} label="模版名称:">
            {getFieldDecorator("templateName", {
                rules: [{ required: true, message: "请输入模版名称!" }]
            })(<Input placeholder="请输入模版子编号" />)}
          </Form.Item>
          <Form.Item label="备注:">
            {getFieldDecorator("remark", {
            })(<TextArea placeholder="备注" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "AddTemplateForm" })(AddTemplateForm);
