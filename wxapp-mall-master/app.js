var app = getApp();
App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var code = res.code;
        if (code) {
          console.log('获取用户登录凭证：' + code);
          wx.request({
            url: 'http://localhost:8080/api/weChat/wxlogin',
            data: {
              code: code
            },
            success: function (res) {
              console.log(res);
            }
          })
        } else {
          console.log('获取用户登录凭证失败');
        }
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }else{
          wx.reLaunch({
            url: '/page/component/authorize/authorize',
          })
        }
      }
    })
  },
  onShow: function() {
    console.log('App Show')
  },
  onHide: function() {
    console.log('App Hide')
  },
  globalData: {
    hasLogin: false,
    URL: 'http://localhost:8080/api',
    imgUrl: 'http://localhost:8080/image',
    openid: '',
    session_key: ''
  }
})