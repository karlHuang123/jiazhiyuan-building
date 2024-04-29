import React, { Component } from "react";
import { Form, Input, Modal, Select } from "antd";
import { reqValidatUserID } from "@/api/user";
const { Option } = Select;
const handleChange = (value) => {
  console.log(value);
}
class AddClientForm extends Component {
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
    const { visible, onCancel, onOk, form, confirmLoading, options } = this.props;
    const { getFieldDecorator } = form;
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
        title="添加委托方"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
      >
        <Form {...formItemLayout}>
          <Form.Item label="委托方名称:">
            {getFieldDecorator("name", {
              rules: [{ required: true, message: "请输入委托方名称!" }],
            })(<Input style={{marginLeft: '10px'}} placeholder="请输入委托方名称" />)}
          </Form.Item>
          <Form.Item label="委托方类型:">
            {getFieldDecorator("type", {
              rules: [{ required: true, message: "请选择岗位" }]
            })(
              <Select
                allowClear
                labelInValue
                onChange={handleChange}
                style={{marginLeft: '10px'}}
              >
                {options.map((item, index) => (
                  <Option value={item.value} key={index}>{item.label}</Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="委托方意向:">
            {getFieldDecorator("intention", {
              rules: [{ required: true, message: "委托意向不能为空" }],
            })(<Input style={{marginLeft: '10px'}} placeholder="请输入委托意向" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "AddClientForm" })(AddClientForm);
