import React, { Component } from "react";
import { Form, Input, Select, Modal, Cascader } from "antd";
const { Option } = Select;
const handleChange = (value) => {
  console.log(value);
}
class EditUserForm extends Component {
  state = {
    positionOptions: [
      {
        value: '项目经理',
        label: 0,
      },
      {
        value: '总工程师',
        label: 1,
      },
      {
        value: '调度员',
        label: 2,
      },
      {
        value: '采购员',
        label: 3,
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
  render() {
    const {
      visible,
      onCancel,
      onOk,
      form,
      confirmLoading,
      currentRowData,
      departmentList,
    } = this.props;
    const { getFieldDecorator } = form;
    const { id, username, mobile, allDepartments, position, nickname, email, tags } = currentRowData;
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
        confirmLoading={confirmLoading}
      >
        <Form {...formItemLayout}>
          <Form.Item label="用户id:">
            {getFieldDecorator("id", {
              initialValue: id,
            })(<Input disabled placeholder="请输入手机号" />)}
          </Form.Item>
          <Form.Item label="用户名称:">
            {getFieldDecorator("username", {
              rules: [{ required: true, message: "请输入用户名称!" }],
              initialValue: username
            })(<Input placeholder="请输入用户名称" />)}
          </Form.Item>
          <Form.Item label="手机号:">
            {getFieldDecorator("mobile", {
              rules: [{ required: true, message: "手机号不能为空" }],
              initialValue: mobile
            })(<Input placeholder="请输入手机号" />)}
          </Form.Item>
          <Form.Item label="部门:">
            {getFieldDecorator("allDepartments", {
              initialValue: allDepartments ? allDepartments : [],
            })(
              <Cascader
                options={departmentList ? departmentList : []}
                expandTrigger="hover"
                onChange={handleChange} />
            )}
          </Form.Item>
          <Form.Item label="岗位:">
            {getFieldDecorator("position", {
              rules: [{ required: true, message: "请选择岗位" }],
              initialValue: {key: position, label: position}
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
                  <Option value={item.label} key={item.value}>{item.value}</Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="昵称:">
            {getFieldDecorator("nickname", {
              rules: [{ required: false}],
              initialValue: nickname
            })(<Input placeholder="请输入昵称" />)}
          </Form.Item>
          <Form.Item label="邮箱:">
            {getFieldDecorator("email", {
              rules: [{ required: false}],
              initialValue: email
            })(<Input placeholder="邮箱" />)}
          </Form.Item>
          <Form.Item label="人员标签:">
            {getFieldDecorator("tags", {
              rules: [{ required: false}],
              initialValue: tags
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

export default Form.create({ name: "EditUserForm" })(EditUserForm);
