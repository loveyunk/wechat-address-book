var utils = require('../../utils/util.js');

// pages/record/record.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sellerData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    var _this = this;
    // 获取收藏列表
    wx.request({
      url: 'https://interface.mahejia.com/web/user/myshop',
      data: {
      },
      method: "GET",
      header: {
        "auth-token": wx.getStorageSync('token')
        // "Content-Type": "json"
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.error === 0) {
          _this.setData({
            sellerData: res.data.data
          });
        } else if (res.data.error = 100001) {
          utils.login();
        }  else {
          wx.showToast({
            title: 'fail',
            image: 'warn',
            duration: 2000
          })
        }
      }
    })
  },

  onOpenDetail: function (e) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  onOpenDetail: function (e) {
    let id = e.target.id;
    let status = e.detail.status;
    if (status === 1) {
      wx.navigateTo({
        url: `/pages/pending/pending?id=${id}`,
      })
    } else if (status === 2) {
      wx.navigateTo({
        url: `/pages/sellerDetail/sellerDetail?id=${id}`,
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})