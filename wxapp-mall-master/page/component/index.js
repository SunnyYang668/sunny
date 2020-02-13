var app = getApp();

Page({
  data: {
    imgUrls: [
      '/image/b1.jpg',
      '/image/b2.jpg',
      '/image/b3.jpg'
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 3000,
    duration: 800,
    proType:[],
    produceList: []
  },
  onLoad: function(){
    this.getProTypeList();
    this.getProduceList();
    this.onLogin();
  },
  onLogin: function(){
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var code = res.code;
        if (code) {
          console.log('获取用户登录凭证：' + code);
          wx.request({
            url: app.globalData.URL +'/weChat/wxlogin',
            data: {
              code: code
            },
            success: function (res) {
              app.globalData.openid = res.data.openid;
              app.globalData.session_key = res.data.session_key;
            }
          })
        } else {
          console.log('获取用户登录凭证失败');
        }
      }
    })
  },
  getProTypeList: function(){
    var that = this;
    wx.request({
      url: app.globalData.URL + '/protype/list',
      data: {},
      header: {
        'content-type': 'application/json'
      },
      method: 'post',
      success: function (res) {
        var data = res.data.data.list;
        if (data.list !== null) {
          for (let i = 0; i < data.length; i++) {
            data[i].proImgurl = app.globalData.imgUrl + data[i].proImgurl;
          }
        }
        that.setData({
          proType: data
        })
        console.log(data);
      }
    })
  },
  getProduceList: function(){
    var that = this;
    wx.request({
      url: app.globalData.URL + '/produce/newpro',
      data: {
        "pageNum": "1",
        "pageSize": "30"
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'post',
      success: function (res) {
        var data = res.data.data.list;
        if (data.list !== null) {
          for (let i = 0; i < data.length; i++) {
            data[i].proImgurl = app.globalData.imgUrl + data[i].proOne;
          }
        }
        that.setData({
          produceList: data
        })
        console.log(data);
      }
    })
  }
})