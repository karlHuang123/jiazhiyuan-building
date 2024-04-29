import React, { Component } from 'react';
import { Card, Button, Table, message, Select } from "antd";
import { getClientList } from "@/api/business";
import { getProjectList, editConfig, getMapSettingList } from "@/api/projects";
import EditConfigForm from '../report/form/edit-config-form';
import '../business/style/clientInfo.less'

const { Option } = Select
const { Column } = Table;
class  MapConfig extends Component{
  state = {
    clients: [],
    projects: [],
    projectDetailsList: [],
    selectProjects: [],
    addresses: [],
    listBody: {
      currPage: 1,
      pageSize: 999,
      keyword: null,
      clientType: null,
      creatorId: null
    },
    clientId: null,
    openEditConfig: null,
    currentRowData: null
  }
  getClientList = async (body = this.state.listBody) => {
    const result = await getClientList(body)
    if (result.data.status === 'OK') {
      let list = result.data.data.list
      let temp = []
      list.forEach(item => {
        const ele = {
          label: item.name,
          value: item.id
        }
        temp.push(ele)
      })
      this.setState({
        clients: temp
      })
    }
  }
  getProjectList = async () => {
    const result = await getProjectList({client: this.state.clientId})
    if (result.data.status === 'OK') {
      let temp = []
      let tempSelect = []
      result.data.data.list.forEach(item => {
        const ele = {
          label: item.projectName,
          value: item.id
        }
        tempSelect.push(item.id)
        temp.push(ele)
      })
      this.setState({
        projects: temp,
        selectProjects: tempSelect
      })
    }
  }
  getMapSettingList = async () => {
    const result = await getMapSettingList({
        clientId: this.state.clientId,
        projectIds: this.state.selectProjects,
        currPage: 1,
        pageSize: 999,
    })
    if (result.data.status === 'OK') {
      console.log(result.data)
      this.setState({
        projectDetailsList: result.data.data.data
      })
    }
  }
  selectProject = (value) => {
    this.setState({
      selectProjects: value
  }, () => {
      this.getMapSettingList() //改
    })
  }
  editTemplate = (row) => {
    this.setState({
      currentRowData: row,
      openEditConfig: true
    })
  }
  handleEditConfigOk = () => {
    const { form } = this.editConfigFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const body = {
        planId: values.planId,
        projectId: values.projectId,
        score: values.score
      }
      editConfig(body).then((response) => {
        if (response.data.status === 'OK') {
          form.resetFields();
          this.setState({ 
            openEditConfig: false
           });
          message.success("编辑成功!")
          this.getMapSettingList()
        } else {
          this.setState({ 
            openEditConfig: false
           });
          message.success("编辑失败!")
        }
      }).catch(e => {
        message.error("编辑失败,请重试!")
      })
    });
  }
  componentDidMount(){
    this.getClientList()
  }
  render(){
    const title = (
      <div className="title flex">
        <div>
          <Select
            style={{
              width: 350,
            }}
            placeholder="选择委托方"
            allowClear
            onChange={(value) => {
              this.setState({
                clientId: value
              }, () => {
                this.getProjectList()
              })
            }}
          >
            {this.state.clients.map((item, index) => (
              <Option value={item.value} key={index}>{item.label}</Option>
            ))}
          </Select>
        </div>
        &nbsp;
        &nbsp;
        <div>
          <Select
            style={{
              width: 350,
            }}
            placeholder="项目"
            allowClear
            mode="multiple"
            onChange={this.selectProject}
            maxTagCount={4}
          >
            {this.state.projects.map((item, index) => (
              <Option value={item.value} key={index}>{item.label}</Option>
            ))}
          </Select>
        </div>
      </div>
    )
      return (
        <div> 
          <Card title={title}>
            <Table 
                bordered 
                rowKey="id" 
                dataSource={this.state.projectDetailsList} 
                pagination={true}>
                <Column title="计划名称" dataIndex="planName" key="planName" align="center"/>
                <Column title="项目名称" dataIndex="projectName" key="projectName" align="center"/>
                <Column title="检查时间" key="checkDate" align="center" dataIndex="checkDate"/>
                <Column title="项目评分" dataIndex="score" key="score" align="center" />
                <Column title="操作" key="action" align="center" render={(text, row) => (
                    <span>
                        <Button title="编辑" onClick={this.editTemplate.bind(null, row)}>编辑</Button>
                    </span>
                )}/>
            </Table>
          </Card>
          <EditConfigForm
            wrappedComponentRef={formRef => this.editConfigFormRef = formRef}
            visible={this.state.openEditConfig}
            onCancel={() => this.setState({openEditConfig: false})}
            onOk={this.handleEditConfigOk}
            currentRowData={this.state.currentRowData}
          />
        </div>
    );
  }
}
//导出地图组建类
export default MapConfig;