import React, { Component } from "react";
import { Card, Button, Table, message, Divider, Input, Select, Modal, Icon, Popconfirm } from "antd";
import { getBusinessDataProbList, deleteDataProblem, getProjectScore } from "@/api/business";
import { getProjectList } from "@/api/projects";
import { getPlanList } from "@/api/produce";
import { getModuleList } from "@/api/report"
import GenerateReportForm from "./forms/generate-report-form";
import ProjectScoreTable from "./components/projectScoreTable"
import '../business/style/clientInfo.less'
import moment from "moment";
const { Column } = Table;
const { Option } = Select
const axios = require('axios');
class DataProb extends Component {
  state = {
    dataProbs: [],
    planOptions: [],
    projectOptions: [],
    templateOptions: [],
    openGenerateReport: false,
    openProjectScore: false,
    showDetails: false,
    currentTemplateConfig: null,
    getDataProbBody: {
        currPage: 1,
        pageSize: 20000,
        type: 'SYSTEM',
        sysId: '',
        planId: undefined,
        projectId: undefined
      },
      currentData: null
  };
  getBusinessDataProbListFun = async () => {
    const result = await getBusinessDataProbList(this.state.getDataProbBody)
    if (result.data.status === 'OK') {
      this.setState({
        dataProbs: result.data.data.list
      })
    }
  }
  getProjectListOptions = async () => {
    const result = await getProjectList({
      currPage: 1,
      pageSize: 20000,
      projectId: null,
      planId: null
    })
    if (result.data.status === 'OK') {
      let temp = []
      result.data.data.list.forEach(item => {
        const ele = {
          label: item.projectName,
          value: item.id
        }
        temp.push(ele)
      })
      this.setState({
        projectOptions: temp
      })
    }
  }
  getModuleListFun = async () => {
    const result = await getModuleList()
    if (result.data.status === 'OK') {
      let temp = []
      result.data.data.list.forEach(item => {
        const ele = {
          label: item.templateTypeName,
          value: item.id
        }
        temp.push(ele)
      })
      this.setState({
        templateOptions: temp
      })
    }
  }
  getPlanListOptions = async () => {
    const result = await getPlanList({
      currPage: 1,
      pageSize: 20000,
      projectId: null,
      planId: null
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
        planOptions: temp
      })
    }
  }
  generateReport = () => {
    this.setState({
      openGenerateReport: true
    })
  }
  // async downloadContractFun(fileName, index) {
  //   this.contractFileList[index].spinning = true
  //   await downloadContract(
  //     this.contractFileList[index].studentId,
  //     fileName
  //   ).then((res) => {
  //     console.log(res)
  //     if (!res.headers['content-disposition']) {
  //       message.error(`合同文件${fileName}不存在，请联系教务重新上传`)
  //     } else {
  //       let blob = res.data
  //       const finalFileName = decodeURI(
  //         res.headers['content-disposition'].split(';')[1].split('=')[1]
  //       )
  //       let downloadElement = document.createElement('a')
  //       let href = window.URL.createObjectURL(blob) //创建下载的链接
  //       downloadElement.href = href
  //       downloadElement.setAttribute('download', finalFileName)
  //       document.body.appendChild(downloadElement)
  //       downloadElement.click() //点击下载
  //       document.body.removeChild(downloadElement) //下载完成移除元素
  //       window.URL.revokeObjectURL(href) //释放掉blob对象
  //     }
  //   })
  //   this.contractFileList[index].spinning = false
  // }
  generate = () => {
    const { form } = this.generateReportForm.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const body = {
        plan_id: values.planId, // 模板类型
        project_id: values.projectId, // 模板编号
        template_id: values.templateId, // 模板子编号
      }
      let downloadElement = document.createElement('a')
      downloadElement.href = `http://47.93.28.249:8020/api/report_build?template_id=${values.templateId}&plan_id=${values.planId}&project_id=${values.projectId}`
      downloadElement.setAttribute('download', 'report')
      document.body.appendChild(downloadElement)
      downloadElement.click() //点击下载
      document.body.removeChild(downloadElement) //下载完成移除元素
    });
    this.setState({
      openGenerateReport: false
    })
  }
  openDetailsModal = (row) => {
    this.setState({
      currentData: row,
      showDetails: true
    })
  }
  handlePlanChange = (value) => {
    let temp = {...this.state.getDataProbBody}
    temp.planId = value
    this.setState({
      getDataProbBody: temp
    }, () => {
      this.getBusinessDataProbListFun()
    })
  }
  handleProjectChange = (value) => {
    let temp = {...this.state.getDataProbBody}
    temp.projectId = value
    this.setState({
      getDataProbBody: temp
    }, () => {
      this.getBusinessDataProbListFun()
    })
  }
  templateSelectCatch = (value) => {
    this.setState({
      currentTemplateConfig: value
    })
  }

  handleDeleteProblem = (row) => {
    const { id } = row
    deleteDataProblem({
      ids: [id]
    }).then(res => {
      if (res.data.status === 'OK') {
        message.success("删除成功")
        this.getBusinessDataProbListFun();
      } else {
        message.success("删除失败")
      }
    })
  }

  multipDelete = () => {
    let temp = []
    this.state.selectClients.forEach(item => {
      const ele = item.id
      temp.push(ele)
    })
    deleteDataProblem({
      ids: temp
    }).then(res => {
      if (res.data.status === 'OK') {
        message.success("删除成功")
        this.getBusinessDataProbListFun();
      } else {
        message.success("删除失败")
      }
    })
  }

  openScore = () => {
    this.setState({
      openProjectScore: true
    })
  }

  componentDidMount() {
    this.getBusinessDataProbListFun()
    this.getPlanListOptions()
    this.getProjectListOptions()
    this.getModuleListFun()
  }
  render() {
    const { dataProbs } = this.state
    const title = (
      <div className="title flex">
        <div>
          <Select
            style={{
              width: 250,
            }}
            placeholder="计划"
            allowClear
            onChange={this.handlePlanChange}
            value={this.state.getDataProbBody.planId}
          >
            {this.state.planOptions.map((item, index) => (
              <Option value={item.value} key={index}>{item.label}</Option>
            ))}
          </Select>
          &nbsp;
          &nbsp;
          <Select
            style={{
              width: 250,
            }}
            placeholder="项目"
            allowClear
            onChange={this.handleProjectChange}
            value={this.state.getDataProbBody.projectId}
          >
            {this.state.projectOptions.map((item, index) => (
              <Option value={item.value} key={index}>{item.label}</Option>
            ))}
          </Select>
        </div>
        <div className="right">
            <Button type='primary'>
                <div className="bolder">
                体系筛选
                </div>
            </Button>
            &nbsp;
            &nbsp;
            <Button onClick={this.openScore}>
                <div className="bolder">
                项目评分
                </div>
            </Button>
            &nbsp;
            &nbsp;
            <Button type='' onClick={this.generateReport}>
                <div className="bolder">
                <Icon type="plus"></Icon>&nbsp;
                报告生成
                </div>
            </Button>
            &nbsp;
            &nbsp;
            <Button>
                <div className="bolder">
                <Icon type="upload"></Icon>&nbsp;
                导出
                </div>
            </Button>
            &nbsp;
            &nbsp;
            <Button type='primary' onClick={() => {
              let temp = {...this.state.getDataProbBody}
              temp.planId = undefined
              temp.projectId = undefined
              this.setState({
                getDataProbBody: temp
              }, () => {
                this.getBusinessDataProbListFun()
              })
            }}>
                <div className="bolder">
                <Icon type="reload"></Icon>&nbsp;
                重置
                </div>
            </Button>
            &nbsp;
            &nbsp;
          <Popconfirm
            placement="top"
            title={'确定要删除选中项吗？'}
            okText="是"
            cancelText="否"
            onConfirm={this.multipDelete}
          >
            <Button type='danger'>
              <div className="bolder">
                <Icon type="delete"></Icon>&nbsp;
                批量删除
              </div>
            </Button>
          </Popconfirm>
        </div>
      </div>
    )
    return (
      <div className="app-container">
        <Card title={title}>
          <Table 
            bordered 
            rowKey="index" 
            rowSelection={{
              type: 'checkbox',
              onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                  selectDeviceExperts: selectedRows
                })
              },
            }}
            dataSource={dataProbs} 
            pagination={true}
            scroll={{x: 'max-content'}}>
            <Column title="序号" dataIndex="id" key="id" align="center"/>
            <Column title="计划" dataIndex="planName" key="planName" align="center"/>
            <Column title="项目" dataIndex="projectName" key="projectName" align="center"/>
            <Column title="检查内容" key="checkContent" align="center" dataIndex="checkContent"/>
            <Column title="问题描述" dataIndex="problemDesc" key="problemDesc" align="center" />
            <Column title="问题备注" dataIndex="problemRemark" key="problemRemark" align="center" />
            <Column title="隐患等级" dataIndex="hiddenDangerLevel" key="hiddenDangerLevel" align="center" />
            <Column title="复合状态" dataIndex="reviewStateName" key="reviewStateName" align="center" />
            <Column title="图片" key="images" align="center" render={(text, row) => (
                <span>{row.images.length}张</span>
            )}/>
            <Column title="创建人" key="creatorName" align="center" dataIndex="creatorName"/>
            <Column title="操作" key="action" width={255} fixed="right" align="center" render={(text, row) => (
              <span>
                <Popconfirm
                    placement="topLeft"
                    title={'确定要删除该委托方吗？'}
                    okText="是"
                    cancelText="否"
                    onConfirm={this.handleDeleteProblem.bind(null, row)}
                >
                    <Button title="删除">删除</Button>
                </Popconfirm>
                <Divider type="vertical" />
                <Button title="详情" onClick={this.openDetailsModal.bind(null, row)}>详情</Button>
                </span>
            )}/>
          </Table>
        </Card>
        <ProjectScoreTable
          visible={this.state.openProjectScore}
          planOptions={this.state.planOptions}
          onCancel={() => {
            this.setState({
              openProjectScore: false
            })
          }}/>
        <GenerateReportForm 
          visible={this.state.openGenerateReport}
          projectOptions={this.state.projectOptions}
          planOptions={this.state.planOptions}
          templateOptions={this.state.templateOptions}
          wrappedComponentRef={formRef => this.generateReportForm = formRef}
          onOk={this.generate}
          templateSelect={this.templateSelectCatch}
          onCancel={() => {
            this.setState({
              openGenerateReport: false
            })
          }}/>
          <Modal
            title={this.state.currentData ? this.state.currentData.projectName : ''}
            visible={this.state.showDetails}
            onCancel={() => {
                this.setState({
                  showDetails: false
                })
            }}
            footer={[
              <div key={'footer'}></div>
            ]}
            width={'70%'}
            destroyOnClose
            >
              <div className="border">
                <div className="list-item">
                  <div className="title text-center">计划名称</div>
                  <div className="content text-center">{this.state.currentData ? this.state.currentData.planName : ''}</div>
                </div>
                <div className="list-item">
                  <div className="title text-center">项目名称</div>
                  <div className="content text-center">{this.state.currentData ? this.state.currentData.projectName : ''}</div>
                </div>
                <div className="list-item">
                  <div className="title text-center">检查内容</div>
                  <div className="content text-center">{this.state.currentData ? this.state.currentData.checkContent : ''}</div>
                </div>
                <div className="list-item">
                  <div className="title text-center">检查部位</div>
                  <div className="content text-center">{this.state.currentData ? this.state.currentData.checkParts : ''}</div>
                </div>
                <div className="list-item">
                  <div className="title text-center">规范条款</div>
                  <div className="content text-center">{this.state.currentData ? this.state.currentData.specificItems : ''}</div>
                </div>
                <div className="list-item">
                  <div className="title text-center">建议措施</div>
                  <div className="content text-center">{this.state.currentData ? JSON.stringify(this.state.currentData.suggests) : '暂无'}</div>
                </div>
                <div className="list-item">
                  <div className="title text-center">问题数量</div>
                  <div className="content text-center">{this.state.currentData ? this.state.currentData.problemNum : ''}</div>
                </div>
                <div className="list-item">
                  <div className="title text-center">扣除分数</div>
                  <div className="content text-center">{this.state.currentData ? this.state.currentData.deductScore : ''}</div>
                </div>
                <div className="list-item">
                  <div className="title text-center">附加扣分</div>
                  <div className="content text-center">{this.state.currentData ? this.state.currentData.additionDuductScore : ''}</div>
                </div>
                <div className="list-item">
                  <div className="title text-center">备注</div>
                  <div className="content text-center">{this.state.currentData ? this.state.currentData.problemRemark : ''}</div>
                </div>
                <div className="list-item">
                  <div className="title text-center">创建时间</div>
                  <div className="content text-center">{this.state.currentData ? moment(this.state.currentData.createTime).format('YYYY-MM-DD') : ''}</div>
                </div>
              </div>
          </Modal>
      </div>
    );
  }
}

export default DataProb;
