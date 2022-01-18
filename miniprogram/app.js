// app.js
App({
  onLaunch: function () {
    // this.login()
    let timeMap = new Map(
      [["09:00",0],["09:30",1],["10:00",2],["10:30",3],["11:00",4],["11:30",5],
       ["12:00",6],["12:30",7],["13:00",8],["13:30",9],["14:00",10],["14:30",11],
       ["15:00",12],["15:30",13],["16:00",14],["16:30",15],["17:00",16],["17:30",17],
      ])
    this.globalData.timeMap = timeMap
  },
  globalData:{
    timeMap:null
  },
  login(){
    wx.qy.login({
      success: function(res) {
        console.log('调用成功！');
        if (res.code) {
          //发起网络请求
          wx.request({
            url: 'https://test.com/onLogin',
            data: {
              code: res.code
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
  },
});
