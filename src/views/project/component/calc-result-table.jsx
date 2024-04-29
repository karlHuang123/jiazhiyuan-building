import React, { Component } from "react";
import { Card, Button, Table, message, Divider, Input, Tooltip, Icon, Modal, Popconfirm, Select } from "antd";
import { getCalcScoreResultDetails } from "@/api/projects";
const { Column } = Table;
const inputLongStyle = {
  padding: '1px 10px',
  width: '250px'
}
const cloumns = [

]
class ResultTable extends Component {
  state = {
    data: [],
    columns: [],
    scoreDetailsList: [],
    showDetailList: false
  };
  openCalc = async (row) => {
      const { id } = row
      const result = await getCalcScoreResultDetails({detailId: id})
      console.log(result)
      if (result.data.status === 'OK') {
          this.setState({
            scoreDetailsList: result.data.data,
            showDetailList: true
          })
      } else {
          message.error(result.data.errorMsg)
      }
  }
  formatData = (list) => {
      let output = []
      list.forEach(item => { // 最外层循环
        item.children.forEach(ele => { // 二级指标
            ele.children.forEach((atom, index) => { // 三级指标
                console.log(atom)
                let unit = {
                    id: atom.id,
                    firstLevelName: item.name ? item.name : '-',
                    firstLevelScore: item.score ? item.score : '-',
                    firstLevelWeight: item.weight ? item.weight : '-',
                    secondLevelName: ele.name ? ele.name : '-',
                    secondLevelScore: ele.score ? ele.score : '-',
                    secondLevelWeight: ele.weight ? ele.weight : '-',
                    thirdLevelName: atom.name ? atom.name : '-',
                    thirdLevelScore: atom.score ? atom.score : '-',
                    thirdLevelWeight: atom.weight ? atom.weight : '-',
                }
                output.push(unit)
            })
        })
      })
      this.setState({
          data: output
      }, () => {
          let temp = [
            {
                title: '一级指标',
                dataIndex: 'firstLevelName',
                key: 'firstLevelName',
                align: 'center',
                fixed: 'left',
                // render: (text, row, index) => {
                //     // 检查当前单元格与上一行单元格的值是否相同
                //     if (index > 0 && text === this.state.data[index - 1].firstLevelName) {
                //       return {
                //         children: text,
                //         props: {
                //           rowSpan: 0, // 设置rowSpan为0，表示不渲染该单元格
                //         },
                //       };
                //     }
                //     // 否则渲染正常的单元格
                //     return {
                //       children: text,
                //       props: {rowSpan: row.firstLevelName === '安全检查' ? row.firstChildren.length : row.firstChildren[0].children.length},
                //     };
                //   },
            },
            {
                title: '一级指标得分',
                dataIndex: 'firstLevelScore',
                key: 'firstLevelScore',
                align: 'center',   
                // render: (text, row, index) => {
                //     // 检查当前单元格与上一行单元格的值是否相同
                //     if (index > 0 && row.firstLevelName === this.state.data[index - 1].firstLevelName) {
                //       return {
                //         children: text,
                //         props: {
                //           rowSpan: 0, // 设置rowSpan为0，表示不渲染该单元格
                //         },
                //       };
                //     }
                //     // 否则渲染正常的单元格
                //     return {
                //       children: text,
                //       props: {rowSpan: row.firstLevelName === '安全检查' ? row.firstChildren.length : row.firstChildren[0].children.length},
                //     };
                //   },
              },
            {
                title: '一级指标权重',
                dataIndex: 'firstLevelWeight',
                key: 'firstLevelWeight',
                align: 'center',   
                  // render: (text, row, index) => {
                  //     // 检查当前单元格与上一行单元格的值是否相同
                  //     if (index > 0 && row.firstLevelName === this.state.data[index - 1].firstLevelName) {
                  //       return {
                  //         children: text,
                  //         props: {
                  //           rowSpan: 0, // 设置rowSpan为0，表示不渲染该单元格
                  //         },
                  //       };
                  //     }
                  //     // 否则渲染正常的单元格
                  //     return {
                  //       children: text,
                  //       props: {rowSpan: row.firstLevelName === '安全检查' ? row.firstChildren.length : row.firstChildren[0].children.length},
                  //     };
                  //   },
            },
            {
                title: '二级指标',
                dataIndex: 'secondLevelName',
                key: 'secondLevelName',
                align: 'center',  
                // render: (text, row, index) => {
                //     // 检查当前单元格与上一行单元格的值是否相同
                //     if (index > 0 && text === this.state.data[index - 1].secondLevelName) {
                //       return {
                //         children: text,
                //         props: {
                //           rowSpan: 0, // 设置rowSpan为0，表示不渲染该单元格
                //         },
                //       };
                //     }
                //     // 否则渲染正常的单元格
                //     return {
                //       children: text,
                //       props: {rowSpan: row.firstChildren[0].children.length},
                //     };
                //   },
            },
            {
                title: '二级指标得分',
                dataIndex: 'secondLevelScore',
                key: 'secondLevelScore',
                align: 'center',  
                // render: (text, row, index) => {
                //     // 检查当前单元格与上一行单元格的值是否相同
                //     if (index > 0 && row.secondLevelName === this.state.data[index - 1].secondLevelName) {
                //       return {
                //         children: text,
                //         props: {
                //           rowSpan: 0, // 设置rowSpan为0，表示不渲染该单元格
                //         },
                //       };
                //     }
                //     // 否则渲染正常的单元格
                //     return {
                //       children: text,
                //       props: {rowSpan: row.firstChildren[0].children.length},
                //     };
                //   },
            },
            {
                title: '二级指标权重',
                dataIndex: 'secondLevelWeight',
                key: 'secondLevelWeight',
                align: 'center',  
                // render: (text, row, index) => {
                //     // 检查当前单元格与上一行单元格的值是否相同
                //     if (index > 0 && row.secondLevelName === this.state.data[index - 1].secondLevelName) {
                //       return {
                //         children: text,
                //         props: {
                //           rowSpan: 0, // 设置rowSpan为0，表示不渲染该单元格
                //         },
                //       };
                //     }
                //     // 否则渲染正常的单元格
                //     return {
                //       children: text,
                //       props: {rowSpan: row.firstChildren[0].children.length},
                //     };
                //   },
            },
            {
                title: '三级指标',
                dataIndex: 'thirdLevelName',
                key: 'thirdLevelName',
                align: 'center',
            },
            {
                title: '三级指标评分',
                dataIndex: 'thirdLevelScore',
                key: 'thirdLevelScore',
                align: 'center',
            },
            {
                title: '三级指标权重',
                dataIndex: 'thirdLevelWeight',
                key: 'thirdLevelWeight',
                align: 'center',
            },
            {
                title: '操作',
                key: 'operation',
                align: 'center',
                render: (text, row, index) => (
                    <span>
                      <Button title="计算详情" onClick={this.openCalc.bind(null, row)}>计算详情</Button>
                    </span>
                  ),
            },
          ]
          this.setState({
              columns: temp
          })
      })
  }
  componentDidMount() {
    this.formatData(this.props.sourceData?.children)
}
  render() {
    const title = (
      <div className="title flex">

      </div>
    )
    return (
      <div className="app-container">
        <Card title={title}>
          <Table 
            bordered 
            rowKey="id"
            columns={this.state.columns}
            dataSource={this.state.data} 
            pagination={false}
            scroll={{x: 'max-content'}}>
          </Table>
        </Card>
        <Modal
            visible={this.state.showDetailList}
            onCancel={() => this.setState({showDetailList: false})}
            width={'70%'}
            footer={[
              <div key={'footer'}></div>
            ]}
            title="打分详情"
          >
            <Table 
                bordered 
                dataSource={this.state.scoreDetailsList} 
                rowKey="id">
                <Column title="序号" align="center" key="id" width={60} render={(text,record,index) => index+1}/>
                <Column title="检查内容" align="center" dataIndex="checkContent" key="checkContent" />
                <Column title="应得分" align="center" dataIndex="deserveScore" key="deserveScore" />
                <Column title="扣除分数" align="center" dataIndex="deductScore" key="deductScore" />
                <Column title="得分" align="center" dataIndex="score" key="score" />
            </Table>
          </Modal>
      </div>
    );
  }
}

export default ResultTable;
