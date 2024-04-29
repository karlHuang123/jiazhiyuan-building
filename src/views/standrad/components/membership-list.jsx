import React, { Component } from "react";
import { Card, Button, Table, Select, Icon, message } from "antd";
import { getMembershipList, editMembership } from "@/api/standrad";
import EditMemberShipForm from "../forms/edit-member-ship-form";
import '../../business/style/clientInfo.less'
const { Column } = Table;
const { Option } = Select

class MembershipList extends Component {
  state = {
    hiddenDangerOptions: [],
    keyword: '',
    membershipList: [],
    fourth: [],
    third: [],
    second: [],
    first: [],
    openEditMembership: false
  };
  getMembershipListFun = async () => {
    const result = await getMembershipList({
        fourth: this.state.fourth,
        third: this.state.third,
        second: this.state.second,
        first: this.state.first,
        currPage: 1,
        pageSize: 999999
    })
    if (result.data.status === 'OK') {
      this.setState({
        membershipList: result.data.data.list
      })
    }
  }
  forthChange = (value) => {
    console.log(value)
      this.setState({
          fourth: value
      }, () => {
          this.getMembershipListFun()
      })
  }
  thirdChange = (value) => {
      this.setState({
          third: value
      }, () => {
        this.getMembershipListFun()
    })
  }
  secondChange = (value) => {
    this.setState({
        second: value
    }, () => {
        this.getMembershipListFun()
    })
  }
  firstChange = (value) => {
    this.setState({
        first: value
    }, () => {
        this.getMembershipListFun()
    }) 
  }
  openEdit = (row) => {
    this.setState({
      currentRowData: row,
      openEditMembership: true
    })
  }
  handleEditMembershipOk = () => {
    const { form } = this.editMembershipFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const body = {
        id: values.id,
        fourth: values.fourth,
        third: values.third,
        second: values.second,
        first: values.first,
        canIgnore: values.canIgnore, // 可忽略
        canEndure: values.canEndure, // 可容忍
        canAccept: values.canAccept, // 可接受
        canNotAccept: values.canNotAccept, // 不可接受
        reject: values.reject// 拒绝接受
      }
      editMembership(body).then((response) => {
        if (response.data.status === 'OK') {
          form.resetFields();
          this.setState({ 
            openEditMembership: false
           });
          message.success("编辑成功!")
          this.getMembershipListFun()
        } else {
          this.setState({ 
            openEditMembership: false
           });
           message.error(response.data.errorMsg)
        }
      }).catch(e => {
        message.error("编辑失败,请重试!")
      })
    });
  }
  componentDidMount() {
    this.getMembershipListFun()
    let temp = []
    for(let i = 0; i < 10; i++) {
        const ele = {
            label: i.toString(),
            value: i
        }
        temp.push(ele)
        this.setState({
            hiddenDangerOptions: temp
        })
    }
  }
  render() {
    const { membershipList, hiddenDangerOptions } = this.state
    const title = (
      <div className="title flex">
        <div>
            <Select
                style={{width: '180px', marginRight: '10px'}}
                maxTagCount={5}
                allowClear
                placeholder="四级隐患"
                mode="multiple"
                onChange={this.forthChange}
            >
                {hiddenDangerOptions.map((item, index) => (
                  <Option value={item.value} key={index}>{item.label}</Option>
                ))}
            </Select>
        </div>
        <div>
            <Select
                style={{width: '180px', marginRight: '10px'}}
                maxTagCount={5}
                allowClear
                placeholder="三级隐患"
                mode="multiple"
                onChange={this.thirdChange}
            >
                {hiddenDangerOptions.map((item, index) => (
                  <Option value={item.value} key={index}>{item.label}</Option>
                ))}
            </Select>
        </div>
        <div>
            <Select
                maxTagCount={5}
                style={{width: '180px', marginRight: '10px'}}
                allowClear
                placeholder="二级隐患"
                mode="multiple"
                onChange={this.secondChange}
            >
                {hiddenDangerOptions.map((item, index) => (
                  <Option value={item.value} key={index}>{item.label}</Option>
                ))}
            </Select>
        </div>
        <div>
            <Select
                maxTagCount={5}
                style={{width: '180px', marginRight: '10px'}}
                allowClear
                placeholder="一级隐患"
                mode="multiple"
                onChange={this.firstChange}
            >
                {hiddenDangerOptions.map((item, index) => (
                  <Option value={item.value} key={index}>{item.label}</Option>
                ))}
            </Select>
        </div>
        <div className="right">
            <Button type='primary'>
                <div className="bolder">
                <Icon type="upload"></Icon>&nbsp;
                导入
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
            rowKey="id" 
            dataSource={membershipList} 
            pagination={true}>
            <Column title="四级隐患" dataIndex="fourth" key="fourth" align="center"/>
            <Column title="三级隐患" dataIndex="third" key="third" align="center"/>
            <Column title="二级隐患" dataIndex="second" key="second" align="center"/>
            <Column title="一级隐患" dataIndex="first" key="first" align="center"/>
            <Column title="可忽略" dataIndex="canIgnore" key="canIgnore" align="center"/>
            <Column title="可容忍" dataIndex="canEndure" key="canEndure" align="center"/>
            <Column title="可接受" dataIndex="canAccept" key="canAccept" align="center"/>
            <Column title="不可接受" dataIndex="canNotAccept" key="canNotAccept" align="center"/>
            <Column title="拒绝接受" dataIndex="reject" key="reject" align="center"/>
            <Column title="操作" key="action" align="center" render={(text, row) => (
              <span>
                <Button title="编辑模型" onClick={this.openEdit.bind(null, row)}>编辑</Button>
              </span>
            )}/>
          </Table>
        </Card>
        <EditMemberShipForm
          wrappedComponentRef={formRef => this.editMembershipFormRef = formRef}
          visible={this.state.openEditMembership}
          onCancel={() => this.setState({openEditMembership: false})}
          onOk={this.handleEditMembershipOk}
          currentRowData={this.state.currentRowData}
        />
      </div>
    );
  }
}

export default MembershipList;
