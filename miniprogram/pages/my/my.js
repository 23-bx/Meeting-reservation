// pages/my/my.js
import url from '../../utils/url.js'
Page({
  data: {
    activeName:'1'
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '预约记录',
    })
    this.getMyRecord();
  },
  getMyRecord(){
    wx.request({
      url: url.getMyRecord,
      method:"GET",
      data:{
        userId:wx.getStorageSync('userId')
      },
      success:res=>{
        console.log(res)
        this.setData({
          myRecord:res.data
        })
      }
    })
  },
  onChange(event) {
    console.log(event.detail)
    this.setData({
      activeName: event.detail,
    });
  },
})