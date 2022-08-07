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
    btnClicked:false,
    myColor:['#c6cee2','#efdadd','#cadabb','#9aa193','#b0787d','#a1b2cc','#d9d6d9'],
    orderTarget:[],
    showInfoWindow:false //显示填信息弹窗
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
    let timeArr = app.globalData.timeArr
    // console.log(condition)
    wx.request({
      url: url.getRoomListSplit,
      method: "GET",
      data: condition,
      success: res=> {
        console.log(res.data.data)
        if(res.data.rtnCode === '000000'){
          // let colorNum = 0
          let recordArr = []
          res.data.data.forEach((item,index)=>{
            let str = this.formatRecord(item.record)
            // recordArr[20] = recordArr[20]||{status:0}
            let start = str.indexOf('1')
            let end = str.lastIndexOf('1')
            recordArr[start] = {status:1,name:item.nickname,theme:item.theme,userId:item.userId,timeStr:`${timeArr[start]}-${timeArr[end+1]}`}
            for(let i=start+1;i<=end;i++){
              recordArr[i] = {status:3}
            }
            // let pos = str.indexOf('1')  旧版横向时间轴
            // while(pos > -1){
            //   recordArr[pos] = {status:1,name:item.nickname,theme:item.theme,color:this.data.myColor[colorNum],userId:item.userId,timeStr:`${timeArr[pos]}-${timeArr[pos+1]}`}
            //   pos = str.indexOf('1',pos+1)
            // }
            // colorNum ++
            for(let i=0;i<21;i++){
              if(!recordArr[i])
              recordArr[i] = {status:0,timeStr:`${timeArr[i]}-${timeArr[i+1]}`}
            }
            this.setData({
              recordArr
            })
          })
        }
      },
      fail:err=>{
        console.log(err)
      }
    })
  },
  formatRecord(record){
    record = Number(record).toString(2)
    while(record.length<20){
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
  // chooseTime(e){
  //   let index = e.currentTarget.dataset.index;
  //   let orderTarget = this.data.orderTarget
  //   let recordValue = this.data.recordArr[index]; //此时间段的记录
  //   let newRecordArr = this.data.recordArr
  //   let startTime = orderTarget.indexOf(1)
  //   let endTime = orderTarget.lastIndexOf(1)
  //   if(recordValue && recordValue.status === 1){
  //     Toast(recordValue.name + ' - ' + recordValue.userId +' - ' + recordValue.theme);
  //   }else{
  //     if(startTime>-1){ //如果已经选了
  //       if(endTime>startTime){ //选择了多段时间，清空
  //         newRecordArr.forEach((item)=>{
  //           if(item.status === 2){
  //             item.status = 0
  //           }
  //         })
  //         orderTarget = new Array(18)
  //       }else if(endTime == startTime){ //选择了一段时间，继续选择结束时间
  //         if(index - startTime > 3 || index - startTime < -3){
  //           Toast('最多预约两个小时！')
  //           return false
  //         }
  //         if(index>startTime){
  //           for(let i=startTime;i<index+1;i++){
  //             if(newRecordArr[i] && newRecordArr[i].status === 1){
  //               Toast('不可以包含别人的会议时间！')
  //               return false
  //             }
  //             orderTarget[i] = 1
  //             newRecordArr[i] = {status:2,name:''}
  //           }
  //         }else{
  //           for(let i=index;i<startTime+1;i++){
  //             if(newRecordArr[i] && newRecordArr[i].status === 1){
  //               Toast('不可以包含别人的会议时间！')
  //               return false
  //             }
  //             orderTarget[i] = 1
  //             newRecordArr[i] = {status:2,name:''}
  //           }
  //         }
  //       }
  //       // console.log('已有')
  //     }else{
  //       orderTarget[index] = 1
  //       newRecordArr[index] = {status:2,name:''}
  //       // console.log('暂无')
  //     }
  //   }
  //   this.setData({
  //     recordArr:newRecordArr,
  //     orderTarget,
  //   })
  // },
  chooseTime(e){
    let chooseTarget = e.currentTarget.dataset.index
    let recordArr = this.data.recordArr
    let orderTarget = this.data.orderTarget
    let orderStart = orderTarget.indexOf(1)
    let orderEnd = orderTarget.lastIndexOf(1)
    if(orderStart<0){ //目前无选中
      recordArr[chooseTarget].status = 2
      orderTarget[chooseTarget] = 1
    }else if(orderStart===orderEnd){ //目前有一个选中
      if(chooseTarget-orderStart>3 || chooseTarget-orderStart<-3){
        Toast('最多预约两小时！')
        orderTarget = this.data.orderTarget
        return false
      }
      if(orderStart<chooseTarget){
        for(let i=orderStart;i<chooseTarget+1;i++){
          if(recordArr[i].status == 0){
            recordArr[i].status = 2
            orderTarget[i] = 1
          }else if(recordArr[i].status == 1){
            Toast('不可以包含别人的会议时间！')
            return false
          }
        }
      }else if(chooseTarget<orderStart){
        for(let i=chooseTarget;i<orderStart+1;i++){
          if(recordArr[i].status == 0){
            recordArr[i].status = 2
            orderTarget[i] = 1
          }else if(recordArr[i].status == 1){
            Toast('不可以包含别人的会议时间！')
            return false
          }
        }
      }else if(chooseTarget==orderStart){
        recordArr.forEach(item=>{
          if(item.status == 2) {
            item.status = 0
            orderTarget = []
          }
        })
      }
    }else if(orderStart !== orderEnd){ //目前有两个选中
      recordArr.forEach(item=>{
        if(item.status == 2) {
          item.status = 0
          orderTarget = []
        }
      })
    }
    this.setData({
      recordArr,
      orderTarget
    })
  },
  enterInfo(){
    if(this.data.orderTarget.indexOf(1)>-1){
      this.setData({
        showInfoWindow:true
      })
    }else{
      Toast('还没有选择时间哦！');
      return false
    }
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
  },
  onShareAppMessage:function(){
    return{
      title:'卡中心会议预定',
      path:'/pages/index/index',
      imageUrl:'/images/index/share.png',
    }
  }
})