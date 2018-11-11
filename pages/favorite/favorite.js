// pages/record/record.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    })
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
        // 获取收藏列表
        wx.request({
          url: 'https://interface.mahejia.com/web/shop/storelist',
          data: {
            lat: latitude,
            long: longitude,
          },
          method: "GET",
          header: {
            "auth-token": wx.getStorageSync('token')
            // "Content-Type": "json"
          },
          success: function (res) {
            console.log(res);
            wx.hideLoading();
            var data = res.data.data.data;
            _this.setData({
              sellerData: data
            });
          }
        })

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