import React, { Component } from 'react';
import { Card, Button, Table, message, Select, Input, Tooltip, Icon, Modal, Popconfirm } from "antd";
import MapComponent from './component/MapComponent'
import { getClientList } from "@/api/business";
import { getProjectList, getProjectsByIds } from "@/api/projects";
import axios from 'axios';
import '../business/style/clientInfo.less'

const { Option } = Select
class  MapContainer extends Component{

  state = {
    lng: null,
    lat: null,
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
    clientId: null
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
  getProjectsByIds = async () => {
    const result = await getProjectsByIds({ids: this.state.selectProjects})
    if (result.data.status === 'OK') {
      let temp = []
      result.data.data.forEach(item => {
        temp.push({
          address: item.address,
          id: item.id
        })
      })
      this.setState({
        projectDetailsList: result.data.data,
        addresses: temp
      })
    }
  }
  selectProject = (value) => {
    this.setState({
      selectProjects: value
  }, () => {
      this.getProjectsByIds() //改
  })
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
            value={this.state.selectProjects}
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
            <MapComponent
              addresses={this.state.addresses}
              projectDetailsList={this.state.projectDetailsList}
            ></MapComponent>
          </Card>
        </div>
    );
  }
}
//导出地图组建类
export default MapContainer;