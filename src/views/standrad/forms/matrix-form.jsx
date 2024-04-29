import React, { Component } from 'react';
import { Table, Input, Modal, Select, Cascader, Button, Icon, Popconfirm } from 'antd';
import { getMatrix, getMatrixTree } from "@/api/standrad";
import '../style/standrad.less'
import { relativeTimeThreshold } from 'moment';
 
const { Option } = Select
class Demo extends Component {
  constructor(props) {
    super(props);
    this.uploadRef = React.createRef();
  }
  state = { 
      dataSource: [],
      indexCols: [],
      columns: null,
      currentId: null,
      levelParentId: '',
      showTable: false,
      matrixTree: [],
      currentExpertType: '',
      typeList: [
            {
                label: '模糊数学',
                value: 'FUZZY_MATH'
            },
            {
                label: '打分',
                value: 'SCORE'
            }
        ]
    };

  confirmOk = () => {
    this.props.outputData({
        martix: this.state.dataSource,
        indexCols: this.state.indexCols
    })
  }

  changeType = (value) => {
      this.setState({
          currentExpertType: value,
          showTable: false
      })
      getMatrix({
        expertId: this.state.currentId,
        expertType: value,
        levelParentId: this.state.levelParentId
      }).then(res => {
          const xArr = res.data.data.indexCols;
        //   const dataSource = xArr.map((v, i) => ({key: v, name: v}));
        let dataSource = null
        if (res.data.data.scoreMatrix && JSON.stringify(res.data.data.scoreMatrix) !== '{}') {
            dataSource = res.data.data.scoreMatrix
        } else {
          dataSource = xArr.map((v, i) => ({name: v}));
        }
          this.setState({ dataSource }, () => {
              const yArr = res.data.data.indexCols;
              const that = this;//定义中间量that=this确保columns内部onChange事件作用域为当前组件，方便调用forceUpdate()强制渲染表格
              const columns = [{
                title: ' ',
                dataIndex: 'name',
              }, ...yArr.map(item => ({
                title: item,
                dataIndex: item,
                render: (text, record) => (
                  <Input value={record[item]} onChange={(e) => { record[item] = e.target.value; that.forceUpdate(); }} />
                ),
              }))];//最终的dataSource就是我们想要的数据结构，修改时直接把这个dataSource传给构建的表格就可以渲染
              this.setState({
                  columns: columns,
                  showTable: true,
                  indexCols: res.data.data.indexCols
              })
          });//dataSource不能在render里面构建，在render里面构建每次重新渲染的时候dataSource会被重新构建，指针指向变化导致先前的修改不能被跟踪
      })
  }

  handleChange = (value) => {
      this.setState({
          levelParentId: value.length - 2 >= 0 ? value[value.length - 2] : 0,
          showTable: false
      })
      getMatrix({
        expertId: this.state.currentId,
        expertType: this.state.currentExpertType,
        levelParentId: value.length - 2 >= 0 ? value[value.length - 2] : 0
      }).then(res => {
          const xArr = res.data.data.indexCols;
        //   const dataSource = xArr.map((v, i) => ({key: v, name: v}));
        let dataSource = null
        if (res.data.data.scoreMatrix && JSON.stringify(res.data.data.scoreMatrix) !== '{}') {
            dataSource = res.data.data.scoreMatrix
        } else {
          dataSource = xArr.map((v, i) => ({name: v}));
        }
          this.setState({ dataSource }, () => {
              const yArr = res.data.data.indexCols;
              const that = this;//定义中间量that=this确保columns内部onChange事件作用域为当前组件，方便调用forceUpdate()强制渲染表格
              const columns = [{
                title: ' ',
                dataIndex: 'name',
              }, ...yArr.map(item => ({
                title: item,
                dataIndex: item,
                render: (text, record) => (
                  <Input value={record[item]} onChange={(e) => { record[item] = e.target.value; that.forceUpdate(); }} />
                ),
              }))];//最终的dataSource就是我们想要的数据结构，修改时直接把这个dataSource传给构建的表格就可以渲染
              this.setState({
                  columns: columns,
                  showTable: true,
                  indexCols: res.data.data.indexCols
              })
          });//dataSource不能在render里面构建，在render里面构建每次重新渲染的时候dataSource会被重新构建，指针指向变化导致先前的修改不能被跟踪
      })
  }

  formatList = (list) => { // 格式化数据
    let temp = []
    list.map(item => {
      let obj = {
        ...item
      }
      obj.label = item.name
      obj.value = item.id;
      obj.children = item.children ? this.formatList(item.children) : [];
      temp.push(obj)
    })
    return temp
  }

  confirmImport = () => {
    if (this.uploadRef.current) {
      this.uploadRef.current.click();
    }
  }

  renderConfirmContent = () => (
    <div>
      <p>导入文件？</p>
      <Button type="" size="small">
        <a href={`http://47.93.28.249:8181/admin/file/template/download?type=matrix`}>模版下载</a>
      </Button>
    </div>
  )
 
  componentDidUpdate(prevProps) {
      if (this.props && prevProps && prevProps.expertId !== this.props.expertId) {
          getMatrixTree({expertId: this.props.expertId}).then(res => {
              this.setState({
                currentId: this.props.expertId,
                matrixTree: this.formatList(res.data.data)
            })
          })
      }
  }
 
  render() {
    const { visible, expertId } = this.props;
    return (
        <Modal
            title='判断矩阵'
            visible={visible}
            onCancel={() => {
                this.props.onCancel('close')
                this.setState({
                    showTable: false
                })
            }}
            onOk={this.confirmOk}
            width={'70%'}
            destroyOnClose
            >
            <div className='flex mb-10'>
                <Select
                    style={{
                        width: 150,
                    }}
                    placeholder="专家类型"
                    allowClear
                    onChange={this.changeType}
                >
                    {this.state.typeList.map((item, index) => (
                    <Option value={item.value} key={index}>{item.label}</Option>
                    ))}
                </Select>
                &nbsp;
                &nbsp;
                <Cascader
                    options={this.state.matrixTree ? this.state.matrixTree : []}
                    style={{width: '50%'}}
                    expandTrigger="hover"
                    onChange={this.handleChange} />
                &nbsp;
                &nbsp;
                <Popconfirm placement="top" 
                  title={this.renderConfirmContent()} 
                  onConfirm={this.confirmImport} 
                  okText="确定" cancelText="取消">
                    <Button type="">
                      <Icon type="download"></Icon>&nbsp;导入
                    </Button>
                </Popconfirm>
            </div>
            {this.state.showTable ? (
                <Table 
                    columns={this.state.columns} 
                    dataSource={this.state.dataSource} 
                    bordered pagination={false} />
            ) : (<span></span>)}
        </Modal>
    )
  }
}

export default Demo;