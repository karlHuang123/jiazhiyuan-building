import React, { Component } from "react";
import { Form, Input, Modal, Cascader, Select } from "antd";
import { reqValidatUserID } from "@/api/user";
const { Option } = Select;
const handleChange = (value) => {
  console.log(value);
}
class AddUserForm extends Component {
  state = {
    positionOptions: [
      {
        value: 0,
        label: '项目经理',
      },
      {
        value: 1,
        label: '总工程师',
      },
      {
        value: 2,
        label: '调度员',
      },
      {
        value: 3,
        label: '采购员',
      },
    ],
    tagOptions: [
      {
        value: '生产',
        label: '生产',
      },
      {
        value: '非生产',
        label: '非生产',
      },
      {
        value: '信利隆',
        label: '信利隆',
      }
    ]
  }
  validatUserID = async (rule, value, callback) => {
    if (value) {
      if (!/^[a-zA-Z0-9]{1,6}$/.test(value)) {
        callback("用户ID必须为1-6位数字或字母组合");
      }
      let res = await reqValidatUserID(value);
      const { status } = res.data;
      if (status) {
        callback("该用户ID已存在");
      }
    } else {
      callback("请输入用户ID");
    }
    callback();
  };
  render() {
    const { visible, onCancel, onOk, form, confirmLoading, departmentList } = this.props;
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
        title="添加用户"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={confirmLoading}
      >
        <Form {...formItemLayout}>
          <Form.Item label="用户名称:">
            {getFieldDecorator("username", {
              rules: [{ required: true, message: "请输入用户名称!" }],
            })(<Input placeholder="请输入用户名称" />)}
          </Form.Item>
          <Form.Item label="手机号:">
            {getFieldDecorator("mobile", {
              rules: [{ required: true, message: "手机号不能为空" }],
            })(<Input placeholder="请输入手机号" />)}
          </Form.Item>
          <Form.Item label="部门:">
            {getFieldDecorator("department", {
              initialValue: "",
            })(
              <Cascader
                options={departmentList ? departmentList : []}
                expandTrigger="hover"
                onChange={handleChange} />
            )}
          </Form.Item>
          <Form.Item label="岗位:">
            {getFieldDecorator("position", {
              rules: [{ required: true, message: "请选择岗位" }]
            })(
              <Select
                style={{
                  width: 150,
                }}
                allowClear
                labelInValue
                onChange={handleChange}
              >
                {this.state.positionOptions.map((item, index) => (
                  <Option value={item.value} key={index}>{item.label}</Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="昵称:">
            {getFieldDecorator("nickname", {
              rules: [{ required: false}],
            })(<Input placeholder="请输入昵称" />)}
          </Form.Item>
          <Form.Item label="邮箱:">
            {getFieldDecorator("email", {
              rules: [{ required: false}],
            })(<Input placeholder="邮箱" />)}
          </Form.Item>
          <Form.Item label="人员标签:">
            {getFieldDecorator("tags", {
              rules: [{ required: false}]
            })(
              <Select
                style={{
                  width: 370,
                }}
                maxTagCount={3}
                allowClear
                mode="multiple"
                onChange={handleChange}
              >
                {this.state.tagOptions.map((item, index) => (
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

export default Form.create({ name: "AddUserForm" })(AddUserForm);
