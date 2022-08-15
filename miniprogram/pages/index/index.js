// index.js
// const app = getApp()
import color from '../../utils/styleConst.js'
import url from '../../utils/url.js'
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
var app = getApp()
Page({
  data: {
    color: {}, //配色
    date: '选择日期', //calendar
    officeList: [],
    office: 0, //初始显示全部职场
    floor: 1,
    floorColor: '#eeeeee',
    chair: 10,
    device: [],
    condition: {},
    conditionStr: '更多筛选', //条件筛选会议室结果
    rooms: {},
    deviceCount:0,
    showYanka:false,
    showOfiiceWindow:false, //显示选择职场的窗口
    showConfirmButton:false,
    touchStartPosition:[],
    touchEndPosition:[],
    calendarDate:0
  },
  onLoad(e) {
    // if(e.type === 'wy'){
    //   this.setData({
    //     showYanka:true
    //   })
    // }
  },
  onShow(){
    if(!wx.getStorageSync('defaultOffice')){
      this.setData({
        showOfiiceWindow:true
      })
    }else{
      let target = 'condition.office_id'
      this.setData({
        office:wx.getStorageSync('defaultOffice'),
        [target]:wx.getStorageSync('defaultOffice')
      })
    }
    let pDate,sDate;
    if(wx.getStorageSync('date') && wx.getStorageSync('changeDate') === 1){
      let date = wx.getStorageSync('date');
      pDate = date; //传给后台的数据
      sDate = `${date.split("-")[1]}月${date.split("-")[2]}日`
      wx.setStorageSync('changeDate', 0)
    }else{
      let date = new Date();
      pDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
      sDate = `${date.getMonth()+1}月${date.getDate()}日`
      wx.setStorageSync('date', pDate)
    }
    let dateTarget = 'condition.date';
    let calendarDate = new Date().getTime()
    this.setData({
      color,
      date:sDate,
      [dateTarget]:pDate,
      calendarDate
    })
    this.getOffices();
    this.getDevices();
    this.getRooms();
  },
  changeOffice(event) { //职场选择
    let target = 'condition.office_id'
    this.setData({
      [target]: event.detail
    });
    this.getRooms();
  },
  // 条件筛选
  chooseFloor(event) { //楼层选择
    let floor = event.detail.value||event.detail;
    let target = 'condition.floor'
    this.setData({
      [target]: floor,
      floor,
      floorColor: this.data.color.dpink
    });
  },
  choosePplNum(event) { //人数选择
    let chair = event.detail.value||event.detail;
    this.setData({
      chair
    });
  },
  getDevice(event) { //设备选择
    let deviceCount = event.detail.reduce(function(a,b){return parseInt(a)+parseInt(b)},0);
    this.setData({
      device: event.detail,
      deviceCount
    });
  },
  resetCondition() { //重置筛选
    this.selectComponent('#moreCondition').toggle();
    let conditionStr = '更多筛选'
    let condition = {}
    if(this.data.condition.office_id){
      let temp = this.data.condition.office_id
      condition.office_id = temp
    }
    this.setData({
      conditionStr,
      condition,
      floor: 1,
      floorColor: '#eee',
      chair: 10,
      device: []
    })
    this.getRooms();
  },
  confirmCondition() { //筛选确定
    let deviceFormat = [];
    deviceFormat[2]="HDMI";
    deviceFormat[4]="白板";
    deviceFormat[8]="显示器";
    deviceFormat[16]="外网";
    deviceFormat[32]="开发网";
    deviceFormat[64]="办公网";
    this.selectComponent('#moreCondition').toggle();
    let conditionArr = []
    if (this.data.condition.floor) {
      conditionArr.push(`${this.data.floor}层`)
    }
    if (this.data.chair) {
      conditionArr.push(`${this.data.chair}人`)
    }
    if (this.data.device && this.data.device.length > 0) {
      this.data.device.forEach(item => {
        conditionArr.push(deviceFormat[item])
      });
    }
    let conditionStr = conditionArr.join(',')
    const chair = 'condition.chair'
    const device = 'condition.device'
    this.setData({
      conditionStr,
      [chair]: this.data.chair,
      [device]: this.data.deviceCount
    })
    this.getRooms();
  },
  // 条件筛选结束

  // 日历组件
  formatDate(date) {
    date = new Date(date);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  },
  confirmDate(event) {
    this.selectComponent('#datePicker').toggle();
    let dateTarget = 'condition.date'
    this.setData({
      [dateTarget]:`${event.detail.getFullYear()}-${event.detail.getMonth() + 1}-${event.detail.getDate()}`,
      date: this.formatDate(event.detail),
    });
    this.getRooms()
  },
  // 日历组件结束

  getOffices() { //获取职场列表
    wx.request({
      url: url.getOffice,
      method: "GET",
      data: {},
      success: res=> {
        let officeList = [{text: '全部职场',value: 0}, ];
        res.data.map(item => {
          officeList.push({
            text: item.office_name,
            value: item.office_id
          })
        })
        this.setData({
          officeList
        })
      }
    })
  },
  getDevices(){
    wx.request({
      url: url.getDevice,
      method: "GET",
      success: res=> {
        if(Array.isArray(res.data)){
          this.setData({
            deviceList:res.data
          })
        }
      }
    })
  },
  getRooms() { //获取会议室列表
    let condition = this.data.condition
    wx.request({
      url: url.getRoomList,
      method: "GET",
      data: condition,
      success: res=> {
        if(Array.isArray(res.data)){
          this.setData({
            rooms:res.data
          })
        }
      },
      fail:err=>{
        console.log(err)
      }
    })
  },
  order(e){
    wx.setStorageSync('roomMsg', e.currentTarget.dataset.msg)
    wx.setStorageSync('date', this.data.condition.date)
    wx.navigateTo({
      url: '../order/order'
    })
  },
  onShareAppMessage:function(){
    return{
      title:'卡中心会议预定',
      path:'/pages/index/index',
      imageUrl:'/images/index/share.png',
    }
  },
  chooseOffice(e){
    let target = 'condition.office_id'
    wx.setStorageSync('defaultOffice',e.currentTarget.dataset.office)
    this.setData({
      showOfiiceWindow:false,
      office:e.currentTarget.dataset.office,
      [target]:e.currentTarget.dataset.office
    })
    this.getRooms();
  },
  touchStart(e){
    this.setData({
      touchStartPosition:[e.changedTouches[0].pageX,e.changedTouches[0].pageY]
    })
  },
  touchEnd(e){
    let [sx,sy] = this.data.touchStartPosition
    let [ex,ey] = [e.changedTouches[0].pageX,e.changedTouches[0].pageY]
    if(sx-ex>50){
      this.setSlideDate(0) //左滑
    }else if(sx-ex<-50){
      this.setSlideDate(1) //右滑
    }
  },
  setSlideDate(e){
    let date = this.data.condition.date
    let currentTimeStamp = new Date(date).getTime()
    let targetTimeStamp
    let todayStamp = new Date(new Date().toLocaleDateString()).getTime()
    if(e == 0){ 
      targetTimeStamp = (currentTimeStamp/1000 + 86400)*1000
    }else{
      targetTimeStamp = (currentTimeStamp/1000 - 86400)*1000
      if(targetTimeStamp < todayStamp){
        Toast('前面不可以约啦！')
        return false
      }
    }
    let targetDate = new Date(targetTimeStamp).getFullYear()+'-'+ (new Date(targetTimeStamp).getMonth()+1)+'-'+new Date(targetTimeStamp).getDate()
    let showDate = this.formatDate(targetTimeStamp)
    let target = "condition.date"
    this.setData({
      calendarDate:targetTimeStamp,
      [target]:targetDate,
      date:showDate
    })
    this.getRooms()
  }
});