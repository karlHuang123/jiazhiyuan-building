import React, { Component } from "react";
import { Form, Input, Table } from "antd";

const { Column } = Table;
class ReviewInfo extends Component {
  state = {

  }
  render() {
    const { currentTaskData, currentTitle } = this.props;
    return (
        <div className="task-container">
            {currentTaskData ? (
                <div>
                    <h1 className="text-center mb-10">{currentTitle}</h1>
                    <div className="mb-30">
                        <strong>复查时间：{currentTaskData ? currentTaskData.reviewDate : ''}</strong>
                    </div>
                    <div className="mb-30">
                        <div className="mb-10"><strong>复查问题：</strong></div>
                        {currentTaskData ? (
                                <div className="grid grid-5">
                                    {currentTaskData.reviewProblems.map((item, index) => (
                                        <div key={item.id}>{item}</div>
                                    ))}
                                </div>
                            ) : (<span></span>)}
                    </div>
                    <div className="mb-30">
                        <strong>集合地点：{currentTaskData ? currentTaskData.assemblePlace : ''}</strong>
                    </div>
                    <div className="mb-30">
                        <div className="mb-10"><strong>组长：</strong></div>
                        {currentTaskData ? (
                                <div className="grid grid-5">
                                    {currentTaskData.groupLeaders.map((item, index) => (
                                        <div key={item.id}>{item.username}</div>
                                    ))}
                                </div>
                            ) : (<span></span>)}
                    </div>
                    <div className="mb-30">
                        <div className="mb-10"><strong>组员：</strong></div>
                        {currentTaskData ? (
                                <div className="grid grid-5">
                                    {currentTaskData.groupMembers.map((item, index) => (
                                        <div key={item.id}>{item.username}</div>
                                    ))}
                                </div>
                            ) : (<span></span>)}
                    </div>
                    <div className="mb-30">
                        <div className="mb-30"><strong>司机信息：</strong></div>
                        {currentTaskData ? (
                            <Table 
                                bordered 
                                rowKey="id" 
                                pagination={false}
                                dataSource={currentTaskData.useCarInfos} >
                                <Column title="司机姓名" dataIndex="driver_name" key="driver_name" align="center"/>
                                <Column title="车牌号" dataIndex="license_no" key="license_no" align="center"/>
                                <Column title="车型" dataIndex="model" key="model" align="center"/>
                            </Table>
                            ) : (<span></span>)}
                    </div>
                </div>
            ) : (<span></span>)}
        </div>
    );
  }
}

export default ReviewInfo;
