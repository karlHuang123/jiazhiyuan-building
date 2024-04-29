import React, { Component } from "react";
import { Form, Input, Modal } from "antd";
import { reqValidatUserID } from "@/api/user";
const { TextArea } = Input
class AddDeviceModelForm extends Component {
  state = {

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
    const { visible, onCancel, onOk, form, confirmLoading } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        title={'新增设备体系模型'}
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        destroyOnClose
        confirmLoading={confirmLoading}
      >
        <Form>
          <Form.Item label="名称:">
            {getFieldDecorator("name", {
              rules: [{ required: true, message: "请输入名称!" }],
            })(<Input placeholder="请输入名称" />)}
          </Form.Item>
          <Form.Item label="描述:">
            {getFieldDecorator("description", {
            })(<TextArea placeholder="描述" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "AddDeviceModelForm" })(AddDeviceModelForm);
