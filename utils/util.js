const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


function login () {
  return new Promise(resolve => {
    wx.login({
      success: res => {
        wx.request({
          url: 'https://interface.mahejia.com/web/user/login',
          data: {
            code: res.code
          },
          method: "POST",
          header: {
            // "Content-Type": "json"
          },
          success: function (res) {
            var token = res.data.data.token;
            wx.setStorageSync('token', token);
            resolve(token);
          }
        })
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  });
}

function setScrollHeight(that) {
  wx.getSystemInfo({
    success: function (res) {
      that.setData({
        scrollHeight: res.windowHeight
      });
    }
  })
}

module.exports = {
  formatTime: formatTime,
  login,
  setScrollHeight
}
