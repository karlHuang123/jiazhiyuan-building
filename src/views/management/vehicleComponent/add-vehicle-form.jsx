import React, { Component } from "react";
import { Form, Input, Modal, Select, Upload, Icon, Button, message, Cascader } from "antd";
import '../style/vehicle.less'
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
class AddCehicleForm extends Component {
  state = {
    uploading: false,
    fileList: [],
    previewVisible: false,
    previewImage: '',
  }
  uploadVehicleImage = (data) => {
    let formData = new FormData()
    formData.append('type', 'IMAGE')
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
      if (response.data.status === 'OK') {
        data.onSuccess(response, data.file);
        this.updateVehicleImage(response.data.data)
        message.success('上传成功')
        this.setState({
          uploading: false,
        })
      }
    }).catch(error => {
      message.error('上传失败')
    });
  }
  updateVehicleImage = (contractName) => {
    this.props.updateVehicleImage(contractName)
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
    const { visible, onCancel, onOk, form, departmentList, currentRowData, users } = this.props;
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
        title="新增车辆"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        destroyOnClose
      >
        <Form {...formItemLayout}>
         <Form.Item label="车牌号:">
            {getFieldDecorator("licenseNo", {
              rules: [{required: true, message: '请输入车牌号！'}],
            })(<Input/>)}
          </Form.Item>
          <Form.Item label="所属片区:">
            {getFieldDecorator("allDepartments", {
            })(
              <Cascader
                options={departmentList ? departmentList : []}
                expandTrigger="hover"
                onChange={handleChange} />
            )}
          </Form.Item>
          <Form.Item label="车辆型号:">
            {getFieldDecorator("model", {
            })(<Input placeholder="请输入车辆型号" />)}
          </Form.Item>
          <Form.Item label="初始里程:">
            {getFieldDecorator("initialMileage", {
            })(<Input placeholder="请输入初始里程" />)}
          </Form.Item>
          <Form.Item label="车辆图片:">
            {getFieldDecorator("carImages", {
              valuePropName: 'fileList',
              getValueFromEvent: this.normFile,
            })(
              <Upload 
                disabled={this.state.uploading}
                name={'file'}
                listType={'picture'}
                maxCount={1}
                multiple={false}
                customRequest={this.uploadVehicleImage}
                onRemove={this.handleRemoveImage}
                beforeUpload={this.checkFileSize}
                onPreview={this.handlePreview}
                accept=".png,.jpeg,.jpg"
              >
                <Button disabled={this.state.fileList.length >= 1}>
                  <Icon type="upload"/>
                  上传车辆图片
                </Button>
              </Upload>
            )}
          </Form.Item>
          <Form.Item label="司机:">
            {getFieldDecorator("driverId", {
            })(
              <Select
                style={{
                  width: 150,
                }}
                allowClear
                labelInValue
                onChange={handleChange}
              >
                {users.map((item, index) => (
                  <Option value={item.label} key={item.value}>{item.value}</Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="轨迹ID:">
            {getFieldDecorator("trackerId", {
            })(<Input placeholder="请输入轨迹ID" />)}
          </Form.Item>
        </Form>
        <Modal visible={this.state.previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
        </Modal>
      </Modal>
    );
  }
}

export default Form.create({ name: "AddCehicleForm" })(AddCehicleForm);
