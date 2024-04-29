import React, { Component } from "react";
import { getProjectUsageOptions } from '@/api/projects'
import { Form, Input, Modal, Select, Cascader } from "antd";
import '../style/projects.less'
import moment from 'moment'
const axios = require('axios');
const { Option } = Select;
const handleChange = (value) => {
  console.log(value);
}
const province = [
    { value: '110000', label: '北京' },
    { value: '120000', label: '天津' },
    { value: '130000', label: '河北省' },
    { value: '140000', label: '山西省' },
    { value: '150000', label: '内蒙古自治区' },
    { value: '210000', label: '辽宁省' },
    { value: '220000', label: '吉林省' },
    { value: '230000', label: '黑龙江省' },
    { value: '310000', label: '上海' },
    { value: '320000', label: '江苏省' },
    { value: '330000', label: '浙江省' },
    { value: '340000', label: '安徽省' },
    { value: '350000', label: '福建省' },
    { value: '360000', label: '江西省' },
    { value: '370000', label: '山东省' },
    { value: '410000', label: '河南省' },
    { value: '420000', label: '湖北省' },
    { value: '430000', label: '湖南省' },
    { value: '440000', label: '广东省' },
    { value: '450000', label: '广西壮族自治区' },
    { value: '460000', label: '海南省' },
    { value: '500000', label: '重庆' },
    { value: '510000', label: '四川省' },
    { value: '520000', label: '贵州省' },
    { value: '530000', label: '云南省' },
    { value: '540000', label: '西藏自治区' },
    { value: '610000', label: '陕西省' },
    { value: '620000', label: '甘肃省' },
    { value: '630000', label: '青海省' },
    { value: '640000', label: '宁夏回族自治区' },
    { value: '650000', label: '新疆维吾尔自治区' }     
]
class AddProjectForm extends Component {
  state = {
    projectUsageOptions: [],
    itemCode: moment().format('YYYYMMDDHHmmss'),
    cityList: [],
    districtList: []
  }
  getProjectUsageOptions = async (data) => {
    const res = await getProjectUsageOptions(data)
    if (res.data.status === 'OK') {
        console.log(res)
      let temp = []
      res.data.data.forEach((item) => {
        const ele = {
          value: item.code,
          label: item.name
        }
        temp.push(ele)
      })
      this.setState({
        projectUsageOptions: temp
      })
    }
  }
  handleProjectTypeChange = (value) => {
    this.getProjectUsageOptions({projectType: value.key})
  }
  handleProvinceChange = (value) => {
      const num = value.key
      axios.get(`https://gateway.yiruibim.com/scyjt/system/v1.0/area/find/subs/${num}`, {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        }
      }).then(res => {
          console.log(res)
          if (res && res.data.Data) {
              let temp = []
              res.data.Data.forEach(item => {
                  const ele = {
                      value: item.Id,
                      label: item.Name
                  }
                  temp.push(ele)
              })
              this.setState({
                  cityList: temp
              })
          }
      })
  }
  handleCityChange = (value) => {
    const num = value.key
    axios.get(`https://gateway.yiruibim.com/scyjt/system/v1.0/area/find/subs/${num}`, {
      headers: {
          'Content-Type': 'application/json;charset=UTF-8'
      }
    }).then(res => {
        if (res && res.data.Data) {
            let temp = []
            res.data.Data.forEach(item => {
                const ele = {
                    value: item.Name,
                    label: item.Name
                }
                temp.push(ele)
            })
            this.setState({
                districtList: temp
            })
        }
    })
  }
  componentDidMount() {

  }
  render() {
    const { visible, onCancel, onOk, form, departmentList, projectSelectOptions, clientSelectOptions } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        title="新增项目"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        width={'60%'}
        destroyOnClose
      >
        <Form
            labelCol={{ style: { width: '100%', height: '30px' } }} //label样式
            labelAlign="left" //label样式
        >
          <div className="grid grid-1-1">
            <div className="p-10">
                <Form.Item label="项目名称:">
                    {getFieldDecorator("projectName", {
                        rules: [{required: true, message: '请输入项目名称！'}],
                    })(<Input/>)}
                </Form.Item>
            </div>
            <div className="p-10">
                <Form.Item label="项目类型:">
                    {getFieldDecorator("projectType", {
                        rules: [{required: true, message: '请选择项目类型！'}],
                    })(
                    <Select
                        allowClear
                        labelInValue
                        onChange={this.handleProjectTypeChange}
                    >
                        {projectSelectOptions ? projectSelectOptions.map((item, index) => (
                            <Option value={item.value} key={item.value}>{item.label}</Option>
                        )) : []}
                    </Select>
                    )}
                </Form.Item>
            </div>
            <div className="p-10">
                <Form.Item label="用途类型:">
                    {getFieldDecorator("usageType", {
                        rules: [{required: true, message: '请选择项目类型！'}],
                    })(
                    <Select
                        allowClear
                        labelInValue
                        onChange={handleChange}
                    >
                        {this.state.projectUsageOptions.length !== 0 ? this.state.projectUsageOptions.map((item, index) => (
                            <Option value={item.value} key={item.value}>{item.label}</Option>
                        )) : null}
                    </Select>
                    )}
                </Form.Item>
            </div>
          </div>
          <div className="grid grid-1">
            <div className="p-10">
                <Form.Item label="部门:">
                    {getFieldDecorator("allDepartments", {
                    })(
                    <Cascader
                        options={departmentList ? departmentList : []}
                        expandTrigger="hover"
                        onChange={handleChange} />
                    )}
                </Form.Item>
            </div>
            <div className="p-10">
                <Form.Item label="委托方:">
                    {getFieldDecorator("clientId", {
                        rules: [{required: true, message: '请选择委托方！'}],
                    })(
                    <Select
                        allowClear
                        labelInValue
                        onChange={handleChange}
                    >
                        {clientSelectOptions.map((item, index) => (
                            <Option value={item.value} key={item.value}>{item.label}</Option>
                        ))}
                    </Select>
                    )}
                </Form.Item>
            </div>
          </div>
          <div className="grid grid-1-1">
            <div className="p-10">
                <Form.Item label="施工许可证号:">
                    {getFieldDecorator("constructionLicense", {
                    })(<Input placeholder="请输入施工许可证号" />)}
                </Form.Item>
            </div>
            <div className="p-10">
                <Form.Item label="项目编码:">
                    {getFieldDecorator("itemCode", {
                        initialValue: this.state.itemCode,
                    })(<Input disabled />)}
                </Form.Item>
            </div>
            <div className="p-10">
                <Form.Item label="所属分公司:">
                    {getFieldDecorator("branch", {
                    })(<Input placeholder="请输入所属分公司" />)}
                </Form.Item>
            </div>
          </div>
          <div className="grid grid-1-1">
            <div className="p-10">
                <Form.Item label="施工单位:">
                    {getFieldDecorator("buildCompany", {
                    })(<Input placeholder="施工单位" />)}
                </Form.Item>
            </div>
            <div className="p-10">
                <Form.Item label="项目经理:">
                    {getFieldDecorator("projectManager", {
                    })(<Input placeholder="项目经理" />)}
                </Form.Item>
            </div>
            <div className="p-10">
                <Form.Item label="手机号:">
                    {getFieldDecorator("managerPhoneNumber", {
                    })(<Input placeholder="手机号" />)}
                </Form.Item>
            </div>
          </div>
          <div className="grid grid-1-1">
            <div className="p-10">
                <Form.Item label="监理单位:">
                    {getFieldDecorator("supervisorCompany", {
                    })(<Input placeholder="监理单位" />)}
                </Form.Item>
            </div>
            <div className="p-10">
                <Form.Item label="总监:">
                    {getFieldDecorator("supervisor", {
                    })(<Input placeholder="总监" />)}
                </Form.Item>
            </div>
            <div className="p-10">
                <Form.Item label="手机号:">
                    {getFieldDecorator("supervisorPhoneNumber", {
                    })(<Input placeholder="手机号" />)}
                </Form.Item>
            </div>
          </div>
          <div className="grid grid-1-1">
            <div className="p-10">
                <Form.Item label="建设单位:">
                    {getFieldDecorator("constructionCompany", {
                    })(<Input placeholder="建设单位" />)}
                </Form.Item>
            </div>
            <div className="p-10">
                <Form.Item label="项目负责人:">
                    {getFieldDecorator("projectLeader", {
                    })(<Input placeholder="项目负责人" />)}
                </Form.Item>
            </div>
            <div className="p-10">
                <Form.Item label="手机号:">
                    {getFieldDecorator("leaderPhoneNumber", {
                    })(<Input placeholder="手机号" />)}
                </Form.Item>
            </div>
          </div>
          <div className="grid grid-1-1">
            <div className="p-10">
                <Form.Item label="省:">
                    {getFieldDecorator("province", {
                    })(
                    <Select
                        allowClear
                        labelInValue
                        onChange={this.handleProvinceChange}
                    >
                        {province.map((item, index) => (
                            <Option value={item.value} key={item.value}>{item.label}</Option>
                        ))}
                    </Select>
                    )}
                </Form.Item>       
            </div>
            <div className="p-10">
                <Form.Item label="市:">
                    {getFieldDecorator("city", {
                    })(
                    <Select
                        allowClear
                        labelInValue
                        onChange={this.handleCityChange}
                    >
                        {this.state.cityList.map((item, index) => (
                            <Option value={item.value} key={item.value}>{item.label}</Option>
                        ))}
                    </Select>
                    )}
                </Form.Item>
            </div>
            <div className="p-10">
                <Form.Item label="区:">
                {getFieldDecorator("district", {
                    })(
                    <Select
                        allowClear
                        labelInValue
                    >
                        {this.state.districtList.map((item, index) => (
                            <Option value={item.value} key={item.value}>{item.label}</Option>
                        ))}
                    </Select>
                    )}
                </Form.Item>
            </div>
          </div>
          <div className="grid grid-1">
            <div className="p-10">
                <Form.Item label="详细地址:">
                    {getFieldDecorator("address", {
                        })(<Input placeholder="详细地址" />)}
                </Form.Item>
            </div>
            <div className="p-10">
                <Form.Item label="工程造价:">
                    {getFieldDecorator("projectCost", {
                        })(<Input placeholder="工程造价" />)}
                </Form.Item>
            </div>
          </div>
        </Form>
      </Modal>
    );
  }
}

export default Form.create({ name: "AddProjectForm" })(AddProjectForm);
