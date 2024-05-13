import React, { Component } from "react";
import { Card, Button, Table, message, Divider, Input, Tooltip, Icon, Modal, Radio, Popconfirm, Pagination } from "antd";
import { getUsers, deleteUser, editUser, addUser, resetPassword, changeState } from "@/api/user";
import { getDepartmentList } from "@/api/department";
import EditUserForm from "./forms/edit-user-form"
import AddUserForm from "./forms/add-user-form"
import moment from 'moment'
import './style/userManagement.less'
const { Column } = Table;
const inputLongStyle = {
  padding: '1px 10px',
  width: '250px'
}
class UserManagement extends Component {
  state = {
    users: [],
    editUserModalVisible: false,
    editUserModalLoading: false,
    currentRowData: {},
    addUserModalVisible: false,
    addUserModalLoading: false,
    searchName: '',
    departmentList: [],
    resetPasswordVisible: false,
    changeStatusVisible: false,
    currentId: '',
    currentStatus: null,
    total: 0,
    currentPage: 0,
    pageSize: 10
  };
  getUsers = async () => {
    getUsers({page: this.state.currentPage, size: this.state.pageSize}, this.state.searchName).then(res => {
      if (res.status === 200) {
        let temp = []
        res.data.data.list.forEach(item => {
          const uid = `U${item.id}`
          const ele = {
            uid: uid,
            ...item
          }
          temp.push(ele)
        })
        this.setState({
          users: temp,
          total: res.data.data.totalElements
        })
      } else {
        message.error(res.statusText)
      }
    })
  }
  getDepartmentList = async () => {
    const result = await getDepartmentList()
    if (result.data.status === 'OK') {
      this.setState({
        departmentList: result.data.data
      })
    }
  }
  handleEditUser = (row) => {
    this.setState({
      currentRowData: Object.assign({}, row),
      currentStatus: row.state,
      editUserModalVisible: true,
    });
  };

  handleDeleteUser = (row) => {
    const { id } = row
    deleteUser({ids: [id]}).then(res => {
      console.log(res)
      message.success("删除成功")
      this.getUsers();
    })
  }
  
