import React, { Component, useRef } from "react";
import { Card, Button, Table, message, Divider, Input, Icon, Popconfirm, Select, Modal, Radio, Upload } from "antd";
import { getClientSelectOptions } from "@/api/business";
import { uploadProjects, deleteHistory } from "@/api/projects"
import { getToken } from "@/utils/auth";
import { 
  getProjectList,
  deleteProject,
  getProjectOptions,
  getDangerousOptions,
  getSuperDangerousOptions,
  editProject,
  addProject,
  updateProject,
  getProjectHistory,
  changeProject,
  getDeviceSummary,
  getDeviceTypeList,
  addDevice } from '@/api/projects'
import { getDepartmentList } from "@/api/department";
import CompanyModal from "./components/companyModal";
import InformationModal from "./components/informationModal";
import AddProjectForm from "./forms/add-project-form";
import EditProjectForm from "./forms/edit-project-form";
import UpdateProjectInfo from "./forms/update-project-info";
import DeviceList from "./components/deviceList";
import DeviceInfoList from "./components/deviceInfoList";
import AddDeviceForm from "./forms/add-device-form";
import moment from 'moment'
import './style/projects.less'
import './style/clientInfo.less'
import generalInfo from "./static/general";
const axios = require('axios');
const { Column } = Table;
const { Option } = Select;
const inputLongStyle = {
  padding: '1px 10px',
  width: '250px'
}
class Projects extends Component {
  constructor(props) {
    super(props);
    this.uploadRef = React.createRef();
  }
  state = {
    projects: [],
    clientOptions: [],
    clientSelectOptions: [],
    projectSelectOptions: [],
    projectUsageOptions: [],
    dangerousOptions: [],
    superDangerousOptions: [],
    deviceSummaryList: [],
    deviceInfoList: [],
    editProjectModalVisible: false,
    updateProjectModalVisible: false,
    showProjectHistoryList: false,
    showUpdateDeviceInfo: false,
    showDeviceSummaryList: false,
    showAddDeviceForm: false,
    currentRowData: {},
    projectId: null,
    addProjectModalVisible: false,
    addProjectModalLoading: false,
    searchKeyword: '',
    selectProjects: [],
    singleDelete: [],
    projectHistoryList: [],
    searchClientType: null,
    projectBody: {
      currPage: 1,
      pageSize: 20000,
      keyword: null,
      client: null,
      projectTypes: null
    },
    showCompanyInfo: false,
    showProjectInfo: false,
    currentDevice: 'TOWER_CRANE',
    currentProjectId: null,
    openExport: false, // 导入弹窗展示anchor
  };
  renderConfirmContent = () => (
    <div>
      <p>导入文件？</p>
      <Button type="" size="small">
        <a href={`http://47.93.28.249:8181/admin/file/template/download?type=project`}>模版下载</a>
      </Button>
    </div>
  )

  downloadTemplate = () => {
    
  }
  handlerojectTypeChange = (value) => {
    let body = this.state.projectBody
    body.keyword = this.searchKeyword || ''
    if (value) {
      body.client = value
      this.setState({
        projectBody: body
      })
    } else {
      body.client = null
      this.setState({
        projectBody: body
      })
    }
    this.getProjectList()
  }

