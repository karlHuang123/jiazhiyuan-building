import React, { Component } from "react";
import { Button, Form, Input, Modal, Select, message, Tooltip, Popconfirm } from "antd";
import BasicInfoForm from "./basic-info-form";
import TaskInfo from "./task-info";
import ReviewInfo from "./review-info";
import EditProjectTask from "./edit-project-task";
import EditProjectReview from "./edit-project-review";
import { getModelList } from "@/api/standrad";
import { getCarList } from "@/api/car";
import { editPlan, editPlanTask, editPlanReview, getPlanDetails, getTaskDetails, getTaskReviewDetails, rejectProject } from "@/api/produce";
const { TextArea } = Input
const { Option } = Select
class AddPlan extends Component {
  state = {
    searchName: '',
    projectList: [],
    currentDetails: null,
    activeIndex: -1,
    currentTaskData: null,
    currentTaskReview: null,
    showProjectTask: true,
    openEditTask: false,
    openReview: false,
    vehicleList: []
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
  getStateName = (state) => {
      let output = ''
      switch (state) {
          case 'PUBLISHING':
              output = '发布中'
              break;
          case 'PUBLISHED':
              output = '已发布'
              break;
          case 'CLOSED':
              output = '已关闭'
              break;
          case 'REVIEWED':
              output = '已复查'
              break;
      }
      return output
  }
  getTaskDetailsFun = async (id) => {
      const result = await getTaskDetails({projectId: id, planId: this.props.currentRowData.id})
      if (result.data.status === 'OK') {
        if (result.data.data) {
            this.setState({
                currentTaskData: result.data.data
            })
        } else {
            const tempReview = {
                projectId: id,
                checkDate: null, // 检查时间
                assemblePlace: "", // 集合地点
                groupLeaders: [], // 组长
                groupMembers: [], // 组员
                useCarInfos: []
            }
            this.setState({
                currentTaskData: tempReview
            })
        }
      }
  }
  getTaskReviewDetailsFun = async (id) => {
    const result = await getTaskReviewDetails({projectId: id})
    if (result.data.status === 'OK') {
        if (result.data.data) {
            this.setState({
                currentTaskReview: result.data.data
            })
        } else {
            const tempReview = {
                projectId: id,
                reviewProblems: [], // 复查问题
                reviewDate: null, // 检查时间
                assemblePlace: "", // 集合地点
                groupLeaders: [], // 组长
                groupMembers: [], // 组员
                useCarInfos: []
            }
            this.setState({
                currentTaskReview: tempReview
            })
        }
    }
}
getCarListFun = (data) => {
    getCarList(data).then(res => {
      if (res.data.status === 'OK') {
          let temp = []
          res.data.data.list.forEach(item => {
              const ele = {
                  label: item.model,
                  value: item.id
              }
              temp.push(ele)
          })
          this.setState({
              vehicleList: temp
          })
      }
    })
  }
  handleEditPlanOk = () => {
    const { form } = this.addBasicInfoFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const body = {
        id: values.id,
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
      editPlan(body).then((response) => {
        if (response.data.status === 'OK') {
        //   form.resetFields();
          this.props.onSuccess('success')
          message.success("编辑成功!")
        } else {
          message.success("编辑失败!")
        }
      }).catch(e => {
        message.error("编辑失败,请重试!")
      })
    });
  }
  getPlanDetailsFun = async (id) => {
      const result = await getPlanDetails({id: id})
      if (result.data.status === 'OK') {
          this.setState({
              currentDetails: result.data.data,
              projectList: result.data.data.projectList
          })
      }
  }
  itemClick = (item, index) => {
      this.setState({
          currentProjectId: item.id,
          currentTitle: item.projectName
      })
      this.getTaskDetailsFun(item.id)
      this.getTaskReviewDetailsFun(item.id)
      this.setState({
          activeIndex: index
      })
  }
  rejectProjectFun = (id, event) => {
    event.stopPropagation()
    rejectProject({projectId: id}).then(res => {
        if (res.data.status === 'OK') {
            message.success('项目驳回成功')
            this.getPlanDetailsFun(this.props.currentRowData.id)
        } else {
            message.error('驳回失败')
        }
    })
  }
  handleSubmit = (value) => {
      const body = {
        projectId: this.state.currentProjectId,
        planId: this.props.currentRowData.id,
        assemblePlace: value.assemblePlace,
        checkDate: value.checkDate,
        groupLeaders: value.groupLeadersNeo,
        groupMembers: value.groupMembersNeo,
        useCarInfos: value.useCarInfos
      }
      editPlanTask(body).then(res => {
          if (res.data.status === 'OK') {
              message.success('编辑项目信息成功')
              this.setState({
                  openEditTask: false
              })
              this.getTaskDetailsFun(this.state.currentProjectId)
              this.getTaskReviewDetailsFun(this.state.currentProjectId)
          } else {
              message.error(res.data.errorMsg)
          }
      })
  }
  handleReviewSubmit = (value) => {
    const body = {
        assemblePlace: value.assemblePlace,
        reviewDate: value.reviewDate,
        reviewProblems: value.reviewProblems,
        groupLeaders: value.groupLeadersNeo,
        groupMembers: value.groupMembersNeo,
        projectId: value.projectId,
        useCarInfos: value.useCarInfos
      }
      editPlanReview(body).then(res => {
          if (res.data.status === 'OK') {
              message.success('编辑项目复查信息成功')
              this.setState({
                  openReview: false
              })
              this.getTaskDetailsFun(this.state.currentProjectId)
              this.getTaskReviewDetailsFun(this.state.currentProjectId)
          } else {
              message.error(res.data.errorMsg)
          }
      })
  }
  deleteTaskInfo = () => {
    const body = {
        assemblePlace: '',
        checkDate: '',
        groupLeaders: [],
        groupMembers: [],
        projectId: this.state.currentProjectId,
        useCarInfos: []
      }
      editPlanTask(body).then(res => {
          if (res.data.status === 'OK') {
              message.success('编辑项目信息成功')
              this.setState({
                  openEditTask: false
              })
              this.getTaskDetailsFun(this.state.currentProjectId)
              this.getTaskReviewDetailsFun(this.state.currentProjectId)
          } else {
              message.error(res.data.errorMsg)
          }
      })
  }
  deleteTaskReview = () => {
    const body = {
        assemblePlace: '',
        checkDate: '',
        reviewProblems: [],
        groupLeaders: [],
        groupMembers: [],
        projectId: this.state.currentProjectId,
        useCarInfos: []
      }
      editPlanReview(body).then(res => {
          if (res.data.status === 'OK') {
              message.success('编辑项目信息成功')
              this.setState({
                  openEditTask: false
              })
              this.getTaskDetailsFun(this.state.currentProjectId)
              this.getTaskReviewDetailsFun(this.state.currentProjectId)
          } else {
              message.error(res.data.errorMsg)
          }
      }) 
  }
  componentDidMount() {
      this.getModelListFun()
      this.getPlanDetailsFun(this.props.currentRowData.id)
      this.getCarListFun({
        departmentId: null,
        licenseNo: null,
        day: null
      })
  }
  render() {
    const { clientList, currentRowData, onClose, planTypeList, modelList, deviceModelList, measurementModelList } = this.props;
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
                    onAdd={this.handleEditPlanOk}
                    planTypeList={planTypeList}
                    currentRowData={currentRowData}
                 />
            </div>
            <br />
            <br />
            <h1>计划详细信息：</h1>
            <div className="flex pl-20 pr-20 mb-10">
                <div className="half">
                    <div className="flex">
                        <Button type="primary">项目清单</Button>
                        <Input 
                            className="input-style" 
                            onPressEnter={(e) => {
                                this.setState({
                                    searchName: e.target.value
                                }, () => {
                                    if (this.state.searchName) {
                                        let tempOne = this.state.currentDetails
                                        let temp = this.state.currentDetails.projectList.filter(item => {
                                            return item.projectName.includes(this.state.searchName)
                                        })
                                        tempOne.projectList = temp
                                        this.setState({
                                            currentDetails: tempOne
                                        })
                                    } else {
                                        let tempOne = this.state.currentDetails
                                        tempOne.projectList = this.state.projectList
                                        this.setState({
                                            currentDetails: tempOne
                                        })
                                    }
                                })
                            }}
                            placeholder="请输入关键字">
                        </Input>
                    </div>
                    <div className="bg-white">
                        {this.state.currentDetails ? (
                            <div className="project-list">
                                {this.state.currentDetails.projectList.map((item, index) => (
                                    <div className="list-item" onClick={this.itemClick.bind(null, item, index)} key={item.id} style={{
                                        'borderBottom': this.state.activeIndex === index ? '2px solid rgb(0, 143, 224)' : '1px solid black'
                                    }}>
                                        <div className="project-name">
                                            <Tooltip title={item.projectName}>
                                                <div className="">{item.projectName}</div>
                                            </Tooltip>
                                        </div>
                                        <div className="btn-group">
                                            {item.state === 'CLOSED' ? (
                                                <div className="grid grid-3">
                                                    <div className="text-center">{this.getStateName(item.state)}</div>
                                                    <div className="text-center"><Button type="primary" onClick={this.rejectProjectFun.bind(null, item.id)}>驳回</Button></div>
                                                    <div className="text-center"><Button type="primary" onClick={() => {
                                                        this.setState({
                                                            openReview: true
                                                        })
                                                    }}>复查</Button></div>
                                                </div>
                                            ) : (
                                                <div>{this.getStateName(item.state)}</div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (<span></span>)}
                    </div>
                </div>
                <div className="half">
                    <div className="flex" style={{marginBottom: '20px'}}>
                        <Button type={this.state.showProjectTask ? 'primary' : ''} onClick={() => {
                            this.setState({
                                showProjectTask: true
                            })
                        }}>项目任务信息</Button>&nbsp;&nbsp;
                        <Button type={!this.state.showProjectTask ? 'primary' : ''} onClick={() => {
                            this.setState({
                                showProjectTask: false
                            })
                        }}>项目复查信息</Button>
                        <div className="flex-1 text-right">
                            <Button disabled={!this.state.currentTaskData} type="primary" onClick={() => {
                                if (this.state.showProjectTask) {
                                    this.setState({
                                        openEditTask: true
                                    })
                                } else {
                                    this.setState({
                                        openReview: true
                                    })
                                }
                            }}>编辑</Button>  
                            {this.state.showProjectTask ? (
                                <Popconfirm
                                    placement="topLeft"
                                    title={'该操作会清空所有项目信息，是否继续？'}
                                    okText="是"
                                    cancelText="否"
                                    onConfirm={this.deleteTaskInfo}
                                    >
                                    <Button style={{marginLeft: '10px'}} disabled={!this.state.currentTaskData} type="primary">清除任务信息</Button>  
                                </Popconfirm> 
                            ) : (
                                <Popconfirm
                                    placement="topLeft"
                                    title={'该操作会清空所有复查信息，是否继续？'}
                                    okText="是"
                                    cancelText="否"
                                    onConfirm={this.deleteTaskReview}
                                    >
                                    <Button style={{marginLeft: '10px'}} disabled={!this.state.currentTaskData} type="primary">清除复查信息</Button>  
                                </Popconfirm> 
                            )}                       
                            </div>
                    </div>
                    <div className="project-details bg-white">
                        {this.state.showProjectTask ? (
                            <TaskInfo currentTaskData={this.state.currentTaskData} currentTitle={currentRowData ? currentRowData.name : ''} />
                        ): (
                            <ReviewInfo currentTaskData={this.state.currentTaskReview} currentTitle={currentRowData ? currentRowData.name : ''} />
                        )}
                    </div>
                </div>
            </div>
            <div className="text-center">
                <Button type="primary" onClick={onClose}>返回</Button>
            </div>
            <EditProjectTask
                visible={this.state.openEditTask}
                vehicleList={this.state.vehicleList}
                currentTaskData={this.state.currentTaskData}
                projectName={this.state.currentTitle}
                onCancel={() => {this.setState({openEditTask: false})}}
                onSubmit={this.handleSubmit}
             />
            <EditProjectReview
                visible={this.state.openReview}
                vehicleList={this.state.vehicleList}
                currentTaskReview={this.state.currentTaskReview}
                projectName={this.state.currentTitle}
                onCancel={() => {this.setState({openReview: false})}}
                onSubmit={this.handleReviewSubmit}
             />
        </div>
    );
  }
}

export default AddPlan;
