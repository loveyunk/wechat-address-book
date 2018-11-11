var utils = require('../../utils/util.js');

// pages/sellerDetail/sellerDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logo: '',
    name: '',
    favoriteNum: 0,
    addTime: '',
    location: '',
    range: '',
    linkman: '',
    wechat: '',
    intro: '',
    phone: '',
    latitude: '',
    longitude: '',
    isFavorite: '2', // 1已收藏 2未收藏
    id: 0,
    introImgs: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    });
    wx.showLoading({
      title: '加载中...'
    });
    var _this = this;
    wx.request({
      url: 'https://interface.mahejia.com/web/shop/pending',
      data: {
        shop_id: options.id
      },
      method: "GET",
      header: {
        "auth-token": wx.getStorageSync('token')
        // "Content-Type": "json"
      },
      success: function (res) {
        console.log(res);
        var data = res.data.data;
        if (res.data.error === 0) {
          wx.hideLoading();
          _this.setData({
            logo: data.logo,
            name: data.name,
            favoriteNum: data.store_count,
            location: data.addr_full_name,
            addTime: data.add_time,
            range: data.sort_id,
            linkman: data.linkman,
            wechat: data.wechat,
            intro: data.breif_word,
            phone: data.cell_phone,
            longitude: data.addr_long,
            latitude: data.addr_lat,
            isFavorite: data.is_store,
            introImgs: data.breif_image && data.breif_image.split(',')
          });
        } else if (res.data.error = 100001) {
          utils.login();
        } else {
          wx.showToast({
            title: '',
            icon: "none",
            duration: 2000
          })
        }
      },
      fail: function () {
        wx.showToast({
          title: '出错，请稍后重试',
          icon: "none",
          duration: 2000
        })
      }
    })
  },

  previewLogo: function () {
    wx.previewImage({
      current: '', // 当前显示图片的https链接
      urls: [this.data.logo] // 需要预览的图片https链接列表
    });
  },

  goPay: function () {
    wx.navigateTo({
      url: '/pages/pay/pay'
    })
  },

  contactUs: function () {
    wx.makePhoneCall({
      phoneNumber: '02483863490' //仅为示例，并非真实的电话号码
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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