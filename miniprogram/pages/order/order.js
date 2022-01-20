// pages/order/order.js
import color from '../../utils/styleConst.js'
import url from '../../utils/url.js'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

var app = getApp()
Page({
  data: {
    filter(type, options) {
      if (type === 'minute') {
        return options.filter((option) => option % 30 === 0);
      }
      return options;
    },
    orderMsg:{},
    userName:'',
    userId:''
  },
  onLoad: function (options) {
    let roomMsg = wx.getStorageSync('roomMsg')
    let date = wx.getStorageSync('date')
    let dateTarget = 'orderMsg.date'
    if(wx.getStorageSync('userName')&&wx.getStorageSync('userId')){
      this.setData({
        userName:wx.getStorageSync('userName'),
        userId:wx.getStorageSync('userId')
      })
    }
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
    wx.setStorageSync('date', date)
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
  getUserName(event){
    console.log(event.detail)
    this.setData({
      userName:event.detail
    })
  },
  getUserId(event){
    console.log(event.detail)
    this.setData({
      userId:event.detail
    })
  },
  order(){
    let orderMsg = this.data.orderMsg;
    let sTime = app.globalData.timeMap.get(this.data.startTime);
    let eTime = app.globalData.timeMap.get(this.data.endTime);
    wx.setStorageSync('userId', this.data.userId)
    wx.setStorageSync('userName', this.data.userName)
    orderMsg.nickName = this.data.userName;
    orderMsg.userId = this.data.userId;
    orderMsg.date = this.data.date;
    orderMsg.time = Math.pow(2,eTime) - Math.pow(2,sTime);
    orderMsg.id = parseInt(this.data.roomMsg.room_id);
    console.log(orderMsg)
    if(orderMsg.time>0){
      wx.request({
        url: url.orderMeeting,
        method: "POST",
        header:{'Content-Type': 'application/x-www-form-urlencoded'},
        data:orderMsg,
        success:res=>{
          console.log(res)
          if(res.data==1){
            Toast('预约成功啦,跳转中~');
            setTimeout(()=>{
              wx.switchTab({
                url: '../index/index',
                success(res){
                  let page = getCurrentPages().pop();
                  if(page == undefined || page == null){
                        return
                  }
                  page.onLoad();
            }
              })
            },2000)
            
          }else if(res.data==2){
            Toast('该时段已被预约，请选择其他时间~');
          }
        }
      })
    }else{
      Toast('结束时间须晚于开始时间！');
    }
    
  }
})