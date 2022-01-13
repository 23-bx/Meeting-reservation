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
    floor:1,
    floorColor:'#eeeeee',
    chair:10,
    device:[],
    condition:{},
    conditionStr: '更多筛选', //条件筛选会议室结果
    rooms:{}
  },
  onLoad() {
    this.setData({
      color
    })
    this.getOffices();
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
    let target = 'condition.floor'
    this.setData({
      [target]:event.detail.value,
      floor: event.detail.value,
      floorColor:this.data.color.dpink
    });
  },
  choosePplNum(event) { //人数选择
    this.setData({
      chair: event.detail.value
    });
  },
  getDevice(event) { //设备选择
    this.setData({
      device:event.detail
    });
  },
  resetCondition(){  //重置筛选
    this.selectComponent('#moreCondition').toggle();
    let conditionStr = '更多筛选'
    let office_id = 'condition.office_id'
    let temp = this.data.condition.office_id
    this.setData({
      conditionStr,
      condition:{},
      [office_id]:temp,
      floor:1,
      floorColor:'#eee',
      chair:10,
      device:[]
    })
    this.getRooms();
  },
  confirmCondition() { //筛选确定
    console.log(this.data.condition)
    this.selectComponent('#moreCondition').toggle();
    let conditionArr = []
    if(this.data.condition.floor){
      conditionArr.push(`${this.data.floor}层`)
    }
    if(this.data.chair){
      conditionArr.push(`${this.data.chair}人`)
    }
    if(this.data.device&&this.data.device.length>0){
      conditionArr.push(this.data.device.join(','))
    }
    let conditionStr = conditionArr.join(',')
    const chair = 'condition.chair'
    const device = 'condition.device'
    this.setData({
      conditionStr,
      [chair]:this.data.chair,
      [device]:this.data.device
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
            text:item.office_name,
            value:item.office_id
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
  getRooms(){  //获取会议室列表
    let condition = this.data.condition
    console.log(this.data.condition,'condition')
    wx.cloud.callFunction({
      name:"getRooms",
      data:condition,
      success:res=>{
        console.log(res.result.list,'res')
        this.setData({
          rooms:res.result.list
        })
      },
      fail:err=>{
        console.log(err)
      }
    })
  }
});