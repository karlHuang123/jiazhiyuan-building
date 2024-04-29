import React, { Component } from "react";
import { getProjectUsageOptions } from '@/api/projects'
import { Form, Input, Modal, Checkbox, DatePicker } from "antd";
import '../style/projects.less'
import moment from 'moment'
const handleChange = (value) => {
  console.log(value);
}
const { TextArea } = Input
class UpdateProjectInfo extends Component {
  state = {
    projectUsageOptions: [],
    cityList: [],
    districtList: []
  }
  render() {
    const { visible, onCancel, onOk, form, dangerousOptions, superDangerousOptions, projectId, currentInfo } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        title="新增项目信息"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        width={'50%'}
        destroyOnClose
      >
        <Form>
        <div style={{height: '0', visibility: 'hidden'}}>
            <Form.Item label="id:" style={{height: '100%'}}>
              {getFieldDecorator("currentInfoId", {
                initialValue: currentInfo ? currentInfo.id : null
              })(<TextArea />)}
            </Form.Item>
          </div>
          <div style={{height: '0', visibility: 'hidden'}}>
            <Form.Item label="id:" style={{height: '100%'}}>
              {getFieldDecorator("projectId", {
                initialValue: projectId ? projectId : null
              })(<TextArea />)}
            </Form.Item>
          </div>
          <Form.Item label="项目详情:">
            {getFieldDecorator("detail", {
                initialValue: currentInfo ? currentInfo.detail : '',
            })(<TextArea />)}
          </Form.Item>
          <Form.Item label="形象进度:">
            {getFieldDecorator("progress", {
                initialValue: currentInfo ? currentInfo.progress : '',
            })(<TextArea />)}
          </Form.Item>
          <Form.Item label="危大工程:">
            {getFieldDecorator("dangerousOptions", {
                initialValue: currentInfo ? currentInfo.dangerousOptions : [],
            })(
              <Checkbox.Group options={dangerousOptions}/>
            )}
          </Form.Item>
          <Form.Item label="超危大工程:">
            {getFieldDecorator("superDangerousOptions", {
                initialValue: currentInfo ? currentInfo.superDangerousOptions : [],
            })(
              <Checkbox.Group options={superDangerousOptions}/>
            )}
          </Form.Item>
          <Form.Item label="近一季度施工进展情况:">
            {getFieldDecorator("progressThisSeason", {
                initialValue: currentInfo ? currentInfo.progressThisSeason : '',
            })(<TextArea />)}
          </Form.Item>
          <Form.Item label="更新时间:">
            {getFieldDecorator("updateDate", {
                initialValue: currentInfo ? moment(currentInfo.updateDate) : null,
            })(<DatePicker format={'YYYY/MM/DD'} />)}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "UpdateProjectInfo" })(UpdateProjectInfo);
