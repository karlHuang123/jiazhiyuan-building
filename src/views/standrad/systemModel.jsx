import React, { Component } from "react";
import { Card, Button, Table, message, Divider, Input, Icon, Modal, Popconfirm } from "antd";
import { getModelList, getTreeList, syncModel } from "@/api/standrad";
import AddModel from "./components/add-model";
import '../business/style/clientInfo.less'
const { Column } = Table;
const inputLongStyle = {
  padding: '1px 10px',
  width: '280px'
}
class SystemModel extends Component {
  state = {
    models: [],
    keyword: '',
    modelBody: {},
    selectedDevices: [],
    getModelListBody: {
      currPage: 1,
      pageSize: 20000,
      type: 'SYSTEM',
      keyword: ''
    },
    showAddPage: false,
    treeList: [],
    currentId: null,
    openSyncWindow: false
  };
  formatList = (list) => { // 格式化数据
    let temp = []
    list.map(item => {
      let obj = {
        ...item
      }
      obj.title = item.name
      obj.key = item.id;
      obj.children = item.children ? this.formatList(item.children) : [];
      temp.push(obj)
    })
    return temp
  }
  getModelListFun = async () => { // 获取模型列表
    const result = await getModelList(this.state.getModelListBody)
    if (result.data.status === 'OK') {
      this.setState({
        models: result.data.data.list
      })
    }
  }
  getTreeListFun = async () => { // 获取树形结构
    const result = await getTreeList({type: 'SYSTEM'})
    if (result.data.status === 'OK') {
      this.setState({
        treeList: this.formatList(result.data.data)
      })
    }
  }
  syncModel = () => {
    syncModel({id: this.state.currentId}).then(res => {
      if (res.data.status === 'OK') {
        message.success("同步成功")
        this.getModelListFun()
        this.setState({
          openSyncWindow: false
        })
      } else {
        message.error(res.data.errorMsg)
      }
    })
  }
  handleCancel = () => {
    this.setState({
      showAddPage: false
    })
  }
  handleConfirm = () => {
    this.setState({
      showAddPage: false,
      currentId: null
    })
    this.getModelListFun()
    this.getTreeListFun()
  }
  componentDidMount() {
    this.getModelListFun()
    this.getTreeListFun()
  }
  render() {
    const { models, keyword } = this.state
    const title = (
      <div className="title flex">
        <div>
          <Input 
            style={inputLongStyle}
            value={keyword} 
            placeholder="请输入关键字"
            onChange={(e) => { this.setState({keyword: e.target.value}) }}
            prefix={<Icon style={{marginLeft: '4px'}} type="search" />}
            allowClear
            onPressEnter={
            (e) => {

            }
          } />
        </div>
        <div className="right">
            <Button type='primary' onClick={() => {
              this.setState({
                showAddPage: true
              })
            }}>
                <div className="bolder">
                <Icon type="plus"></Icon>&nbsp;
                添加
                </div>
            </Button>
        </div>
      </div>
    )
    return (
      <div className="app-container">
        {this.state.showAddPage ? (
          <div><AddModel onCancel={this.handleCancel} onConfirm={this.handleConfirm} treeList={this.state.treeList} currentId={this.state.currentId} /></div>
        ) : (
          <div>
            <Card title={title}>
              <Table 
                bordered 
                rowKey="id" 
                dataSource={models} 
                pagination={true}
                scroll={{x: 'max-content'}}>
                <Column title="编号" dataIndex="itemCode" key="code" align="center"/>
                <Column title="名称" dataIndex="name" key="name" align="center"/>
                <Column title="版本号" dataIndex="version" key="versionNmuber" align="center"/>
                <Column title="操作" key="action" width={215} fixed="right" align="center" render={(text, row) => (
                  <span>
                    <Button title="编辑" onClick={() => {
                      this.setState({
                        currentId: row.id,
                        showAddPage: true
                      })
                    }}>编辑</Button>
                    {/* <Divider type="vertical" />
                    <Button title="同步" onClick={() => {
                      this.setState({
                        currentId: row.id,
                        openSyncWindow: true
                      })
                    }}>同步</Button> */}
                    </span>
                )}/>
              </Table>
            </Card>
            <Modal
              visible={this.state.openSyncWindow}
              onCancel={() => {this.setState({openSyncWindow: false})}}
              title="同步"
              onOk={() => {
                this.syncModel()
              }}
            >
              确认同步吗？同步之后版本号加1
            </Modal>
          </div>
        )}
      </div>
    );
  }
}

export default SystemModel;
