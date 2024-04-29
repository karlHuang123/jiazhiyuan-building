import React, { Component } from "react";
import { Form, Input, Modal, Select } from "antd";
class EditConfigForm extends Component {

  render() {
    const { visible, onCancel, onOk, form, confirmLoading, currentRowData } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        title={'编辑'}
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        destroyOnClose
        confirmLoading={confirmLoading}
      >
        <Form>
          <Form.Item style={{height: '0', visibility: 'hidden', marginBottom: '0'}} label="id:">
            {getFieldDecorator("planId", {
               initialValue: currentRowData ? currentRowData.planId : '', 
            })(<Input placeholder="" />)}
          </Form.Item>
          <Form.Item style={{height: '0', visibility: 'hidden', marginBottom: '0'}} label="id:">
            {getFieldDecorator("projectId", {
               initialValue: currentRowData ? currentRowData.projectId : '', 
            })(<Input placeholder="" />)}
          </Form.Item>
          <Form.Item style={{marginBottom: '2px'}} label="计划名称:">
            {getFieldDecorator("projectName", {
                initialValue: currentRowData ? currentRowData.projectName : '', 
            })(<Input disabled placeholder="请输入模版编号" />)}
          </Form.Item>
          <Form.Item style={{marginBottom: '2px'}} label="分数:">
            {getFieldDecorator("score", {
                initialValue: currentRowData ? currentRowData.score : '', 
                rules: [{ required: true, message: "请输入分数!" }]
            })(<Input placeholder="请输入分数" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "EditConfigForm" })(EditConfigForm);