  handleEditUserOk = _ => {
    const { form } = this.editUserFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const body = {
        id: values.id,
        name: values.name, // 必填
        mobile: values.mobile,  //必填
        // department: values.department ? parseInt(values.department[values.department.length - 1]) : 0,
        // allDepartments: values.department,
        // position: values.position.key || '',
        email: values.email || '',
        state: this.state.currentStatus
        // tags: values.tags || ''
      }
      this.setState({ editModalLoading: true, });
      editUser(body).then((response) => {
        form.resetFields();
        this.setState({ editUserModalVisible: false, editUserModalLoading: false });
        message.success("编辑成功!")
        this.getUsers()
      }).catch(e => {
        message.error("编辑失败,请重试!")
      })
      
    });
  };

  handleCancel = _ => {
    this.setState({
      editUserModalVisible: false,
      addUserModalVisible: false,
    });
  };

  handleAddUser = (row) => {
    this.setState({
      addUserModalVisible: true,
    });
  };

  handleAddUserOk = _ => {
    const { form } = this.addUserFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const body = {
        id: values.id,
        name: values.name, // 必填
        mobile: values.mobile,  //必填
        // department:  values.department ? parseInt(values.department[values.department.length - 1]) : 0,
        // position: values.position.key || '',
        email: values.email || '',
        // tags: values.tags || ''
      }
      this.setState({ addUserModalLoading: true, });
      addUser(body).then((response) => {
        if (response.status === 200) {
          form.resetFields();
          this.setState({ addUserModalVisible: false, addUserModalLoading: false });
          message.success("添加成功!")
          this.getUsers()
        } else {
          message.success(response.statusText)
        }
      }).catch(e => {
        message.error("添加失败,请重试!")
      })
    });
  };
  openReset = (row) => {
    this.setState({
      currentId: row.id,
      resetPasswordVisible: true,
    });
  }
  openChangeStatus = (row) => {
    this.setState({
      currentId: row.id,
      currentStatus: row.state,
      changeStatusVisible: true,
    });
  }
  resetPassword = () => {
    resetPassword({
      id: this.state.currentId
    }).then(res => {
      if (res.data.status === 'OK') {
        message.success("重置密码成功!")
        this.setState({
          resetPasswordVisible: false
        })
        this.getUsers()
      } else {
        message.error("重置密码失败!")
      }
    })
  }
  updateState = (e) => {
    this.setState({
      currentStatus: e.target.value
    })
  }
  changeState = () => {
    changeState({
      id: this.state.currentId,
      state: this.state.currentStatus
    }).then(res => {
      if (res.data.status === 'OK') {
        message.success("修改成功!")
        this.setState({
          changeStatusVisible: false
        })
        this.getUsers()
      } else {
        message.error("修改失败!")
      }
    })
  }
  cancelChangeStatus = () => {
    this.setState({
      changeStatusVisible: false
    })
  }
  cancelReset = () => {
    this.setState({
      resetPasswordVisible: false
    })
  }
  changePageSize = (current, pageSize) => {
    this.setState({
        pageSize: pageSize
      }, () => {
        this.getUsers()
      }
    )
  }
  changePage = (current, pageSize) => {
    this.setState({
      currentPage: current - 1
    }, () => {
      this.getUsers()
    }
  )
  }
  componentDidMount() {
    this.getUsers()
    // this.getDepartmentList()
  }
  render() {
    const { users, searchName } = this.state
    const title = (
      <div className="title">
        <Input 
          style={inputLongStyle}
          value={searchName} 
          onChange={(e) => { this.setState({searchName: e.target.value}) }}
          prefix={<Icon style={{marginLeft: '4px'}} type="search" />}
          allowClear
          onPressEnter={
          (e) => this.getUsers()
        } />
        &nbsp;
        <Button type='primary' onClick={this.handleAddUser}>
          <Icon type="plus"></Icon>
          添加用户
        </Button>
      </div>
    )
    return (
      <div className="app-container">
        <Card title={title}>
          <Table 
            bordered 
            rowKey="uid" 
            dataSource={users} 
            pagination={false}>
            <Column title="用户ID" dataIndex="uid" key="uid" align="center"/>
            <Column title="用户名称" width={105} dataIndex="name" key="name" align="center"/>
            <Column title="手机号" width={125} dataIndex="mobile" key="mobile" align="center"/>
            {/* <Column title="部门" dataIndex="department" key="department" align="center" /> */}
            <Column title="状态" key="state" align="center"render={(_, {state}) => (
              <span>
                {state === 'NORMAL' ? '正常' : '禁用'}
              </span>
            )}/>
            {/* <Column title="人员标签" key="tags" align="center" render={(_, {tags}) => (
              <span>
                {
                  tags.map((item, index) => {
                    return <span className='type-container text-center cursor-pointer' key={index}>
                      {item};
                    </span>
                  })
                }
              </span>
            )}/> */}
            <Column title="修改时间" key="updateTime" width={165} align="center" render={(text, row) => (
              <span>
                {moment(row.updateTime ? row.updateTime : row.createTime).format('YYYY-MM-DD HH:mm:ss')}
              </span>
            )}/>
            <Column title="操作" key="action" width={215} align="center" render={(text, row) => (
              <span>
                <Tooltip placement="top" title={'编辑'}>
                  <Button type="primary" shape="circle" icon="edit" title="编辑" onClick={this.handleEditUser.bind(null,row)}/>
                </Tooltip>
                <Divider type="vertical" />
                <Tooltip placement="top" title={'修改状态'}>
                  <Button type="primary" shape="circle" icon="reload" title="修改状态" onClick={this.openChangeStatus.bind(null,row)}/>
                </Tooltip>
                <Divider type="vertical" />
                <Tooltip placement="top" title={'重置密码'}>
                  <Button type="primary" shape="circle" icon="eye" title="重置密码" onClick={this.openReset.bind(null, row)}/>
                </Tooltip>
                <Divider type="vertical" />
                <Tooltip placement="top" title={'删除'}>
                  <Popconfirm
                    placement="topLeft"
                    title={'确定要删除该用户吗？'}
                    onConfirm={this.handleDeleteUser.bind(null,row)}
                    okText="是"
                    cancelText="否"
                  >
                    <Button type="primary" shape="circle" icon="delete" title="删除"/>
                  </Popconfirm>
                </Tooltip>
              </span>
            )}/>
          </Table>
          <br />
          <Pagination
            total={this.state.total}
            pageSizeOptions={["10", "20", "40"]}
            showTotal={(total) => `共${total}条数据`}
            onChange={this.changePage}
            current={this.state.currentPage + 1}
            onShowSizeChange={this.changePageSize}
            showSizeChanger
            showQuickJumper
            hideOnSinglePage={true}
          />
        </Card>
        <EditUserForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={formRef => this.editUserFormRef = formRef}
          visible={this.state.editUserModalVisible}
          departmentList={this.state.departmentList}
          confirmLoading={this.state.editUserModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleEditUserOk}
        />  
        <AddUserForm
          wrappedComponentRef={formRef => this.addUserFormRef = formRef}
          visible={this.state.addUserModalVisible}
          departmentList={this.state.departmentList}
          confirmLoading={this.state.addUserModalLoading}
          onCancel={this.handleCancel}
          onOk={this.handleAddUserOk}
        />  
        <Modal title="重置密码" visible={this.state.resetPasswordVisible} onOk={this.resetPassword} onCancel={this.cancelReset}>
          <div>是否将该用户的密码重置为123456？</div>
        </Modal>
        <Modal title="修改状态" visible={this.state.changeStatusVisible} onOk={this.changeState} onCancel={this.cancelChangeStatus}>
          <Radio.Group onChange={this.updateState} value={this.state.currentStatus}>
            <Radio value={1}>在职</Radio>
            <Radio value={2}>离职</Radio>
          </Radio.Group>
        </Modal>
      </div>
    );
  }
}

export default UserManagement;
