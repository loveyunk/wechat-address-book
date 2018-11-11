var utils = require('../../utils/util.js');

// pages/record/record.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: true,
    scrollTop: 0,
    scrollHeight: 0,
    page: 1,
    sellerData: [],
    latitude: 0,
    longitude: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    });
    var _this = this;

    //1、获取当前位置坐标
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        var latitude = res.latitude;
        var longitude = res.longitude;

        _this.setData({
          latitude,
          longitude
        });

        // 微信的scroll-view必须要设置高度才能监听滚动事件，所以，需要在页面的onLoad事件中给scroll-view的高度赋值
        utils.setScrollHeight(_this);
        // 获取收藏列表
        wx.request({
          url: 'https://interface.mahejia.com/web/user/calllist',
          data: {
            lat: _this.data.latitude,
            long: _this.data.longitude,
            page: _this.data.page,
            perPage: 10
          },
          method: "GET",
          header: {
            "auth-token": wx.getStorageSync('token'),
            // "Content-Type": "json"
          },
          success: function (res) {
            // wx.hideLoading();
            // var data = res.data.data.data;
            // _this.setData({
            //   sellerData: data
            // });

            wx.hideLoading();
            if (res.data.error === 0) {

              if (res.data.data.data !== []) {
                var list = _this.data.sellerData;
                for (var i = 0; i < res.data.data.data.length; i++) {
                  list.push(res.data.data.data[i]);
                }

                _this.setData({
                  sellerData: list,
                  page: _this.data.page + 1
                });
              }
            }
          }
        })
      }
    })
  },

  loadMore: function () {
    var _this = this;
    wx.request({
      url: 'https://interface.mahejia.com/web/user/calllist',
      data: {
        lat: _this.data.latitude,
        long: _this.data.longitude,
        page: _this.data.page,
        perPage: 10
      },
      method: "GET",
      header: {
        "auth-token": wx.getStorageSync('token'),
        // "Content-Type": "json"
      },
      success: function (res) {
        if (res.data.error === 0) {

          if (res.data.data.data !== []) {
            var list = _this.data.sellerData;
            for (var i = 0; i < res.data.data.data.length; i++) {
              list.push(res.data.data.data[i]);
            }

            _this.setData({
              sellerData: list,
              page: _this.data.page + 1
            });
          }
        }
      }
    })
  },

  onOpenDetail: function (e) {
    var id = e.target.id;
    wx.navigateTo({
      url: `/pages/sellerDetail/sellerDetail?id=${id}`,
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