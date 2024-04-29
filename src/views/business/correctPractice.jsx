import React, { Component } from "react";
import { Card, Button, Table, message, Divider, Input, Select, Tooltip, Icon, Modal, Popconfirm, DatePicker } from "antd";
import { getCorrectPracticeList, deleteCorrectPractice, getClientList } from "@/api/business";
import { getProjectList } from "@/api/projects";
import { getPlanList } from "@/api/produce";
import moment from "moment";
import '../business/style/clientInfo.less'
const { Column } = Table;
const { Option } = Select
const { RangePicker } = DatePicker;
class CorrectPractice extends Component {
  state = {
    practices: [],
    planOptions: [],
    projectOptions: [],
    clientList: [],
    client: '',
    projectId: '',
    selectPlanString: '',
    selectProjectString: '',
    startDate: '',
    endDate: '',
    getPracticeBody: {
        currPage: 1,
        pageSize: 999,
        sysId: '',
        projectId: '',
        planId: ''
      },
    openExport: false, // 导入弹窗展示anchor
  };
  getCorrectPracticeListFun = async () => {
    const result = await getCorrectPracticeList(this.state.getPracticeBody)
    if (result.data.status === 'OK') {
      this.setState({
        practices: result.data.data
      })
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
  getProjectListOptions = async () => {
    const result = await getProjectList({
      currPage: 1,
      pageSize: 20000,
      keyword: null,
      client: null,
      projectTypes: null
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

  getPlanListOptions = async () => {
    const result = await getPlanList({
      currPage: 1,
      pageSize: 20000,
      keyword: null,
      client: null,
      projectTypes: null
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
  multipDelete = () => {
    let temp = []
    this.state.selectDeviceExperts.forEach(item => {
      const ele = item.id
      temp.push(ele)
    })
    deleteCorrectPractice({
      ids: temp
    }).then(res => {
      if (res.data.status === 'OK') {
        message.success("删除成功")
        this.getCorrectPracticeListFun();
      } else {
        message.success("删除失败")
      }
    })
  }
  deleteCorrectSingle = row => {
    deleteCorrectPractice({
      ids: [row.id]
    }).then(res => {
      if (res.data.status === 'OK') {
        message.success("删除成功")
        this.getCorrectPracticeListFun();
      } else {
        message.success("删除失败")
      }
    })
  }
  componentDidMount() {
    this.getCorrectPracticeListFun()
    this.getProjectListOptions()
    this.getPlanListOptions()
    this.getClientListFun()
  }
  render() {
    const { practices } = this.state
    const title = (
      <div className="title flex">
        <div>
          <Select
            style={{
              width: 250,
            }}
            placeholder="计划"
            allowClear
            value={this.state.getPracticeBody.planId ? this.state.getPracticeBody.planId : undefined}
            onChange={(e) => {
              console.log(e)
              let temp = this.state.getPracticeBody
              temp.planId = e
              this.setState({
                getPracticeBody: temp
              }, () => {
                this.getCorrectPracticeListFun()
              })
            }}
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
            value={this.state.getPracticeBody.projectId ? this.state.getPracticeBody.projectId : undefined}
            onChange={(e) => {
              let temp = this.state.getPracticeBody
              temp.projectId = e
              this.setState({
                getPracticeBody: temp
              }, () => {
                this.getCorrectPracticeListFun()
              })
            }}
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
            <Button
              onClick={() => {
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
            onConfirm={this.multipDelete}
            okText="是"
            cancelText="否"
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
            dataSource={practices} 
            pagination={true}
            scroll={{x: 'max-content'}}>
            <Column title="序号" dataIndex="id" key="id" align="center" />
            <Column title="计划" dataIndex="planName" key="planName" align="center"/>
            <Column title="项目" dataIndex="projectName" key="projectName" align="center"/>
            <Column title="检查内容" key="checkContent" align="center" dataIndex="checkContent"/>
            <Column title="问题描述" dataIndex="problemDesc" key="problemDesc" align="center" />
            <Column title="问题备注" dataIndex="problemRemark" key="problemRemark" align="center" />
            <Column title="图片" key="images" align="center" render={(text, row) => (
                <span>{row.images.length}张</span>
            )}/>
            <Column title="创建人" key="creatorName" align="center" dataIndex="creatorName"/>
            <Column title="创建时间" key="createTime" align="center" render={(text, row) => (
                <span>{moment(row.createTime).format('YYYY-MM-DD')}</span>
            )}/>
            <Column title="操作" key="action" align="center" render={(text, row) => (
              <span>
                <Popconfirm
                    placement="topLeft"
                    title={'确定要删除该委托方吗？'}
                    okText="是"
                    cancelText="否"
                    onConfirm={this.deleteCorrectSingle.bind(null, row)}
                >
                    <Button title="删除">删除</Button>
                </Popconfirm>
                </span>
            )}/>
          </Table>
        </Card>
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
                  href={`http://47.93.28.249:8181/admin/business/data/correct/practice/export?planId=${this.state.selectPlanString}&projectId=${this.state.selectProjectString}&clientId=${this.state.client}&startDate=${this.state.startDate}&endDate=${this.state.endDate}`}>确定</a>
              </Button>
            </div>]}
            onCancel={() => {
              this.setState({
                openExport: false
              })
            }}>
              <div>
                <div className="flex align-center mb-18">
                  <span style={{color: 'red'}}>*</span>委托方：
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
                <div className="flex align-center mb-18">
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
                        const selectPlanString = e.join(',')
                        this.setState({
                          selectPlanString: selectPlanString
                        })
                      }}
                    >
                      {this.state.planOptions.map((item, index) => (
                        <Option value={item.value} key={index}>{item.label}</Option>
                      ))}
                    </Select>
                </div>
                <div className="flex align-center mb-18">
                  计划名称：
                    <Select
                      style={{
                        width: 250,
                      }}
                      placeholder="请选择计划名称"
                      allowClear
                      mode="multiple"
                      onChange={(e) => {
                        console.log(e)
                        const selectProjectString = e.join(',')
                        this.setState({
                          selectProjectString: selectProjectString
                        })
                      }}
                    >
                      {this.state.planOptions.map((item, index) => (
                        <Option value={item.value} key={index}>{item.label}</Option>
                      ))}
                    </Select>
                </div>
                <div className="flex align-center mb-18">
                  检查日期：
                  <RangePicker onChange={(date, dateString) => {
                    this.setState({
                      startDate: dateString[0],
                      endDate: dateString[1]
                    })
                  }} />
                </div>
              </div>
          </Modal>
      </div>
    );
  }
}

export default CorrectPractice;
