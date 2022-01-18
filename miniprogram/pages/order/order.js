// pages/order/order.js
import color from '../../utils/styleConst.js'
import url from '../../utils/url.js'
var app = getApp()
Page({
  data: {
    filter(type, options) {
      if (type === 'minute') {
        return options.filter((option) => option % 30 === 0);
      }
      return options;
    },
    orderMsg:{}
  },
  onLoad: function (options) {
    let roomMsg = wx.getStorageSync('roomMsg')
    let date = wx.getStorageSync('date')
    let dateTarget = 'orderMsg.date'
    this.setData({
      color,
      roomMsg,
      date,
      showCal: false,
      [dateTarget]:date
    })
    wx.setNavigationBarTitle({
      title: roomMsg.room_name
    })
  },
  // calendar
  showCalender() {
    this.setData({ showCal: true });
  },
  closeCalender() {
    this.setData({ showCal: false });
  },
  formatDate(date) {
    date = new Date(date);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  },
  confirmDate(event) {
    let date = this.formatDate(event.detail)
    this.setData({
      showCal: false,
      date,
    });
    
  },
  //startTime
  showStartTime(){
    this.setData({
      showStartTime:true
    })
  },
  chooseStartTime(event) {
    this.setData({
      startTime: event.detail,
    });
    console.log(app.globalData.timeMap.get(event.detail));
    this.closeStartTime();
  },
  closeStartTime(){
    this.setData({
      showStartTime:false
    })
  },
  //endTime
  showEndTime(){
    this.setData({
      showEndTime:true
    })
  },
  chooseEndTime(event) {
    this.setData({
      endTime: event.detail,
    });
    this.closeEndTime()
    console.log(typeof(event.detail))
  },
  closeEndTime(){
    this.setData({
      showEndTime:false
    })
  },
  //预约
  order(){
    console.log(this.data.orderMsg)
  }
})