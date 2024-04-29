import React, { Component } from "react";
import { Card, Button, Table, message, Divider, Input, Select, Icon, Modal, Popconfirm } from "antd";
import { getPlanList, getPlanTypeList, getModelTypeList, deletePlan } from "@/api/produce";
import { getClientList } from "@/api/business";
import AddPlan from "./component/add-plan";
import EditPlan from "./component/edit-plan";
import '../business/style/clientInfo.less'
import moment from 'moment'
const { Column } = Table;
const { Option } = Select
const inputLongStyle = {
  padding: '1px 10px',
  width: '280px'
}
class PlanManagement extends Component {
  state = {
    plans: [],
    planName: '',
    client: '',
    planId: '',
    planTypes: [],
    selectDeviceExperts: [],
    selectDeviceExpertsString: '',
    selectedDevices: [],
    planOptions: [],
    modelList: [],
    deviceModelList: [],
    measurementModelList: [],
    planNameOptions: [],
    creatorList: [],
    clientList: [],
    planTypeList: [],
    openExport: false,
    getPlanListBody: {
        currPage: 1,
        pageSize: 20000,
        planName: '',
        planTypes: '',
        creatorId: ''
      },
    showAddPlan: false,
    showEditPlan: false,
    currentRowData: null
  };
  getPlanListFun = async () => {
    const result = await getPlanList(this.state.getPlanListBody)
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
        plans: result.data.data.list,
        planNameOptions: temp
      })
    }
  }
  deleteSingle = (row) => {
    const { id } = row
    deletePlan({ids: [id]}).then(res => {
      if (res.data.status === 'OK') {
        message.success("删除成功")
        this.getPlanListFun();
      } else {
        message.success("删除失败")
      }
    })
  }
  deleteMultiple = () => {
    let temp = []
    this.state.selectDeviceExperts.forEach(item => {
      temp.push(item.id)
    })
    deletePlan({ids: temp}).then(res => {
      if (res.data.status === 'OK') {
        message.success("删除成功")
        this.getPlanListFun();
      } else {
        message.success("删除失败")
      }
    })
  }
  getPlanTypeListFun = async () => {
    const result = await getPlanTypeList()
    if (result.data.status === 'OK') {
      let temp = []
      result.data.data.forEach(item => {
        const ele = {
          label: item.name,
          value: item.code
        }
        temp.push(ele)
      })
      this.setState({
        planTypeList: temp
      })
    }
  }
  getModelTypeListFun = async (params) => {
    const result = await getModelTypeList(params)
    if (result.data.status === 'OK') {
      let temp = []
      result.data.data.forEach(item => {
        const ele = {
          label: item.name,
          value: item.code
        }
        temp.push(ele)
      })
      if (params.type === 'SYSTEM') {
        this.setState({
          modelList: temp
        })
      }
      if (params.type === 'DEVICE') {
        this.setState({
          deviceModelList: temp
        })
      }
      if (params.type === 'MEASUREMENT') {
        this.setState({
          measurementModelList: temp
        })
      }
    }
  }
  getClientListFun = async () => {
    const body = {
      currPage: 1,
      pageSize: 20000,
      keyword: null,
      clientType: null,
      creatorId: null
    }
    const result = await getClientList(body)
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
        clientList: temp
      })
    }
  }
  openEdit = (row) => {
    this.setState({
      showEditPlan: true,
      showAddPlan: false,
      currentRowData: row
    })
  }
  openAdd = () => {
    this.setState({
      showEditPlan: false,
      showAddPlan: true,
      currentRowData: null
    })
  }
  handleAddClose = () => {
    this.setState({
      showAddPlan: false,
      currentRowData: null
    })
  }
  handleEditClose = () => {
    this.setState({
      showEditPlan: false,
      currentRowData: null
    })
  }
  componentDidMount() {
    this.getPlanListFun()
    this.getClientListFun()
    this.getPlanTypeListFun()
    this.getModelTypeListFun({
      type: 'SYSTEM',
    })
    this.getModelTypeListFun({
      type: 'DEVICE',
    })
    this.getModelTypeListFun({
      type: 'MEASUREMENT',
    })
  }
  render() {
    const { plans, planName } = this.state
    const title = (
      <div className="title flex">
        <div>
          <Input 
            style={inputLongStyle}
            value={planName} 
            placeholder="请输入关键字"
            onChange={(e) => { this.setState({planName: e.target.value}) }}
            prefix={<Icon style={{marginLeft: '4px'}} type="search" />}
            allowClear
            onPressEnter={
            (e) => {
              let body = this.state.getPlanListBody
              body.keyword = e.target.value
              this.setState({
                getPlanListBody: body
              })
              this.getPlanListFun()
            }
          } />
          &nbsp;
          <Select
            style={{
              width: 250,
            }}
            placeholder="计划类型"
            allowClear
            value={this.state.planTypes ? this.state.planTypes : undefined}
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
            placeholder="创建人"
            allowClear
            value={this.state.getPlanListBody.creatorId ? this.state.getPlanListBody.creatorId : undefined}
          >
            {this.state.creatorList.map((item, index) => (
              <Option value={item.value} key={index}>{item.label}</Option>
            ))}
          </Select>
        </div>
        <div className="right">
            <Button onClick={() => {
              this.setState({
                openExport: true
              })
            }}>
                <div className="bolder">
                <Icon type="upload"></Icon>&nbsp;
                导出
                </div>
            </Button>
            &nbsp;
            &nbsp;
            <Button type='primary' onClick={this.openAdd}>
                <div className="bolder">
                <Icon type="plus"></Icon>&nbsp;
                添加
                </div>
            </Button>
            &nbsp;
            &nbsp;
            <Button type='primary'>
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
            onConfirm={this.deleteMultiple}
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
        {this.state.showAddPlan ? (
          <AddPlan 
            clientList={this.state.clientList} 
            planTypeList={this.state.planTypeList} 
            modelList={this.state.modelList}
            deviceModelList={this.state.deviceModelList}
            measurementModelList={this.state.measurementModelList}
            onSuccess={() => {
              this.getPlanListFun()
              this.setState({
                showAddPlan: false
              })
            }}
            onClose={this.handleAddClose} />
        ) : (<span></span>)}
        {this.state.showEditPlan ? (
          <EditPlan 
            clientList={this.state.clientList} 
            planTypeList={this.state.planTypeList} 
            modelList={this.state.modelList}
            deviceModelList={this.state.deviceModelList}
            currentRowData={this.state.currentRowData} 
            measurementModelList={this.state.measurementModelList}
            onSuccess={() => {
              this.getPlanListFun()
            }}
            onClose={this.handleEditClose} />
        ) : (<span></span>)}
        {this.state.showAddPlan || this.state.showEditPlan ? (<span></span>) : (
          <Card title={title}>
            <Table 
              bordered 
              rowKey="id" 
              rowSelection={{
                type: 'checkbox',
                onChange: (selectedRowKeys, selectedRows) => {
                  this.setState({
                    selectDeviceExperts: selectedRows
                  })
                },
              }}
              dataSource={plans} 
              pagination={true}
              scroll={{x: 'max-content'}}>
              <Column title="委托方" dataIndex="clientName" key="clientName" align="center"/>
              <Column title="计划名称" dataIndex="name" key="name" align="center"/>
              <Column title="计划类型" dataIndex="typeName" key="typeName" align="center"/>
              <Column title="创建日期" key="createTime" align="center" render={(text, row) => (
                <span>
                  {moment(row.createTime).format('YYYY-MM-DD')}
                </span>
              )}/>
              <Column title="创建人" dataIndex="creatorName" key="creatorName" align="center" />
              <Column title="计划来源" dataIndex="sourceName" key="sourceName" align="center" />
              <Column title="完成情况" key="stateName" align="center" dataIndex="stateName"/>
              <Column title="完成日期" key="updateTime" align="center" render={(text, row) => (
                <span>
                  {moment(row.updateTime ? row.updateTime : row.createTime).format('YYYY-MM-DD')}
                </span>
              )}/>
              <Column title="实测实量模型" key="measureModelName" align="center" dataIndex="measureModelName"/>
              <Column title="操作" key="action" width={205} fixed="right" align="center" render={(text, row) => (
                <span>
                  <Button title="编辑" onClick={this.openEdit.bind(null, row)}>编辑</Button>
                  <Divider type="vertical" />
                  <Popconfirm
                      placement="topLeft"
                      title={'确定要删除该委托方吗？'}
                      okText="是"
                      cancelText="否"
                      onConfirm={this.deleteSingle.bind(null, row)}
                  >
                      <Button title="删除">删除</Button>
                  </Popconfirm>
                </span>
              )}/>
            </Table>
          </Card>
        )}
        <Modal
            title="导出列表"
            visible={this.state.openExport}
            destroyOnClose
            footer={[<div className="text-right" key={'footer'}>
              <Button title="取消" onClick={() => {
                this.setState({
                  openExport: false,
                })
              }}>取消</Button>
              <Button type="primary" title="确定" onClick={() => {
                this.setState({
                  openExport: false
                })
              }}>
                <a 
                  href={`http://47.93.28.249:8181/admin/plan/export?planName=${this.state.planName}&planTypes=${this.state.getPlanListBody.planTypes}&creatorId=${this.state.getPlanListBody.creatorId}&clientId=${this.state.client}&checkPlanId=${this.state.selectDeviceExpertsString}`}>确定</a>
              </Button>
            </div>]}
            onCancel={() => {
              this.setState({
                openExport: false
              })
            }}>
              <div>
                <div className="flex align-center ">
                  委托方：
                  <Select
                    style={{
                      width: 250,
                    }}
                    placeholder="委托方："
                    allowClear
                    onChange={(e) => {
                      this.setState({
                        client: e
                      })
                    }}
                  >
                    {this.state.clientList.map((item, index) => (
                      <Option value={item.value} key={index}>{item.label}</Option>
                    ))}
                  </Select>
                </div>
                <div className="flex align-center">
                  检查计划：
                    <Select
                      style={{
                        width: 250,
                      }}
                      placeholder="检查计划"
                      allowClear
                      mode="multiple"
                      onChange={(e) => {
                        console.log(e)
                        const selectDeviceExpertsString = e.join(',')
                        this.setState({
                          selectDeviceExpertsString: selectDeviceExpertsString
                        })
                      }}
                    >
                      {this.state.planNameOptions.map((item, index) => (
                        <Option value={item.value} key={index}>{item.label}</Option>
                      ))}
                    </Select>
                </div>
              </div>
          </Modal>
      </div>
    );
  }
}

export default PlanManagement;
