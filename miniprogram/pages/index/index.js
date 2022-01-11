// index.js
// const app = getApp()
import color from '../../utils/styleConst.js'
Page({
  data: {
    date:'', //calendar
    show:false, //calendar
    roomCondition:'',//条件筛选会议室
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
    this.setData({ show: true });
  },
  closeCalendar() {
    this.setData({ show: false });
  },
  formatDate(date) {
    console.log(date.getMonth()+1)
    console.log(date.getDate())
    date = new Date(date);
    console.log(date)
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  },
  confirmDate(event) {
    console.log(this.formatDate(event.detail))
    this.setData({
      show: false,
      date: this.formatDate(event.detail),
    });
  },
  // 日历组件结束
  // 条件筛选
  roomFilter(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
  chooseFloor(event) {  //楼层选择
    console.log(event.detail)
    this.setData({
      floor: event.detail,
    });
  },
  choosePplNum(event) {  //楼层选择
    console.log(event.detail)
    this.setData({
      pplNum: event.detail,
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