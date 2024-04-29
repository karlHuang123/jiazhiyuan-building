import React, { Component } from "react";
import { Modal } from "antd";
import '../style/projects.less'

class InformationModal extends Component {

  render() {
    const { visible, onCancel, currentRowData } = this.props;
    return (
      <Modal
        title="单位集合"
        visible={visible}
        onCancel={onCancel}
        footer={
            [
                <div key={'footer'}></div>
            ]
        }
        destroyOnClose
      >
          <div className="list-style">
              <div className="grid bottom-line list-item">
                  <div className="right-line text-center">项目名称</div>
                  <div className="text-center">{currentRowData && currentRowData.projectName ? currentRowData.projectName: '暂未录入'}</div>
              </div>
              <div className="grid bottom-line list-item">
                  <div className="right-line text-center">项目编码</div>
                  <div className="text-center">{currentRowData && currentRowData.itemCode ? currentRowData.itemCode: '暂未录入'}</div>
              </div>
              <div className="grid bottom-line list-item">
                  <div className="right-line text-center">详细地址</div>
                  <div className="text-center">{currentRowData && currentRowData.address ? currentRowData.address: '暂未录入'}</div>
              </div>
              <div className="grid list-item">
                  <div className="right-line text-center">检查部门</div>
                  <div className="text-center">{currentRowData && currentRowData.checkDept ? currentRowData.checkDept: '暂未录入'}</div>
              </div>
          </div>
      </Modal>
    );
  }
}

export default InformationModal;
