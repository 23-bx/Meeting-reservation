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
    console.log(roomMsg.record)
    this.setData({
      record : roomMsg.record.split("")
    })
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
      [dateTarget]:date,
      newTimeLine:[]
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
  chooseTime(e){
    let index = e.currentTarget.dataset.index;
    let newTimeLine = this.data.newTimeLine;
    let recordValue = this.data.record[index];
    let target = `record[${index}]`
    if(this.data.record[index]==='1'){
      Toast('该时间已经被预约啦！');
    }else if(newTimeLine[index]=='1'){
      newTimeLine[index] = '0'
      recordValue = '0'
    }else{
      newTimeLine[index] = '1'
      recordValue = '2'
    }
    this.setData({
      newTimeLine,
      [target]:recordValue
    })
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
  },
  closeEndTime(){
    this.setData({
      showEndTime:false
    })
  },
  //预约
  getUserName(event){
    this.setData({
      userName:event.detail
    })
  },
  getUserId(event){
    this.setData({
      userId:event.detail
    })
  },
  order(){
    let orderMsg = this.data.orderMsg;
    let newTimeLine = this.data.newTimeLine;
    // let sTime = app.globalData.timeMap.get(this.data.startTime);
    // let eTime = app.globalData.timeMap.get(this.data.endTime);
    wx.setStorageSync('userId', this.data.userId)
    wx.setStorageSync('userName', this.data.userName)
    console.log(this.checkArr(newTimeLine))
    if(!this.checkArr(newTimeLine)){
      Toast('只能选择连续的时间段哦！');
      return false
    }
    orderMsg.nickName = this.data.userName;
    orderMsg.userId = this.data.userId;
    orderMsg.date = this.data.date;
    orderMsg.id = parseInt(this.data.roomMsg.room_id);
    if(newTimeLine){
      let timeCount = 0
      console.log(newTimeLine)
      for(let i=0;i<newTimeLine.length;i++){
        if(newTimeLine[i]=='1'){
          console.log(newTimeLine.length-i)
          timeCount+=Math.pow(2,i)
        }
      }
      orderMsg.time = timeCount;
      console.log(timeCount)
      wx.request({
        url: url.orderMeeting,
        method: "POST",
        header:{'Content-Type': 'application/x-www-form-urlencoded'},
        data:orderMsg,
        success:res=>{
          console.log(res)
          if(res.data==1){
            Toast('预约成功啦,跳转中~');
            wx.setStorageSync('changeDate', 1)
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
            },1000)
          }else if(res.data==2){
            Toast('该时段已被预约，请选择其他时间~');
          }
        }
      })
    }else{
      Toast('还没有选择预约时间哦！');
    }
  },
  checkArr(arr){
    let first = arr.indexOf('1');
    let last = arr.lastIndexOf('1');
    for(let i=first;i<last;i++){
      if(!arr[i]){
        return false
      }
    }
    return true
  }
})