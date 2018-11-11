Component({
  /**
   * 组件的属性列表
   */
  properties: {
    id: {
      type: Number,
      default: 0,
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
    address: {
      type: String,
      default: ''
    },
    apply_time: {
      type: String,
      default: ''
    },
    // 到期时间
    end_time: {
      type: String,
      default: ''
    },
    // 状态 1待审核2正常营业中3已过期
    status: {
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

      wx.makePhoneCall({
        phoneNumber: this.properties.phone //仅为示例，并非真实的电话号码
      })
    },
    openDetail: function () {
      this.triggerEvent('opendetail', {id: this.properties.id, status: this.properties.status})
    },
    previewImage: function () {
      wx.previewImage({
        current: '', // 当前显示图片的http链接
        urls: [this.properties.avatar] // 需要预览的图片http链接列表
      })
    },
    goPay: function () {
      wx.navigateTo({
        url: "/pages/pay/pay"
      })
    },
  }
})
