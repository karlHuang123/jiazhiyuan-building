import React, { Component } from "react";
import { Form, Input, Modal, Select } from "antd";
import { reqValidatUserID } from "@/api/user";
const { Option } = Select
class AddSystemExpertForm extends Component {
  state = {
    systemList: [],
    typeList: [
        {
            label: '模糊数学',
            value: 'FUZZY_MATH'
        },
        {
            label: '打分',
            value: 'SCORE'
        }
    ]
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
    const { visible, onCancel, onOk, form, systemList } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        title={'新增专家'}
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        destroyOnClose
      >
        <Form>
          <Form.Item style={{marginBottom: '2px'}} label="体系:">
            {getFieldDecorator("modelSysId", {
              rules: [{ required: true, message: "请选择体系" }]
            })(
              <Select
                allowClear
                labelInValue
              >
                {systemList.map((item, index) => (
                  <Option value={item.value} key={index}>{item.label}</Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item style={{marginBottom: '2px'}} label="专家姓名:">
            {getFieldDecorator("name", {
              rules: [{ required: true, message: "请输入专家姓名!" }],
            })(<Input placeholder="请输入专家姓名" />)}
          </Form.Item>
          <Form.Item style={{marginBottom: '2px'}} label="专家类型:">
            {getFieldDecorator("types", {
              rules: [{ required: true, message: '请选择专家类型！'}]
            })(
              <Select
                maxTagCount={3}
                allowClear
                mode="multiple"
              >
                {this.state.typeList.map((item, index) => (
                  <Option value={item.value} key={index}>{item.label}</Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item style={{marginBottom: '2px'}} label="联系方式:">
            {getFieldDecorator("contact", {
            })(<Input placeholder="请输入联系方式" />)}
          </Form.Item>
          <Form.Item style={{marginBottom: '2px'}} label="矩阵权重:">
            {getFieldDecorator("matrixWeight", {
                rules: [{ required: true, message: '请输入矩阵权重！'}]
            })(<Input placeholder="请输入矩阵权重" />)}
          </Form.Item>
          <Form.Item style={{marginBottom: '2px'}} label="隶属度权重:">
            {getFieldDecorator("membershipWeight", {
                rules: [{ required: true, message: '请输入隶属度权重！'}]
            })(<Input placeholder="请输入隶属度权重" />)}
          </Form.Item>
          <Form.Item style={{marginBottom: '2px'}} label="专家调查权重:">
            {getFieldDecorator("expertInquiryWeight", {
                rules: [{ required: true, message: '请输入专家调查权重！'}]
            })(<Input placeholder="请输入专家调查权重" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "AddSystemExpertForm" })(AddSystemExpertForm);
