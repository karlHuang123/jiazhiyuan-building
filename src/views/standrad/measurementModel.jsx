import React, { Component } from "react";
import { Card, Button, Table, message, Divider, Input, Tooltip, Icon, Modal, Popconfirm } from "antd";
import { getModelList, addModel, editModel, deleteModel } from "@/api/standrad";
import AddMeasurementForm from "./forms/add-measurement-form";
import EditMeasurementForm from "./forms/edit-measurement-form";
import '../business/style/clientInfo.less'
const { Column } = Table;
const inputLongStyle = {
  padding: '1px 10px',
  width: '280px'
}
class MeasurementModel extends Component {
  state = {
    measurementModels: [],
    keyword: '',
    modelBody: {},
    getMeasurementModelListBody: {
      currPage: 1,
      pageSize: 20000,
      type: 'MEASUREMENT',
      keyword: ''
    },
    openAddMeasurement: false,
    openEditMeasurement: false,
    currentData: null
  };
  getMeasurementModelListFun = async () => {
    const result = await getModelList(this.state.getMeasurementModelListBody)
    if (result.data.status === 'OK') {
      this.setState({
        measurementModels: result.data.data.list
      })
    }
  }
  openEdit = (row) => {
    this.setState({
      currentData: row,
      openEditMeasurement: true
    })
  }
  handleAddMeasurementOk = () => {
    const { form } = this.addMeasurementFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const body = {
        type: 'MEASUREMENT',
        name: values.name,  //必填
        description: values.description
      }
      addModel(body).then((response) => {
        if (response.data.status === 'OK') {
          form.resetFields();
          this.setState({ 
            openAddMeasurement: false
           });
          message.success("添加成功!")
          this.getMeasurementModelListFun()
        } else {
          this.setState({ 
            openAddMeasurement: false
           });
          message.success("添加失败!")
        }
      })
    });
  }

  handleEditMeasurementOk = () => {
    const { form } = this.editMeasurementFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const body = {
        type: 'MEASUREMENT',
        name: values.name,  //必填
        description: values.description
      }
      editModel(body).then((response) => {
        if (response.data.status === 'OK') {
          form.resetFields();
          this.setState({ 
            openAddMeasurement: false
           });
          message.success("添加成功!")
          this.getMeasurementModelListFun()
        } else {
          this.setState({ 
            openAddMeasurement: false
           });
          message.success("添加失败!")
        }
      })
    });
  }
  handleDeleteModel = (row) => {
    const { id } = row
    deleteModel({id: id}).then(res => {
      if (res.data.status === 'OK'){
        message.success('删除成功')
        this.getMeasurementModelListFun()
      } else {
        message.error(res.data.errorMsg)
      }
    })
  }
  componentDidMount() {
    this.getMeasurementModelListFun()
  }
  render() {
    const { measurementModels, keyword } = this.state
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
            <Button type='primary' onClick={() => this.setState({openAddMeasurement: true})}>
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
            dataSource={measurementModels} 
            pagination={true}
            scroll={{x: 'max-content'}}>
            <Column title="编号" dataIndex="itemCode" key="code" align="center"/>
            <Column title="名称" dataIndex="name" key="name" align="center"/>
            <Column title="版本" dataIndex="version" key="version" align="center"/>
            <Column title="描述" dataIndex="description" key="description" align="center"/>
            <Column title="操作" key="action" align="center" render={(text, row) => (
              <span>
                <Button title="编辑模型" onClick={this.openEdit.bind(null, row)}>编辑模型</Button>
                <Divider type="vertical" />
                <Button title="拷贝" onClick={this.handleDeleteModel.bind(null, row)}>删除</Button>
                </span>
            )}/>
          </Table>
        </Card>
        <AddMeasurementForm
          wrappedComponentRef={formRef => this.addMeasurementFormRef = formRef}
          visible={this.state.openAddMeasurement}
          onCancel={() => this.setState({openAddMeasurement: false})}
          onOk={this.handleAddMeasurementOk}
        />
        <EditMeasurementForm
          wrappedComponentRef={formRef => this.editMeasurementFormRef = formRef}
          visible={this.state.openEditMeasurement}
          currentData={this.state.currentData}
          onCancel={() => this.setState({openEditMeasurement: false})}
          onOk={this.handleEditMeasurementOk}
        />
      </div>
    );
  }
}

export default MeasurementModel;
