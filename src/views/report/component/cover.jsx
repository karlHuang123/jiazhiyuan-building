import React, { Component } from "react";
import { Input, Modal, Button, Checkbox, message, Upload, Icon } from "antd";
import { generalData } from "../static/general";
import '../style/report.less'

const axios = require('axios');
function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
class Cover extends Component {
    state = {
        headerSelection: ['companyName', 'companyLogo'],
        mainSelection: [],
        fileList: [],
        previewVisible: false,
        previewImage: '',
        companyNameStr: '',
        indeterminate: true,
        checkAll: false,
        logoUrl: ''
    }

    handleTabChange = (key) => {
        console.log(key)
    }

    handleHeaderSelect = (value) => {
        this.setState({
            headerSelection: value
        }, () => {
            const temp = this.state.headerSelection.filter(item => {
                return item === 'companyLogo'
            })
            if (temp.length === 0) {
                this.setState({
                    logoUrl: ''
                }, () => {
                  this.outPutCover()
                })
            }
        })
    }

    handleMainChange = (value) => {
      this.setState({
        mainSelection: value,
        indeterminate: !!value.length && value.length < generalData.mainOptions.length,
        checkAll: value.length === generalData.mainOptions.length,
      }, () => {
        this.outPutCover()
      });
    }

    onCheckAllChange = e => {
      let temp = []
      if (e.target.checked) {
        generalData.mainOptions.forEach(item => {
          temp.push(item.value)
        })
      }
      this.setState({
        mainSelection: temp,
        indeterminate: false,
        checkAll: e.target.checked,
      }, () => {
        this.outPutCover()
      });
    };

    uploadLogo = (data) => {
        let formData = new FormData()
        formData.append('type', 'IMAGE')
        formData.append('file', data.file)
        this.saveFile(formData, data)
      }

      checkFileSize = (file) => {
        return new Promise((resolve, reject) => {
          // 使用promise不会进入upload的change事件
          const isLt10M = file.size / 1024 / 1024 < 10
          if (!isLt10M) {
            message.error('合同文件大小不能超过10M。')
            return reject(false)
          }
          return resolve(true)
        })
      }

      handlePreview = async file => {
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj);
        }
    
        this.setState({
          previewImage: file.url || file.preview,
          previewVisible: true,
        });
      };

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
            this.setState({
              uploading: false,
              logoUrl: response.data.data
            }, () => {
              this.outPutCover()
            })
          }
        }).catch(error => {
        //   message.error('上传失败')
        });
      }
      handleRemoveImage = () => {
        this.setState({
            logoUrl: ''
        })
      }

      outPutCover = () => {
        let header = {}
        this.state.headerSelection.forEach(item => {
          header[item] = true
        })
        header.companyLogoImg = this.state.logoUrl
        let main = {}
        this.state.mainSelection.forEach(item => {
          main[item] = true
        })
        main.companyNameStr = this.state.companyNameStr
        this.props.outPutCover({
          header,
          main
        })
      }

    componentDidMount() {
      this.onCheckAllChange({
        target: {
          checked: true
        }
      })
    }
  render() {
    const { currentId } = this.props;
    return (
        <div className="">
            <div className="header-section">
                <h2 className="bg-light-grey p-5">页眉</h2>
                <Checkbox.Group 
                    options={generalData.headerOptions} 
                    defaultValue={['companyName', 'companyLogo']} 
                    onChange={this.handleHeaderSelect} />
                <Upload 
                    disabled={this.state.uploading}
                    name={'file'}
                    listType={'picture'}
                    maxCount={1}
                    multiple={false}
                    customRequest={this.uploadLogo}
                    onRemove={this.handleRemoveImage}
                    beforeUpload={this.checkFileSize}
                    onPreview={this.handlePreview}
                    accept=".png,.jpeg,.jpg"
                >
                    <Button disabled={this.state.fileList.length >= 1}>
                        <Icon type="upload"/>
                        上传公司Logo
                    </Button>
                </Upload>
            </div>
            <div className="main-section mt-40">
                <h2 className="bg-light-grey p-5">主页</h2>
                <div>
                  <Checkbox
                    indeterminate={this.state.indeterminate}
                    onChange={this.onCheckAllChange}
                    checked={this.state.checkAll}
                  >
                    全选
                  </Checkbox>
                </div>
                <div className="flex mt-20">
                  <Checkbox.Group
                    options={generalData.mainOptions}
                    value={this.state.mainSelection}
                    onChange={this.handleMainChange}
                  />
                  <Input 
                    value={this.state.companyNameStr} 
                    onChange={(e) => {
                      this.setState({companyNameStr: e.target.value}, () => {
                        this.outPutCover()
                      })
                    }} 
                    style={{width: '200px'}} />
                </div>
            </div>
            <Modal visible={this.state.previewVisible} footer={null} onCancel={() => {this.setState({previewVisible: false})}}>
             <img alt="example" style={{ width: '100%' }} src={this.state.previewImage} />
            </Modal>
        </div>
    );
  }
}

export default Cover;
