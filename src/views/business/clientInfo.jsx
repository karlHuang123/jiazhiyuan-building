import React, { Component } from "react";
import { Card, Button, Table, message, Divider, Input, Tooltip, Icon, Popconfirm, Select } from "antd";
import { getClientList, deleteClient, addClient, getClientOptions, editClient } from "@/api/business";
import { getUsersOptions } from '@/api/user'
import EditClientForm from "./forms/edit-client-form"
import AddClientForm from "./forms/add-client-form"
import moment from 'moment'
import './style/clientInfo.less'
const { Column } = Table;
const { Option } = Select;
const inputLongStyle = {
  padding: '1px 10px',
  width: '250px'
}
class ClientInfo extends Component {
  state = {
    clients: [],
    clientOptions: [],
    createorOptions: [],
    editUserModalVisible: false,
    editUserModalLoading: false,
    currentRowData: {},
    addClientModalVisible: false,
    addClientModalLoading: false,
    searchName: '',
    selectClients: [],
    singleDelete: [],
    searchClientType: null,
    listBody: {
      currPage: 1,
      pageSize: 999,
      keyword: null,
      clientType: null,
      creatorId: null
    }
  };
  handleClientTypeChange = (value) => {
    let body = this.state.listBody
    body.keyword = this.searchName || ''
    if (value) {
      body.clientType = value
      this.setState({
        listBody: body
      })
    } else {
      body.clientType = null
      this.setState({
        listBody: body
      })
    }
    this.getClientList()
  }

  handleCreatorChange = (value) => {
    let body = this.state.listBody
    body.keyword = this.searchName || ''
    if (value) {
      body.creatorId = value
      this.setState({
        listBody: body
      })
    } else {
      body.creatorId = null
      this.setState({
        listBody: body
      })
    }
    this.getClientList()
  }

  resetSearch = () => {
    const body = {
      currPage: 1,
      pageSize: 999,
      keyword: null,
      clientType: null,
      creatorId: null
    }
    this.setState({
      listBody: body,
      searchName: ''
    })
    this.getClientList(body)
  }
  getClientList = async (body = this.state.listBody) => {
    const result = await getClientList(body)
    if (result.data.status === 'OK') {
      let list = result.data.data.list
      list.forEach(item => {
        const typeName = 
          this.state.clientOptions.find(ele => ele.value === item.type) ? this.state.clientOptions.find(ele => ele.value === item.type).label : ''
        item.typeName = typeName
      })
      this.setState({
        clients: list
      })
    }
  }
  getCreatorOptions = async () => {
    const result = await getUsersOptions()
    if (result.data.status === 'OK') {
      let temp = []
      result.data.data.forEach(item => {
        const ele = {
          value: item.code,
          label: item.name
        }
        temp.push(ele)
      })
      this.setState({
        createorOptions: temp
      }, () => {
        this.getClientList()
      })
    }
  }
  getClientOptions = async () => {
    const result = await getClientOptions()
    if (result.data.status === 'OK') {
      let temp = []
      result.data.data.forEach(item => {
        const ele = {
          value: item.code,
          label: item.name
        }
        temp.push(ele)
      })
      this.setState({
        clientOptions: temp
      })
    }
  }
  handleEditUser = (row) => {
    this.setState({
      currentRowData: Object.assign({}, row),
      editUserModalVisible: true,
    });
  };

  handleDeleteClient = (row) => {
    const { id } = row
    deleteClient({
      clientIds: [id]
    }).then(res => {
      if (res.data.status === 'OK') {
        message.success("删除成功")
        this.getClientList();
      } else {
        message.success("删除失败")
      }
    })
  }

  multipDelete = () => {
    let temp = []
    this.state.selectClients.forEach(item => {
      const ele = item.id
      temp.push(ele)
    })
    deleteClient({
      clientIds: temp
    }).then(res => {
      if (res.data.status === 'OK') {
        message.success("删除成功")
        this.getClientList();
      } else {
        message.success("删除失败")
      }
    })
  }
  
