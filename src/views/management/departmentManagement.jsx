import React, { Component } from "react";
import { Button, Tree, Icon, Card, Modal, Input, message, Divider, Popconfirm } from "antd";
import { getDepartmentList, addDept, editDept, deleteDept } from "@/api/department";
import OrgTree from 'react-org-tree';
import './style/departmentManegement.less'
const inputLongStyle = {
  padding: '1px 10px',
  width: '250px'
}
let temp = {}
class DepartmentManagement extends Component {
  state = {
    departmentList: [],
    orglist: {},
    currentDeptName: '',
    addDeptVisible: false,
    editDeptVisible: false,
    currentId: '',
    currentParentId: '',
    collapsable: false,
    expandAll: false
  };
  getDepartmentList = async () => {
    const result = await getDepartmentList()
    if (result.data.status === 'OK') {
      this.setState({
        departmentList: result.data.data ? this.formatList(result.data.data) : [],
        orglist: {
          id: 99999,
          label: '组织架构',
          children: result.data.data,
        }
      })
    }
  }
  formatList = (list) => { // 格式化数据
    let temp = []
    list.map(item => {
      let obj = {
        ...item
      }
      obj.title = this.titleRender(item.label, item.id, item.parentId, item.label);
      obj.key = item.id;
      obj.children = item.children ? this.formatList(item.children) : null;
      temp.push(obj)
    })
    return temp
  } 
  addDept = () => {
    addDept({
      name: this.state.currentDeptName,
      parentId: this.state.currentParentId
    }).then(res => {
      if (res.data.status === 'OK') {
        message.success('添加成功')
        this.setState({
          addDeptVisible: false,
          currentDeptName: ''
        })
        this.getDepartmentList()
      } else {
        message.error(res.data.errorMsg)
      }
    })
  }
  editDept = () => {
    editDept({
      name: this.state.currentDeptName,
      parentId: this.state.currentParentId,
      id: this.state.currentId
    }).then(res => {
      if (res.data.status === 'OK') {
        message.success('修改成功')
        this.setState({
          editDeptVisible: false,
          currentDeptName: '',
          currentId: '',
          currentParentId: ''
        })
        this.getDepartmentList()
      } else {
        message.error('修改失败')
      }
    })
  }
  deleteDept = (id) => {
    deleteDept({
      id: id
    }).then(res => {
      if (res.data.status === 'OK') {
        message.success('删除成功')
        this.setState({
          editDeptVisible: false,
          currentDeptName: '',
          currentId: '',
          currentParentId: ''
        })
        this.getDepartmentList()
      } else {
        message.error(res.data.errorMsg)
      }
    })
  }
  cancelDept = () => {
    this.setState({
      addDeptVisible: false,
      editDeptVisible: false,
      currentDeptName: '',
      currentId: '',
      currentParentId: ''
    })
  }
  titleRender = (title, id, parentId, label) => {
    return <div className="tree-box">
        <div className='title'>{title}</div>
        <div>
          <span className='tree-btn' onClick={() => { 
            this.setState({
              addDeptVisible: true,
              currentParentId: id
            })
          }}>新增</span>
          <span className='tree-btn' onClick={() => { 
            this.setState({
              editDeptVisible: true,
              currentParentId: parentId,
              currentId: id,
              currentDeptName: label
            })
          }}>修改</span>
          <Popconfirm
            placement="top"
            title={'确定要删除该部门吗？'}
            onConfirm={this.deleteDept.bind(null, id)}
            okText="是"
            cancelText="否"
          >
            <span className='tree-btn'>删除</span>
          </Popconfirm>
        </div>
    </div>
}
  componentDidMount() {
    this.getDepartmentList()
  }
  render() {
    const title = (
      <div className="title">
        <Button type='primary' onClick={
          () => {
            this.setState({
              addDeptVisible: true,
              currentParentId: 0
            })
          }
        }>
          <Icon type="plus"></Icon>
          添加
        </Button>
      </div>
    )
    return (
      <div className="app-container">
        <Card title={title}>
          <div className="grid grid-1-1">
            <Tree
              showLine
              switcherIcon={<Icon type="down" />}
              treeData={this.state.departmentList}
              titleRender={this.titleRender}
            />
            <Divider style={{height: '100%'}} type="vertical" />
            <OrgTree
                data={this.state.orglist}
                horizontal={true}
                collapsable={this.state.collapsable}
                expandAll={true}
            ></OrgTree>
          </div>
        </Card>
        <Modal title="新增部门" visible={this.state.addDeptVisible} onOk={this.addDept} onCancel={this.cancelDept}>
          <Input 
            style={inputLongStyle}
            value={this.state.currentDeptName} 
            onChange={(e) => { this.setState({currentDeptName: e.target.value}) }}
            allowClear/>
        </Modal>
        <Modal title="修改部门" visible={this.state.editDeptVisible} onOk={this.editDept} onCancel={this.cancelDept}>
          <Input 
            style={inputLongStyle}
            value={this.state.currentDeptName} 
            onChange={(e) => { this.setState({currentDeptName: e.target.value}) }}
            allowClear/>
        </Modal>
      </div>
    );
  }
}

export default DepartmentManagement;
