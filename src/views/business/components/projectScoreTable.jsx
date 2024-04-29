import React, { Component } from "react";
import { Card, Table, Input, Select, Modal, Cascader } from "antd";
import { getProjectScore, getPlanByProject } from "@/api/business";
import { getTreeListByModelId } from "@/api/standrad";
import { getPlanDetails, getModelTypeList } from "@/api/produce";
import moment from "moment";
import '../style/clientInfo.less'
const { Column } = Table;
const { Option } = Select
const axios = require('axios');
class DataProb extends Component {
  state = {
      planList: [],
      projectList: [],
      treeList: [],
      modelList: [],
      planId: '',
      projectId: '',
      modelSysId: '',
      hierarchySysId: '',
      deductScore: null,
      deserveScore: null,
      score: null
  };

  formatList = (list) => { // 格式化数据
    let temp = []
    list.map(item => {
      let obj = {
        ...item
      }
      obj.label = item.name
      obj.value = item.id;
      obj.children = item.children ? this.formatList(item.children) : [];
      temp.push(obj)
    })
    return temp
  }
  handleNodeChange = (value) => {
      this.setState({
        hierarchySysId: value[value.length - 1]
      }, () => {
        getProjectScore({
            planId: this.state.planId,
            projectId: this.state.projectId,
            modelSysId: this.state.modelSysId,
            hierarchySysId: this.state.hierarchySysId,
            currPage: 1,
            pageSize: 20000
        }).then(res => {
          if (res.data.status === 'OK') {
            this.setState({
              dataProbs: res.data.data.list,
              score: res.data.data.score,
              deductScore: res.data.data.deductScore,
              deserveScore: res.data.data.deserveScore
            })
          }
        })
      })
  }
  getTreeListByModelIdFun = async () => { // 获取树形结构
    const result = await getTreeListByModelId({type: 'SYSTEM', modelId: this.state.modelSysId})
    if (result.data.status === 'OK') {
      this.setState({
        treeList: this.formatList(result.data.data)
      })
    }
  }
  handlePlanChange = async (value) => {
    const result = await getPlanByProject({
        planId: value,
        currPage: 1,
        pageSize: 20000,
    })
    if (result.status === 200 && result.data.status === 'OK') {
        let temp = []
        result.data.data.forEach(item => {
            const ele = {
                label: item.projectName,
                value: item.id
            }
            temp.push(ele)
        })
        this.setState({
            projectList: temp,
            planId: value
        })
    }
    this.getPlanDetailsFun(value)
  }
  getPlanDetailsFun = async (id) => {
    const result = await getPlanDetails({id: id})
    if (result.data.status === 'OK') {
        this.setState({
            modelSysId: result.data.data.checkSysId,
        })
    }
  }
  handleProjectChange = value => {
      this.setState({
          projectId: value
      }, () => {
        this.getTreeListByModelIdFun()
      })
  }
  getModelTypeListFun = async () => {
    const result = await getModelTypeList({
      type: 'SYSTEM',
    })
    if (result.data.status === 'OK') {
      let temp = []
      result.data.data.forEach(item => {
        const ele = {
          label: item.name,
          value: parseInt(item.code)
        }
        temp.push(ele)
      })
      this.setState({
        modelList: temp
      })
    }
  }
  componentDidMount() {
      // this.getTreeListByModelIdFun()
      this.getModelTypeListFun()
  }
  render() {
    const { dataProbs } = this.state
    const { visible, onCancel, planOptions } = this.props
    const title = (
      <div className="title flex">
          <Select
            style={{
              width: '25%',
            }}
            placeholder="计划"
            allowClear
            onChange={this.handlePlanChange}
          >
            {planOptions.map((item, index) => (
              <Option value={item.value} key={index}>{item.label}</Option>
            ))}
          </Select>
          &nbsp;
          &nbsp;
          <Select
            style={{
              width: '25%',
            }}
            placeholder="查询已结束项目项目"
            onChange={this.handleProjectChange}
            allowClear
          >
            {this.state.projectList.map((item, index) => (
              <Option value={item.value} key={index}>{item.label}</Option>
            ))}
          </Select>
          &nbsp;
          &nbsp;
          <Select
            style={{
              width: '25%',
            }}
            placeholder="查询已结束项目项目"
            onChange={this.handleProjectChange}
            value={this.state.modelSysId}
            allowClear
            disabled
          >
            {this.state.modelList.map((item, index) => (
              <Option value={item.value} key={index}>{item.label}</Option>
            ))}
          </Select>
          &nbsp;
          &nbsp;
          <Cascader
                style={{
                    width: '25%',
                }}
                options={this.state.treeList ? this.state.treeList : []}
                placeholder="节点"
                expandTrigger="hover"
                onChange={this.handleNodeChange} />
      </div>
    )
    return (
        <Modal
            title={'项目评分'}
            visible={visible}
            onCancel={onCancel}
            footer={[
            <div key={'footer'}></div>
            ]}
            width={'70%'}
            destroyOnClose
        >
            <div className="app-container">
                <Card title={title}>
                    <div className="grid grid-1-1-1">
                      <div>应得分：{this.state.deserveScore}</div>
                      <div>扣除分：{this.state.deductScore}</div>
                      <div>得分：{this.state.score}</div>
                    </div>
                    <Table 
                        bordered 
                        rowKey="index" 
                        dataSource={dataProbs} 
                        pagination={true}
                        scroll={{x: 'max-content'}}>
                        <Column title="序号" dataIndex="serialNum" key="serialNum" align="center"/>
                        <Column title="检查内容" dataIndex="checkContent" key="checkContent" align="center"/>
                        <Column title="应得分" dataIndex="deserveScore" key="deserveScore" align="center"/>
                        <Column title="扣除分数" key="deductScore" align="center" dataIndex="deductScore"/>
                        <Column title="得分" dataIndex="score" key="score" align="center" />
                    </Table>
                </Card>
            </div>
        </Modal>
    );
  }
}

export default DataProb;
