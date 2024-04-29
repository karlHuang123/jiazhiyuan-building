import React, { Component } from "react";
import { Tree, Divider, Table, Card, Button, Modal, Popconfirm, Tooltip, Input, Icon, message } from "antd";
import { getProbList, getTreeList, addProbs, editProbs, deleteProbs } from "@/api/standrad";
import './style/standrad.less'
import AddProbsForm from "./forms/add-probs-form";
import EditProbsForm from "./forms/edit-probs-form";
const { TreeNode, DirectoryTree } = Tree;
const { Column } = Table;
const inputLongStyle = {
  padding: '1px 10px',
  width: '280px'
}
class SystemProb extends Component {
  state = {
    expandedKeys: [],
    currentSelect: '',
    systemName: '',
    problemList: [],
    selectedProbs: [],
    keyword: '',
    nodePath: '',
    treeList: [],
    showNodes: false,
    showProbAnchor: false,
    showScaleAnchor: false,
    currentRow: null,
    keyLevelMap: new Map(),
    requestBody: null,
    openEditProbs: false,
    openAddProb: false
  }
  handleTreeSelect = (selectedKeys, info) => {
    this.setState({ currentSelect: info.selectedNodes[0].props.title });
  };
  handleExpand = (expandedKeys) => {
    console.log('onExpand', expandedKeys);
    let temp = expandedKeys.filter(item => {
      return item !== '-1'
    })
    this.setState({
      expandedKeys: temp
    }, () => {
      const body = {
        type: "SYSTEM", // 系统 SYSTEM  设备DEVICE（必填）
        keyword: this.state.keyword, // 非必填
        hierarchySysIds: this.state.expandedKeys.length > 0 ? [this.state.expandedKeys[this.state.expandedKeys.length - 1]] : [], // 层级ID数组, 非必填
        currPage: 1,
        pageSize: 999999999
      }
      this.setState({
        requestBody: body
      })
    })
  }
  getProbListFun = () => {
    message.success('数据读取中，请稍后...')
    getProbList(this.state.requestBody).then(res => {
      if (res.data.status === 'OK') {
        let temp = [], provisions = [], measure = []
        res.data.data.list.map(item => {
          let obj = {
            ...item
          }
          obj.specificTermList.forEach(ele => {
            provisions.push(ele.info)
          })
          obj.suggestActionList.forEach(ele => {
            measure.push(item.info)
          })
          obj.provisions = provisions.join(' ')
          obj.measure = measure.join(' ')
          temp.push(obj)
        })
        message.success('数据读取成功')
        this.setState({
          problemList: temp,
          showNodes: false
        })
      } else {
        message.error('读取失败')
      }
    })
  }
  formatList = (list) => { // 格式化数据
    let temp = []
    list.map(item => {
      let obj = {
        ...item
      }
      obj.title = item.name
      obj.key = item.id;
      obj.children = item.children ? this.formatList(item.children) : [];
      temp.push(obj)
    })
    return temp
  }
  getTreeListFun = async () => { // 获取树形结构
    const result = await getTreeList({type: 'SYSTEM'})
    if (result.data.status === 'OK') {
      this.setState({
        treeList: [
            {
                title: '体系',
                key: '-1',
                children: this.formatList(result.data.data)
            }
        ]
      })
    }
  }
  handleCancel = () => {
    this.props.onCancel('back')
  }
  handleConfirm = () => {

  }
  editProb = (row) => {
    this.setState({
      currentRow: row,
      openEditProbs: true
    })
  }
  searchProb = () => {
    const body = {
      type: "SYSTEM", // 系统 SYSTEM  设备DEVICE（必填）
      keyword: this.state.keyword, // 非必填
      hierarchySysIds: this.state.expandedKeys, // 层级ID数组, 非必填
      currPage: 1,
      pageSize: 999999999
    }
    this.getProbListFun(body)
  }
  deleteProb = (row) => {
    const { id } = row
    deleteProbs({ids: [id]}).then(res => {
      if (res.data.status === 'OK') {
        message.success('删除成功')
        const body = {
          type: "SYSTEM", // 系统 SYSTEM  设备DEVICE（必填）
          keyword: this.state.keyword, // 非必填
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
          type: "SYSTEM", // 系统 SYSTEM  设备DEVICE（必填）
          keyword: this.state.keyword, // 非必填
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
      temp.type = 'SYSTEM'
      addProbs(temp).then(res => {
        if (res.data.status === 'OK')  {
          message.success('添加成功')
          const body = {
            type: "SYSTEM", // 系统 SYSTEM  设备DEVICE（必填）
            keyword: this.state.keyword, // 非必填
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
      temp.type = 'SYSTEM'
    editProbs(temp).then(res => {
        if (res.data.status === 'OK')  {
          message.success('添加成功')
          const body = {
            type: "SYSTEM", // 系统 SYSTEM  设备DEVICE（必填）
            keyword: this.state.keyword, // 非必填
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
  showProb = (row) => {
    this.setState({
      showProbAnchor: true,
      currentRow: row
    })
  }
  showScale = (row) => {
    this.setState({
      showScaleAnchor: true,
      currentRow: row
    })
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

    findSelectedNode = (nodes, key) => {
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node.key === parseFloat(key)) {
          return node;
        } else if (node.children) {
          const foundNode = this.findSelectedNode(node.children, key);
          if (foundNode) {
            return foundNode;
          }
        }
      }
      return null;
    };

    componentDidMount() {
        this.getTreeListFun()
    }
  render() {
    return (
      <div>
        <Card>
          <div className="tree-container-prob mb-10">
            <div className="flex">
              <Button onClick={() => {
                this.setState({
                  showNodes: true
                })
              }} type="primary">节点选择</Button>
              <div className="flex-1">
                <Input 
                  style={inputLongStyle}
                  value={this.state.keyword} 
                  placeholder="请输入关键字"
                  onChange={(e) => { this.setState({keyword: e.target.value}) }}
                  prefix={<Icon style={{marginLeft: '4px'}} type="search" />}
                  allowClear
                  onPressEnter={
                  (e) => {
                    this.searchProb()
                  }
                } />
                <Button type='primary' onClick={this.openAdd} disabled={this.state.expandedKeys.length === 0}>
                  <div className="bolder">
                    <Icon type="plus"></Icon>&nbsp;
                    添加
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
                  <Button type='danger' onClick={this.deleteProbMultiple}>
                    <div className="bolder">
                      <Icon type="delete"></Icon>&nbsp;
                      批量删除
                    </div>
                  </Button>
                </Popconfirm>
              </div>
            </div>
            <div className="mt-10">当前选择：{ this.state.currentSelect }</div>
            <div className="right ml-10 mt-20" style={{display: this.state.expandedKeys.length > 0 ? '' : 'none'}}>
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
                scroll={{ y: 640, x: 1800 }}
                pagination={true}>
                <Column title="描述" fixed="left" width={210} key="description" align="center" render={(text, row) => (
                   <div>{row.description}</div>
                )}/>
                <Column title="规范与条款" ellipsis={true} width={200} key="provisions" align="center" render={(text, row) => (
                  <Tooltip title={row.provisions}>
                    <div style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', width: '165px' }}>{row.provisions.substring(0, 16)}...</div>
                  </Tooltip>
                )}/>
                <Column title="建议措施" ellipsis={true} width={150} key="measure" align="center" render={(text, row) => (
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
        </Card>
        <Modal
          visible={this.state.showNodes}
          onCancel={() => {this.setState({showNodes: false})}}
          width={'50%'}
          title="节点树"
          onOk={() => {
            let matchedNodes = [];
            this.state.expandedKeys.forEach((key) => {
              const foundNode = this.findSelectedNode(this.state.treeList, key);
              if (foundNode) {
                matchedNodes.push(foundNode);
              }
            });
            let temp = []
            matchedNodes.forEach(item => {
              temp.push(item.name)
            })
            this.setState({
              currentSelect: temp.join('/')
            })
            this.getProbListFun()
          }}
        >
          <div className="left">
              <DirectoryTree
              onExpand={this.handleExpand}
              >
              {this.renderTreeNodes(this.state.treeList)}
              </DirectoryTree>
          </div>
        </Modal>
        <Modal
          visible={this.state.showProbAnchor}
          onCancel={() => {this.setState({showProbAnchor: false, currentRow: null})}}
          width={'50%'}
          footer={[
            <div key={'footer'}></div>
          ]}
          title="问题数量">
              <Table 
                bordered 
                rowKey="name" 
                dataSource={this.state.currentRow ? this.state.currentRow.problemNumSetList : []} 
                pagination={true}>
                  <Column title="名称" dataIndex="name" key="name" align="center"/>
                  <Column title="对应数值(Rn)" dataIndex="value" key="value" align="center"/>
                  <Column title="扣除分数" dataIndex="deductPoint" key="deductPoint" align="center"/>
                  <Column title="附加加分" dataIndex="additionPoint" key="additionPoint" align="center"/>
                </Table>
        </Modal>
        <Modal
          visible={this.state.showScaleAnchor}
          onCancel={() => {this.setState({showScaleAnchor: false, currentRow: null})}}
          width={'50%'}
          footer={[
            <div key={'footer'}></div>
          ]}
          title="问题规模">
              <Table 
                bordered 
                rowKey="name" 
                dataSource={this.state.currentRow ? this.state.currentRow.problemScaleSetList : []} 
                pagination={true}>
                  <Column title="名称" dataIndex="name" key="name" align="center"/>
                  <Column title="对应规模系数" dataIndex="factor" key="factor" align="center"/>
                </Table>
        </Modal>
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

export default SystemProb;
