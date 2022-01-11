// index.js
// const app = getApp()
import color from '../../utils/styleConst.js'
Page({
  data: {
    date:'', //calendar
    showCal:false, //calendar
    roomCondition:'',//条件筛选会议室
    activeNames:[],
    floor:1, //楼层选择
    pplNum:10,
    showUploadTip: false,
    meetingRoom: [{
      id: 1,
      name: '天安厅',
      num: 10,
      floor: 2,
      office: '新大厦'
    },{
      id: 2,
      name: '颜卡厅',
      num: 10,
      floor: 14,
      office: '新大厦'
    },{
      id: 3,
      name: '动卡厅',
      num: 15,
      floor: 16,
      office: '新大厦'
    }],
    roomIndex: 0
  },
  onLoad(){
    this.setData({
      color
    })
  },
  // 日历组件
  showCalendar(){
    this.setData({ showCal: true });
  },
  closeCalendar() {
    this.setData({ showCal: false });
  },
  formatDate(date) {
    date = new Date(date);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  },
  confirmDate(event) {
    this.setData({
      showCal: false,
      date: this.formatDate(event.detail),
    });
  },
  // 日历组件结束
  // 条件筛选
  roomFilter(event) {
    console.log(event.detail)
    this.setData({
      activeNames: event.detail,
    });
  },
  chooseFloor(event) {  //楼层选择
    this.setData({
      floor: event.detail.value,
    });
  },
  choosePplNum(event) {  //楼层选择
    this.setData({
      pplNum: event.detail.value,
    });
  },
  getDevice(event){
    console.log(event.detail)
    this.setData({
      result: event.detail,
    });
  },
  // 条件筛选结束
  goReserve() {
    console.log('立即预约');
  }
});