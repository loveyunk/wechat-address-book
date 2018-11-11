var utils = require('../../utils/util.js');

var appInstance = getApp();
// pages/apply/apply.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // multiArray: [['无脊柱动物', '脊柱动物'], ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物']],
    multiArray: [],
    multiIndex: [0, 0],
    category: '',
    applyCode: '',
    logo: '',
    businessImgUrl: [],
    location: null,
    token: '',
    introImgUrls: [],
    topData: [],
    secondData: [],
    sortId: 0
  },

  upload: function () {
    var _this = this;
    var imgs = [];
    for (let i = 0; i < _this.data.businessImgUrl.length; i++) {
      wx.uploadFile({
        url: 'https://interface.mahejia.com/file/upload',
        filePath: _this.data.businessImgUrl[i],
        name: 'file',
        formData: {
          // 'user': 'test'
        },
        success: function (res) {
          var data = JSON.parse(res.data);
          imgs.push(data.data);
          //do something
          _this.setData({
            introImgUrls: imgs
          });
        }
      })
    }
  },

  formSubmit: function (e) {
    var _this = this;

    if (!this.WxValidate.checkForm(e)) {
      const error = this.WxValidate.errorList[0]
      // `${error.param} : ${error.msg} `
      wx.showToast({
        title: `${error.msg} `,
        image: '/images/warn.svg',
        duration: 2000
      })
      return false
    } else if (this.data.location === null) {
      wx.showToast({
        title: `请选择位置`,
        image: '/images/warn.svg',
        duration: 2000
      })
      return false;
    } else if (this.data.location.name === undefined) {
      wx.showToast({
        title: `请选择具体位置`,
        image: '/images/warn.svg',
        duration: 2000
      })
      return false;
    } else if (this.data.logo === '') {
      wx.showToast({
        title: `请选择商家图片`,
        image: '/images/warn.svg',
        duration: 2000
      })
      return false;
    } else {
      var imgs = [];
      for (let i = 0; i < _this.data.businessImgUrl.length; i++) {
        wx.uploadFile({
          url: 'https://interface.mahejia.com/file/upload',
          filePath: _this.data.businessImgUrl[i],
          name: 'file',
          formData: {
            // 'user': 'test'
          },
          success: function (res) {
            var data = JSON.parse(res.data);
            imgs.push(data.data);
            //do something
            _this.setData({
              introImgUrls: imgs
            });

            if (i === _this.data.businessImgUrl.length - 1) {
              var data = e.detail.value;
              var introImgUrls = _this.data.introImgUrls.join(',');
              wx.request({
                url: 'https://interface.mahejia.com/web/shop/enter',
                data: {
                  name: data.name,
                  linkman: data.linkman,
                  cell_phone: data.cell_phone,
                  wechat: data.wechat,
                  admin_id: data.admin_id || 0,
                  breif_word: data.breif_word,
                  transfer_code: _this.data.applyCode,
                  logo: _this.data.logo,
                  sort_id: _this.data.sortId,
                  addr_name: _this.data.location.name,
                  addr_lat: _this.data.location.latitude,
                  addr_long: _this.data.location.longitude,
                  addr_full_name: _this.data.location.address,
                  breif_image: introImgUrls
                },
                method: "POST",
                header: {
                  "auth-token": wx.getStorageSync('token')
                  // "Content-Type": "json"
                },
                success: function (res) {
                  if (res.data.error === 0) {
                    wx.showToast({
                      title: '申请成功',
                      icon: 'success',
                      duration: 2000
                    }),
                      wx.navigateTo({
                        url: '/pages/myShop/myShop'
                      })
                  } else {
                    wx.showToast({
                      title: res.data.data,
                      icon: '/images/warn.svg',
                      duration: 2000
                    })
                  }
                },
                fail: function () {

                }
              })
            }
          }
        })
      }
    }
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
  chooseImage: function () {
    var _this = this;
    wx.chooseImage({
      count: 1,
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        _this.setData({
          logo: tempFilePaths[0]
        });
        wx.uploadFile({
          url: 'https://interface.mahejia.com/file/upload',
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            // 'user': 'test'
          },
          success: function (res) {
            var data = JSON.parse(res.data);
            //do something
            _this.setData({
              logo: data.data
            });
          }
        })
      }
    })
  },

  server: function () {
    wx.showModal({
      title: '服务条款',
      content: `**商家通讯录使用说明**

    1、该软件旨在为商铺提供一个连接用户的平台，让消费者得到更便捷的服务，让商铺实现更好的经营。

    2、用户可以在平台入驻多家商铺，审核通过之后方可在平台上展示，每位用户名下只能有一家未经审核的商铺。

    3、入驻平台的商铺需要支付一定的费用，支付为线下转账的形式，扫描平台二维码完成转账，转账时请按照【商铺名+交易码】写入转账备注。

    4、用户可以在我的商铺中提交申请商城链接申请，等到审核成功之后会展示在商城列表当中。

    5、如有疑问可以去个人中心页联系我们^v ^

**商家通讯录服务条款**

    1、入驻平台费用为98元，有效期为3年，从审核通过之日起计算，有效期过后我们有权对该商铺进行下架或删除处理。

    2、每个行业最多只做一个置顶，置顶收费: 60元，时长三年。

    3、退费流程: 书面邮件至zhiheng@outlook.com申请，审核通过之后才能退款。

    4、最终解释权归沈阳泰桔丰连锁企业管理有限公司独家所有`,
      success: function (res) {
        if (res.confirm) {
        } else if (res.cancel) {
        }
      }
    })
  },

  getTheLocation: function () {
    var _this = this;
    wx.chooseLocation({
      type: 'wgs84',
      success: function (res) {
        console.log(res);
        _this.setData({
          location: res
        });
      }
    })
  },

  chooseBuinessImage: function () {
    var _this = this;
    wx.chooseImage({
      count: 3 - _this.data.businessImgUrl.length, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var tempImgUrls = _this.data.businessImgUrl;
        tempImgUrls = tempImgUrls.concat(tempFilePaths);
        _this.setData({
          businessImgUrl: tempImgUrls
        });
      }
    })
  },

  deleteImgItem: function (e) {
    let index = e.currentTarget.id - 0;
    let imgUrl = this.data.businessImgUrl;
    for (let i = 0; i < this.data.businessImgUrl.length; i++) {
      if (i === index) {
        imgUrl.splice(i, 1);
        this.setData({
          businessImgUrl: imgUrl
        });
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this;
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
          that.setData({
            multiArray: tmp
          });
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

    this.WxValidate = appInstance.wxValidate({
      name: {
        required: true,
        minlength: 1,
        maxlength: 50,
      },
      linkman: {
        required: true,
        minlength: 1,
        maxlength: 10
      },
      cell_phone: {
        required: true,
        minlength: 8,
        maxlength: 11
      },
      wechat: {
        required: true,
        minlength: 1
      },
      breif_word: {
        required: true,
        minlength: 1
      }
    }
      , {
        name: {
          required: '请填写商家名称',
        },
        linkman: {
          required: '请填写联系人',
        },
        cell_phone: {
          required: '请输入正确手机号',
        },
        wechat: {
          required: '请输入微信号'
        },
        breif_word: {
          required: '请输入商家介绍'
        }
      });
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
    var d = Date.now().toString();
    this.setData({
      applyCode: d
    });
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