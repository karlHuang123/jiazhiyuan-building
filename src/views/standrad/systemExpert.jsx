import React, { Component } from "react";
import { Card, Button, Table, message, Divider, Select, Input, Tooltip, Icon, Modal, Popconfirm } from "antd";
import { getExpertList, getModelList, addExpert, editExpert, deleteExpert, editMatrix } from "@/api/standrad";
import AddSystemExpertForm from "./forms/add-system-expert-form";
import EditSystemExpertForm from "./forms/edit-system-expert-form";
import MembershipList from "./components/membership-list";
import MatrixForm from "./forms/matrix-form";
import '../business/style/clientInfo.less'
const { Column } = Table;
const { Option } = Select;
const inputLongStyle = {
  padding: '1px 10px',
  width: '280px'
}
class SystemExpert extends Component {
  state = {
    experts: [],
    keyword: '',
    selectExperts: [],
    selectedDevices: [],
    currentRow: null,
    getExpertListBody: {
      currPage: 1,
      pageSize: 20000,
      type: 'SYSTEM',
      keyword: '',
      modelSysId: undefined
    },
    getModelListBody: {
      currPage: 1,
      pageSize: 20000,
      type: 'SYSTEM',
      keyword: ''
    },
    systemList: [],
    openAddExpert: false,
    openEditExpert: false,
    openMembershipList: false,
    openMatrix: false
  };
  getExpertListFun = async () => {
    const result = await getExpertList(this.state.getExpertListBody)
    if (result.data.status === 'OK') {
      this.setState({
        experts: result.data.data.list
      })
    }
  }
  reset = () => {
    this.setState({
      getExpertListBody: {
        currPage: 1,
        pageSize: 20000,
        type: 'SYSTEM',
        keyword: '',
        modelSysId: undefined
      },
      keyword: ''
    }, () => {
      this.getExpertListFun()
    })
  }
  getModelListFun = async () => { // 
    const result = await getModelList(this.state.getModelListBody)
    if (result.data.status === 'OK') {
      let temp = []
      result.data.data.list.forEach(item => {
        const ele = {
          label: item.name,
          value: item.id
        }
        temp.push(ele)
      })
      this.setState({
        systemList: temp
      })
    }
  }
  handleAddSystemExpertOk = () => {
    const { form } = this.addSystemExpertFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const body = {
        sysType: "SYSTEM", // 必填
        name: values.name,  //必填
        contact: values.contact ? values.contact : '',
        modelSysId: values.modelSysId.key,
        matrixWeight: values.matrixWeight,
        membershipWeight: values.membershipWeight,
        expertInquiryWeight: values.expertInquiryWeight,
        types: values.types
      }
      addExpert(body).then((response) => {
        if (response.data.status === 'OK') {
          form.resetFields();
          this.setState({ 
            openAddExpert: false
           });
          message.success("添加成功!")
          this.getExpertListFun()
        } else {
          this.setState({ 
            openAddExpert: false
           });
           message.error(response.data.errorMsg)
        }
      }).catch(e => {
        message.error("添加失败,请重试!")
      })
    });
  }
  openEdit = (row) => {
    this.setState({
      currentRow: Object.assign({}, row),
      openEditExpert: true,
    });
  }
  deleteExpert = (row) => {
    const { id } = row
    deleteExpert({ids: [id]}).then(res => {
      if (res.data.status === 'OK') {
        message.success("删除成功")
        this.getExpertListFun();
      } else {
        message.success("删除失败")
      }
    })
  }
  handleEditSystemExpertOk = () => {
    const { form } = this.editSystemExpertFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const body = {
        sysType: "SYSTEM", // 必填
        id: values.id,
        name: values.name,  //必填
        contact: values.contact ? values.contact : '',
        modelSysId: values.modelSysId.key,
        matrixWeight: values.matrixWeight,
        membershipWeight: values.membershipWeight,
        expertInquiryWeight: values.expertInquiryWeight,
        types: values.types
      }
      editExpert(body).then((response) => {
        if (response.data.status === 'OK') {
          form.resetFields();
          this.setState({ 
            openEditExpert: false
           });
          message.success("编辑成功!")
          this.getExpertListFun()
        } else {
          this.setState({ 
            openEditExpert: false
           });
          message.success("编辑失败!")
        }
      }).catch(e => {
        message.error("编辑失败,请重试!")
      })
    });
  }
  multipDelete = () => {
    let temp = []
    this.state.selectExperts.forEach(item => {
      const ele = item.id
      temp.push(ele)
    })
    deleteExpert({
      ids: temp
    }).then(res => {
      if (res.data.status === 'OK') {
        message.success("删除成功")
        this.getExpertListFun();
      } else {
        message.success("删除失败")
      }
    })
  }
  openMatrix = (row) => {
    this.setState({
      currentRow: row,
      openMatrix: true
    })
  }
  handleMatrix = (value) => {
    console.log(value)
    editMatrix({
      expertScoreId: this.state.currentRow.id,
      indexCols: value.indexCols,
      scoreMatrix: value.martix
    }).then(res => {
      if(res.status === 'OK') {
        message.success('编辑成功')
      } else {
        message.error('编辑失败，请稍后重试')
      }
    })
    this.setState({
      openMatrix: false
    })
  }
  componentDidMount() {
    this.getExpertListFun()
    this.getModelListFun()
  }
  render() {
    const { experts, keyword } = this.state
    const title = (
      <div className="title flex">
        <div>
          <Input 
            style={inputLongStyle}
            value={keyword} 
            placeholder="专家名称"
            onChange={(e) => { this.setState({keyword: e.target.value}) }}
            prefix={<Icon style={{marginLeft: '4px'}} type="search" />}
            allowClear
            onPressEnter={
            (e) => {
              let temp = {...this.state.getExpertListBody}
              temp.keyword = this.state.keyword
              this.setState({
                getExpertListBody: temp
              }, () => {
                this.getExpertListFun()
              })
            }
          } />
          &nbsp;
          <Select
            style={{
              width: 350,
            }}
            placeholder="体系"
            allowClear
            onChange={(value) => {
              let temp = {...this.state.getExpertListBody}
              temp.modelSysId = value
              this.setState({
                getExpertListBody: temp
              }, () => {
                this.getExpertListFun()
              })
            }}
            value={this.state.getExpertListBody.modelSysId}
          >
            {this.state.systemList.map((item, index) => (
              <Option value={item.value} key={index}>{item.label}</Option>
            ))}
          </Select>
        </div>
        <div className="right">
            <Button type='primary' onClick={() => this.setState({openAddExpert: true})}>
                <div className="bolder">
                <Icon type="plus"></Icon>&nbsp;
                添加
                </div>
            </Button>
            &nbsp;
            &nbsp;
            <Button type='primary' onClick={this.reset}>
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
        <Card title={title}>
          <Table 
            bordered 
            rowKey="id" 
            rowSelection={{
              type: 'checkbox',
              onChange: (selectedRowKeys, selectedRows) => {
                this.setState({
                  selectExperts: selectedRows
                })
              },
            }}
            dataSource={experts} 
            pagination={true}
            scroll={{x: 'max-content'}}>
            <Column title="专家姓名" dataIndex="name" key="name" align="center"/>
            <Column title="联系方式" dataIndex="contact" key="contact" align="center"/>
            <Column title="模型体系" dataIndex="modelSysName" key="modelSysName" align="center"/>
            <Column title="矩阵权重" dataIndex="matrixWeight" key="matrixWeight" align="center" />
            <Column title="隶属度权重" dataIndex="membershipWeight" key="membershipWeight" align="center" />
            <Column title="专家调查权重值" dataIndex="expertInquiryWeight" key="expertInquiryWeight" align="center" />
            <Column title="类型" key="types" align="center" render={(text, row) => (
              <span>
                {JSON.stringify(row.types)}
              </span>
            )} />
            <Column title="操作" key="action" width={415} fixed="right" align="center" render={(text, row) => (
              <span>
                <Button title="编辑" onClick={this.openEdit.bind(null, row)}>编辑</Button>
                <Divider type="vertical" />
                <Popconfirm
                    placement="topLeft"
                    title={'确定要删除该专家吗？'}
                    okText="是"
                    cancelText="否"
                    onConfirm={this.deleteExpert.bind(null, row)}
                >
                    <Button title="删除">删除</Button>
                </Popconfirm>
                <Divider type="vertical" />
                <Button title="判断矩阵" onClick={this.openMatrix.bind(null, row)}>判断矩阵</Button>
                <Divider type="vertical" />
                <Button title="隶属度" onClick={() => {this.setState({openMembershipList: true})}}>隶属度</Button>
                </span>
            )}/>
          </Table>
        </Card>
        <AddSystemExpertForm
          wrappedComponentRef={formRef => this.addSystemExpertFormRef = formRef}
          visible={this.state.openAddExpert}
          onCancel={() => this.setState({openAddExpert: false})}
          onOk={this.handleAddSystemExpertOk}
          systemList={this.state.systemList}
        />
        <EditSystemExpertForm
          wrappedComponentRef={formRef => this.editSystemExpertFormRef = formRef}
          visible={this.state.openEditExpert}
          onCancel={() => this.setState({openEditExpert: false})}
          onOk={this.handleEditSystemExpertOk}
          systemList={this.state.systemList}
          currentRow={this.state.currentRow}
        />
        <MatrixForm
          visible={this.state.openMatrix}
          expertId={this.state.currentRow ? this.state.currentRow.id : null}
          onCancel={() => this.setState({openMatrix: false})}
          outputData={this.handleMatrix}
         />
        <Modal
          title="隶属度列表"
          visible={this.state.openMembershipList}
          onCancel={() => {this.setState({openMembershipList: false})}}
          footer={[
            <div key={'footer'}></div>
          ]}
          width={'80%'}>
          <MembershipList />
        </Modal>
      </div>
    );
  }
}

export default SystemExpert;
