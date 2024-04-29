import React, { Component } from "react";
import { Form, Popconfirm, Divider, Table, Button, message } from "antd";
import { deleteDeviceByDate } from '@/api/projects'
import '../style/projects.less'
const { Column } = Table;
class DeviceList extends Component {
  state = {
    projectUsageOptions: [],
    cityList: [],
    districtList: []
  }
  deleteProject = (row) => {
    deleteDeviceByDate({updateDate: row.updateDate}).then(res => {
      if (res.data.status === 'OK') {
        message.success('删除成功')
        this.props.deleteDeviceByDate('recallDeviceList')
      }
    })
  }
  handleEditProjectHistory = (row) => {
    this.props.editProjectHistory(row)
  }
  render() {
    const { deviceList } = this.props;
    return (
        <Table
            bordered 
            dataSource={deviceList}
            pagination={true}
            scroll={{x: 'max-content'}}
            rowKey="id" >
            <Column title="更新日期" fixed="left" width={150} dataIndex="updateDate" key="updateDate" align="center"/>
            <Column title="塔式起重机" dataIndex="TOWER_CRANE" key="TOWER_CRANE" align="center"/>
            <Column title="施工升降机" dataIndex="CONSTRUCTION_LIFT" key="CONSTRUCTION_LIFT" align="center"/>
            <Column title="物料提升机" dataIndex="MATERIAL_HOIST" key="MATERIAL_HOIST" align="center"/>
            <Column title="桥式起重机" key="BRIDGE_CRANE" dataIndex="BRIDGE_CRANE" align="center" />
            <Column title="附着式升降脚手架" dataIndex="SUSPENDED_SCAFFOLDING" key="SUSPENDED_SCAFFOLDING" align="center" />
            <Column title="流动式起重机" dataIndex="MOBILE_CRANE" key="MOBILE_CRANE" align="center"/>
            <Column title="高处作业吊篮" dataIndex="HIGH_ALTITUDE_BASKET" key="HIGH_ALTITUDE_BASKET" align="center"/>
            <Column title="门式起重机" dataIndex="GANTRY_CRANE" key="GANTRY_CRANE" align="center"/>
            <Column title="架桥机" dataIndex="GANTRY_TROLLEY_CRANE" key="GANTRY_TROLLEY_CRANE" align="center"/>
            <Column title="其他类型" dataIndex="OTHER" key="OTHER" align="center"/>
            <Column title="操作" fixed="right" key="action" width={180} align="center" render={(text, row) => (
                <span>
                    <Button title="编辑" onClick={this.handleEditProjectHistory.bind(null,row)}>编辑</Button>
                    <Divider type="vertical" />
                    <Popconfirm
                        placement="topLeft"
                        title={'确定要删除该记录吗？'}
                        onConfirm={this.deleteProject.bind(null,row)}
                        okText="是"
                        cancelText="否"
                    >
                        <Button title="删除">删除</Button>
                    </Popconfirm>
                </span>
            )}/>
      </Table>
    );
  }
}

export default Form.create({ name: "DeviceList" })(DeviceList);
