import React, { Component } from "react";
import { Tree, Input, Table, Card, Button, message } from "antd";
import { getProbList, addModel, editModel } from "@/api/standrad";
import '../style/standrad.less'
const { TreeNode } = Tree;
const { Column } = Table;
const inputLongStyle = {
  padding: '1px 10px',
  width: '280px'
}
class AddModel extends Component {
  state = {
    selectedNode: [],
    selectNodes: [],
    systemName: '',
    problemList: [],
    selectedProbs: [],
    nodePath: '',
    defaultRowSelect: []
  }
  handleCheck = (selectedNode, info) => {
    const selectedNodeKey = selectedNode[0]; // 获取选中的子节点的key值
    const parentNodes = []; // 存储上级节点的数组

    const findParentNodes = (node, path) => {
      if (node.id === parseFloat(selectedNodeKey)) {
        parentNodes.push(...path); // 将路径中的节点添加到上级节点数组
        return;
      }

      if (node.children) {
        node.children.forEach((child) => {
          findParentNodes(child, [...path, child]);
        });
      }
    };
    this.props.treeList.forEach((node) => {
      findParentNodes(node, [node]);
    });
    let tempNodes = []
    parentNodes.forEach(item => {
      tempNodes.push(item.id)
    })
    this.setState({
      selectedNode: selectedNode,
      selectNodes: tempNodes
    }, () => {
      const body = {
        type: "SYSTEM", // 系统 SYSTEM  设备DEVICE（必填）
        keyword: "", // 非必填
        hierarchySysIds: this.state.selectedNode, // 层级ID数组, 非必填
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
  handleCancel = () => {
    this.props.onCancel('back')
  }
  handleConfirm = () => {
    let temp = []
    this.state.selectedProbs.forEach(item => {
      const ele = item.id
      temp.push(ele)
    })
    if (this.props.currentId) {
      const body = {
        id: this.props.currentId,
        name: this.state.systemName,
        hierarchyList: this.state.selectNodes,
        problemIds: temp,
        type: 'SYSTEM'
      }
      editModel(body).then(res => {
        if (res.data.status === 'OK') {
          message.success('编辑成功')
          this.props.onConfirm('confirm')
          this.setState({
            selectedNode: [],
            selectedProbs: [],
            selectNodes: [],
            systemName: '',
            nodePath: ''
          })
        } else {
          message.error(res.data.errorMsg)
        }
      })
    } else {
      const body = {
        name: this.state.systemName,
        hierarchyList: this.state.selectNodes,
        problemIds: temp,
        type: 'SYSTEM'
      }
      addModel(body).then(res => {
        if (res.data.status === 'OK') {
          message.success('添加成功')
          this.props.onConfirm('confirm')
          this.setState({
            selectedNode: [],
            selectedProbs: [],
            selectNodes: [],
            systemName: '',
            nodePath: ''
          })
        } else {
          message.error(res.data.errorMsg)
        }
      })
    }
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
          <div className="grid tree-container mb-10">
            <div className="left">
            <div>已勾选：{this.state.selectedNode.length}</div>
            <Tree
              checkable
              onCheck={this.handleCheck}
            >
              {this.renderTreeNodes(treeList)}
            </Tree>
          </div>
            <div className="right" style={{display: this.state.selectedNode.length > 0 ? '' : 'none'}}>
              <div className="tool-bar flex flex-center mb-10">
                <div><span className="red">* </span>体系名称：</div>
                <Input 
                  placeholder="请输入体系名称"
                  value={this.state.systemName} 
                  style={inputLongStyle}
                  onChange={(e) => {
                    this.setState({
                      systemName: e.target.value
                    })
                }} />
                <div className="ml-20">已选择{this.state.selectedProbs.length}条问题---</div>
                <div>共{this.state.problemList.length}条问题</div>
              </div>
              <Table 
                bordered 
                rowKey="id" 
                dataSource={this.state.problemList} 
                rowSelection={{
                  type: 'checkbox',
                  selectedRowKeys: this.state.defaultRowSelect,
                  onChange: (selectedRowKeys, selectedRows) => {
                    this.setState({
                      selectedProbs: selectedRows
                    })
                  },
                }}
                scroll={{ y: 240 }}
                pagination={true}>
                <Column title="序号" dataIndex="id" key="id" align="center"/>
                <Column title="编码" dataIndex="hierarchySysCode" key="hierarchySysCode" align="center"/>
                <Column title="描述" dataIndex="description" key="description" align="center"/>
              </Table>
            </div>
          </div>
          <div className="bottom-btn-group text-center">
              <Button onClick={this.handleCancel} title="取消">取消</Button>
              <Button 
                onClick={this.handleConfirm} 
                disabled={this.state.selectedProbs.length === 0 || this.state.systemName === ''} 
                className="ml-20" 
                type="primary" 
                title="确定">确定</Button>
          </div>
        </Card>
      </div>
    );
  }
}

export default AddModel;
