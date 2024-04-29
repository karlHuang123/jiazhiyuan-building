import React, { Component } from "react";
import { Form, Input, Modal } from "antd";
import { reqValidatUserID } from "@/api/user";
class AddLayerForm extends Component {
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
    const { visible, onCancel, onOk, form, confirmLoading, currentParentId } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        title={currentParentId === 0 ? '新增体系' : '添加子集'}
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
            })(<Input style={{marginLeft: '10px'}} placeholder="请输入名称" />)}
          </Form.Item>
          <Form.Item label="分数:">
            {getFieldDecorator("score", {
              initialValue: '10',
              rules: [{ required: true, message: "请输入分数！" }],
            })(<Input style={{marginLeft: '10px'}} placeholder="请输入分数" />)}
          </Form.Item>
          <Form.Item label="国际权重:">
            {getFieldDecorator("weight", {
              initialValue:'0',
              rules: [{ required: true, message: "请输入分数！" }],
            })(<Input style={{marginLeft: '10px'}} placeholder="请输入分数" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "AddLayerForm" })(AddLayerForm);
