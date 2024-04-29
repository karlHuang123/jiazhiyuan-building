import React, { Component } from "react";
import { Form, Input, Modal, Select, Button, Icon, message, Upload } from "antd";
import '../style/standrad.less'
const axios = require('axios');
const { Option } = Select
class EditProbsForm extends Component {
  state = {
      numOptions: [
          {label: '3', value: '3.0'},
          {label: '2', value: '2.0'},
          {label: '1', value: '1.0'},
      ],
      incidentTypeOptions: [
        {label: '默认', value: 'DEFAULT'},
        {label: '车辆伤害', value: 'VEHICLE_INJURY'},
        {label: '起重伤害', value: 'CRANE_INJURY'},
        {label: '触电', value: 'ELECTRIC_SHOCK'}
      ],
      incidentCase: '',
      fileList: []
  }

  addSpecificTerm = () => {
    const { form } = this.props;
    // 获取 specificTermList 的控件值数组
    const specificTermList = form.getFieldValue('specificTermList');
    // 创建新的 key
    specificTermList.push({
        info: '',
        nth: specificTermList.length + 1,
        type: 'SPECIFIC_TERMS'
    })
    // 添加新的控件值
    form.setFieldsValue({
      specificTermList: specificTermList,
    });
  }

  handleSpecificTermListItem = (index, event) => { //绑定对应的值
    const { form } = this.props;
    const specificTermList = form.getFieldValue('specificTermList');
    specificTermList[index].info = event.target.value
    form.setFieldsValue({
      specificTermList: specificTermList,
    });
  }

  handleSuggestAction = (index, event) => {
    const { form } = this.props;
    const suggestActionList = form.getFieldValue('suggestActionList');
    suggestActionList[index].info = event.target.value
    form.setFieldsValue({
      suggestActionList: suggestActionList,
    });
  }

  handleProblemNumSetListChange = (obj, event) => {
    const { form } = this.props;
    const problemNumSetList = form.getFieldValue('problemNumSetList');
    problemNumSetList[obj.index][obj.key] = event.target.value
    form.setFieldsValue({
      problemNumSetList: problemNumSetList,
    });
  }

  handleProblemScaleSetListChange = (obj, event) => {
    const { form } = this.props;
    const problemScaleSetList = form.getFieldValue('problemScaleSetList');
    problemScaleSetList[obj.index][obj.key] = event.target.value
    form.setFieldsValue({
      problemScaleSetList: problemScaleSetList,
    });
  }

  addSuggestActionList = () => {
    const { form } = this.props;
    // 获取 suggestActionList 的控件值数组
    const suggestActionList = form.getFieldValue('suggestActionList');
    // 创建新的 key
    suggestActionList.push({
        info: '',
        nth: suggestActionList.length + 1,
        type: 'SUGGEST_ACTIONS'
    })
    // 添加新的控件值
    form.setFieldsValue({
      suggestActionList: suggestActionList,
    });
  }

  addProblemNumSetList = () => {
    const { form } = this.props;
    // 获取 problemNumSetList 的控件值数组
    const problemNumSetList = form.getFieldValue('problemNumSetList');
    // 创建新的 key
    problemNumSetList.push({name: '', value: '', deductPoint: '', additionPoint: ''})
    // 添加新的控件值
    form.setFieldsValue({
      problemNumSetList: problemNumSetList,
    });
  }

  addProblemScaleSetList = () => {
    const { form } = this.props;
    // 获取 problemScaleSetList 的控件值数组
    const problemScaleSetList = form.getFieldValue('problemScaleSetList');
    // 创建新的 key
    problemScaleSetList.push({name: '', factor: ''})
    // 添加新的控件值
    form.setFieldsValue({
      problemScaleSetList: problemScaleSetList,
    });
  }

  deleteProblemScaleSet = (indexC) => {
    const { form } = this.props;
    const problemScaleSetList = form.getFieldValue('problemScaleSetList');
    // 创建新的 key
    const temp = problemScaleSetList.filter((item, index) => {
        return index !== indexC
    })
    // 添加新的控件值
    form.setFieldsValue({
      problemScaleSetList: temp,
    });
  }

  deleteProblemNumSet = (indexC) => {
    const { form } = this.props;
    const problemNumSetList = form.getFieldValue('problemNumSetList');
    // 创建新的 key
    const temp = problemNumSetList.filter((item, index) => {
        return index !== indexC
    })
    // 添加新的控件值
    form.setFieldsValue({
      problemNumSetList: temp,
    });
  }

  deleteSpecificTerm = (indexC) => {
    const { form } = this.props;
    const specificTermList = form.getFieldValue('specificTermList');
    // 创建新的 key
    const temp = specificTermList.filter((item, index) => {
        return index !== indexC
    })
    // 添加新的控件值
    form.setFieldsValue({
      specificTermList: temp,
    });
  }

