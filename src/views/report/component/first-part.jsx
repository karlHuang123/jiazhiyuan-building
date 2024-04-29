import React, { Component } from "react";
import { Input, Modal, Radio } from "antd";
import '../style/report.less'

class FirstPart extends Component {
    state = {
        defaultFirstPartName: '专项检查评估情况综述',
        firstPartName: '专项检查评估情况综述',
        firstPartNameDisable: true,
        defaultConstructure: '工程概况',
        constructure: '工程概况',
        constructureDisable: true
    }

    handleTabChange = (key) => {
        console.log(key)
    }

    handleEdit = (anchor) => {
        if (anchor === 'edit') {
            this.setState({
                firstPartNameDisable: false
            })
        } else {
            this.setState({
                firstPartNameDisable: true,
                firstPartName: this.state.defaultFirstPartName
            })  
        }
    }

    handleConstructure = (anchor) => {
        if (anchor === 'edit') {
            this.setState({
                constructureDisable: false
            })
        } else {
            this.setState({
                constructureDisable: true,
                constructure: this.state.defaultConstructure
            })  
        }
    }

    componentDidMount() {

    }
  render() {
    return (
        <div className="">
            <div className="text-center flex align-center middle">
                <strong>第一部分：</strong>
                <Input 
                    style={{width: '250px'}} 
                    onChange={(e) => {
                        this.setState({
                            firstPartName: e.target.value
                        })
                    }}
                    value={this.state.firstPartName}
                    disabled={this.state.firstPartNameDisable} />
                {this.state.firstPartNameDisable ? (
                    <div className="edit" onClick={this.handleEdit.bind(null, 'edit')}>【修改】</div>
                ) : (
                    <div className="edit" onClick={this.handleEdit.bind(null, 'cancel')}>【取消】</div>
                )}
            </div>
            <div className="">
                <div className="text-center flex align-center bg-light-grey mt-20 p-5">
                    <strong>一、</strong>
                    <Input 
                        style={{width: '250px'}} 
                        onChange={(e) => {
                            this.setState({
                                constructure: e.target.value
                            })
                        }}
                        value={this.state.constructure}
                        disabled={this.state.constructureDisable} />
                    {this.state.constructureDisable ? (
                        <div className="edit" onClick={this.handleConstructure.bind(null, 'edit')}>【修改】</div>
                    ) : (
                        <div className="edit" onClick={this.handleConstructure.bind(null, 'cancel')}>【取消】</div>
                    )}
                </div>
                <div className="mt-20">
                    <Radio.Group name="radiogroup">
                        <Radio value={'formatOne'}>A</Radio>
                        <Radio value={'formatTwo'}>B</Radio>
                        <Radio value={3}>C</Radio>
                        <Radio value={4}>D</Radio>
                    </Radio.Group>
                </div>
            </div>
        </div>
    );
  }
}

export default FirstPart;