  handleProjectTypeChange = (value) => {
    let body = this.state.projectBody
    body.keyword = this.searchKeyword || ''
    if (value) {
      body.projectTypes = value.join(',')
      this.setState({
        projectBody: body
      })
    } else {
      body.projectTypes = null
      this.setState({
        projectBody: body
      })
    }
    this.getProjectList()
  }
  handleClientTypeChange = (value) => {
    let body = this.state.projectBody
    body.keyword = this.searchKeyword || ''
    if (value) {
      body.client = value.key
      this.setState({
        projectBody: body
      })
    } else {
      body.client = null
      this.setState({
        projectBody: body
      })
    }
    this.getProjectList()
  }
  resetSearch = () => {
    const body = {
      currPage: 1,
      pageSize: 20000,
      keyword: null,
      client: null,
      projectTypes: null
    }
    this.setState({
      projectBody: body,
      searchKeyword: ''
    })
    this.getProjectList()
  }
  getProjectList = async () => {
    const result = await getProjectList(this.state.projectBody)
    if (result.data.status === 'OK') {
      let list = JSON.parse(JSON.stringify(result.data.data.list))
      list.forEach(item => {
        const typeName = this.state.clientOptions.find(ele => ele.value === item.client.type) ? 
                         this.state.clientOptions.find(ele => ele.value === item.client.type).label : ''
        item.typeName = typeName
      })
      this.setState({
        projects: list
      })
    }
  }
  getProjectOptions = async () => {
      const res = await getProjectOptions()
      if (res.data.status === 'OK') {
        let temp = []
        res.data.data.forEach((item) => {
          const ele = {
            value: item.code,
            label: item.name
          }
          temp.push(ele)
        })
        this.setState({
            projectSelectOptions: temp
        })
      }
  }
  getClientSelectOptions = async () => {
    const result = await getClientSelectOptions()
    if (result.data.status === 'OK') {
      let temp = []
      result.data.data.forEach((item) => {
        const ele = {
          value: item.id,
          label: item.name
        }
        temp.push(ele)
      })
      this.setState({
        clientSelectOptions: temp
      })
    }
  }
  getDangerousOptions = async () => {
    const result = await getDangerousOptions()
    if (result.data.status === 'OK') {
      let temp = []
      result.data.data.forEach((item) => {
        const ele = {
          value: item.code,
          label: item.name
        }
        temp.push(ele)
      })
      this.setState({
        dangerousOptions: temp
      })
    }
  }
  getSuperDangerousOptions = async () => {
    const result = await getSuperDangerousOptions()
    if (result.data.status === 'OK') {
      let temp = []
      result.data.data.forEach((item) => {
        const ele = {
          value: item.code,
          label: item.name
        }
        temp.push(ele)
      })
      this.setState({
        superDangerousOptions: temp
      })
    }
  }
  findDangerous = (str, type) => {
    if (type === 'dangerous') {
      return generalInfo.dangerousOptions[str]
    }
    return generalInfo.superDangerousOptions[str]
  }
  getProjectHistory = async (id) => {
    this.setState({
      currentProjectId: id
    })
    const result = await getProjectHistory({projectId: id})
    if (result.data.status === 'OK') {
      let temp = JSON.parse(JSON.stringify(result.data.data))
      temp.forEach(item => {
        let dangerText = []
        let superDangerousText = []
        item.dangerousOptions.forEach(ele => {
          dangerText.push(this.findDangerous(ele, 'dangerous'))
        })
        item.superDangerousOptions.forEach(ele => {
          superDangerousText.push(this.findDangerous(ele, 'superDangerous'))
        })
        item.dangerText = dangerText.join(',')
        item.superDangerousText = superDangerousText.join(',')
      })
      this.setState({
        showProjectHistoryList: true,
        projectHistoryList: temp
      })
    }
  }
  handleEditUser = (row) => {
    this.setState({
      currentRowData: Object.assign({}, row),
      editProjectModalVisible: true,
    });
  };

  handleUpdateProject = (row) => {
    this.setState({
      projectId: row.id,
      updateProjectModalVisible: true,
    });
  }

  handleEditProjectHistory = (row) => {
    this.setState({
      projectId: row.id,
      currentInfo: row,
      updateProjectModalVisible: true,
    });
  }

  handleDeleteProject = (row) => {
    const { id } = row
    deleteProject({
      ids: [id]
    }).then(res => {
      if (res.data.status === 'OK') {
        message.success("删除成功")
        this.getProjectList();
      } else {
        message.success("删除失败")
      }
    })
  }

