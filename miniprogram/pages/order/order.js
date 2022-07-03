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
    userId:'',
    orderTarget:[],
    btnClicked:false
  },
  onLoad: function (options) {
    let roomId = wx.getStorageSync('roomMsg')['room_id']
    let roomMsg = wx.getStorageSync('roomMsg')
    let date = wx.getStorageSync('date')
    this.getRooms(roomId,date)
    let dateTarget = 'orderMsg.date'
    if(wx.getStorageSync('userName')&&wx.getStorageSync('userId')){
      this.setData({
        userName:wx.getStorageSync('userName'),
        userId:wx.getStorageSync('userId')
      })
    }
    this.setData({
      roomId,
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
  getRooms(id,date) { //获取会议室列表
    this.setData({
      orderTarget:[]
    })
    let condition = {date,id}
    wx.request({
      url: url.getRoomListSplit,
      method: "GET",
      data: condition,
      success: res=> {
        // console.log(res.data.data)
        if(res.data.rtnCode === '000000'){
          // console.log(res.data)
          let recordArr = []
          res.data.data.forEach(item=>{
            let str = this.formatRecord(item.record)
            recordArr[17] = recordArr[17]||{status:0}
            let pos = str.indexOf('1')
            while(pos > -1){
              recordArr[pos] = {status:1,name:item.nickname,theme:item.theme}
              pos = str.indexOf('1',pos+1)
            }
            this.setData({
              recordArr
            })
          })
        }
      },
      fail:err=>{
        console.log(res)
      }
    })
  },
  formatRecord(record){
    record = Number(record).toString(2)
    while(record.length<18){
      record = '0' + record
    }
    record = record.split('').reverse().join('')
    return record
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
    this.getRooms(this.data.roomId,date)
    wx.setStorageSync('date', date)
  },
  chooseTime(e){
    let index = e.currentTarget.dataset.index;
    let orderTarget = this.data.orderTarget
    let recordValue = this.data.recordArr[index]; //此时间段的记录
    let target = `recordArr[${index}]`
    if(recordValue && recordValue.status === 1){
      Toast(recordValue.name + ' - ' + recordValue.theme);
    }else if(recordValue && recordValue.status === 2){
      orderTarget[index] = 0
      recordValue = {status:0,name:''}
    }else{
      orderTarget[index] = 1
      recordValue = {status:2,name:''}
    }
    this.setData({
      [target]:recordValue,
      orderTarget
    })
  },
  // //startTime
  // showStartTime(){
  //   this.setData({
  //     showStartTime:true
  //   })
  // },
  // chooseStartTime(event) {
  //   this.setData({
  //     startTime: event.detail,
  //   });
  //   this.closeStartTime();
  // },
  // closeStartTime(){
  //   this.setData({
  //     showStartTime:false
  //   })
  // },
  //endTime
  // showEndTime(){
  //   this.setData({
  //     showEndTime:true
  //   })
  // },
  // chooseEndTime(event) {
  //   this.setData({
  //     endTime: event.detail,
  //   });
  //   this.closeEndTime()
  // },
  // closeEndTime(){
  //   this.setData({
  //     showEndTime:false
  //   })
  // },
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
  getTheme(event){
    this.setData({
      theme:event.detail
    })
  },
  order(){
    let orderMsg = this.data.orderMsg;
    let orderTarget = this.data.orderTarget
    let start,end
    wx.setStorageSync('userId', this.data.userId)
    wx.setStorageSync('userName', this.data.userName)
    let checkResult = this.checkArr(orderTarget)
    if(checkResult===1){
      Toast('还没有选择时间哦！');
      return false
    }else if(checkResult===2){
      Toast('只能选择连续的时间段哦！');
      return false
    }else{
      start = checkResult.start
      end = checkResult.end
    }
    if(!this.data.userName){
      Toast('请填写姓名！')
      return false
    }
    if(!this.data.userId){
      Toast('请填写工号！')
      return false
    }
    if(!this.data.theme){
      Toast('请填写会议主题！')
      return false
    }
    this.setData({
      btnClicked:true
    })
    orderMsg.nickName = this.data.userName;
    orderMsg.userId = this.data.userId;
    orderMsg.theme = this.data.theme;
    orderMsg.date = this.data.date;
    orderMsg.id = parseInt(this.data.roomMsg.room_id);
    if(start < end || start == end){
      let timeCount = 0
      for(let i = start;i <= end;i++){
          timeCount+=Math.pow(2,i)
      }
      orderMsg.time = timeCount;
      wx.request({
        url: url.orderMeeting,
        method: "POST",
        header:{'Content-Type': 'application/x-www-form-urlencoded'},
        data:orderMsg,
        success:res=>{
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
    let first = arr.indexOf(1);
    if(first==-1) return 1
    let last = arr.lastIndexOf(1);
    for(let i=first;i<last;i++){
      if(!arr[i]){
        return 2
      }
    }
    return {start:first,end:last}
  }
})