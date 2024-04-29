import React, { Component } from "react";
import { Modal } from "antd";
import '../style/projects.less'

class CompanyModal extends Component {
  state = {

  }

  render() {
    const { visible, onCancel, currentRowData } = this.props;
    return (
      <Modal
        title="单位集合"
        visible={visible}
        onCancel={onCancel}
        width={'50%'}
        footer={
            [
                <div key={'footer'}></div>
            ]
        }
        destroyOnClose
      >
          <div className="grid grid-1-1">
              <div className="grid-item">
                <span>施工单位：</span>
                <span>{currentRowData && currentRowData.buildCompany ? currentRowData.buildCompany : '暂未录入'}</span>
              </div>
              <div className="grid-item">
                <span>项目负责人：</span>
                <span>{currentRowData && currentRowData.projectManager ? currentRowData.projectManager : '暂未录入'}</span>     
              </div>
              <div className="grid-item">
                <span>联系方式：</span>
                <span>{currentRowData && currentRowData.managerPhoneNumber ? currentRowData.managerPhoneNumber : '暂未录入'}</span>     
              </div>
              <div className="grid-item">
                <span>监工单位：</span>
                <span>{currentRowData && currentRowData.supervisorCompany ? currentRowData.supervisorCompany : '暂未录入'}</span>
              </div>
              <div className="grid-item">
                <span>总监：</span>
                <span>{currentRowData && currentRowData.supervisor ? currentRowData.supervisor : '暂未录入'}</span>     
              </div>
              <div className="grid-item">
                <span>联系方式：</span>
                <span>{currentRowData && currentRowData.supervisorPhoneNumber ? currentRowData.supervisorPhoneNumber : '暂未录入'}</span>     
              </div>
              <div className="grid-item">
                <span>建设单位：</span>
                <span>{currentRowData && currentRowData.constructionCompany ? currentRowData.constructionCompany : '暂未录入'}</span>
              </div>
              <div className="grid-item">
                <span>项目负责人：</span>
                <span>{currentRowData && currentRowData.projectLeader ? currentRowData.projectLeader : '暂未录入'}</span>     
              </div>
              <div className="grid-item">
                <span>联系方式：</span>
                <span>{currentRowData && currentRowData.leaderPhoneNumber ? currentRowData.leaderPhoneNumber : '暂未录入'}</span>     
              </div>
          </div>
      </Modal>
    );
  }
}

export default CompanyModal;
