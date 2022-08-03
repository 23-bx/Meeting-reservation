// app.js
import url from './utils/url.js'
App({
  onLaunch: function () {
    // this.login()
    let timeMap = new Map(
      [["09:00",0],["09:30",1],["10:00",2],["10:30",3],["11:00",4],["11:30",5],
       ["12:00",6],["12:30",7],["13:00",8],["13:30",9],["14:00",10],["14:30",11],
       ["15:00",12],["15:30",13],["16:00",14],["16:30",15],["17:00",16],["17:30",17],
       ["18:00",18],["18:30",19],["19:00",20],
      ])
    let deviceMap = new Map(
      [[64,"办公网"],[32,"开发网"],[16,"外网"],[8,"显示器"],[4,"白板"],[2,"HDMI"]]
    )
    this.globalData.timeMap = timeMap
    this.globalData.deviceMap = deviceMap
  },
  onHide:function(){
    wx.removeStorageSync('date')
  },
  globalData:{
    timeMap:null,
    deviceMap:null
  },
});