  multipDelete = () => {
    let temp = []
    this.state.selectProjects.forEach(item => {
      const ele = item.id
      temp.push(ele)
    })
    deleteProject({
      clientIds: temp
    }).then(res => {
      if (res.data.status === 'OK') {
        message.success("删除成功")
        this.getProjectList();
      } else {
        message.success("删除失败")
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
  handleAddDevice = _ => {
    const { form } = this.addDeviceForm.props
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      let details = {}
      for(let i in values) {
        if (values[i] === undefined) {
          details[i] = ''
        } else {
          details[i] = values[i]
        }
      }
      details.outputLisence = values.outputLisence.label
      delete details.projectId
      delete details.deviceType
      delete details.updateDate
      delete details.deviceId
      const body = {
        projectId: this.state.projectId,
        deviceId: parseFloat(values.outputLisence.key),
        deviceType: values.deviceType.key,
        updateDate: moment(values.updateDate).format('YYYY-MM-DD'),
        details: details
      }
      addDevice(body).then(res => {
        // console.log(res)
        if (res.data.status === 'OK') {
          message.success('添加成功')
          this.setState({
            showAddDeviceForm: false
          }, () => {
            this.handleCancel()
          })
        } else {
          message.error(res.data.errorMsg)
        }
      })
    })
  }
  handleEditUserOk = _ => {
    const { form } = this.editContractFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const body = {
        id: values.id,
        projectName: values.projectName, // 项目名称,必填
        projectType: values.projectType.key, // 项目类型, 必填
        usageType: values.usageType.key, // 用途类型
        clientId: values.clientId.key, // 委托方，必填
        constructionLicense: values.constructionLicense ? values.constructionLicense : '', // 施工许可证号
        itemCode: values.itemCode ? values.itemCode : '', // 项目编码，必填
        branch: values.branch ? values.branch : '', // 所属分公司
        buildCompany: values.buildCompany ? values.buildCompany : '', // 施工单位
        projectManager: values.projectManager ? values.projectManager : '', // 项目经理
        managerPhoneNumber: values.managerPhoneNumber ? values.managerPhoneNumber : '', // 项目经理电话
        supervisorCompany: values.supervisorCompany ? values.supervisorCompany : '', // 监理单位
        supervisor: values.supervisor ? values.supervisor : '', // 监理
        supervisorPhoneNumber: values.supervisorPhoneNumber ? values.supervisorPhoneNumber : '', // 监理电话
        constructionCompany: values.constructionCompany ? values.constructionCompany : '', // 建设单位
        projectLeader: values.projectLeader ? values.projectLeader : '', // 项目负责人
        leaderPhoneNumber: values.leaderPhoneNumber ? values.leaderPhoneNumber : '', // 项目负责人电话
        province: values.province ? values.province.key : '', //  省
        city: values.city ? values.city.key : '', // 市 
        district: values.district ? values.district.key : '', // 区
        address: values.address ? values.address : '', // 详细地址
        projectCost: values.projectCost ? values.projectCost : '', // 工程造价
        allDepartments: values.allDepartments ? values.allDepartments : [],
        department: values.allDepartments ? values.allDepartments[values.allDepartments.length - 1] : null
      }
      editProject(body).then((res) => {
        form.resetFields();
        this.setState({ 
          addProjectModalVisible: false,
          editProjectModalVisible: false
         });
        message.success("编辑成功!")
        this.getProjectList()
      }).catch(e => {
        message.success("编辑失败,请重试!")
      })
    });
  };

