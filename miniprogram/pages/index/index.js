// index.js
// const app = getApp()
import color from '../../utils/styleConst.js'
Page({
  data: {
    color:{},//配色
    date: '选择日期', //calendar
    officeList: [{  //职场列表
        text: '全部职场',
        value: 0
      },
    ],
    office: 0, //初始显示全部职场
    condition:{},
    conditionStr: '更多筛选条件', //条件筛选会议室结果
    floor: 1, //楼层选择
    pplNum: 10, //容纳人数
  },
  onLoad() {
    this.setData({
      color
    })
    this.getOffices();
    this.getRooms();
  },
  changeOffice(event) {
    const {
      picker,
      value,
      index
    } = event.detail;
    Toast(`当前值：${value}, 当前索引：${index}`);
  },
  // 条件筛选
  chooseFloor(event) { //楼层选择
    this.setData({
      floor: event.detail.value,
    });
  },
  choosePplNum(event) { //人数选择
    this.setData({
      pplNum: event.detail.value,
    });
  },
  getDevice(event) { //设备选择
    console.log(event.detail)
    this.setData({
      result: event.detail,
    });
  },
  resetCondition(){
    let conditionStr = '更多筛选条件'
    this.setData({
      conditionStr,
      condition:{},
      result:[],
      floor:1,
      pplNum:10
    })
  },
  confirmCondition() { //筛选确定
    this.selectComponent('#moreCondition').toggle();
    let conditionStr = `${this.data.floor}层,${this.data.pplNum}人`;
    if(this.data.result&&this.data.result.length>0){
      condition += ','+this.data.result.join(',')
    }
    let condition = {};
    condition.floor = this.data.floor;
    condition.pplNum = this.data.pplNum;
    condition.result = this.data.result;
    this.setData({
      conditionStr,
      condition
    })
  },
  // 条件筛选结束
  // 日历组件
  formatDate(date) {
    date = new Date(date);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  },
  confirmDate(event) {
    console.log(event.detail)
    this.selectComponent('#datePicker').toggle();
    this.setData({
      date: this.formatDate(event.detail),
    });
  },
  // 日历组件结束
  getOffices(){ //获取职场列表
    wx.cloud.callFunction({
      name:'getOffices',
      data:{},
      success:res=>{
        let officeList = this.data.officeList;
        console.log(res.result.data)
        res.result.data.map(item=>{
          officeList.push({
            text:item.name,
            value:item._id
          })
        })
        this.setData({
          officeList
        })
      },
      fail(res){
        console.log(res)
      }
    })
  },
  getRooms(options){  //获取会议室列表
    wx.cloud.callFunction({
      name:"getRooms",
      data:options,
      success:res=>{
        console.log(res.result.data)
      }
    })
  },
  goReserve() {
    console.log('立即预约');
  }
});