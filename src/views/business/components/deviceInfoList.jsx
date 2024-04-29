import React, { Component } from "react";
import { Form, Popconfirm, Divider, Table, Button, message } from "antd";
import { deleteDevice } from '@/api/projects'
import moment from 'moment'
import '../style/projects.less'
const { Column } = Table;
class DeviceInfoList extends Component {
  state = {
    projectUsageOptions: [],
    columns: [],
    deviceInfoList: []
  }
  deleteDevice = (row) => {
    deleteDevice({id: row.id}).then(res => {
      if (res.data.status === 'OK') {
        message.success('删除成功')
        this.props.deleteDevice()
      } else {
        message.error(res.data.errorMsg)
      }
    })
  }
  componentWillReceiveProps (nextProps) {
    this.setState({
      deviceInfoList: nextProps.deviceInfoList
    }, () => {
      if (this.state.deviceInfoList.length > 0) {
        let temp = [
          {
            title: '更新日期',
            dataIndex: 'updateDate',
            key: 'updateDate',
            align: 'center',
            fixed: 'left'
          },
          {
            title: '工程起重机械检测单位',
            dataIndex: 'constructionCrane',
            key: 'constructionCrane',
            align: 'center',
            className: this.state.deviceInfoList[this.state.deviceInfoList.length - 1].hasOwnProperty('constructionCrane') ? '' : 'hide-column'
          },
          {
            title: '检测日期',
            key: 'checkDate',
            align: 'center',
            className: this.state.deviceInfoList[this.state.deviceInfoList.length - 1].hasOwnProperty('checkDate') ? '' : 'hide-column',
            render: (text, row) => (
              <span>{row.checkDate ? moment(row.checkDate).format('YYYY/MM/DD') : ''}</span>
            )
          },
          {
            title: '安全锁标定日期',
            dataIndex: 'saveLockGoalDate',
            key: 'saveLockGoalDate',
            align: 'center',
            className: this.state.deviceInfoList[this.state.deviceInfoList.length - 1].hasOwnProperty('saveLockGoalDate') ? '' : 'hide-column',
            render: (text, row) => (
              <span>{row.saveLockGoalDate ? moment(row.saveLockGoalDate).format('YYYY/MM/DD') : ''}</span>
            )
          },
          {
            title: '工程起重机械设备状态',
            dataIndex: 'constructionCraneStatus',
            key: 'constructionCraneStatus',
            align: 'center'
          },
          {
            title: '跨度',
            dataIndex: 'crossOver',
            key: 'crossOver',
            align: 'center',
            className: this.state.deviceInfoList[this.state.deviceInfoList.length - 1].hasOwnProperty('crossOver') ? '' : 'hide-column'
          },
          {
            title: '最近一次提升日期',
            key: 'latestPullUpDate',
            align: 'center',
            className: this.state.deviceInfoList[this.state.deviceInfoList.length - 1].hasOwnProperty('latestPullUpDate') ? '' : 'hide-column',
            render: (text, row) => (
              <span>{row.latestPullUpDate ? moment(row.latestPullUpDate).format('YYYY/MM/DD') : ''}</span>
            )
          },
          {
            title: '验收日期',
            key: 'acceptanceDate',
            align: 'center',
            className: this.state.deviceInfoList[this.state.deviceInfoList.length - 1].hasOwnProperty('acceptanceDate') ? '' : 'hide-column',
            render: (text, row) => (
              <span>{row.acceptanceDate ? moment(row.acceptanceDate).format('YYYY/MM/DD') : ''}</span>
            )
          },
          {
            title: '防坠器有效期',
            key: 'fallingAvaliableDate',
            align: 'center',
            className: this.state.deviceInfoList[this.state.deviceInfoList.length - 1].hasOwnProperty('fallingAvaliableDate') ? '' : 'hide-column',
            render: (text, row) => (
              <span>{row.fallingAvaliableDate ? moment(row.fallingAvaliableDate).format('YYYY/MM/DD') : ''}</span>
            )
          },
          {
            title: '防坠器标定日期',
            key: 'fallingAvaliableGoalDate',
            align: 'center',
            className: this.state.deviceInfoList[this.state.deviceInfoList.length - 1].hasOwnProperty('fallingAvaliableGoalDate') ? '' : 'hide-column',
            render: (text, row) => (
              <span>{row.fallingAvaliableGoalDate ? moment(row.fallingAvaliableGoalDate).format('YYYY/MM/DD') : ''}</span>
            )
          },
          {
            title: '年检日期',
            key: 'yearCheckDate',
            align: 'center',
            className: this.state.deviceInfoList[this.state.deviceInfoList.length - 1].hasOwnProperty('yearCheckDate') ? '' : 'hide-column',
            render: (text, row) => (
              <span>{row.yearCheckDate ? moment(row.yearCheckDate).format('YYYY/MM/DD') : ''}</span>
            )
          },
          {
            title: '安装高度(米):',
            dataIndex: 'setupHeight',
            key: 'setupHeight',
            align: 'center',
            className: this.state.deviceInfoList[this.state.deviceInfoList.length - 1].hasOwnProperty('setupHeight') ? '' : 'hide-column'
          },
          {
            title: '使用高度(米):',
            dataIndex: 'useHeight',
            key: 'useHeight',
            align: 'center',
            className: this.state.deviceInfoList[this.state.deviceInfoList.length - 1].hasOwnProperty('useHeight') ? '' : 'hide-column'
          },
          {
            title: '顶升加节次数',
            dataIndex: 'topJackingCount',
            key: 'topJackingCount',
            align: 'center',
            className: this.state.deviceInfoList[this.state.deviceInfoList.length - 1].hasOwnProperty('topJackingCount') ? '' : 'hide-column'
          },
          {
            title: '最近一次加节时间',
            key: 'lastestJackingDate',
            align: 'center',
            className: this.state.deviceInfoList[this.state.deviceInfoList.length - 1].hasOwnProperty('lastestJackingDate') ? '' : 'hide-column',
            render: (text, row) => (
              <span>{row.lastestJackingDate ? moment(row.lastestJackingDate).format('YYYY/MM/DD') : ''}</span>
            )
          },
          {
            title: '每次顶升加节作业人员操作证证件号',
            dataIndex: 'jackingPeopleId',
            key: 'jackingPeopleId',
            align: 'center',
            className: this.state.deviceInfoList[this.state.deviceInfoList.length - 1].hasOwnProperty('jackingPeopleId') ? '' : 'hide-column'
          },
          {
            title: '信号工、司索工证件号',
            dataIndex: 'infoPeopleId',
            key: 'infoPeopleId',
            align: 'center',
            className: this.state.deviceInfoList[this.state.deviceInfoList.length - 1].hasOwnProperty('infoPeopleId') ? '' : 'hide-column'
          },
          {
            title: '设备操作人员(司机)证件号',
            dataIndex: 'operatorId',
            key: 'operatorId',
            align: 'center',
            className: this.state.deviceInfoList[this.state.deviceInfoList.length - 1].hasOwnProperty('operatorId') ? '' : 'hide-column'
          },
          {
            title: '设备数量',
            dataIndex: 'deviceCount',
            key: 'deviceCount',
            align: 'center',
            className: this.state.deviceInfoList[this.state.deviceInfoList.length - 1].hasOwnProperty('deviceCount') ? '' : 'hide-column'
          },
          {
            title: '操作',
            key: 'action',
            align: 'center',
            fixed: 'right',
            width: 100,
            render: (text, row) => (
              <span>
                <Popconfirm
                    placement="topLeft"
                    title={'确定要删除该记录吗？'}
                    onConfirm={this.deleteDevice.bind(null,row)}
                    okText="是"
                    cancelText="否"
                >
                    <Button title="删除">删除</Button>
                </Popconfirm>
              </span>
            )
          }
        ]
        this.setState({
          columns: temp
        })
      } else {
        this.setState({
          columns: []
        })
      }
    })
  }
  render() {
    return (
        <Table
            bordered 
            dataSource={this.state.deviceInfoList}
            pagination={true}
            columns={this.state.columns}
            scroll={{x: 'max-content'}}
            rowKey="id" >
      </Table>
    );
  }
}

export default Form.create({ name: "DeviceInfoList" })(DeviceInfoList);
