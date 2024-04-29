import React, { Component } from "react";
import { Form, Input, Modal } from "antd";
import { reqValidatUserID } from "@/api/user";
class EditLayerForm extends Component {
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
    const { visible, onCancel, onOk, form, confirmLoading, currentRow } = this.props;
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
                        initialValue: currentRow ? currentRow.id : '',
                    })(<Input/>)}
                </Form.Item>
            </div>
            <div>
                <Form.Item label="名称:">
                    {getFieldDecorator("name", {
                    initialValue: currentRow ? currentRow.name : '',
                    rules: [{ required: true, message: "请输入名称!" }],
                    })(<Input style={{marginLeft: '10px'}} placeholder="请输入名称" />)}
                </Form.Item>
            </div>
            <div>
                <Form.Item label="分数:">
                    {getFieldDecorator("score", {
                    initialValue: currentRow ? currentRow.score : '',
                    rules: [{ required: true, message: "请输入分数！" }],
                    })(<Input style={{marginLeft: '10px'}} placeholder="请输入分数" />)}
                </Form.Item>
            </div>
            <div>
                <Form.Item label="国际权重:">
                    {getFieldDecorator("weight", {
                    initialValue: currentRow ? currentRow.weight : '',
                    rules: [{ required: true, message: "请输入分数！" }],
                    })(<Input style={{marginLeft: '10px'}} placeholder="请输入分数" />)}
                </Form.Item>
            </div>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "EditLayerForm" })(EditLayerForm);
