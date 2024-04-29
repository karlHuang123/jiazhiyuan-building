import React, { Component } from "react";
import { Card, Button, Table, message, Divider, Input, Tooltip, Icon, Modal, Popconfirm, Select } from "antd";
import { getDocumentList, getDocumentOptions, addDocument, deleteDocument, editDocument } from "@/api/document";
import AddDocumentForm from "./forms/add-document-form";
import EditDocumentForm from "./forms/edit-document-form";
import moment from 'moment'
import '../business/style/clientInfo.less'
const { Column } = Table;
const { Option } = Select
const inputLongStyle = {
  padding: '1px 10px',
  width: '250px'
}
class ModuleList extends Component {
  state = {
    practices: [],
    fileTypeOptions: [],
    fileType: '',
    fileName: '',
    openAddTemplate: false,
    openEditTemplate: false,
    currentRowData: null,
    getDocumentListBody: {
        currPage: 1,
        pageSize: 20000,
        fileName: '',
        fileType: ''
      }
  };
  getDocumentListFun = async (body) => {
    const result = await getDocumentList(body)
    if (result.data.status === 'OK') {
      this.setState({
        practices: result.data.data.list
      })
    } else {
      message.error('获取失败，请刷新重试')
    }
  }
  getDocumentOptionsFun = async () => {
    const result = await getDocumentOptions()
    if (result.data.status === 'OK') {
      let temp = []
      result.data.data.forEach(item => {
        const ele = {
          label: item.name,
          value: item.code
        }
        temp.push(ele)
      })
      this.setState({
        fileTypeOptions: temp
      })
    } else {
      message.error('获取失败，请刷新重试')
    }
  }
  editTemplate = (row) => {
    this.setState({
      currentRowData: row,
      openEditTemplate: true
    })
  }
  handleAddTemplateOk = () => {
    const { form } = this.addDocumentFormRef.props
    form.validateFields((err, values) => {
        if (err) {
          return;
        }
        const body = {
          fileType: values.fileType.key,
          remark: values.remark ? values.remark : '',
          fileUrl: values.filePath
        }
        console.log(values)
        addDocument(body).then((response) => {
          if (response.data.status === 'OK') {
            form.resetFields();
            this.setState({ openAddTemplate: false});
            message.success("添加成功!")
            this.getDocumentListFun(this.state.getDocumentListBody)
          } else {
            this.setState({ openAddTemplate: false});
            message.success("添加失败!")
          }
        }).catch(e => {
          message.error("添加失败,请重试!")
        })
      })
  }
  multipDelete = () => {
    let temp = []
    this.state.selectDeviceExperts.forEach(item => {
      const ele = item.id
      temp.push(ele)
    })
    deleteDocument({
      ids: temp
    }).then(res => {
      if (res.data.status === 'OK') {
        message.success("删除成功")
        this.getDocumentListFun(this.state.getDocumentListBody)
      } else {
        message.success("删除失败")
      }
    })
  }
  handleDeleteTemplate = (row) => {
    const { id } = row
    deleteDocument({
      ids: [id]
    }).then(res => {
      if (res.data.status === 'OK') {
        message.success("删除成功")
        this.getDocumentListFun(this.state.getDocumentListBody)
      } else {
        message.success("删除失败")
      }
    })
  }
  handleEditTemplateOk = () => {
    const { form } = this.editDocumentFormRef.props
    form.validateFields((err, values) => {
        if (err) {
          return;
        }
        const body = {
          id: values.id,
          fileType: values.fileType.key,
          remark: values.remark ? values.remark : '',
          fileUrl: values.filePath
        }
        editDocument(body).then((response) => {
          if (response.data.status === 'OK') {
            form.resetFields();
            this.setState({ openEditTemplate: false});
            message.success("编辑成功!")
            this.getDocumentListFun(this.state.getDocumentListBody)
          } else {
            this.setState({ openEditTemplate: false});
            message.success("编辑失败!")
          }
        }).catch(e => {
          message.error("添加失败,请重试!")
        })
      })
  }
  componentDidMount() {
    this.getDocumentListFun(this.state.getDocumentListBody)
    this.getDocumentOptionsFun()
  }
  render() {
    const { practices, templateName, remark } = this.state
    const title = (
      <div className="title flex">
        <div className="flex">
          <div>
            <Input 
              style={inputLongStyle}
              value={templateName} 
              placeholder="请输入文件名称"
              onChange={(e) => { this.setState({templateName: e.target.value}) }}
              prefix={<Icon style={{marginLeft: '4px'}} type="search" />}
              allowClear
              onPressEnter={
              (e) => {
                this.getDocumentListFun({
                  currPage: 1,
                  pageSize: 20000,
                  fileName: this.state.fileName,
                  fileType: this.state.fileType
                })
              }
            } />
          </div>
          &nbsp;
          &nbsp;
          <Select
            style={{
              width: 250,
            }}
            placeholder="文件类型"
            allowClear
            value={this.state.fileType}
          >
            {this.state.fileTypeOptions.map((item, index) => (
              <Option value={item.value} key={index}>{item.label}</Option>
            ))}
          </Select>
        </div>
        <div className="right">
           <Button type='primary' onClick={() => this.setState({openAddTemplate: true})}>
                <div className="bolder">
                <Icon type="plus"></Icon>&nbsp;
                添加
                </div>
            </Button>
            &nbsp;
            &nbsp;
            <Button type='primary'>
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
            okText="是"
            cancelText="否"
          >
            <Button type='danger' onClick={this.multipDelete}>
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
            rowKey="id" 
            rowSelection={{
              type: 'checkbox',
              onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                  selectDeviceExperts: selectedRows
                })
              },
            }}
            dataSource={practices} 
            pagination={true}
            scroll={{x: 'max-content'}}>
            <Column title="文件名称" dataIndex="fileName" key="fileName" align="center"/>
            <Column title="文件类型" dataIndex="fileTypeName" key="fileType" align="center"/>
            <Column title="文件格式" dataIndex="fileExtension" key="fileExtension" align="center"/>
            <Column title="文件大小" key="fileSize" align="center" dataIndex="fileSize"/>
            <Column title="上传人" dataIndex="creatorName" key="creatorName" align="center" />
            <Column title="上传时间" key="createTime" width={165} align="center" render={(text, row) => (
              <span>
                {moment(row.updateTime ? row.updateTime : row.createTime).format('YYYY-MM-DD HH:mm:ss')}
              </span>
            )}/>
            <Column title="备注" dataIndex="remark" key="remark" align="center" />
            <Column title="操作" key="action" width={295} fixed="right" align="center" render={(text, row) => (
              <span>
                <Popconfirm
                    placement="topLeft"
                    title={'确定要删除该文件吗？'}
                    okText="是"
                    cancelText="否"
                    onConfirm={this.handleDeleteTemplate.bind(null, text)}
                >
                    <Button title="删除">删除</Button>
                </Popconfirm>
                <Divider type="vertical" />
                <Button title="编辑" onClick={this.editTemplate.bind(null, row)}>编辑</Button>
                <Divider type="vertical" />
                <Button title="下载">
                  <a href={`http://47.93.28.249:8181/admin/file/download/v2?fileName=${row.fileName}`}>下载</a>
                </Button>
                </span>
            )}/>
          </Table>
        </Card>
        <AddDocumentForm
          wrappedComponentRef={formRef => this.addDocumentFormRef = formRef}
          visible={this.state.openAddTemplate}
          onCancel={() => this.setState({openAddTemplate: false})}
          onOk={this.handleAddTemplateOk}
          fileTypeOptions={this.state.fileTypeOptions}
        />
        <EditDocumentForm
          wrappedComponentRef={formRef => this.editDocumentFormRef = formRef}
          visible={this.state.openEditTemplate}
          onCancel={() => this.setState({openEditTemplate: false})}
          onOk={this.handleEditTemplateOk}
          fileTypeOptions={this.state.fileTypeOptions}
          currentRowData={this.state.currentRowData}
        />
      </div>
    );
  }
}

export default ModuleList;
