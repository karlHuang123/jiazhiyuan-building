import React, { Component } from "react";
import { Form, Input, Select, Modal } from "antd";
const { Option } = Select;
const handleChange = (value) => {
  console.log(value);
}
class EditClientForm extends Component {
  state = {

  }
  render() {
    const {
      visible,
      onCancel,
      onOk,
      form,
      confirmLoading,
      currentRowData,
      options
    } = this.props;
    const { getFieldDecorator } = form;
    const { id, name, type, intention } = currentRowData;
    const formItemLayout = {
      labelCol: {
        sm: { span: 4 },
      },
      wrapperCol: {
        sm: { span: 16 },
      },
    };
    return (
      <Modal
        title="编辑"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        destroyOnClose
        confirmLoading={confirmLoading}
      >
        <Form {...formItemLayout}>
          <Form.Item label="委托方id:">
            {getFieldDecorator("id", {
              initialValue: id,
            })(<Input style={{marginLeft: '10px'}} disabled placeholder="请输入手机号" />)}
          </Form.Item>
          <Form.Item label="委托方名称:">
            {getFieldDecorator("name", {
              rules: [{ required: true, message: "请输入委托方名称!" }],
              initialValue: name
            })(<Input style={{marginLeft: '10px'}} placeholder="请输入委托方名称" />)}
          </Form.Item>
          <Form.Item label="委托方类型:">
            {getFieldDecorator("type", {
              rules: [{ required: true, message: "请选择类型" }],
              initialValue: {key: type, label: type}
            })(
              <Select
                style={{
                  width: 150,
                  marginLeft: '10px'
                }}
                allowClear
                labelInValue
                onChange={handleChange}
              >
                {options.map((item, index) => (
                  <Option value={item.value} key={item.label}>{item.label}</Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="委托方意向:">
            {getFieldDecorator("intention", {
              rules: [{ required: true, message: "请填写委托方意向" }],
              initialValue: intention
            })(<Input style={{marginLeft: '10px'}} placeholder="请填写委托方意向" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "EditClientForm" })(EditClientForm);
