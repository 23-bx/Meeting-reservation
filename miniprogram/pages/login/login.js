// pages/login/login.js
Page({
  data: {
  },
  onLoad: function (options) {
    wx.getSystemInfo({
      success: res => {
        console.log(res.environment)
      },
    })
    this.login()
  },
  login(){
    wx.qy.login({
      success: function(res) {
        console.log('调用成功！',res.code);
        wx.switchTab({
          url: '../index/index',
        })
        if (res.code) {
          //发起网络请求
          wx.request({
            url: url.login,
            method:"POST",
            header:{'Content-Type': 'application/x-www-form-urlencoded'},
            data: {
              token: res.code
            },
            success:res=>{
              console.log(res)
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
  },

})