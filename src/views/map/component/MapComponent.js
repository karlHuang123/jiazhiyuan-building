import React, { Component } from 'react';
import AMapLoader from '@amap/amap-jsapi-loader';
import LineChart from './LineChart';
import { Modal } from "antd";

window._AMapSecurityConfig = {
  securityJsCode:'ba4138d0c0efb13d1d5fd10df08bb0d1',
}
// const geocoder = new AMap.Geocoder({
//   apiKey: '62d95204ea3dfb3061cd678bd8e40995'
// });
class  MapComponent extends Component{
  state = {
    map: null,
    lng: null,
    lat: null,
    markers: [],
    chartOptions: null
  }

  fetchGeocodingData = () => {
    AMapLoader.load({
      key: '1c53e2a2bb2218895e9a9f672df36840',
      version: '1.4.15',
      plugins: ['AMap.Geocoder', 'AMap.Marker']
    }).then((AMap) => {
      const map = new AMap.Map('mapcontainer', {
        center: [116.397428, 39.90923],
        zoom: 4,
        resizeEnable: true
      });
      const geocoder = new AMap.Geocoder();
      this.props.addresses.forEach(address => {
        if (address) {
          const that = this
          geocoder.getLocation(address.address, function(status, result) {
            if (status === 'complete' && result.geocodes.length > 0) {
              let marker = new AMap.Marker({
                position: result.geocodes[0].location,
                offset: new AMap.Pixel(-13, -30),
                extData: { id: address.id }
              });
              marker.on('click', (event) => {
                that.handleMarkerClick(event)
              })
              marker.setMap(map)
            }
          })
        }
      });
      this.setState({
        map: map
      })
    });
  }
  handleMarkerClick = (event) => {
    const clickMarker = event.target
    const { id } = clickMarker.getExtData()
    const clickPoint = this.props.projectDetailsList.filter(item => {
      return item.id === id
    })[0]
    this.setState({
      currentLocation: clickPoint,
      openDetails: true
    })
  };
  // 2.dom渲染成功后进行map对象的创建
  componentDidMount(){
    AMapLoader.load({
      key: "1c53e2a2bb2218895e9a9f672df36840",                     // 申请好的Web端开发者Key，首次调用 load 时必填
      // version:"2.0",              // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins:[''],               // 需要使用的的插件列表，如比例尺'AMap.Scale'等
    }).then((AMap)=>{
      const map = new AMap.Map("mapcontainer",{ //设置地图容器id
        viewMode:"3D",         //是否为3D地图模式
        zoom: 8,                //初始化地图级别
        center:[105.602725,37.076636], //初始化地图中心点位置
      });
      this.setState({
        map: map
      })
    }).catch(e=>{
      console.log(e);
    })
  }
  componentDidUpdate(prevProps) {
    let map = this.state.map
    if (JSON.stringify(this.props.addresses) !== JSON.stringify(prevProps.addresses)) {
      if (JSON.stringify(this.props.addresses) !== '[]') {
        // map.setCenter([this.props.lng, this.props.lat])
        // this.setState({
        //   map: map
        // })
        this.fetchGeocodingData()
      }
    }
  }
  render(){
      // 1.初始化创建地图容器,div标签作为地图容器，同时为该div指定id属性；
      return (
        <div>
          <div id="mapcontainer" style={{height: '800px' }}></div>
          <Modal
            visible={this.state.openDetails}
            onCancel={() => this.setState({openDetails: false})}
            footer={[
              <div key={'footer'}></div>
            ]}
            width={'50%'}
            title="项目基本信息"
          >
            <div>项目信息：{this.state.currentLocation?.address}</div>
            <div>项目类型：{this.state.currentLocation?.projectTypeName}</div>
            <div>施工单位：{this.state.currentLocation?.buildCompany}</div>
            <div>建设单位：{this.state.currentLocation?.constructionCompany}</div>
            <div>监理单位：{this.state.currentLocation?.supervisorCompany}</div>
            <div>
              <div><strong>项目评分趋势</strong></div>
              <LineChart data={this.state.currentLocation?.scoreTrends} />
            </div>
          </Modal>
        </div>
    );
  }
}
//导出地图组建类
export default MapComponent;