// component/sellerItem/sellerItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    id: {
      type: Number
    },
    index: {
      type: Number
    },
    name: {
      type: String,
      default: ''
    },
    phone: {
      type: String,
      default: ''
    },
    avatar: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      default: ''
    },
    distance: {
      type: Number
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    makePhoneCall: function (e) {
      var _this = this;
      wx.request({
        url: 'https://interface.mahejia.com/web/user/call',
        data: {
          shop_id: _this.properties.index
        },
        method: "POST",
        header: {
          "auth-token": wx.getStorageSync('token'),
          // "Content-Type": "json"
        },
        success: function (res) {
          if (res.data.error === 0) {
            wx.makePhoneCall({
              phoneNumber: _this.properties.phone //仅为示例，并非真实的电话号码
            })
          } else {
            wx.showToast({
              title: "失败",
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail: function () {

        }
      })
    },
    openDetail: function () {
      this.triggerEvent('opendetail', this.properties.id)
    },
    previewImage: function () {

    }
  }
})
