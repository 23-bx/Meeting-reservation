// index.js
// const app = getApp()
import color from '../../utils/styleConst.js'
import url from '../../utils/url.js'
var app = getApp()
Page({
  data: {
    color: {}, //配色
    date: '选择日期', //calendar
    officeList: [{ //职场列表
      text: '全部职场',
      value: 0
    }, ],
    office: 0, //初始显示全部职场
    floor: 1,
    floorColor: '#eeeeee',
    chair: 10,
    device: [],
    condition: {},
    conditionStr: '更多筛选', //条件筛选会议室结果
    rooms: {},
  },
  onLoad(e) {
    
    let date,pDate,sDate;
    if(wx.getStorageSync('date')){
      let date = wx.getStorageSync('date');
      pDate = date; //传给后台的数据
      sDate = `${date.split("-")[1]}月${date.split("-")[2]}日`
    }else{
      let date = new Date();
      pDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
      sDate = `${date.getMonth()+1}月${date.getDate()}日`
    }
    console.log(date);
    let dateTarget = 'condition.date';
    this.setData({
      color,
      date:sDate,
      [dateTarget]:pDate
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
    console.log(event);
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
    let office_id = 'condition.office_id'
    let temp = this.data.condition.office_id
    this.setData({
      conditionStr,
      condition: {},
      [office_id]: temp,
      floor: 1,
      floorColor: '#eee',
      chair: 10,
      device: []
    })
    this.getRooms();
  },
  confirmCondition() { //筛选确定
    let deviceFormat = [];
    deviceFormat[2]="显示屏";
    deviceFormat[4]="外网";
    deviceFormat[8]="投影仪";
    deviceFormat[16]="电视";
    deviceFormat[32]="白板";
    deviceFormat[64]="麦克风";
    console.log(this.data.condition)
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
        let officeList = this.data.officeList;
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
        // console.log(res.data,'device-res')
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
    // console.log(this.data.condition, 'condition')
    wx.request({
      url: url.getRoomList,
      method: "GET",
      data: condition,
      success: res=> {
        console.log(res.data,'res')
        if(Array.isArray(res.data)){
          this.setData({
            rooms:res.data
          })
        }
      },
      fail:err=>{
        console.log(res)
      }
    })
  },
  order(e){
    wx.setStorageSync('roomMsg', e.currentTarget.dataset.msg)
    wx.setStorageSync('date', this.data.condition.date)
    wx.navigateTo({
      url: '../order/order'
    })
  }
});