  deleteSuggestActionList= (indexC) => {
    const { form } = this.props;
    const suggestActionList = form.getFieldValue('suggestActionList');
    // 创建新的 key
    const temp = suggestActionList.filter((item, index) => {
        return index !== indexC
    })
    // 添加新的控件值
    form.setFieldsValue({
      suggestActionList: temp,
    });
  }

  normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  }

  uploadVehicleFile = (data) => {
    let formData = new FormData()
    formData.append('type', 'FILE')
    formData.append('file', data.file)
    this.saveFile(formData, data)
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
        message.success('上传成功')
        this.setState({
          uploading: false,
          incidentCase: response.data.data
        })
      }
    })
  }


  render() {
    const { visible, onCancel, onOk, form, currentRow } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    getFieldDecorator('specificTermList', 
        { initialValue: currentRow ? currentRow.specificTermList : [{info: '', nth: 1, type: 'SPECIFIC_TERMS'}] });
    const specificTermList = getFieldValue('specificTermList');

    const specificTermListItems = specificTermList.map((item, index) => (
      <Form.Item key={index}>
          <div className="flex align-center">
            {index + 1}、<Input defaultValue={item.info} style={{width: '90%'}} placeholder="请输入规范与条款" onChange={this.handleSpecificTermListItem.bind(null, index)} />
            {index > 0 ? (
              <Button type="danger" style={{marginLeft: '10px'}} onClick={this.deleteSpecificTerm.bind(null, index)}>删除</Button>
            ) : (<Button type="primary" style={{marginLeft: '10px'}} onClick={this.addSpecificTerm}>添加</Button>)}
          </div>
      </Form.Item>
    ));

    getFieldDecorator('suggestActionList', 
        { initialValue: currentRow ? currentRow.suggestActionList : [{info: '', nth: 1, type: 'SUGGEST_ACTIONS'}] });
    const suggestActionList = getFieldValue('suggestActionList');

    const suggestActionListItems = suggestActionList.map((item, index) => (
      <Form.Item key={index}>
          <div className="flex align-center">
            {index + 1}、<Input defaultValue={item.info} style={{width: '90%'}} placeholder="请输入建议措施" onChange={this.handleSuggestAction.bind(null, index)} />
            {index > 0 ? (
              <Button type="danger" style={{marginLeft: '10px'}} onClick={this.deleteSuggestActionList.bind(null, index)}>删除</Button>
            ) : (<Button type="primary" style={{marginLeft: '10px'}} onClick={this.addSuggestActionList}>添加</Button>)}
          </div>
      </Form.Item>
    ));

    getFieldDecorator('problemNumSetList', 
        { initialValue: currentRow ? currentRow.problemNumSetList : [{name: '', value: '', deductPoint: '', additionPoint: ''}]});
    const problemNumSetList = getFieldValue('problemNumSetList');

    const problemNumSetListItems = problemNumSetList.map((item, index) => (
        <div className="flex" key={index}>
            <div className="grid grid-1 flex-1-1">
                <Form.Item label="名称：" rules={[{ required: true, message: "请输入名称!" }]}>
                  <Input 
                    style={{width: '95%'}} 
                    defaultValue={item.name}
                    onChange={this.handleProblemNumSetListChange.bind(null, {index: index, key: 'name'})}
                    placeholder="请输入名称" />
                </Form.Item>
                <Form.Item label="对应数值(Rn)：">
                  <Input 
                      style={{width: '95%'}} 
                      defaultValue={item.value}
                      placeholder="请输入对应数值(Rn)" 
                      onChange={this.handleProblemNumSetListChange.bind(null, {index: index, key: 'value'})} />
                </Form.Item>
                <Form.Item label="扣除分数">
                  <Input 
                      style={{width: '95%'}} 
                      defaultValue={item.deductPoint}
                      placeholder="请输入扣除分数" 
                      onChange={this.handleProblemNumSetListChange.bind(null, {index: index, key: 'deductPoint'})} />
                </Form.Item>
                <Form.Item label="附加分数">
                  <Input 
                    style={{width: '95%'}} 
                    placeholder="请输入附加分数" 
                    defaultValue={item.additionPoint}
                    onChange={this.handleProblemNumSetListChange.bind(null, {index: index, key: 'additionPoint'})} />
                </Form.Item>
            </div>
            <div className="btn-container">
                {index > 0 ? (
                <Button type="danger" style={{marginLeft: '10px'}} onClick={this.deleteProblemNumSet.bind(null, index)}>删除</Button>
                ) : (<Button type="primary" style={{marginLeft: '10px'}} onClick={this.addProblemNumSetList}>添加</Button>)}
            </div>
        </div>
    ));

    getFieldDecorator('problemScaleSetList', 
        { initialValue: currentRow ? currentRow.problemScaleSetList : [{name: '', factor: ''}]});
    const problemScaleSetList = getFieldValue('problemScaleSetList');

    const problemScaleSetListItems = problemScaleSetList.map((item, index) => (
        <div className="flex" key={index}>
            <div className="grid grid-1 flex-1-1">
                <Form.Item label="规模名称">
                  <Input 
                    style={{width: '95%'}} 
                    placeholder="请输入规模名称" 
                    defaultValue={item.name}
                    onChange={this.handleProblemScaleSetListChange.bind(null, {index: index, key: 'name'})} />
                </Form.Item>
                <Form.Item label="对应规模系数：">
                  <Input 
                    style={{width: '95%'}} 
                    placeholder="请输入对应规模系数" 
                    defaultValue={item.factor}
                    onChange={this.handleProblemScaleSetListChange.bind(null, {index: index, key: 'factor'})} />
                </Form.Item>
            </div>
            <div className="btn-container">
                {index > 0 ? (
                <Button type="danger" style={{marginLeft: '10px'}} onClick={this.deleteProblemScaleSet.bind(null, index)}>删除</Button>
                ) : (<Button type="primary" style={{marginLeft: '10px'}} onClick={this.addProblemScaleSetList}>添加</Button>)}
            </div>
        </div>
    ));
    return (
      <Modal
        title="编辑问题"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        width={'60%'}
        destroyOnClose
      >
        <Form>
          <Form.Item label="id:" style={{height: '0', visibility: 'hidden'}}>
            {getFieldDecorator("id", {
              initialValue: currentRow ? currentRow.id : ''
            })(<Input placeholder="请输入备注" />)}
          </Form.Item>
          <div className="grid grid-1">
            <Form.Item label="描述:">
                {getFieldDecorator("description", {
                initialValue: currentRow ? currentRow.description : '',
                rules: [{ required: true, message: "请输入名称!" }],
                })(<Input style={{width: '95%'}} placeholder="请输入名称" />)}
            </Form.Item>
            <Form.Item label="数值:">
                {getFieldDecorator("numValue", {
                 initialValue: currentRow ? currentRow.numValue : '',   
                rules: [{ required: true, message: "请选择数值!" }],
                })(
                    <Select
                        allowClear
                    >
                        {this.state.numOptions.map((item, index) => (
                        <Option value={item.value} key={index}>{item.label}</Option>
                        ))}
                    </Select>
                )}
            </Form.Item>
          </div>
          <Form.Item style={{marginBottom: '0'}} label="规范与条款:">
              {specificTermListItems}
          </Form.Item>
          <Form.Item label="建议措施:">
              {suggestActionListItems}
          </Form.Item>
        </Form>
        <div className="grid grid-1">
            <Form.Item label="事故类型:">
            {getFieldDecorator("incidentType", {
              initialValue: currentRow && currentRow.incidentType ? currentRow.incidentType : []
                })(
                    <Select
                        style={{width: '95%'}}
                        allowClear
                        mode="multiple"
                    >
                        {this.state.incidentTypeOptions.map((item, index) => (
                            <Option value={item.value} key={index}>{item.label}</Option>
                        ))}
                    </Select>
                )}
            </Form.Item>
            <Form.Item label="点评范式:">
                {getFieldDecorator("reviewParadigm", {
                  initialValue: currentRow ? currentRow.reviewParadigm : ''
                    })(<Input style={{width: '95%'}} placeholder="请输入点评范式" />)}
            </Form.Item>
            <Form.Item label="责任人:">
                {getFieldDecorator("responsiblePerson", {
                  initialValue: currentRow ? currentRow.responsiblePerson : ''
                    })(<Input style={{width: '95%'}} placeholder="请输入责任人" />)}
            </Form.Item>
            <Form.Item label="责任部门:">
                {getFieldDecorator("responsibleDepartment", {
                  initialValue: currentRow ? currentRow.responsibleDepartment : ''
                    })(<Input style={{width: '95%'}} placeholder="请输入责任部门" />)}
            </Form.Item>
          </div>
          <Form.Item label="问题数量集合">
              {problemNumSetListItems}
          </Form.Item>
          <Form.Item label="对应规模集合">
              {problemScaleSetListItems}
          </Form.Item>
          <Form.Item label="事故案例:">
            {getFieldDecorator("incidentCaseC", {
              valuePropName: 'fileList',
              getValueFromEvent: this.normFile,
            })(
              <Upload 
                disabled={this.state.uploading}
                name={'file'}
                maxCount={1}
                multiple={false}
                customRequest={this.uploadVehicleFile}
                onRemove={() => {
                  this.setState({
                    incidentCase: ''
                  })
                }}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
              >
                <Button disabled={this.state.fileList.length >= 1}>
                  <Icon type="upload"/>
                  上传文件
                </Button>
              </Upload>
            )}
          </Form.Item>
          <Form.Item label="" style={{height: this.state.fileList.length > 0 ? '0' : 'auto', visibility: this.state.fileList.length > 0 ? 'hidden' : 'visible'}}>
            {getFieldDecorator("incidentCase", {
              initialValue: currentRow ? currentRow.incidentCase : ''
            })(<Input style={{visibility: currentRow?.incidentCase ? 'hidden' : 'visible'}} disabled placeholder="请输入备注" />)}
          </Form.Item>
      </Modal>
    );
  }
}

export default Form.create({ name: "EditProbsForm" })(EditProbsForm);