  handleAddProjectOk = _ => {
    const { form } = this.addContractFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const body = {
        projectName: values.projectName, // 项目名称,必填
        projectType: values.projectType.key, // 项目类型, 必填
        usageType: values.usageType.key, // 用途类型
        clientId: values.clientId.key, // 委托方，必填
        constructionLicense: values.constructionLicense ? values.constructionLicense : '', // 施工许可证号
        itemCode: values.itemCode ? values.itemCode : '', // 项目编码，必填
        branch: values.branch ? values.branch : '', // 所属分公司
        buildCompany: values.buildCompany ? values.buildCompany : '', // 施工单位
        projectManager: values.projectManager ? values.projectManager : '', // 项目经理
        managerPhoneNumber: values.managerPhoneNumber ? values.managerPhoneNumber : '', // 项目经理电话
        supervisorCompany: values.supervisorCompany ? values.supervisorCompany : '', // 监理单位
        supervisor: values.supervisor ? values.supervisor : '', // 监理
        supervisorPhoneNumber: values.supervisorPhoneNumber ? values.supervisorPhoneNumber : '', // 监理电话
        constructionCompany: values.constructionCompany ? values.constructionCompany : '', // 建设单位
        projectLeader: values.projectLeader ? values.projectLeader : '', // 项目负责人
        leaderPhoneNumber: values.leaderPhoneNumber ? values.leaderPhoneNumber : '', // 项目负责人电话
        province: values.province ? values.province.key : '', //  省
        city: values.city ? values.city.key : '', // 市 
        district: values.district ? values.district.key : '', // 区
        address: values.address ? values.address : '', // 详细地址
        projectCost: values.projectCost ? values.projectCost : '', // 工程造价
        allDepartments: values.allDepartments ? values.allDepartments : [],
        department: values.allDepartments ? values.allDepartments[values.allDepartments.length - 1] : null
      }
      addProject(body).then(res => {
        if (res.data.status === 'OK') {
          form.resetFields();
          this.setState({ 
            addProjectModalVisible: false,
            editProjectModalVisible: false
           });
          message.success("添加成功!")
          this.getProjectList()
        } else {
          this.setState({ 
            addProjectModalVisible: false,
           });
          message.success(res.data.errorMsg)
        }
      })
    });
  }
  handleUpdateProjectOk = () => {
    const { form } = this.updateProjectFormRef.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      if (values.currentInfoId) {
        const body = {
          id: values.currentInfoId,
          detail: values.detail,
          progress: values.progress,
          progressThisSeason: values.progressThisSeason,
          dangerousOptions: values.dangerousOptions,
          superDangerousOptions: values.superDangerousOptions,
          updateDate: values.updateDate ? moment(values.updateDate).format('YYYY-MM-DD') : ''
        }
        changeProject(body).then(res => {
          if (res.data.status === 'OK') {
            form.resetFields();
            this.setState({ 
              updateProjectModalVisible: false,
              showProjectHistoryList: false
             });
            message.success("修改成功!")
            this.getProjectList()
          } else {
            this.setState({ 
              updateProjectModalVisible: false,
             });
            message.success("修改失败!")
          }
        })
      } else {
        const body = {
          projectId: values.projectId,
          detail: values.detail,
          progress: values.progress,
          progressThisSeason: values.progressThisSeason,
          dangerousOptions: values.dangerousOptions,
          superDangerousOptions: values.superDangerousOptions,
          updateDate: values.updateDate ? moment(values.updateDate).format('YYYY-MM-DD') : ''
        }
        updateProject(body).then(res => {
          if (res.data.status === 'OK') {
            form.resetFields();
            this.setState({ 
              updateProjectModalVisible: false,
              showProjectHistoryList: false
             });
            message.success("更新成功!")
            this.getProjectList()
          } else {
            this.setState({ 
              updateProjectModalVisible: false,
             });
             message.success(res.data.errorMsg)
          }
        })
      }
    });
  }
  handleCancel = _ => {
    this.setState({
      editProjectModalVisible: false,
      addProjectModalVisible: false,
      updateProjectModalVisible: false,
      showAddDeviceForm: false,
      showUpdateDeviceInfo: false,
      currentDevice: 'TOWER_CRANE'
    });
  };

  handleUpdateDevice = async (row) => {
    const result = await getDeviceSummary({projectId: row.id})
    if (result.data.status === 'OK') {
      let temp = []
      result.data.data.forEach(item => {
        const ele = {
          updateDate: item.updateDate,
          ...JSON.parse(item.summary)
        }
        temp.push(ele)
      })
      this.setState({
        showDeviceSummaryList: true,
        projectId: row.id,
        deviceSummaryList: temp
      })
    }
  }

  handleCompanyInfoCancel = () => {
    this.setState({
      showCompanyInfo: false,
      currentRowData: null
    })
  }

  handleProjectInfoCancel = () => {
    this.setState({
      showProjectInfo: false,
      currentRowData: null
    }) 
  }

  handleAddProject = (row) => {
    this.setState({
      addProjectModalVisible: true,
    });
  };
  checkProjectType = (typeCode) => {
    const temp = this.state.projectSelectOptions.find(item => {
        return item.value === typeCode
    })
    return temp.label
  }
  checkUsageType = (usageType) => {
    const temp = this.state.projectUsageOptions.find(item => {
        return item.value === usageType
    })
    return temp ? temp.label : ''
  }
  onDeviceChange = async (e) => {
    this.getDeviceTypeList(this.state.projectId, e.target.value)
  }
  getDeviceTypeList = async (id, type) => {
    const result = await getDeviceTypeList({projectId: id, type: type})
    if (result.data.status === 'OK') {
      let temp = []
      result.data.data.forEach(item => {
        const ele = {
          updateDate: item.updateDate,
          id: item.id,
          ...item.details
        }
        temp.push(ele)
      })
      this.setState({
        currentDevice: type,
        deviceInfoList: temp
      })
    }
  }
  handleDeviceDelete = async () => {
    const result = await getDeviceTypeList({projectId: this.state.projectId, type: this.state.currentDevice})
    if (result.data.status === 'OK') {
      let temp = []
      result.data.data.forEach(item => {
        const ele = {
          updateDate: item.updateDate,
          id: item.id,
          ...item.details
        }
        temp.push(ele)
      })
      this.setState({
        deviceInfoList: temp
      })
    }
  }
  openAddDevice = () => {
    this.setState({
      showAddDeviceForm: true
    })
  }
  handleDeviceDeleteByDate = async (msg) => {
    const result = await getDeviceSummary({projectId: this.state.projectId})
    if (result.data.status === 'OK') {
      let temp = []
      result.data.data.forEach(item => {
        const ele = {
          updateDate: item.updateDate,
          ...JSON.parse(item.summary)
        }
        temp.push(ele)
      })
      this.setState({
        showDeviceSummaryList: true,
        deviceSummaryList: temp
      })
    }
  }
  uploadVehicleImage = (data) => {
    let formData = new FormData()
    formData.append('type', 'FILE')
    formData.append('file', data.file)
    this.saveFile(formData, data)
  }
  saveFile = (formData, data) => {
    this.setState({
      uploading: true
    })
    axios.post('http://47.93.28.249:8181/admin/file/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(response => {
      if (response.data.status === 'OK') {
        data.onSuccess(response, data.file);
        message.success('上传成功')
        uploadProjects({file: response.data.data}).then(res => {
          console.log(res)
          this.getProjectList()
        })
        this.setState({
          uploading: false,
        })
      }
    })
  }
  confirmImport = () => {
    if (this.uploadRef.current) {
      this.uploadRef.current.click();
    }
  }
  handleEditPorjectHistory = (obj) => {

  }
  deleteHistoryFun = (row) => {
    const { id } = row
    deleteHistory({id: id}).then(res => {
      if (res.data.status === 'OK') {
        message.success('删除成功')
        this.getProjectHistory(this.state.currentProjectId)
      }
    })
  }
  componentDidMount() {
    this.getProjectList()
    this.getClientSelectOptions()
    this.getProjectOptions()
    this.getDepartmentList()
    this.getDangerousOptions()
    this.getSuperDangerousOptions()
  }
  render() {
    const { projects, searchKeyword } = this.state
    const title = (
      <div className="title flex">
        <div>
          <Input 
            style={inputLongStyle}
            value={searchKeyword} 
            placeholder="请输入关键字"
            onChange={(e) => { this.setState({searchKeyword: e.target.value}) }}
            prefix={<Icon style={{marginLeft: '4px'}} type="search" />}
            allowClear
            onPressEnter={
            (e) => {
              let body = this.state.projectBody
              body.keyword = e.target.value
              this.setState({
                projectBody: body
              })
              this.getProjectList()
            }
          } />
          &nbsp;
          <Select
            style={{
              width: 250,
            }}
            placeholder="项目类型"
            allowClear
            mode="multiple"
            onChange={this.handleProjectTypeChange}
          >
            {this.state.projectSelectOptions.map((item, index) => (
              <Option value={item.value} key={index}>{item.label}</Option>
            ))}
          </Select>
          &nbsp;
          &nbsp;
          <Select
            style={{
              width: 250,
            }}
            placeholder="委托方"
            allowClear
            labelInValue
            onChange={this.handleClientTypeChange}
          >
            {this.state.clientSelectOptions.map((item, index) => (
              <Option value={item.value} key={index}>{item.label}</Option>
            ))}
          </Select>
        </div>
        &nbsp;
        &nbsp;
        <div className="right">
        <Popconfirm placement="top" 
          title={this.renderConfirmContent()} 
          onConfirm={this.confirmImport} 
          okText="确定" cancelText="取消">
            <Button type="">
              <Icon type="download"></Icon>&nbsp;导入
            </Button>
        </Popconfirm>
          &nbsp;
          &nbsp;
          <Button onClick={() => {
            this.setState({
              openExport: true
            })
          }}>
            <div className="bolder">
              <Icon type="upload"></Icon>&nbsp;
              导出
            </div>
          </Button>
          &nbsp;
          &nbsp;
          <Button type='primary' onClick={this.handleAddProject}>
            <div className="bolder">
              <Icon type="plus"></Icon>&nbsp;
              添加
            </div>
          </Button>
          &nbsp;
          &nbsp;
          <Button type='primary' onClick={this.resetSearch}>
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
            onConfirm={this.multipDelete}
            okText="是"
            cancelText="否"
          >
            <Button type='danger'>
              <div className="bolder">
                <Icon type="delete"></Icon>&nbsp;
                批量删除
              </div>
            </Button>
          </Popconfirm>
        </div>
        <Upload
            name={'file'}
            maxCount={1}
            multiple={false}
            customRequest={this.uploadVehicleImage}
            showUploadList={false}
            accept=".xlsx"
          >
            <input
              ref={this.uploadRef}
              style={{ display: 'none' }}
            />
          </Upload>
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
                    selectProjects: selectedRows
                  })
                },
            }}
            dataSource={projects} 
            scroll={{x: 'max-content'}}
            pagination={true}>
            <Column fixed="left" width={135} title="项目名称" dataIndex="projectName" key="projectName" align="center"/>
            <Column title="项目类型" key="projectType" align="center" render={(text, row) => (
              <span>{this.checkProjectType(row.projectType)}</span>
            )}/>
            <Column title="用途类型" key="usageTypeName" align="center" dataIndex="usageTypeName"/>
            <Column title="单位集合" key="companyInfo" align="center" render={(text, row) => (
              <div className="link-btn" onClick={() => {
                  this.setState({
                      currentRowData: row,
                      showCompanyInfo: true
                  })
              }}>点击查看</div>
            )}/>
            <Column title="信息集合" key="projectDetails" align="center" render={(text, row) => (
              <div className="link-btn" onClick={() => {
                  this.setState({
                      currentRowData: row,
                      showProjectInfo: true
                  })
              }}>点击查看</div>
            )}/>
            <Column title="施工许可证号" key="constructionLicense" dataIndex="constructionLicense" align="center"/>
            <Column title="工程造价(万元)" dataIndex="projectCost" key="projectCost" align="center" />
            <Column title="最近一次检查时间" key="updateTime" align="center" render={(text, row) => (
              <span>
                {moment(row.updateTime ? row.updateTime : row.createTime).format('YYYY-MM-DD HH:mm:ss')}
              </span>
            )}/>
            <Column title="操作" fixed="right" key="action" width={580} align="center" render={(text, row) => (
              <span>
                <Button title="编辑" onClick={this.handleEditUser.bind(null,row)}>编辑</Button>
                <Divider type="vertical" />
                <Popconfirm
                    placement="topLeft"
                    title={'确定要删除该委托方吗？'}
                    onConfirm={this.handleDeleteProject.bind(null,row)}
                    okText="是"
                    cancelText="否"
                >
                    <Button title="删除">删除</Button>
                </Popconfirm>
                <Divider type="vertical" />
                <Button title="更新设备信息" onClick={this.handleUpdateDevice.bind(null,row)}>更新设备信息</Button>
                <Divider type="vertical" />
                <Button title="项目历史信息" onClick={this.getProjectHistory.bind(null,row.id)}>项目历史信息</Button>
                <Divider type="vertical" />
                <Button title="更新项目信息" onClick={this.handleUpdateProject.bind(null,row)}>更新项目信息</Button>
              </span>
            )}/>
          </Table>
        </Card>
        <CompanyModal visible={this.state.showCompanyInfo} currentRowData={this.state.currentRowData} onCancel={this.handleCompanyInfoCancel} />
        <InformationModal visible={this.state.showProjectInfo} currentRowData={this.state.currentRowData} onCancel={this.handleProjectInfoCancel}/>
        <EditProjectForm
          currentRowData={this.state.currentRowData}
          wrappedComponentRef={formRef => this.editContractFormRef = formRef}
          visible={this.state.editProjectModalVisible}
          onCancel={this.handleCancel}
          onOk={this.handleEditUserOk}
          departmentList={this.state.departmentList}
          clientSelectOptions={this.state.clientSelectOptions}
          projectSelectOptions={this.state.projectSelectOptions}
        />  
        <AddProjectForm
          wrappedComponentRef={formRef => this.addContractFormRef = formRef}
          visible={this.state.addProjectModalVisible}
          onCancel={this.handleCancel}
          onOk={this.handleAddProjectOk}
          departmentList={this.state.departmentList}
          clientSelectOptions={this.state.clientSelectOptions}
          projectSelectOptions={this.state.projectSelectOptions}
        />  
        <UpdateProjectInfo
          currentInfo={this.state.currentInfo}
          projectId={this.state.projectId}
          wrappedComponentRef={formRef => this.updateProjectFormRef = formRef}
          visible={this.state.updateProjectModalVisible}
          onCancel={this.handleCancel}
          onOk={this.handleUpdateProjectOk}
          dangerousOptions={this.state.dangerousOptions}
          superDangerousOptions={this.state.superDangerousOptions}
        /> 
        <Modal
          title="监督历史信息"
          visible={this.state.showProjectHistoryList}
          width={'60%'}
          footer={[<div key={'footer'}></div>]}
          onCancel={() => {
            this.setState({
              showProjectHistoryList: false
            })
          }}
          destroyOnClose>
            <Table
              bordered 
              dataSource={this.state.projectHistoryList}
              pagination={true}
              rowKey="id" >
              <Column fixed="left" title="序号" dataIndex="id" key="id" align="center"/>
              <Column title="更新时间" dataIndex="updateDate" key="updateDate" align="center"/>
              <Column title="项目详情" dataIndex="detail" key="detail" align="center"/>
              <Column title="形象进度" dataIndex="progress" key="progress" align="center"/>
              <Column title="危大工程" key="dangerText" dataIndex="dangerText" align="left" />
              <Column title="超危大工程" dataIndex="superDangerousText" key="superDangerousText" align="left" />
              <Column title="近一季度进展" dataIndex="progressThisSeason" key="progressThisSeason" align="center"/>
              <Column title="操作" fixed="right" key="action" width={180} align="center" render={(text, row) => (
              <span>
                <Button title="编辑" onClick={this.handleEditProjectHistory.bind(null,row)}>编辑</Button>
                <Divider type="vertical" />
                <Popconfirm
                    placement="topLeft"
                    title={'确定要删除该记录吗？'}
                    onConfirm={this.deleteHistoryFun.bind(null,row)}
                    okText="是"
                    cancelText="否"
                >
                    <Button title="删除">删除</Button>
                </Popconfirm>
              </span>
            )}/>
            </Table>
        </Modal> 
        <Modal
          title="更新设备信息"
          visible={this.state.showDeviceSummaryList}
          width={'80%'}
          destroyOnClose
          footer={[<div className="text-right" key={'footer'}>
            <Button title="取消" onClick={() => {
              this.setState({
                showDeviceSummaryList: false,
                projectId: '',
                showUpdateDeviceInfo: false,
                deviceSummaryList: []
              })
              this.handleCancel()
            }}>取消</Button>
            {!this.state.showUpdateDeviceInfo ? (
              <Button type="primary" title="更新" onClick={() => {
                this.getDeviceTypeList(this.state.projectId, this.state.currentDevice)
                setTimeout(() => {
                  this.setState({showUpdateDeviceInfo: true})
                }, 500);
              }}>更新</Button>
            ) : (<Button type="primary" title="确定">确定</Button>)}
          </div>]}
          onCancel={() => {
            this.setState({
              showDeviceSummaryList: false
            })
          }}>
            {!this.state.showUpdateDeviceInfo ? (
              <DeviceList 
                deviceList={this.state.deviceSummaryList} 
                deleteDeviceByDate={this.handleDeviceDeleteByDate}
                editProjectHistory={this.handleEditPorjectHistory} />
            ) : (
              <div className="container">
                <div className="flex" style={{marginBottom: '10px'}}>
                  <div className="tab-list">
                    <Radio.Group onChange={this.onDeviceChange} value={this.state.currentDevice}>
                      {generalInfo.deviceOptionsList.map(item => (
                        <Radio value={item.value} key={item.value}>{item.label}</Radio>
                      ))}
                    </Radio.Group>
                  </div>
                  <div className="add-device">
                    <Button onClick={this.openAddDevice} type="primary" title="添加">
                      <div className="bolder">
                        <Icon type="plus"></Icon>&nbsp;
                        添加
                      </div>
                    </Button>
                  </div>
                </div>
                <DeviceInfoList 
                  deviceInfoList={this.state.deviceInfoList}
                  deleteDevice={this.handleDeviceDelete} />
                <AddDeviceForm 
                  visible={this.state.showAddDeviceForm}
                  wrappedComponentRef={formRef => this.addDeviceForm = formRef}
                  onOk={this.handleAddDevice}
                  onCancel={() => {
                    this.setState({
                      showAddDeviceForm: false
                    })
                  }}
                  deviceTypeList={generalInfo.deviceOptionsList} 
                  currentType={this.state.currentDevice} />
              </div>
            )}
          </Modal>
          <Modal
          title="导出列表"
          visible={this.state.openExport}
          destroyOnClose
          footer={[<div className="text-right" key={'footer'}>
            <Button title="取消" onClick={() => {
              this.setState({
                openExport: false,
              })
            }}>取消</Button>
            <Button type="primary" title="确定" onClick={() => {
                this.setState({
                  openExport: false
                })
              }}>
              <a 
                href={`http://47.93.28.249:8181/admin/project/export?keyword=${this.state.searchKeyword}&projectTypes=${this.state.projectBody.projectTypes}&client=${this.state.projectBody.client}`}>确定</a>
            </Button>
          </div>]}
          onCancel={() => {
            this.setState({
              openExport: false
            })
          }}>
            是否继续导出项目列表？
          </Modal>
      </div>
    );
  }
}

export default Projects;
