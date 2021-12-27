// index.js
// const app = getApp()
const { envList } = require('../../envList.js');

Page({
  data: {
    showUploadTip: false,
    nowDate: {
      yearData: '2021',
      monthData: '12',
      dayData: 22,
      weekData: 3
    }, 
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

  onClickPowerInfo(e) {
    const index = e.currentTarget.dataset.index;
    const powerList = this.data.powerList;
    powerList[index].showItem = !powerList[index].showItem;
    if (powerList[index].title === '数据库' && !this.data.haveCreateCollection) {
      this.onClickDatabase(powerList);
    } else {
      this.setData({
        powerList
      });
    }
  },

  onChangeShowEnvChoose() {
    wx.showActionSheet({
      itemList: this.data.envList.map(i => i.alias),
      success: (res) => {
        this.onChangeSelectedEnv(res.tapIndex);
      },
      fail (res) {
        console.log(res.errMsg);
      }
    });
  },

  onChangeSelectedEnv(index) {
    if (this.data.selectedEnv.envId === this.data.envList[index].envId) {
      return;
    }
    const powerList = this.data.powerList;
    powerList.forEach(i => {
      i.showItem = false;
    });
    this.setData({
      selectedEnv: this.data.envList[index],
      powerList,
      haveCreateCollection: false
    });
  },

  jumpPage(e) {
    wx.navigateTo({
      url: `/pages/${e.currentTarget.dataset.page}/index?envId=${this.data.selectedEnv.envId}`,
    });
  },

  onClickDatabase(powerList) {
    wx.showLoading({
      title: '',
    });
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      config: {
        env: this.data.selectedEnv.envId
      },
      data: {
        type: 'createCollection'
      }
    }).then((resp) => {
      if (resp.result.success) {
        this.setData({
          haveCreateCollection: true
        });
      }
      this.setData({
        powerList
      });
      wx.hideLoading();
    }).catch((e) => {
      console.log(e);
      this.setData({
        showUploadTip: true
      });
      wx.hideLoading();
    });
  },

  toprev() {
    this.roomIndex--;
    console.log('--');
  },

  tonext() {
    this.roomIndex++;
    console.log('++');
  },

  goReserve() {
    console.log('立即预约');
  }
});