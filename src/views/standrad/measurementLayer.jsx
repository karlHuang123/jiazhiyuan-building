import React, { Component } from "react";
import { Card, Button, Table, message, Divider, Input, Tooltip, Icon, Modal, Popconfirm } from "antd";
import { getLayerList } from "@/api/standrad";
import '../business/style/clientInfo.less'
const { Column } = Table;
const inputLongStyle = {
  padding: '1px 10px',
  width: '280px'
}
class MeasurementLayer extends Component {
  state = {
    measurementLayers: [],
    keyword: '',
    layerBody: {},
    selectedDevices: [],
    getLayerListBody: {
      currPage: 1,
      pageSize: 20000,
      type: 'MEASUREMENT',
      keyword: ''
    }
  };
  getMeasurementLayerListFun = async () => {
    const result = await getLayerList(this.state.getLayerListBody)
    if (result.data.status === 'OK') {
      this.setState({
        measurementLayers: result.data.data.list
      })
    }
  }
  componentDidMount() {
    this.getMeasurementLayerListFun()
  }
  render() {
    const { measurementLayers, keyword } = this.state
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
            <Button type='primary'>
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
          <Table 
            bordered 
            rowKey="id" 
            dataSource={measurementLayers} 
            pagination={true}
            scroll={{x: 'max-content'}}>
            <Column title="编号" dataIndex="code" key="code" align="center"/>
            <Column title="名称" dataIndex="name" key="name" align="center"/>
            <Column title="操作" key="action" width={415} fixed="right" align="center" render={(text, row) => (
              <span>
                <Button title="编辑">编辑</Button>
                <Divider type="vertical" />
                <Popconfirm
                    placement="topLeft"
                    title={'确定要删除该委托方吗？'}
                    okText="是"
                    cancelText="否"
                >
                    <Button title="删除">删除</Button>
                </Popconfirm>
                <Divider type="vertical" />
                <Button title="添加子集">添加子集</Button>
                <Divider type="vertical" />
                <Button title="子集">子集</Button>
                </span>
            )}/>
          </Table>
        </Card>
      </div>
    );
  }
}

export default MeasurementLayer;
