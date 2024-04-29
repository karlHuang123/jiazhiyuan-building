import React, { Component } from "react";
import { Button, Form, Input, Modal, Select, message } from "antd";
import BasicInfoForm from "./basic-info-form";
import { getModelList } from "@/api/standrad";
import { addPlan } from "@/api/produce";
const { TextArea } = Input
const { Option } = Select
class AddPlan extends Component {
  state = {

  }
  getModelListFun = async () => {
    const result = await getModelList({
        currPage: 1,
        pageSize: 20000,
        type: 'SYSTEM',
        keyword: ''
    })
    if (result.data.status === 'OK') {
      let temp = []
      result.data.data.list.forEach(item => {
        const ele = {
          label: item.name,
          value: item.id
        }
        temp.push(ele)
      })
      this.setState({
        modelList: temp
      })
    }
  }
  handleAddPlanOk = () => {
    const { form } = this.addBasicInfoFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const body = {
        name: values.name, // 计划名称
        type: values.type ? values.type : '',
        clientId: parseInt(values.clientId), // 委托方
        checkSysId: parseInt(values.checkSysId), // 检查体系
        fuzzyExpert: values.fuzzyExpert.length > 0 ? values.fuzzyExpert.join(',') : '', // 模糊数学专家
        scoreExpert: values.scoreExpert.length > 0 ? values.scoreExpert.join(',') : '', // 打分表专家
        measureModelId: values.measureModelId ? parseInt(values.measureModelId) : null, //实测实量模型
        deviceModelId: values.deviceModelId ? parseInt(values.deviceModelId) : null, // 设备体系模型
        deviceModelVersion: values.deviceModelVersion ? values.deviceModelVersion : '', // 设备体系版本号
        deviceFuzzyExpert: values.deviceFuzzyExpert.length > 0 ? values.deviceFuzzyExpert.join(',') : '',
        deviceScoreExpert: values.deviceScoreExpert.length > 0 ? values.deviceScoreExpert.join(',') : '',
      }
      addPlan(body).then((response) => {
        if (response.data.status === 'OK') {
        //   form.resetFields();
          this.props.onSuccess('success')
          message.success("添加成功!")
        } else {
          message.error(response.data.errorMsg)
        }
      }).catch(e => {
        message.error("编辑失败,请重试!")
      })
    });
  }
  componentDidMount() {
      this.getModelListFun()
  }
  render() {
    const { clientList, onClose, planTypeList, modelList, deviceModelList, measurementModelList } = this.props;
    return (
        <div className="add-plan-container">
            <h1>计划基本信息：</h1>
            <div className="basic-info">
                <BasicInfoForm
                    wrappedComponentRef={formRef => this.addBasicInfoFormRef = formRef}
                    clientList={clientList}
                    modelList={modelList}
                    measurementModelList={measurementModelList}
                    deviceModelList={deviceModelList}
                    planTypeList={planTypeList}
                    onAdd={this.handleAddPlanOk}
                 />
            </div>
            <br />
            <br />
            <h1>计划详细信息：</h1>
            <div className="flex pl-20 pr-20">
                <div className="half">
                    <div className="flex">
                        <Button type="primary">项目清单</Button>
                        <Input className="input-style" placeholder="请输入关键字"></Input>
                    </div>
                    <div className="project-list bg-white"></div>
                </div>
                <div className="half">
                    <div className="flex" style={{marginBottom: '20px'}}>
                        <Button type="primary">项目任务信息</Button>
                    </div>
                    <div className="project-details bg-white"></div>
                </div>
            </div>
            <div className="text-center">
                <Button type="primary" onClick={onClose}>返回</Button>
            </div>
        </div>
    );
  }
}

export default AddPlan;
