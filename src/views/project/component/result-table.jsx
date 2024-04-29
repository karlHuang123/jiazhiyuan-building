import React, { Component } from "react";
import { Card, Button, Table, message, Divider, Input, Tooltip, Icon, Modal, Popconfirm, Select } from "antd";
import { getDocumentList } from "@/api/document";
import mock from '../../../assets/images/mock.jpg'
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
    columns: [
        
    ]
  };
  formatData = (list) => {
      let output = []
      list.forEach(item => { // 最外层循环
        item.children.forEach(ele => { // 二级指标
            ele.children.forEach((atom, index) => {
                atom.hiddenDangerLevelList.forEach(quak => {
                    let unit = {
                        id: Math.random(),
                        firstLevelName: item.name ? item.name : '-',
                        firstLevelScore: item.score ? item.score : '-',
                        firstLevelWeight: item.weight ? item.weight : '-',
                        secondLevelName: ele.name ? ele.name : '-',
                        secondLevelScore: ele.score ? ele.score : '-',
                        secondLevelWeight: ele.weight ? ele.weight : '-',
                        checkSection: ele.children[index].name ? ele.children[index].name : '-', // 检查分项
                        checkSectionScore: ele.children[index].score ? ele.children[index].score : '-',
                        checkSectionWeight: ele.children[index].weight ? ele.children[index].weight : '-',
                        hiddenDangerLevel: quak.hiddenDangerLevel ? quak.hiddenDangerLevel : '-',
                        hiddenDangerCount: quak.count ? quak.count : '-',
                        canAccept: ele.children[index].canAccept ? ele.children[index].canAccept : '-',
                        canEndure: ele.children[index].canEndure ? ele.children[index].canEndure : '-',
                        canIgnore: ele.children[index].canIgnore ? ele.children[index].canIgnore : '-',
                        canNotAccept: ele.children[index].canNotAccept ? ele.children[index].canNotAccept : '-',
                        reject: ele.children[index].reject ? ele.children[index].reject : '-',
                        hiddenDangerLevelList: atom.hiddenDangerLevelList ? atom.hiddenDangerLevelList : [],
                        firstChildren: item.children ? item.children : []
                    }
                    output.push(unit)
                })
            })
        })
      })
      console.log(output)
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
                title: '检查分项',
                dataIndex: 'checkSection',
                key: 'checkSection',
                align: 'center',  
                // render: (text, row, index) => {
                //     // 检查当前单元格与上一行单元格的值是否相同
                //     if (index > 0 && text === this.state.data[index - 1].checkSection) {
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
                //       props: {rowSpan: row.hiddenDangerLevelList.length},
                //     };
                //   },
            },
            {
                title: '检查分项得分',
                dataIndex: 'checkSectionScore',
                key: 'checkSectionScore',
                align: 'center',  
                // render: (text, row, index) => {
                //     // 检查当前单元格与上一行单元格的值是否相同
                //     if (index > 0 && row.checkSection === this.state.data[index - 1].checkSection) {
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
                //       props: {rowSpan: row.hiddenDangerLevelList.length},
                //     };
                //   },
            },
            {
                title: '检查分项权重',
                dataIndex: 'checkSectionWeight',
                key: 'checkSectionWeight',
                align: 'center',  
                // render: (text, row, index) => {
                //     // 检查当前单元格与上一行单元格的值是否相同
                //     if (index > 0 && row.checkSection === this.state.data[index - 1].checkSection) {
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
                //       props: {rowSpan: row.hiddenDangerLevelList.length},
                //     };
                //   },
            },
            {
                title: '隐患等级',
                dataIndex: 'hiddenDangerLevel',
                key: 'hiddenDangerLevel',
                align: 'center',
            },
            {
                title: '问题数量',
                dataIndex: 'hiddenDangerCount',
                key: 'hiddenDangerCount',
                align: 'center',
            },
            {
                title: '风险等级',
                key: 'dangerLevel',
                align: 'center',
                children: [
                    { title: '可忽略风险', key: 'canIgnore', dataIndex: 'canIgnore', align: 'center', width: 100},
                    { title: '可容忍风险', key: 'canEndure', dataIndex: 'canEndure', align: 'center', width: 100},
                    { title: '可接受风险', key: 'canAccept', dataIndex: 'canAccept', align: 'center', width: 100},
                    { title: '不可接受风险', key: 'canNotAccept', dataIndex: 'canNotAccept', align: 'center', width: 100},
                    { title: '拒绝接受风险', key: 'reject', dataIndex: 'reject', align: 'center', width: 100}
                ]
            }
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
        {/* <div className="title">
            <div>项目名称：测试新项目</div>
        </div>
        <div>
            <img style={{width: '100%'}} src={mock} alt="" />
        </div> */}
      </div>
    );
  }
}

export default ResultTable;
