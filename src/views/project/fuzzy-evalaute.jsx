import React, { Component } from "react";
import { Card, Button, Table, message, Divider, Select, Input, Tooltip, Icon, Modal, Popconfirm } from "antd";
import { getFuzzyEvaluate, getFuzzyScoreResult } from "@/api/projects";
import ResultTable from "./component/result-table";
import '../business/style/clientInfo.less'
import moment from "moment";
const { Column } = Table;
const { Option } = Select;
const inputLongStyle = {
  padding: '1px 10px',
  width: '280px'
}
class FuzzyEvalaute extends Component {
  state = {
    evaluateList: [],
    keyword: '',
    selectProjects: [],
    projectOptions: [],
    planOptions: [],
    currentRow: null,
    showCalcResult: false,
    systemList: [],
    sourceData: null
  };
  getFuzzyEvaluateFun = (body) => {
    getFuzzyEvaluate(body).then(res => {
      if(res.data.status === 'OK') {
        this.setState({
          evaluateList: res.data.data.list
        })
      }
    })
  }
  openCalc = (row) => {
    getFuzzyScoreResult({projectId: row.projectId}).then(res => {
      this.setState({
        sourceData: res.data.data
      }, () => {
        this.setState({
          showCalcResult: true,
        })
      })
    })
  }
  componentDidMount() {
    this.getFuzzyEvaluateFun({
      planId: '',
      currPage: 1
    })
  }
  render() {
    const { evaluateList, keyword } = this.state
    const title = (
      <div className="title flex">
        <div>
        <Select
                style={{width: '350px', marginRight: '10px'}}
                maxTagCount={5}
                allowClear
                placeholder="计划"
                onChange={this.forthChange}
            >
                {this.state.planOptions.map((item, index) => (
                  <Option value={item.value} key={index}>{item.label}</Option>
                ))}
            </Select>
          &nbsp;
          <Select
            style={{
              width: 350,
            }}
            mode="multiple"
            placeholder="项目(可查询已结束的项目)"
            allowClear
            value={this.state.selectProjects}
          >
            {this.state.projectOptions.map((item, index) => (
              <Option value={item.value} key={index}>{item.label}</Option>
            ))}
          </Select>
        </div>
        <div className="right">
            &nbsp;
            &nbsp;
            <Button type='primary'>
            <div className="bolder">
              <Icon type="reload"></Icon>&nbsp;
              重置
            </div>
          </Button>
        </div>
      </div>
    )
    return (
      <div className="app-container">
        <Card title={title}>
          <Table 
            bordered 
            rowKey="projectId" 
            rowSelection={{
              type: 'checkbox',
              onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                  selectExperts: selectedRows
                })
              },
            }}
            dataSource={evaluateList} 
            pagination={true}
            scroll={{x: 'max-content'}}>
            <Column title="委托方" dataIndex="clientName" key="clientName" align="center"/>
            <Column title="所属计划" dataIndex="planName" key="planName" align="center"/>
            <Column title="项目名称" dataIndex="projectName" key="projectName" align="center"/>
            <Column title="完成时间" key="types" align="center" render={(text, row) => (
              <span>
                {moment(row.completedTime ? row.completedTime : row.createTime).format('YYYY-MM-DD')}
              </span>
            )} />
            <Column title="评语级隶属度" dataIndex="membershipReviewSet" key="membershipReviewSet" align="center" />
            <Column title="得分" dataIndex="score" key="score" align="center" />
            <Column title="风险状态" dataIndex="riskState" key="riskState" align="center" />
            <Column title="计算深度" dataIndex="calDepth" key="calDepth" align="center" />
            <Column title="算子" dataIndex="operator" key="operator" align="center" />
            <Column title="操作" key="action" fixed="right" align="center" render={(text, row) => (
              <span>
                <Button title="计算详情" onClick={this.openCalc.bind(null, row)}>计算详情</Button>
              </span>
            )}/>
          </Table>
        </Card>
        <Modal
          title={'计算详情'}
          visible={this.state.showCalcResult}
          width={'85%'}
          onCancel={() => {this.setState({showCalcResult: false})}}
          destroyOnClose
        >
          <ResultTable sourceData={this.state.sourceData} />
        </Modal>
      </div>
    );
  }
}

export default FuzzyEvalaute;
