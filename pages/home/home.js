// pages/index/index.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var utils = require('../../utils/util.js');
var qqmapsdk;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: true,
    scrollTop: 0,
    scrollHeight: 0,
    address: '',

    imgUrls: ['https:\/\/tbook2018.oss-cn-qingdao.aliyuncs.com\/20180316112440989.jpg'],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    tabs: [
      "热门推荐",
      "个人收藏",
      "附近商家"
    ],
    latitude: 0,
    longitude: 0,
    activeIndex: 0,
    favorite: [],
    sellerData: [],
    nearData: [],
    page: 1
  },

  formSubmit: function (e) {
    // console.log('form发生了submit事件，携带数据为：', e.detail.value);
    let _this = this;
    wx.request({
      url: 'https://interface.mahejia.com/web/index/list',
      data: {
        name: e.detail.value.input,
        lat: _this.data.latitude,
        long: _this.data.longitude
      },
      method: "GET",
      header: {
        "auth-token": wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.data.error === 0) {
          _this.setData({
            sellerData: res.data.data.data
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this = this;
    // 微信的scroll-view必须要设置高度才能监听滚动事件，所以，需要在页面的onLoad事件中给scroll-view的高度赋值
    utils.setScrollHeight(_this);
    wx.showLoading({
      title: '加载中',
    })

    // 获取轮播图列表
    wx.request({
      url: 'https://interface.mahejia.com/web/banner/list',
      data: {
      },
      method: "GET",
      header: {
        "auth-token": wx.getStorageSync('token'),
        // "Content-Type": "json"
      },
      success: function (res) {
        let imgUrls = [];
        if (res.data.error === 0) {
          for (let i = 0; i < res.data.data.length; i++) {
            imgUrls.push(res.data.data[i].url.slice(6));
          }
          _this.setData({
            imgUrls
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
        utils.login().then(res => {
          wx.request({
            url: 'https://interface.mahejia.com/web/index/list',
            data: {
              lat: _this.data.latitude,
              long: _this.data.longitude,
              type: 1,
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
                  var list = _this.data.sellerData;
                  for (var i = 0; i < res.data.data.data.length; i++) {
                    list.push(res.data.data.data[i]);
                  }

                  _this.setData({
                    // sellerData: res.data.data.data
                    sellerData: list,
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
        });
        // 调用接口
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: latitude,
            longitude: longitude
          },
          success: function (res) {
            var address = res.result.address_component.district;
            _this.setData({
              address: address
            });
          },
        })
      }
    })
  },

  loadMore: function () {
    // console.log("加载更多");
    var _this = this;
    switch (+this.data.activeIndex) {
      case 0:
        wx.request({
          url: 'https://interface.mahejia.com/web/index/list',
          data: {
            lat: _this.data.latitude,
            long: _this.data.longitude,
            type: 1,
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
                var list = _this.data.sellerData;
                for (var i = 0; i < res.data.data.data.length; i++) {
                  list.push(res.data.data.data[i]);
                }

                _this.setData({
                  // sellerData: res.data.data.data
                  sellerData: list,
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
        });
        break;
      case 2:
        wx.request({
          url: 'https://interface.mahejia.com/web/index/list',
          data: {
            lat: _this.data.latitude,
            long: _this.data.longitude,
            type: 2,
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
                var list = _this.data.nearData;
                for (var i = 0; i < res.data.data.data.length; i++) {
                  list.push(res.data.data.data[i]);
                }

                _this.setData({
                  // sellerData: res.data.data.data
                  nearData: list,
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
        });
        break;
      default : break;
    }
  },

  tabClick: function (e) {
    let activeIndex = +e.currentTarget.id;
    this.setData({
      activeIndex
    });
    var _this = this;
    switch (activeIndex) {
      case 0:
        _this.setData({
          sellerData: [],
          page: 1
        });
        wx.showLoading({
          title: '加载中',
        });
        wx.request({
          url: 'https://interface.mahejia.com/web/index/list',
          data: {
            lat: _this.data.latitude,
            long: _this.data.longitude,
            type: 1,
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
                var list = _this.data.sellerData;
                for (var i = 0; i < res.data.data.data.length; i++) {
                  list.push(res.data.data.data[i]);
                }

                _this.setData({
                  // sellerData: res.data.data.data
                  sellerData: list,
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
        break;
      case 1:
        wx.showLoading({
          title: '加载中',
        });
        wx.request({
          url: 'https://interface.mahejia.com/web/shop/storelist',
          data: {
            lat: _this.data.latitude,
            long: _this.data.longitude
          },
          method: "GET",
          header: {
            "auth-token": wx.getStorageSync('token'),
            // "Content-Type": "json"
          },
          success: function (res) {
            wx.hideLoading();
            if (res.data.error === 0) {
              _this.setData({
                favorite: res.data.data.data
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

          }
        })
        break;
      case 2:
        wx.showLoading({
          title: '加载中',
        });
        _this.setData({
          nearData: [],
          page: 1
        });
        wx.request({
          url: 'https://interface.mahejia.com/web/index/list',
          data: {
            lat: _this.data.latitude,
            long: _this.data.longitude,
            type: 2,
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
              // _this.setData({
              //   nearData: res.data.data.data
              // });
              if (res.data.data.data !== []) {
                var list = _this.data.nearData;
                for (var i = 0; i < res.data.data.data.length; i++) {
                  list.push(res.data.data.data[i]);
                }

                _this.setData({
                  // favorite: res.data.data.data
                  nearData: list,
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
        break;
      default: break;
    }
    this.setData({
      activeIndex: e.currentTarget.id
    });
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