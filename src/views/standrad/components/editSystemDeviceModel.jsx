import React, { Component } from "react";
import { Tree, Input, Table, Card, Button, message, Popconfirm, Tooltip, Divider } from "antd";
import { getProbList, addLayer, editLayer, deleteLayer, addProbs, editProbs, deleteProbs } from "@/api/standrad";
import AddLayerForm from "../forms/add-layer-form";
import EditLayerForm from "../forms/edit-layer-form";
import AddProbsForm from "../forms/add-probs-form";
import EditProbsForm from "../forms/edit-probs-form";
import '../style/standrad.less'
const { TreeNode, DirectoryTree } = Tree;
const { Column } = Table;
const inputLongStyle = {
  padding: '1px 10px',
  width: '280px'
}
class EditSystemDeviceModel extends Component {
  state = {
    selectedNode: [],
    selectNodes: [],
    systemName: '',
    problemList: [],
    selectedProbs: [],
    nodePath: '',
    defaultRowSelect: [],
    expandedKeys: [],
    addLayer: false,
    editLayer: false,
    currentParentId: null,
    currentId: null,
    openAddProb: false,
    openEditProbs: false
  }
  handleExpand = (expandedKeys) => {
    const parentNode = this.findParentNodeByKey(this.props.treeList, parseFloat(expandedKeys[expandedKeys.length - 1]));
    this.setState({
      expandedKeys: expandedKeys,
      currentParentId: parentNode ? expandedKeys[expandedKeys.length - 1].id : 0
    }, () => {
      const body = {
        type: "DEVICE", // 系统 SYSTEM  设备DEVICE（必填）
        keyword: "", // 非必填
        hierarchySysIds: this.state.expandedKeys, // 层级ID数组, 非必填
        currPage: 1,
        pageSize: 999999999
      }
      this.getProbListFun(body)
    })
  }
  getProbListFun = (body) => {
    getProbList(body).then(res => {
      if (res.data.status === 'OK') {
        let temp = res.data.data.list.map((item) => item.id)
        this.setState({
          problemList: res.data.data.list,
          defaultRowSelect: temp,
          selectedProbs: res.data.data.list
        })
      }
    })
  }
  addLayerFun = () => {
    const { form } = this.addLayerForm.props
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const body = {
        parentId: this.state.currentParentId,
        type: 'DEVICE',
        name: values.name,
        score: values.score,
        weight: values.weight
      }
      addLayer(body).then(res => {
        if (res.data.status === 'OK') {
          message.success('添加成功')
          this.setState({
            addLayer: false,
            currentParentId: null
          })
          this.props.emitAddLayer('success')
        } else {
          message.error(res.data.errorMsg)
        }
      })
    })
  }
  deleteLayerFun = (row) => {
    deleteLayer({id: this.state.currentId}).then(async (res) => {
      if (res.data.status === 'OK') {
        message.success('删除成功')
        this.props.emitAddLayer('success')
      } else {
        message.error(res.data.errorMsg)
      }
    })
  }
  editLayerFun = () => {
    const { form } = this.editLayerForm.props
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const body = {
        id: values.id,
        name: values.name,
        score: values.score,
        weight: values.weight
      }
      editLayer(body).then(res => {
        if (res.data.status === 'OK') {
          message.success('编辑成功')
          this.setState({
            addLayer: false,
          })
        } else {
          message.error(res.data.errorMsg)
        }
      })
    })
  }
  openAddLayer = () => {
    this.setState({
      addLayer: true
    })
  }
  editProb = (row) => {
    this.setState({
      currentRow: row,
      openEditProbs: true
    })
  }
  deleteProb = (row) => {
    const { id } = row
    deleteProbs({ids: [id]}).then(res => {
      if (res.data.status === 'OK') {
        message.success('删除成功')
        const body = {
          type: "DEVICE", // 系统 SYSTEM  设备DEVICE（必填）
          keyword: "", // 非必填
          hierarchySysIds: this.state.expandedKeys, // 层级ID数组, 非必填
          currPage: 1,
          pageSize: 999999999
        }
        this.getProbListFun(body)
      } else {
        message.error(res.data.errorMsg)
      }
    })
  }
  deleteProbMultiple = () => {
    deleteProbs({ids: this.state.selectedProbs}).then(res => {
      if (res.data.status === 'OK') {
        message.success('删除成功')
        const body = {
          type: "DEVICE", // 系统 SYSTEM  设备DEVICE（必填）
          keyword: "", // 非必填
          hierarchySysIds: this.state.expandedKeys, // 层级ID数组, 非必填
          currPage: 1,
          pageSize: 999999999
        }
        this.getProbListFun(body)
      } else {
        message.error(res.data.errorMsg)
      }
    })
  }
  openAdd = () => {
    this.setState({
      openAddProb: true
    })
  }
  handleAddProb = () => {
    const { form } = this.addProbForm.props
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      let temp = {
        ...values
      }
      temp.hierarchySysId = this.state.expandedKeys[this.state.expandedKeys.length - 1]
      temp.type = 'DEVICE'
      addProbs(temp).then(res => {
        if (res.data.status === 'OK')  {
          message.success('添加成功')
          const body = {
            type: "DEVICE", // 系统 SYSTEM  设备DEVICE（必填）
            keyword: "", // 非必填
            hierarchySysIds: this.state.expandedKeys, // 层级ID数组, 非必填
            currPage: 1,
            pageSize: 999999999
          }
          this.getProbListFun(body)
        } else {
          message.error(res.data.errorMsg)
        }
      })
    })
    this.setState({
      openAddProb: false
    })
  }
  handleEditProb = () => {
    const { form } = this.editProbForm.props
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      let temp = {
        ...values
      }
      temp.hierarchySysId = this.state.expandedKeys[this.state.expandedKeys.length - 1]
      temp.type = 'DEVICE'
    editProbs(temp).then(res => {
        if (res.data.status === 'OK')  {
          message.success('添加成功')
          const body = {
            type: "DEVICE", // 系统 SYSTEM  设备DEVICE（必填）
            keyword: "", // 非必填
            hierarchySysIds: this.state.expandedKeys, // 层级ID数组, 非必填
            currPage: 1,
            pageSize: 999999999
          }
          this.getProbListFun(body)
        } else {
          message.error(res.data.errorMsg)
        }
      })
    })
    this.setState({
      openEditProbs: false
    })
  }
  findParentNodeByKey = (nodes, key) => {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (node.children) {
        if (node.children.some((child) => child.key === key)) {
          return node;
        } else {
          const foundParent = this.findParentNodeByKey(node.children, key);
          if (foundParent) {
            return foundParent;
          }
        }
      }
    }
    return null;
  }  
  handleCancel = () => {
    this.props.onCancel('back')
  }
  renderTreeNodes = data =>
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.key} {...item} />;
    })
  render() {
    const { treeList } = this.props;
    return (
      <div>
        <Card>
          <div className="grid tree-container mb-10 grid-1-4">
            <div className="left">
            <div className="flex">
              <Button onClick={this.openAddLayer}>添加类别</Button>&nbsp;&nbsp;
              <Button icon="edit">修改</Button>&nbsp;&nbsp;
              <Popconfirm
                placement="topLeft"
                title={'确定要删除吗？'}
                onConfirm={this.deleteLayerFun}
                okText="是"
                cancelText="否"
              >
                <Button disabled={!this.state.currentId} icon="delete" title="删除">删除</Button>
              </Popconfirm>
            </div>
            <DirectoryTree
              onExpand={this.handleExpand}
              onSelect={(e) => this.setState({currentId: parseFloat(e[0])})}
            >
              {this.renderTreeNodes(treeList)}
            </DirectoryTree>
          </div>
            <div className="right" style={{overflow: 'hidden'}}>
              <div className="tool-bar flex flex-center mb-10">
                <div>
                <Button onClick={this.openAdd}>添加问题</Button>&nbsp;&nbsp;
                <Popconfirm
                  placement="topLeft"
                  title={'确定要删除吗？'}
                  onConfirm={this.deleteProbMultiple}
                  disabled={this.state.selectedProbs.length === 0}
                  okText="是"
                  cancelText="否"
                >
                  <Button disabled={this.state.selectedProbs.length === 0} title="删除">批量删除</Button>
                </Popconfirm>
                </div>
              </div>
              <Table 
                bordered 
                rowKey="id" 
                dataSource={this.state.problemList} 
                rowSelection={{
                  type: 'checkbox',
                  onChange: (selectedRowKeys, selectedRows) => {
                    this.setState({
                      selectedProbs: selectedRows
                    })
                  },
                }}
                scroll={{x: 'max-content' }}
                pagination={true}>
                <Column title="描述" fixed="left" width={100} key="description" align="center" render={(text, row) => (
                   <div>{row.description}</div>
                )}/>
                <Column title="规范与条款" ellipsis={true} key="provisions" align="center" render={(text, row) => (
                  <Tooltip title={row.provisions}>
                    <div style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '165px' }}>{row.provisions.substring(0, 16)}...</div>
                  </Tooltip>
                )}/>
                <Column title="建议措施" ellipsis={true} key="measure" align="center" render={(text, row) => (
                  <div style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '105px' }}>{row.measure}</div>
                )}/>
                <Column title="问题数量" key="problemNumSetList" align="center" render={(text, row) => (
                  <span onClick={this.showProb.bind(null, row)} className="link">{row.problemNumSetList.length}条</span>
                )}/>
                <Column title="问题规模" key="problemScaleSetList" align="center" render={(text, row) => (
                  <span onClick={this.showScale.bind(null, row)} className="link">{row.problemScaleSetList.length}条</span>
                )}/>
                <Column title="数值" dataIndex="numValue" key="numValue" align="center"/>
                <Column title="事故类型" dataIndex="incidentTypeName" key="incidentTypeName" align="center"/>
                <Column title="点评范式" dataIndex="reviewParadigm" key="reviewParadigm" align="center"/>
                <Column title="责任人" dataIndex="responsiblePerson" key="responsiblePerson" align="center"/>
                <Column title="责任部门" dataIndex="responsibleDepartment" key="responsibleDepartment" align="center"/>
                <Column title="事故案例" dataIndex="incidentCase" key="incidentCase" align="center"/>
                <Column title="操作" key="action" width={205} fixed="right" align="center" render={(text, row) => (
                  <span>
                    <Button title="编辑" onClick={this.editProb.bind(null, row)}>编辑</Button>
                    <Divider type="vertical" />
                    <Popconfirm
                        placement="topLeft"
                        title={'确定要删除该问题吗？'}
                        okText="是"
                        cancelText="否"
                        onConfirm={this.deleteProb.bind(null, row)}
                    >
                        <Button title="删除">删除</Button>
                    </Popconfirm>
                    </span>
                )}/>
              </Table>
            </div>
          </div>
          <div className="bottom-btn-group text-center">
              <Button onClick={() => {
                this.props.goBack('')
              }} title="取消">返回</Button>
          </div>
        </Card>
        <AddLayerForm 
          visible={this.state.addLayer}
          currentParentId={this.state.currentParentId}
          wrappedComponentRef={formRef => this.addLayerForm = formRef}
          onOk={this.addLayerFun}
          onCancel={() => {
            this.setState({
              addLayer: false,
              currentName: ''
            })
          }}/>
        <EditLayerForm 
          visible={this.state.editLayer}
          currentRow={this.state.currentRow}
          wrappedComponentRef={formRef => this.editLayerForm = formRef}
          onOk={this.editLayerFun}
          onCancel={() => {
            this.setState({
              editLayer: false,
              currentRow: null
            })
          }}/>
        <AddProbsForm
          visible={this.state.openAddProb}
          wrappedComponentRef={formRef => this.addProbForm = formRef}
          onOk={this.handleAddProb}
          onCancel={() => {
            this.setState({
              openAddProb: false
            })
          }} />
        <EditProbsForm
          visible={this.state.openEditProbs}
          wrappedComponentRef={formRef => this.editProbForm = formRef}
          currentRow={this.state.currentRow}
          onOk={this.handleEditProb}
          onCancel={() => {
            this.setState({
              openEditProbs: false
            })
          }} />
      </div>
    );
  }
}

export default EditSystemDeviceModel;
