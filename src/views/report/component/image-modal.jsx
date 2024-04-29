import React, { Component } from "react";
import { Card, Modal } from "antd";
import Cover from "./cover";
import FirstPart from "./first-part";

import constructureType_0 from '../images/constructureType_0.png'
class EditTemplatePage extends Component {
    state = {
    }


    componentDidMount() {

    }
  render() {
    const { currentImage, visible, onCancel } = this.props;
    return (
        <Modal
            visible={visible}
            onCancel={onCancel}
            width={'50%'}
            footer={[
                <div key={'footer'}></div>
            ]}
        >
            <img style={{width: '100%'}} src={currentImage} alt="" />
        </Modal>
    );
  }
}

export default EditTemplatePage;
