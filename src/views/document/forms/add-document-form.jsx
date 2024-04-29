import React, { Component } from "react";
import { Form, Input, Modal, Select, Upload, Icon, Button, message, Cascader } from "antd";
const axios = require('axios');
const { Option } = Select;
const handleChange = (value) => {
  console.log(value);
}
function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
class AddDocumentForm extends Component {
  state = {
    uploading: false,
    fileList: [],
    previewVisible: false,
    previewImage: '',
    filePath: ''
  }
  uploadVehicleImage = (data) => {
    let formData = new FormData()
    formData.append('type', 'FILE')
    formData.append('file', data.file)
    this.saveFile(formData, data)
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
  saveFile = (formData, data) => {
    this.setState({
      uploading: true
    })
    axios.post('http://47.93.28.249:8181/admin/file/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
        console.log(response)
      if (response.data.status === 'OK') {
        data.onSuccess(response, data.file);
        message.success('上传成功')
        this.setState({
          uploading: false,
          filePath: response.data.data
        })
      }
    }).catch(error => {
      message.error('上传失败')
    });
  }
  handleRemoveImage = () => {
    this.props.removeImage('remove')
  }
  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };
  normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }
  render() {
    const { visible, onCancel, onOk, form, fileTypeOptions} = this.props;
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
        title="新增档案"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        destroyOnClose
    >
        <Form {...formItemLayout}>
        <Form.Item label="文件类型:">
            {getFieldDecorator("fileType", {
                rules: [{ required: true, message: "请选择文件类型" }]
            })(
                <Select
                allowClear
                labelInValue
                onChange={handleChange}
                style={{width: '80%'}}
                >
                {fileTypeOptions.map((item, index) => (
                    <Option value={item.value} key={index}>{item.label}</Option>
                ))}
                </Select>
            )}
        </Form.Item>
          <Form.Item label="备注:">
            {getFieldDecorator("remark", {
            })(<Input placeholder="请输入备注" />)}
          </Form.Item>
          <Form.Item label="档案文件:">
            {getFieldDecorator("fileUrl", {
              valuePropName: 'fileList',
              getValueFromEvent: this.normFile,
            })(
              <Upload 
                disabled={this.state.uploading}
                name={'file'}
                maxCount={1}
                multiple={false}
                customRequest={this.uploadVehicleImage}
                onRemove={this.handleRemoveImage}
                beforeUpload={this.checkFileSize}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
              >
                <Button disabled={this.state.fileList.length >= 1}>
                  <Icon type="upload"/>
                  上传文件
                </Button>
              </Upload>
            )}
          </Form.Item>
          <Form.Item label="文件路径:" style={{height: '0', visibility: 'hidden'}}>
            {getFieldDecorator("filePath", {
              initialValue: this.state.filePath
            })(<Input placeholder="请输入备注" />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "AddDocumentForm" })(AddDocumentForm);
