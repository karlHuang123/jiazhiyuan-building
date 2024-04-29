import React, { Component } from "react";
import { Card, Button, Table, message, Divider, Input, Breadcrumb, Icon, Modal, Popconfirm } from "antd";
import { getLayerList, addLayer, deleteLayer, editLayer } from "@/api/standrad";
import AddLayerForm from "./forms/add-layer-form";
import EditLayerForm from "./forms/edit-layer-form";
import '../business/style/clientInfo.less'
import './style/standrad.less'
const { Column } = Table;
const { Item } = Breadcrumb
const inputLongStyle = {
  padding: '1px 10px',
  width: '280px'
}
class SystemDeviceDeviceLayer extends Component {
  state = {
    deviceLayers: [],
    keyword: '',
    layerBody: {},
    selectedDevices: [],
    currentParentId: 0,
    currentName: '',
    currentRow: null,
    addLayer: false,
    editLayer: false,
    breadList: [
      {
        label: '体系',
        id: 0
      }
    ],
    getDeviceLayerListBody: {
      currPage: 1,
      pageSize: 20000,
      type: 'DEVICE',
      parentId: 0,
      keyword: ''
    }
  };
  getDeviceLayerListFun = async () => {
    const result = await getLayerList(this.state.getDeviceLayerListBody)
    if (result.data.status === 'OK') {
      this.setState({
        deviceLayers: result.data.data.list
      })
    }
  }
  breadClick = async (data) => {
    const { id } = data.item
    const body = {
      currPage: 1,
      pageSize: 20000,
      type: 'DEVICE',
      parentId: id,
    }
    const result = await getLayerList(body)
    if (result.data.status === 'OK') {
      let temp = this.state.breadList.slice(0, data.index + 1)
      this.setState({
        deviceLayers: result.data.data.list,
        breadList: temp,
        currentParentId: id
      })
    }
  }
  childClick = async (row) => {
    const { id } = row
    const body = {
      currPage: 1,
      pageSize: 20000,
      type: 'DEVICE',
      parentId: id
    }
    const result = await getLayerList(body)
    if (result.data.status === 'OK') {
      let temp = this.state.breadList
      temp.push({
        label: row.name,
        id: id
      })
      this.setState({
        deviceLayers: result.data.data.list,
        breadList: temp,
        currentParentId: id
      })
    }
  }
  addLayerFun = () => {
    const { form } = this.addLayerForm.props
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const body = {
        parentId: this.state.currentParentId,
        type: 'DEVICE',
        name: values.name,
        score: values.score,
        weight: values.weight
      }
      addLayer(body).then(res => {
        if (res.data.status === 'OK') {
          message.success('添加成功')
          this.setState({
            addLayer: false,
          }, async () => {
            const body = {
              currPage: 1,
              pageSize: 20000,
              type: 'DEVICE',
              parentId: this.state.currentParentId
            }
            const result = await getLayerList(body)
            if (result.data.status === 'OK') {
              let temp = this.state.breadList
              temp.push({
                label: this.state.currentName,
                id: this.state.currentParentId
              })
              this.setState({
                deviceLayers: result.data.data.list,
                breadList: temp
              })
            }
          })
        } else {
          message.error(res.data.errorMsg)
        }
      })
    })
  }
  editLayerFun = () => {
    const { form } = this.editLayerForm.props
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const body = {
        id: values.id,
        name: values.name,
        score: values.score,
        weight: values.weight
      }
      editLayer(body).then(res => {
        if (res.data.status === 'OK') {
          message.success('编辑成功')
          this.setState({
            addLayer: false,
          }, async () => {
            const body = {
              currPage: 1,
              pageSize: 20000,
              type: 'DEVICE',
              parentId: this.state.currentParentId
            }
            const result = await getLayerList(body)
            if (result.data.status === 'OK') {
              this.setState({
                deviceLayers: result.data.data.list,
                currentRow: null,
                editLayer: false
              })
            }
          })
        } else {
          message.error(res.data.errorMsg)
        }
      })
    })
  }
  addChildren = (row) => {
    this.setState({
      currentParentId: row.id,
      currentName: row.name
    }, () => {
      this.setState({
        addLayer: true
      })
    })
  }
  editChildren = (row) => {
    this.setState({
      currentRow: row
    }, () => {
      this.setState({
        editLayer: true
      })
    })
  }
  deleteLayerFun = (row) => {
    deleteLayer({id: row.id}).then(async (res) => {
      if (res.data.status === 'OK') {
        const body = {
          currPage: 1,
          pageSize: 20000,
          type: 'DEVICE',
          parentId: this.state.currentParentId
        }
        const result = await getLayerList(body)
        if (result.data.status === 'OK') {
          message.success('删除成功')
          this.setState({
            deviceLayers: result.data.data.list
          })
        } else {
          message.error(res.data.errorMsg)
        }
      }
    })
  }
  componentDidMount() {
    this.getDeviceLayerListFun()
  }
  render() {
    const { deviceLayers, keyword } = this.state
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
                addLayer: true,
                currentName: ''
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
        <Card title={title}>
          <div className="flex mb-10">
            <span>当前层级：</span>
            <Breadcrumb>
              {this.state.breadList.map((item, index) => (
                <Item key={item.id} onClick={this.breadClick.bind(null, {item, index})}>
                  <span className={index === this.state.breadList.length - 1 ? '' : 'clickable'}>{item.label}</span>
                </Item>
              ))}
            </Breadcrumb>
          </div>
          <Table 
            bordered 
            rowKey="id" 
            dataSource={deviceLayers} 
            pagination={true}
            scroll={{x: 'max-content'}}>
            <Column title="编号" dataIndex="code" key="code" align="center"/>
            <Column title="名称" dataIndex="name" key="name" align="center"/>
            <Column title="分数" dataIndex="score" key="score" align="center"/>
            <Column title="国际权重" dataIndex="weight" key="weight" align="center" />
            <Column title="操作" key="action" width={415} fixed="right" align="center" render={(text, row) => (
              <span>
                <Button title="编辑" onClick={this.editChildren.bind(null, row)}>编辑</Button>
                <Divider type="vertical" />
                <Popconfirm
                    placement="topLeft"
                    title={'确定要删除该层级吗？'}
                    okText="是"
                    cancelText="否"
                    onConfirm={this.deleteLayerFun.bind(null, row)}
                >
                    <Button title="删除">删除</Button>
                </Popconfirm>
                <Divider type="vertical" />
                <Button title="添加子集" onClick={this.addChildren.bind(null, row)}>添加子集</Button>
                <Divider type="vertical" />
                <Button title="子集" onClick={this.childClick.bind(null, row)}>子集</Button>
                </span>
            )}/>
          </Table>
        </Card>
        <AddLayerForm 
          visible={this.state.addLayer}
          currentParentId={this.state.currentParentId}
          wrappedComponentRef={formRef => this.addLayerForm = formRef}
          onOk={this.addLayerFun}
          onCancel={() => {
            this.setState({
              addLayer: false,
              currentName: ''
            })
          }}/>
        <EditLayerForm 
          visible={this.state.editLayer}
          currentRow={this.state.currentRow}
          wrappedComponentRef={formRef => this.editLayerForm = formRef}
          onOk={this.editLayerFun}
          onCancel={() => {
            this.setState({
              editLayer: false,
              currentRow: null
            })
          }}/>
      </div>
    );
  }
}

export default SystemDeviceDeviceLayer;
