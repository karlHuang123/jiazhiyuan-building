import React, { Component } from "react";
import { Form, Input, Modal } from "antd";
import { reqValidatUserID } from "@/api/user";
import '../style/standrad.less'
class EditMembershipForm extends Component {
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
    const { visible, onCancel, onOk, form, confirmLoading, currentRowData } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        title='编辑'
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        destroyOnClose
        confirmLoading={confirmLoading}
      >
        <Form>
            <div className="p-10" style={{height: '0', visibility: 'hidden'}}>
                <Form.Item label="项目名称:" style={{height: '100%'}}>
                    {getFieldDecorator("id", {
                        initialValue: currentRowData ? currentRowData.id : '',
                    })(<Input/>)}
                </Form.Item>
            </div>
            <div className="grid grid-1">
                <Form.Item label="四级隐患:" style={{marginRight: '10px'}}>
                    {getFieldDecorator("fourth", {
                    initialValue: currentRowData ? currentRowData.forth : '',
                    })(<Input disabled />)}
                </Form.Item>
                <Form.Item label="三级隐患:">
                    {getFieldDecorator("third", {
                    initialValue: currentRowData ? currentRowData.third : '',
                    })(<Input disabled />)}
                </Form.Item>
            </div>
            <div className="grid grid-1">
                <Form.Item label="二级隐患:" style={{marginRight: '10px'}}>
                    {getFieldDecorator("second", {
                    initialValue: currentRowData ? currentRowData.second : '',
                    })(<Input disabled />)}
                </Form.Item>
                <Form.Item label="一级隐患:">
                    {getFieldDecorator("first", {
                    initialValue: currentRowData ? currentRowData.first : '',
                    })(<Input disabled />)}
                </Form.Item>
            </div>
            <div className="grid grid-1">
                <Form.Item label="可忽略:" style={{marginRight: '10px'}}>
                    {getFieldDecorator("canIgnore", {
                    initialValue: currentRowData ? currentRowData.canIgnore : '',
                    rules: [{ required: true, message: "请输入!" }],
                    })(<Input placeholder="请输入可忽略值" />)}
                </Form.Item>
                <Form.Item label="可容忍:">
                    {getFieldDecorator("canEndure", {
                    initialValue: currentRowData ? currentRowData.canEndure : '',
                    })(<Input placeholder="请输入可容忍值" />)}
                </Form.Item>
            </div>
            <div className="grid grid-1">
                <Form.Item label="可接受:" style={{marginRight: '10px'}}>
                    {getFieldDecorator("canAccept", {
                    initialValue: currentRowData ? currentRowData.canAccept : '',
                    rules: [{ required: true, message: "请输入!" }],
                    })(<Input placeholder="请输入可接受值" />)}
                </Form.Item>
                <Form.Item label="不可接受:">
                    {getFieldDecorator("canNotAccept", {
                    initialValue: currentRowData ? currentRowData.canNotAccept : '',
                    })(<Input placeholder="请输入不可接受值" />)}
                </Form.Item>
            </div>
            <div className="grid grid-1">
                <Form.Item label="可拒绝:" style={{marginRight: '10px'}}>
                    {getFieldDecorator("reject", {
                    initialValue: currentRowData ? currentRowData.reject : '',
                    rules: [{ required: true, message: "请输入!" }],
                    })(<Input placeholder="请输入可拒绝值" />)}
                </Form.Item>
            </div>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "EditMembershipForm" })(EditMembershipForm);
