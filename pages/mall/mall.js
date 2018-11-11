// pages/index/index.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var utils = require('../../utils/util.js');
var qqmapsdk;

// pages/record/record.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: true,
    scrollTop: 0,
    scrollHeight: 0,
    multiArray: [],
    multiIndex: [0, 0],
    category: '',
    sortId: 0,
    categoryData: [],
    latitude: 0,
    longitude: 0,
    page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: 'https://interface.mahejia.com/web/sort/list',
      data: {
      },
      method: "GET",
      header: {
        "auth-token": wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.data.error === 0) {
          let tmp = [res.data.data.top_sort, res.data.data.second_sort];
          _this.setData({
            multiArray: tmp
          });
        } else if (res.data.error = 100001) {
          utils.login();
        } else {
          wx.showToast({
            title: "获取数据失败",
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function () {

      }
    })

    // 微信的scroll-view必须要设置高度才能监听滚动事件，所以，需要在页面的onLoad事件中给scroll-view的高度赋值
    utils.setScrollHeight(_this);

    // 实例化API核心类
    qqmapsdk = new QQMapWX({
      key: 'JYFBZ-IGWWO-KCJWI-SAN7U-5JPFK-X7FNJ'
    });
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
        wx.request({
          url: 'https://interface.mahejia.com/web/index/list',
          data: {
            lat: _this.data.latitude,
            long: _this.data.longitude,
            type: 3,
            page: _this.data.page,
            perPage: 5
          },
          method: "GET",
          header: {
            "auth-token": wx.getStorageSync('token')
            // "Content-Type": "json"
          },
          success: function (res) {

            wx.hideLoading();
            if (res.data.error === 0) {

              if (res.data.data.data !== []) {
                var list = _this.data.categoryData;
                for (var i = 0; i < res.data.data.data.length; i++) {
                  list.push(res.data.data.data[i]);
                }

                _this.setData({
                  categoryData: list,
                  page: _this.data.page + 1
                });
              }

            } else if (res.data.error = 100001) {
              utils.login();
            } else {
              wx.showToast({
                title: '出错',
                icon: "none",
                duration: 2000
              })
            }
          },
          fail: function () {

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

  loadMore: function () {
    var _this = this;
    wx.request({
      url: 'https://interface.mahejia.com/web/index/list',
      data: {
        lat: _this.data.latitude,
        long: _this.data.longitude,
        type: 3,
        page: _this.data.page,
        perPage: 5
      },
      method: "GET",
      header: {
        "auth-token": wx.getStorageSync('token')
        // "Content-Type": "json"
      },
      success: function (res) {

        if (res.data.error === 0) {

          if (res.data.data.data !== []) {
            var list = _this.data.categoryData;
            for (var i = 0; i < res.data.data.data.length; i++) {
              list.push(res.data.data.data[i]);
            }

            _this.setData({
              // sellerData: res.data.data.data
              categoryData: list,
              page: _this.data.page + 1
            });
          }

        } else if (res.data.error = 100001) {
          utils.login();
        } else {
          wx.showToast({
            title: '出错',
            icon: "none",
            duration: 2000
          })
        }
      },
      fail: function () {

      }
    })
  },


  bindMultiPickerChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)    
    let id = this.data.multiArray[1][e.detail.value[1]].id;
    let firstName = this.data.multiArray[0][e.detail.value[0]].name;
    let lastName = this.data.multiArray[1][e.detail.value[1]].name;
    let category = firstName + ' / ' + lastName;
    this.setData({
      sortId: id,
      category
    });
    let _this = this;

    wx.showLoading({
      title: '加载中',
    });

    wx.request({
      url: 'https://interface.mahejia.com/web/index/list',
      data: {
        lat: _this.data.latitude,
        long: _this.data.longitude,
        type: 3,
        sort_id: _this.data.sortId
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
            categoryData: res.data.data.data
          });

        } else if (res.data.error = 100001) {
          utils.login();
        } else {
          wx.showToast({
            title: '出错',
            icon: "none",
            duration: 2000
          })
        }
      },
      fail: function () {

      }
    })

  },
  bindMultiPickerColumnChange: function (e) {
    // console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    if (e.detail.column === 0) {
      let id = this.data.multiArray[e.detail.column][e.detail.value].id;
      var that = this;
      wx.request({
        url: 'https://interface.mahejia.com/web/sort/list',
        data: {
          pid: id
        },
        method: "GET",
        header: {
          "auth-token": wx.getStorageSync('token')
        },
        success: function (res) {
          if (res.data.error === 0) {
            let tmp = that.data.multiArray;
            tmp.splice(1, 1, res.data.data.second_sort);
            that.setData({
              multiArray: tmp
            });
          } else if (res.data.error = 100001) {
            utils.login();
          } else {
            wx.showToast({
              title: "获取数据失败",
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail: function () {

        }
      })
    }
    // var data = {
    //   multiArray: this.data.multiArray,
    //   multiIndex: this.data.multiIndex
    // };
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