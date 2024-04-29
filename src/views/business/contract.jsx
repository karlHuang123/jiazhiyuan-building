import React, { Component } from "react";
import { Card, Button, Table, message, Divider, Input, Tooltip, Icon, Popconfirm, Select } from "antd";
import { getContractList, deleteContract, getClientSelectOptions, addContract, getClientOptions, editContract } from "@/api/business";
import { getUsersOptions } from '@/api/user'
import EditContractForm from "./forms/edit-contract-form"
import AddContractForm from "./forms/add-contract-form"
import moment from 'moment'
import './style/clientInfo.less'
const { Column } = Table;
const { Option } = Select;
const inputLongStyle = {
  padding: '1px 10px',
  width: '250px'
}
class Contract extends Component {
  state = {
    clients: [],
    clientOptions: [],
    clientSelectOptions: [],
    createorOptions: [],
    editUserModalVisible: false,
    editUserModalLoading: false,
    currentRowData: {},
    addContractModalVisible: false,
    addContractModalLoading: false,
    searchName: '',
    selectClients: [],
    singleDelete: [],
    searchClientType: null,
    contractFile: '',
    techServiceFile: '',
    listBody: {
      currPage: 1,
      pageSize:20000,
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
      }, () => {
        this.getContractList()
      })
    } else {
      body.clientType = null
      this.setState({
        listBody: body
      }, () => {
        this.getContractList()
      })
    }
  }

  handleCreatorChange = (value) => {
    let body = this.state.listBody
    body.keyword = this.searchName || ''
    if (value) {
      body.creatorId = value
      this.setState({
        listBody: body
      }, () => {
        this.getContractList()
      })
    } else {
      body.creatorId = null
      this.setState({
        listBody: body
      }, () => {
        this.getContractList()
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
        this.getClientOptions()
      })
    }
  }
  resetSearch = () => {
    const body = {
      currPage: 1,
      pageSize:20000,
      keyword: null,
      clientType: null,
      creatorId: null
    }
    this.setState({
      listBody: body,
      searchName: ''
    })
    this.getContractList()
  }
  getContractList = async () => {
    const result = await getContractList(this.state.listBody)
    if (result.data.status === 'OK') {
      let list = result.data.data.list
      console.log(this.state.clientOptions)
      list.forEach(item => {
        const typeName = this.state.clientOptions.find(ele => ele.value === item.client.type)?.label
        item.typeName = typeName
      })
      this.setState({
        clients: list
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
      }, () => {
        this.getContractList()
      })
    }
  }
  getClientSelectOptions = async () => {
    const result = await getClientSelectOptions()
    if (result.data.status === 'OK') {
      let temp = []
      result.data.data.forEach((item) => {
        const ele = {
          value: item.id,
          label: item.name
        }
        temp.push(ele)
      })
      this.setState({
        clientSelectOptions: temp
      })
    }
  }
  handleEditUser = (row) => {
    this.setState({
      currentRowData: Object.assign({}, row),
      editUserModalVisible: true,
    });
  };

  handleDeleteContract = (row) => {
    const { id } = row
    deleteContract({
      contractIds: [id]
    }).then(res => {
      if (res.data.status === 'OK') {
        message.success("删除成功")
        this.getContractList();
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
    deleteContract({
      contractIds: temp
    }).then(res => {
      if (res.data.status === 'OK') {
        message.success("删除成功")
        this.getContractList();
      } else {
        message.success("删除失败")
      }
    })
  }
  
  handleEditUserOk = _ => {
    const { form } = this.editContractFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const body = {
        id: values.id,
        clientId: values.client.type.key, // 必填
        contractNo: values.contractNo,  //必填
        contractState: values.state.key,
        contractFile: this.state.contractFile ? this.state.contractFile : values.contractFile[0].name,
        techServiceFile: this.state.techServiceFile ? this.state.techServiceFile : values.techServiceFile[0].name
      }
      this.setState({ editModalLoading: true, });
      editContract(body).then((response) => {
        form.resetFields();
        this.setState({ 
          editUserModalVisible: false,
          addContractModalVisible: false,
          contractFile: '',
          techServiceFile: ''
         });
        message.success("编辑成功!")
        this.getContractList()
      }).catch(e => {
        message.success("编辑失败,请重试!")
      })
    });
  };
  handleAddContractOk = _ => {
    const { form } = this.addContractFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const body = {
        clientId: values.client.type.key, // 必填
        contractNo: values.contractNo,  //必填
        contractState: values.contractState.key,
        contractFile: this.state.contractFile,
        techServiceFile: this.state.techServiceFile
      }
      this.setState({ addContractModalLoading: true, });
      addContract(body).then((response) => {
        if (response.data.status === 'OK') {
          form.resetFields();
          this.setState({ 
            editUserModalVisible: false,
            addContractModalVisible: false,
            contractFile: '',
            techServiceFile: ''
           });
          message.success("添加成功!")
          this.getContractList()
        } else {
          this.setState({ 
            editUserModalVisible: false,
            addContractModalVisible: false,
            contractFile: '',
            techServiceFile: ''
           });
          message.success("添加失败!")
        }
      }).catch(e => {
        message.error("添加失败,请重试!")
      })
    });
  }
  handleCancel = _ => {
    this.setState({
      editUserModalVisible: false,
      addContractModalVisible: false,
      contractFile: '',
      techServiceFile: ''
    });
  };

  handleAddContract = (row) => {
    this.setState({
      addContractModalVisible: true,
    });
  };
  handleContractName = (contractFile) => {
    this.setState({
      contractFile: contractFile
    })
  }
  handleTechServiceFileName = (techServiceFile) => {
    this.setState({
      techServiceFile: techServiceFile
    })
  }
  checkStatus = (status) => {
    let output = ''
    switch (status) {
      case 0:
        output = '未开始'
        break;
      case 1:
        output = '执行中'
        break;
      case 2:
        output = '已完成'
        break;  
    }
    return output
  }
  componentDidMount() {
    this.getCreatorOptions()
    this.getClientSelectOptions()
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
              this.getContractList()
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
              <Option value={item.value} key={index}>{item.label}</Option>
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
              <Option value={item.value} key={index}>{item.label}</Option>
            ))}
          </Select>
        </div>
        &nbsp;
        &nbsp;
        <div className="right">
          <Button type='primary' onClick={this.handleAddContract}>
            <div className="bolder">
              <Icon type="plus"></Icon>&nbsp;
              新增
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
                  this.setState({
                    selectClients: selectedRows
                  })
                },
            }}
            dataSource={clients} 
            pagination={true}>
            <Column title="委托方" key="client" align="center" render={(text, row) => (
              <span>{row.client.name}</span>
            )}/>
            <Column title="委托方类别" dataIndex="typeName" key="typeName" align="center"/>
            <Column title="委托方意向" key="intention" align="center" render={(text, row) => (
              <span>{row.client.intention}</span>
            )}/>
            <Column title="创建时间" key="createTime" align="center" render={(text, row) => (
              <span>
                {moment(text).format('YYYY-MM-DD HH:mm:ss')}
              </span>
            )}/>
            <Column title="技术服务方案" key="techServiceFile" align="center" render={(text, row) => (
              <a href={`http://47.93.28.249:8181/admin/file/download?fileName=${row.techServiceFile}`}>{row.techServiceFile}</a>
            )}/>
            <Column title="合同文件" key="contractFile" align="center" render={(text, row) => (
              <a href={`http://47.93.28.249:8181/admin/file/download?fileName=${row.contractFile}`}>{row.contractFile}</a>
            )}/>
            <Column title="状态" key="state" align="center" render={(text, row) => (
              <span>{this.checkStatus(row.state)}</span>
            )}/>
            <Column title="合同编号" key="contractNo" align="center" render={(text, row) => (
              <span>{row.contractNo}</span>
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
                    onConfirm={this.handleDeleteContract.bind(null,row)}
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
        <EditContractForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={formRef => this.editContractFormRef = formRef}
          visible={this.state.editUserModalVisible}
          confirmLoading={this.state.editUserModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleEditUserOk}
          updateContract={this.handleContractName}
          updateTechFile={this.handleTechServiceFileName}
          options={this.state.clientSelectOptions}
        />  
        <AddContractForm
          wrappedComponentRef={formRef => this.addContractFormRef = formRef}
          visible={this.state.addContractModalVisible}
          confirmLoading={this.state.addContractModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleAddContractOk}
          updateContract={this.handleContractName}
          updateTechFile={this.handleTechServiceFileName}
          options={this.state.clientSelectOptions}
        />  
      </div>
    );
  }
}

export default Contract;