  handleEditUserOk = _ => {
    const { form } = this.editClientFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const body = {
        id: values.id,
        name: values.name, // 必填
        intention: values.intention,  //必填
        type: values.type.key
      }
      this.setState({ editModalLoading: true, });
      editClient(body).then((response) => {
        form.resetFields();
        this.setState({ editUserModalVisible: false, editUserModalLoading: false });
        message.success("编辑成功!")
        this.getClientList()
      }).catch(e => {
        message.success("编辑失败,请重试!")
      })
    });
  };

  handleCancel = _ => {
    this.setState({
      editUserModalVisible: false,
      addClientModalVisible: false,
    });
  };

  handleAddClient = (row) => {
    this.setState({
      addClientModalVisible: true,
    });
  };

  handleAddClientOk = _ => {
    const { form } = this.addClientFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const body = {
        name: values.name, // 必填
        intention: values.intention,  //必填
        type: values.type.key
      }
      this.setState({ addClientModalLoading: true, });
      addClient(body).then((response) => {
        if (response.data.status === 'OK') {
          form.resetFields();
          this.setState({ addClientModalVisible: false, addClientModalLoading: false });
          message.success("添加成功!")
          this.getClientList()
        } else {
          this.setState({ addClientModalVisible: false, addClientModalLoading: false });
          message.success("添加失败!")
        }
      }).catch(e => {
        message.error("添加失败,请重试!")
      })
    });
  };
  componentDidMount() {
    this.getClientOptions()
    this.getCreatorOptions()
  }
  render() {
    const { clients, searchName } = this.state
    const title = (
      <div className="title flex">
        <div>
          <Input 
            style={inputLongStyle}
            value={searchName} 
            onChange={(e) => { this.setState({searchName: e.target.value}) }}
            prefix={<Icon style={{marginLeft: '4px'}} type="search" />}
            allowClear
            onPressEnter={
            (e) => {
              let body = this.state.listBody
              body.keyword = e.target.value
              this.setState({
                listBody: body
              })
              this.getClientList()
            }
          } />
          &nbsp;
          <Select
            style={{
              width: 250,
            }}
            placeholder="委托方类型"
            allowClear
            onChange={this.handleClientTypeChange}
          >
            {this.state.clientOptions.map((item, index) => (
              <Option value={item.value} key={item.value}>{item.label}</Option>
            ))}
          </Select>
          &nbsp;
          &nbsp;
          <Select
            style={{
              width: 250,
            }}
            placeholder="创建人"
            allowClear
            onChange={this.handleCreatorChange}
          >
            {this.state.createorOptions.map((item, index) => (
              <Option value={item.value} key={item.value}>{item.label}</Option>
            ))}
          </Select>
        </div>
        &nbsp;
        &nbsp;
        <div className="right">
          <Button type='primary' onClick={this.handleAddClient}>
            <div className="bolder">
              <Icon type="plus"></Icon>&nbsp;
              添加委托方
            </div>
          </Button>
          &nbsp;
          &nbsp;
          <Button type='primary' onClick={this.resetSearch}>
            <div className="bolder">
              <Icon type="reload"></Icon>&nbsp;
              重置
            </div>
          </Button>
          &nbsp;
          &nbsp;
          <Popconfirm
            placement="top"
            title={'确定要删除选中项吗？'}
            onConfirm={this.multipDelete}
            okText="是"
            cancelText="否"
          >
            <Button type='danger'>
              <div className="bolder">
                <Icon type="delete"></Icon>&nbsp;
                批量删除
              </div>
            </Button>
          </Popconfirm>
        </div>
      </div>
    )
    return (
      <div className="app-container">
        <Card title={title}>
          <Table 
            bordered 
            rowKey="createTime" 
            rowSelection={{
                type: 'checkbox',
                onChange: (selectedRowKeys, selectedRows) => {
                  console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                  this.setState({
                    selectClients: selectedRows
                  })
                },
            }}
            dataSource={clients} 
            pagination={true}>
            <Column title="委托方名称" dataIndex="name" key="name" align="center"/>
            <Column title="委托方类别" width={140} dataIndex="typeName" key="typeName" align="center"/>
            <Column title="委托方意向" width={205} dataIndex="intention" key="intention" align="center"/>
            <Column title="创建时间" key="createTime" width={225} align="center" render={(text, row) => (
              <span>
                {moment(parseFloat(row.createTime)).format('YYYY-MM-DD HH:mm:ss')}
              </span>
            )}/>
            <Column title="创建人" dataIndex="creatorName" key="creatorName" align="center" />
            <Column title="操作" key="action" width={115} align="center" render={(text, row) => (
              <span>
                <Tooltip placement="top" title={'编辑'}>
                  <Button type="primary" shape="circle" icon="edit" title="编辑" onClick={this.handleEditUser.bind(null,row)}/>
                </Tooltip>
                <Divider type="vertical" />
                <Tooltip placement="top" title={'删除'}>
                  <Popconfirm
                    placement="topLeft"
                    title={'确定要删除该委托方吗？'}
                    onConfirm={this.handleDeleteClient.bind(null,row)}
                    okText="是"
                    cancelText="否"
                  >
                    <Button type="primary" shape="circle" icon="delete" title="删除"/>
                  </Popconfirm>
                </Tooltip>
              </span>
            )}/>
          </Table>
        </Card>
        <EditClientForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={formRef => this.editClientFormRef = formRef}
          visible={this.state.editUserModalVisible}
          confirmLoading={this.state.editUserModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleEditUserOk}
          options={this.state.clientOptions}
        />  
        <AddClientForm
          wrappedComponentRef={formRef => this.addClientFormRef = formRef}
          visible={this.state.addClientModalVisible}
          clientOptions={this.state.clientOptions}
          confirmLoading={this.state.addClientModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleAddClientOk}
          options={this.state.clientOptions}
        />  
      </div>
    );
  }
}

export default ClientInfo;
