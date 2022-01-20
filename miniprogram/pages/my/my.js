// pages/my/my.js
import url from '../../utils/url.js'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
var app = getApp();
Page({
  data: {
    activeName: '1'
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '预约记录',
    });
    this.getMyRecord();
  },
  onShow: function () {
    this.getMyRecord();
  },
  getMyRecord() {
    wx.request({
      url: url.getMyRecord,
      method: "GET",
      data: {
        userId: wx.getStorageSync('userId')
      },
      success: res => {
        console.log(res)
        res.data.forEach(item=>{
          item.date = item.date.slice(5)
          item.time = this.timeFormat(item.time)
        })
        this.setData({
          myRecord: res.data
        })
      }
    })
  },
  onChange(event) {
    this.setData({
      activeName: event.detail,
    });
  },
  timeFormat(timeCount) {
    let bin = parseInt(timeCount).toString(2);
    let first = bin.length - 1 - bin.lastIndexOf("1");
    let last = bin.length - bin.indexOf("1");
    return this.getMapKey(first)+'-'+this.getMapKey(last);
    // app.globalData.timeMap.get(this.data.startTime);
  },
  getMapKey(value) {
    let timeMap = app.globalData.timeMap;
    let key = ''
    timeMap.forEach((v,k) => {
      if ( v == value) {
        key = k
      }
    })
    return key
  },
  cancelOrder(event){
    wx.request({
      url: url.cancelOrder,
      data:{
        id:event.currentTarget.dataset.id
      },
      success:res=>{
        console.log(res)
        if(res.data==1){
          Toast('预约已取消~');
          this.getMyRecord();
        }else{
          Toast('取消失败TAT');
        }
      }
    })
  }
})