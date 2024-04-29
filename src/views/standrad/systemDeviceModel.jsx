import React, { Component } from "react";
import { Card, Button, Table, message, Divider, Input, Tooltip, Icon, Modal, Popconfirm } from "antd";
import { getModelList, addModel, editModel, getTreeList, publishModel, cloneModel } from "@/api/standrad";
import AddDeviceModelForm from "./forms/add-device-model-form";
import EditDeviceModelForm from "./forms/edit-device-model-form";
import EditSystemDeviceModel from "./components/editSystemDeviceModel";
import '../business/style/clientInfo.less'
const { Column } = Table;
const inputLongStyle = {
  padding: '1px 10px',
  width: '280px'
}
class SystemDeviceModel extends Component {
  state = {
    deviceModels: [],
    keyword: '',
    modelBody: {},
    currentRowData: null,
    getDeviceModelListBody: {
      currPage: 1,
      pageSize: 20000,
      type: 'DEVICE',
      keyword: ''
    },
    openAddDeviceModel: false,
    openEditDeviceModel: false,
    showEditModel: false,
    treeList: []
  };
  getDeviceModelListFun = async () => {
    const result = await getModelList(this.state.getDeviceModelListBody)
    if (result.data.status === 'OK') {
      this.setState({
        deviceModels: result.data.data.list
      })
    }
  }
  editDeviceModelFun = () => {
    const { form } = this.editDeviceModelForm.props
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const body = {
        id: values.id,
        type: 'DEVICE',
        name: values.name,
        description: values.description,
        hierarchyList: [],
        problemIds: []
      }
      editModel(body).then(res => {
        if (res.data.status === 'OK') {
          message.success('编辑成功')
          this.setState({
            openEditDeviceModel: false,
          }, () => {
            this.getDeviceModelListFun()
          })
        } else {
          message.error(res.data.errorMsg)
        }
      })
    })
  }
  openEditSystem = (row) => {
    this.setState({
      currentRowData: row,
      showEditModel: true
    })
  }
  addDeviceModelFun = () => {
    const { form } = this.addDeviceModelForm.props
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const body = {
        type: 'DEVICE',
        name: values.name,
        description: values.description,
        hierarchyList: [],
        problemIds: []
      }
      addModel(body).then(res => {
        if (res.data.status === 'OK') {
            message.success('添加成功')
            this.setState({
              openAddDeviceModel: false,
            }, () => {
              this.getDeviceModelListFun()
            })
          } else {
            message.error(res.data.errorMsg)
          }
        })
      })
    }
    openEditModel = (row) => {
      this.setState({
        currentRowData: row,
        openEditDeviceModel: true
      })
    }
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
    getTreeListFun = async () => { // 获取树形结构
      const result = await getTreeList({type: 'DEVICE'})
      if (result.data.status === 'OK') {
        this.setState({
          treeList: this.formatList(result.data.data)
        })
      }
    }
  publishModelFun = (row) => {
    publishModel({modelId: row.id}).then(res => {
      if (res.data.status === 'OK') {
        message.success('发布成功')
      } else {
        message.error(res.data.errorMsg)
      }
    })
  }
  cloneModelFun = (row) => {
    cloneModel({modelId: row.id}).then(res => {
      if (res.data.status === 'OK') {
        message.success('拷贝成功')
      } else {
        message.error(res.data.errorMsg)
      }
    })
  }
  componentDidMount() {
    this.getDeviceModelListFun()
    this.getTreeListFun()
  }
  render() {
    const { deviceModels, keyword } = this.state
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
            <Button type='primary' onClick={() => { this.setState({ openAddDeviceModel: true }) }}>
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
        <Card title={!this.state.showEditModel ? title : ''}>
          {this.state.showEditModel ? <div>
            <EditSystemDeviceModel
              currentRowData={this.state.currentRowData}
              treeList={this.state.treeList} 
              goBack={() => {
                this.setState({
                  showEditModel: false
                })
              }}
              emitAddLayer={() => {
              this.getTreeListFun()
            }} />
          </div> : 
            <Table 
            bordered 
            rowKey="id" 
            dataSource={deviceModels} 
            pagination={true}
            scroll={{x: 'max-content'}}>
            <Column title="编号" dataIndex="itemCode" key="code" align="center"/>
            <Column title="名称" dataIndex="name" key="name" align="center"/>
            <Column title="描述" dataIndex="description" key="description" align="center"/>
            <Column title="版本号" dataIndex="version" key="version" align="center"/>
            <Column title="操作" key="action" width={465} fixed="right" align="center" render={(text, row) => (
              <span>
                <Button title="编辑模型" onClick={this.openEditModel.bind(null, row)}>编辑模型</Button>
                <Divider type="vertical" />
                <Button title="编辑体系" onClick={this.openEditSystem.bind(null, row)}>编辑体系</Button>
                <Divider type="vertical" />
                <Button title="拷贝">拷贝</Button>
                <Divider type="vertical" />
                <Button title="发布" onClick={this.publishModelFun.bind(null, row)}>发布</Button>
                {/* <Divider type="vertical" />
                <Button title="开启">开启</Button> */}
                </span>
            )}/>
          </Table>}
        </Card>
        <AddDeviceModelForm 
          visible={this.state.openAddDeviceModel}
          wrappedComponentRef={formRef => this.addDeviceModelForm = formRef}
          onOk={this.addDeviceModelFun}
          onCancel={() => {
            this.setState({
              openAddDeviceModel: false
            })
          }}/>
        <EditDeviceModelForm 
          visible={this.state.openEditDeviceModel}
          wrappedComponentRef={formRef => this.editDeviceModelForm = formRef}
          onOk={this.editDeviceModelFun}
          currentRowData={this.state.currentRowData}
          onCancel={() => {
            this.setState({
              openEditDeviceModel: false
            })
          }}/>
      </div>
    );
  }
}

export default SystemDeviceModel;
