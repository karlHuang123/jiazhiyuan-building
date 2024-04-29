import React, { Component } from "react";
import { Form, Input, Modal } from "antd";
const { TextArea } = Input
class AddMeasurementForm extends Component {
  state = {

  }
  render() {
    const { visible, onCancel, onOk, form, confirmLoading } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        title="新增模型"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        destroyOnClose
        confirmLoading={confirmLoading}
      >
        <Form>
          <Form.Item label="模型名称:">
            {getFieldDecorator("name", {
              rules: [{ required: true, message: "请输入名称!" }],
            })(<Input style={{marginLeft: '10px'}} placeholder="请输入名称" />)}
          </Form.Item>
          <Form.Item label="描述:">
            {getFieldDecorator("description", {
            })(<TextArea style={{marginLeft: '10px'}} placeholder="请输入描述" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "AddMeasurementForm" })(AddMeasurementForm);
