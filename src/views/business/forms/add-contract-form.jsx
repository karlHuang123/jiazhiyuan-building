import React, { Component } from "react";
import { Form, Input, Modal, Select, Upload, Icon, Button, message } from "antd";
const axios = require('axios');
const { Option } = Select;
const handleChange = (value) => {
  console.log(value);
}
class AddContractForm extends Component {
  state = {
    statusOptions: [
      {
        value: 0,
        label: '未开始'
      },
      {
        value: 1,
        label: '执行中'
      },
      {
        value: 2,
        label: '已完成'
      }
    ],
    uploading: false,
    fileList: []
  }
  uploadContract = (type, data) => {
    let formData = new FormData()
    formData.append('type', 'FILE')
    formData.append('file', data.file)
    this.saveFile(formData, data, type)
  }
  checkFileSize = (file) => {
    return new Promise((resolve, reject) => {
      // 使用promise不会进入upload的change事件
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        message.error('合同文件大小不能超过10M。')
        return reject(false)
      }
      return resolve(true)
    })
  }
  saveFile = (formData, data, type) => {
    this.setState({
      uploading: true
    })
    axios.post('http://47.93.28.249:8181/admin/file/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
      if (response.data.status === 'OK') {
        data.onSuccess(response, data.file);
        if (type === 'contract') {
          this.updateContract(response.data.data)
        } else {
          this.updateTechFile(response.data.data)
        }
        this.setState({
          uploading: false,
        })
      }
    }).catch(error => {
      message.error('上传失败')
    });
  }
  updateContract = (contractName) => {
    this.props.updateContract(contractName)
  }
  updateTechFile = (techName) => {
    this.props.updateTechFile(techName)
  }
  handleRemoveContract = () => {
    this.props.updateContract('')
  }
  handleRemoveTech = () => {
    this.props.updateTechFile('')
  }
  normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }
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
        title="新增合同"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        destroyOnClose
        confirmLoading={confirmLoading}
      >
        <Form {...formItemLayout}>
          <Form.Item label="委托方:">
            {getFieldDecorator(`client[${'type'}]`, {
              rules: [{ required: true, message: "请选择委托方" }]
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
          <Form.Item label="合同编号:">
            {getFieldDecorator("contractNo", {
              rules: [{ required: true, message: "请输入合同编号!" }],
            })(<Input style={{marginLeft: '10px'}} placeholder="请输入合同编号" />)}
          </Form.Item>
          <Form.Item label="状态:">
            {getFieldDecorator("contractState", {
              rules: [{ required: true, message: "请选择状态" }]
            })(
              <Select
                allowClear
                labelInValue
                onChange={handleChange}
                style={{marginLeft: '10px'}}
              >
                {this.state.statusOptions.map((item, index) => (
                  <Option value={item.value} key={index}>{item.label}</Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="合同文件:">
            {getFieldDecorator("contractFile", {
              rules: [{ required: true, message: "请上传合同" }],
              valuePropName: 'fileList',
              getValueFromEvent: this.normFile,
            })(
              <Upload 
                disabled={this.state.uploading}
                name={'file'}
                maxCount={1}
                multiple={false}
                customRequest={this.uploadContract.bind(null, 'contract')}
                onRemove={this.handleRemoveContract}
                beforeUpload={this.checkFileSize}
                accept=".pdf,.doc,.docx"
              >
                <Button style={{marginLeft: '10px'}}>
                  <Icon type="upload" />
                  上传文件
                </Button>
              </Upload>
            )}
          </Form.Item>
          <Form.Item label="技术服务方案:" name="upload">
            {getFieldDecorator("techServiceFile", {
              rules: [{ required: true, message: "请上传服务方案" }],
              valuePropName: 'fileList',
              getValueFromEvent: this.normFile,
            })(
              <Upload 
                disabled={this.state.uploading}
                name={'file'}
                maxCount={1}
                multiple={false}
                customRequest={this.uploadContract.bind(null, 'tech')}
                onRemove={this.handleRemoveTech}
                beforeUpload={this.checkFileSize}
                accept=".pdf,.doc,.docx"
              >
                <Button style={{marginLeft: '10px'}}>
                  <Icon type="upload" />
                  上传文件
                </Button>
              </Upload>
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "AddContractForm" })(AddContractForm);
