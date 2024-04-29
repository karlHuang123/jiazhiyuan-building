import React, { Component } from "react";
import { Card, Typography, Radio, Button, message } from "antd";
import { edieTemplateStyle } from "@/api/report";
// import Cover from "./cover";
// import FirstPart from "./first-part";
import ImageModal from "./image-modal"
import '../style/report.less'
// 模版样式文件
import constructureType_0 from '../images/constructureType_0.png'
import constructureType_1 from '../images/constructureType_1.png'
import checkStatus_0 from '../images/checkStatus_0.png'
import checkStatus_1 from '../images/checkStatus_1.png'
import safety_0 from '../images/safety_0.png'
import safety_1 from '../images/safety_1.png'
import management_0 from '../images/management_0.png'
import management_1 from '../images/management_1.png'
import problems_0 from '../images/problems_0.png'
import problems_1 from '../images/problems_1.png'

const { Title } = Typography;
class EditTemplatePage extends Component {
    state = {
        modelStyle: {
            "工程概况样式": null,
            "检查综合评价情况样式": null,
            "安全文明评估结果": null,
            "管理行为评估结果": null,
            "问题汇总表": null
        },
        currentImage: null,
        showImage: false
    }

    onSelect = (e, str) => {
        let temp = this.state.modelStyle
        temp[str] = e.target.value
        this.setState({
            modelStyle: temp
        })
    }

    onSubmitTemplate = () => {
        edieTemplateStyle({
            templateId: this.props.currentRowData.id,
            templateConfig: {
                "工程概况样式": this.state.modelStyle['工程概况样式'] ? this.state.modelStyle['工程概况样式'] : this.props.currentConfig['工程概况样式'],
                "检查综合评价情况样式": this.state.modelStyle['检查综合评价情况样式'] ? this.state.modelStyle['检查综合评价情况样式'] : this.props.currentConfig['检查综合评价情况样式'],
                "安全文明评估结果": this.state.modelStyle['安全文明评估结果'] ? this.state.modelStyle['安全文明评估结果'] : this.props.currentConfig['安全文明评估结果'],
                "管理行为评估结果": this.state.modelStyle['管理行为评估结果'] ? this.state.modelStyle['管理行为评估结果'] : this.props.currentConfig['管理行为评估结果'],
                "问题汇总表": this.state.modelStyle['问题汇总表'] ? this.state.modelStyle['问题汇总表'] : this.props.currentConfig['问题汇总表'] 
            }
        }).then(res => {
            if (res.data.status === 'OK') {
                message.success('模版编辑成功')
                this.props.onCancel('success')
            } else {
                message.error(res.data.errorMsg)
            }
        })
    }

    handleImageClick = (str) => {
        this.setState({
            currentImage: str,
            showImage: true
        })
    }
  render() {
    const { currentRowData, currentConfig } = this.props;
    return (
        <div className="">
            <Card>
                <div className="model-container">
                    {/* <Tabs defaultActiveKey="1" onChange={this.handleTabChange}>
                        <TabPane tab="封面" key="1">
                            <Cover outPutCover={this.handleCover} />
                        </TabPane>
                        <TabPane tab="第一部分" key="2">
                            <FirstPart />
                        </TabPane>
                        <TabPane tab="第二部份" key="3">
                        Content of Tab Pane 3
                        </TabPane>
                        <TabPane tab="第三部份" key="4">
                        Content of Tab Pane 3
                        </TabPane>
                    </Tabs> */}
                    <Title level={2}>报告名称：{currentRowData.templateName}</Title>
                    <div className="model-edit">
                        <Title level={4}>工程概况样式:</Title>
                        <div className="mb-10">
                            <Radio.Group onChange={(e) => this.onSelect(e, '工程概况样式')} defaultValue={currentConfig['工程概况样式']}>
                                <Radio value={0}>版式一</Radio>
                                <img src={constructureType_0} onClick={this.handleImageClick.bind(null, constructureType_0)} className="images" alt="" />
                                <Radio value={1}>版式二</Radio>
                                <img src={constructureType_1} onClick={this.handleImageClick.bind(null, constructureType_1)} className="images" alt="" />
                            </Radio.Group>
                        </div>
                        <Title className="mt-20" level={4}>检查综合评价情况样式:</Title>
                        <div className="mb-10">
                            <Radio.Group onChange={(e) => this.onSelect(e, '检查综合评价情况样式')} defaultValue={currentConfig['检查综合评价情况样式']}>
                                <Radio value={0}>版式一</Radio>
                                <img src={checkStatus_0} onClick={this.handleImageClick.bind(null, checkStatus_0)} className="images" alt="" />
                                <Radio value={1}>版式二</Radio>
                                <img src={checkStatus_1} onClick={this.handleImageClick.bind(null, checkStatus_1)} className="images" alt="" />
                            </Radio.Group>
                        </div>
                        <Title className="mt-20" level={4}>安全文明评估结果:</Title>
                        <div className="mb-10">
                            <Radio.Group onChange={(e) => this.onSelect(e, '安全文明评估结果')} defaultValue={currentConfig['安全文明评估结果']}>
                                <Radio value={0}>版式一</Radio>
                                <img src={safety_0} onClick={this.handleImageClick.bind(null, safety_0)} className="images" alt="" />
                                <Radio value={1}>版式二</Radio>
                                <img src={safety_1} onClick={this.handleImageClick.bind(null, safety_1)} className="images" alt="" />
                            </Radio.Group>
                        </div>
                        <Title className="mt-20" level={4}>管理行为评估结果:</Title>
                        <div className="mb-10">
                            <Radio.Group onChange={(e) => this.onSelect(e, '管理行为评估结果')} defaultValue={currentConfig['管理行为评估结果']}>
                                <Radio value={0}>版式一</Radio>
                                <img src={management_0} onClick={this.handleImageClick.bind(null, management_0)} className="images" alt="" />
                                <Radio value={1}>版式二</Radio>
                                <img src={management_1} onClick={this.handleImageClick.bind(null, management_1)} className="images" alt="" />
                            </Radio.Group>
                        </div>
                        <Title className="mt-20" level={4}>问题汇总表:</Title>
                        <div className="mb-10">
                            <Radio.Group onChange={(e) => this.onSelect(e, '问题汇总表')} defaultValue={currentConfig['问题汇总表']}>
                                <Radio value={0}>版式一</Radio>
                                <img src={problems_0} onClick={this.handleImageClick.bind(null, problems_0)} className="images" alt="" />
                                <Radio value={1}>版式二</Radio>
                                <img src={problems_1} onClick={this.handleImageClick.bind(null, problems_1)} className="images" alt="" />
                            </Radio.Group>
                        </div>
                    </div>
                    <div className="text-center">
                        <Button type="primary" onClick={this.onSubmitTemplate}>提交</Button>&nbsp;&nbsp;&nbsp;
                        <Button onClick={() => this.props.onCancel('')}>取消</Button>
                    </div>
                </div>
            </Card>
            <ImageModal
                visible={this.state.showImage}
                onCancel={() => {this.setState({showImage: false})}}
                currentImage={this.state.currentImage}
             />
        </div>
    );
  }
}

export default EditTemplatePage;
