import React, { Component } from "react";
import { Card, Button, Table, message, Divider, Input, Tooltip, Icon, Modal, Popconfirm, Empty } from "antd";
import { getModuleList, addTemplate, editTemplate,  deleteTemplate, getTemplateOptionList, getTemplateDetails } from "@/api/report";
import AddTemplateForm from "./form/add-template-form";
import EditTemplateForm from "./form/edit-template-form";
import EditTemplatePage from "./component/edit-template-page";
import moment from 'moment'
import '../business/style/clientInfo.less'
const { Column } = Table;
const inputLongStyle = {
  padding: '1px 10px',
  width: '250px'
}
class ModuleList extends Component {
  state = {
    practices: [],
    selectTemplates: [],
    templateOptions: [],
    templateName: '',
    remark: '',
    currentId: null,
    openAddTemplate: false,
    openEditTemplate: false,
    currentRowData: null,
    editModule: false,
    currentConfig: null,
    getmoduleListBody: {
        currPage: 1,
        pageSize: 20000,
        name: '',
        remark: ''
      }
  };
  getModuleListFun = async (body) => {
    const result = await getModuleList(body)
    if (result.data.status === 'OK') {
      this.setState({
        practices: result.data.data.list
      })
    } else {
      message.error('获取失败，请刷新重试')
    }
  }
  getTemplateOptionListFun = async () => {
    const result = await getTemplateOptionList()
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
        templateOptions: temp
      })
    }
  }

  getTemplateDetails = async (id) => {
    const result = await getTemplateDetails({
      templateId: id
    })
    if (result.data.status === 'OK') {
        this.setState({
          currentConfig: result.data.data.templateConfig
        })
    } else {
        message.error(result.data.errorMsg)
    }
}
  editTemplate = (row) => {
    this.setState({
      currentRowData: row,
      openEditTemplate: true
    }, () => {
      this.getTemplateDetails(row.id)
    })
  }
  multipDelete = () => {
    let temp = []
    this.state.selectTemplates.forEach(item => {
      const ele = item.id
      temp.push(ele)
    })
    deleteTemplate({
      ids: temp
    }).then(res => {
      if (res.data.status === 'OK') {
        message.success("删除成功")
        this.getModuleListFun(this.state.getmoduleListBody);
      } else {
        message.success("删除失败")
      }
    })
  }
  handleDeleteTemplate = (row) => {
    const { id } = row
    deleteTemplate({
      ids: [id]
    }).then(res => {
      if (res.data.status === 'OK') {
        message.success("删除成功")
        this.getModuleListFun(this.state.getmoduleListBody)
      } else {
        message.success("删除失败")
      }
    })
  }
  handleAddTemplateOk = () => {
    const { form } = this.addTemplateFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const body = {
        templateType: values.templateType, // 模板类型
        templateNo: values.templateNo, // 模板编号
        templateSubNo: values.templateSubNo, // 模板子编号
        templateName: values.templateName, // 模板名称
        remark: values.remark ? values.remark : '',  // 备注
      }
      addTemplate(body).then((response) => {
        if (response.data.status === 'OK') {
          form.resetFields();
          this.setState({ 
            openAddTemplate: false
           });
          message.success("添加成功!")
          this.getModuleListFun(this.state.getmoduleListBody)
        } else {
          this.setState({ 
            openAddTemplate: false
           });
          message.success("添加失败!")
        }
      }).catch(e => {
        message.error("添加失败,请重试!")
      })
    });
  }
  handleEditTemplateOk = () => {
    const { form } = this.editTemplateFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const body = {
        id: values.id,
        templateType: values.templateType, // 模板类型
        templateNo: values.templateNo, // 模板编号
        templateSubNo: values.templateSubNo, // 模板子编号
        templateName: values.templateName, // 模板名称
        remark: values.remark ? values.remark : '',  // 备注
      }
      editTemplate(body).then((response) => {
        if (response.data.status === 'OK') {
          form.resetFields();
          this.setState({ 
            openEditTemplate: false,
            editModule: values.templateType === 'DSFPGBG',
            currentId: values.id
           });
          message.success("编辑成功!")
          this.getModuleListFun(this.state.getmoduleListBody)
        } else {
          this.setState({ 
            openEditTemplate: false
           });
          message.success("编辑失败!")
        }
      }).catch(e => {
        message.error("编辑失败,请重试!")
      })
    });
  }
  deleteTemplateFun = () => {

  }
  componentDidMount() {
    this.getModuleListFun(this.state.getmoduleListBody)
    this.getTemplateOptionListFun()
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
              placeholder="请输入模版名称"
              onChange={(e) => { this.setState({templateName: e.target.value}) }}
              prefix={<Icon style={{marginLeft: '4px'}} type="search" />}
              allowClear
              onPressEnter={
              (e) => {
                this.getModuleListFun({
                  currPage: 1,
                  pageSize: 20000,
                  name: this.state.templateName,
                  remark: this.state.remark
                })
              }
            } />
          </div>
          &nbsp;
          &nbsp;
          <div>
            <Input 
              style={inputLongStyle}
              value={remark} 
              placeholder="请输入备注"
              onChange={(e) => { this.setState({remark: e.target.value}) }}
              prefix={<Icon style={{marginLeft: '4px'}} type="search" />}
              allowClear
              onPressEnter={
              (e) => {
                this.getModuleListFun({
                  currPage: 1,
                  pageSize: 20000,
                  name: this.state.templateName,
                  remark: this.state.remark
                })
              }
            } />
          </div>
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
            onConfirm={this.multipDelete}
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
        {this.state.editModule ? (
          <EditTemplatePage currentConfig={this.state.currentConfig} currentRowData={this.state.currentRowData} onCancel={(msg) => {
            if (msg === 'success') {
              this.getModuleListFun(this.state.getmoduleListBody)
            }
            this.setState({
              editModule: false,
              currentRowData: null
            })
          }} />
        ) : (
            <Card title={title}>
              <Table 
                bordered 
                rowKey="id" 
                rowSelection={{
                  type: 'checkbox',
                  onChange: (selectedRowKeys, selectedRows) => {
                    this.setState({
                      selectTemplates: selectedRows
                    })
                  },
                }}
                dataSource={practices} 
                pagination={true}
                scroll={{x: 'max-content'}}>
                <Column title="序号" dataIndex="id" key="id" align="center"/>
                <Column title="报告模版编号" dataIndex="templateNo" key="templateNo" align="center"/>
                <Column title="报告模版名称" dataIndex="templateName" key="templateName" align="center"/>
                <Column title="类型" key="templateType" align="center" dataIndex="templateType"/>
                <Column title="创建人" dataIndex="creatorName" key="creatorName" align="center" />
                <Column title="修改时间" key="createTime" width={165} align="center" render={(text, row) => (
                  <span>
                    {moment(row.updateTime ? row.updateTime : row.createTime).format('YYYY-MM-DD HH:mm:ss')}
                  </span>
                )}/>
                <Column title="备注" dataIndex="remark" key="remark" align="center" />
                <Column title="操作" key="action" width={295} fixed="right" align="center" render={(text, row) => (
                  <span>
                    <Popconfirm
                        placement="topLeft"
                        title={'确定要删除该模版吗？'}
                        okText="是"
                        cancelText="否"
                        onConfirm={this.handleDeleteTemplate.bind(null,row)}
                    >
                        <Button title="删除">删除</Button>
                    </Popconfirm>
                    <Divider type="vertical" />
                    <Button title="编辑" onClick={this.editTemplate.bind(null, row)}>编辑</Button>
                    <Divider type="vertical" />
                    <Button title="下载">
                      <a href={`http://47.93.28.249:8181/admin/file/download/v2?fileName=report_112.docx`}>下载</a>
                    </Button>
                    </span>
                )}/>
              </Table>
            </Card>
        )}
        <AddTemplateForm
          wrappedComponentRef={formRef => this.addTemplateFormRef = formRef}
          visible={this.state.openAddTemplate}
          onCancel={() => this.setState({openAddTemplate: false})}
          onOk={this.handleAddTemplateOk}
          templateOptions={this.state.templateOptions}
        />
        <EditTemplateForm
          wrappedComponentRef={formRef => this.editTemplateFormRef = formRef}
          visible={this.state.openEditTemplate}
          onCancel={() => this.setState({openEditTemplate: false})}
          onOk={this.handleEditTemplateOk}
          currentRowData={this.state.currentRowData}
        />
      </div>
    );
  }
}

export default ModuleList;
