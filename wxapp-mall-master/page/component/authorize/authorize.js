const app = getApp();
var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    console.log(8888);
    var that = this;
    this.onLogin();
    // 查看是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              //从数据库获取用户信息
              that.queryUsreInfo();
              //用户已经授权过
              wx.switchTab({
                url: '/page/component/index'
              })
            }
          });
        }
      }
    })
  },
  onLogin: function () {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var code = res.code;
        if (code) {
          console.log('获取用户登录凭证：' + code);
          wx.request({
            url: app.globalData.URL + '/weChat/wxlogin',
            data: {
              code: code
            },
            success: function (res) {
              app.globalData.openid = res.data.openid;
              app.globalData.session_key = res.data.session_key;
              console.log(app.globalData.openid)
            }
          })
        } else {
          console.log('获取用户登录凭证失败');
        }
      }
    })
  },
  bindGetUserInfo: function (e) {
    if (e.detail.userInfo) {
      //用户按了允许授权按钮
      app.globalData.userInfo = e.detail.userInfo;
      
      //插入登录的用户的相关信息到数据库
      let that = this;
      that.insertUserInfo(e);
      
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '警告',
        content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
        showCancel: false,
        confirmText: '返回授权',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击了“返回授权”')
          }
        }
      })
    }
  },
  //保存用户信息
  insertUserInfo: function (res){
    console.log(res);
    var data = {
      openid: app.globalData.openid,
      nickname: res.detail.userInfo.nickName,
      gender: res.detail.userInfo.gender,
      avatarurl: res.detail.userInfo.avatarUrl,
      province: res.detail.userInfo.province,
      city: res.detail.userInfo.city,
      language: res.detail.userInfo.language,
      country: res.detail.userInfo.country,
      ctime: util.getNowFormatDate(),
      mobile:'',
      telnum:''
    };
    util.request(api.UserAdd, data, 'POST').then(function (res) {
      if (res.code === 0) {
        console.log("小程序登录用户信息成功！");
        //授权成功后，跳转进入小程序首页(正式环境应该在这里)
        wx.switchTab({
          url: '/page/component/index'
        })
      }else{
        that.insertUserInfo(data);
      }
    });
    //授权成功后，跳转进入小程序首页(展示效果用)
    wx.switchTab({
      url: '/page/component/index'
    })
  },
  //获取用户信息接口
  queryUsreInfo: function () {
    console.log(9999);
    util.request(api.AuthUserInfo, { openid: app.globalData.openid}).then(function (res) { 
      if(res.code === 0){
        app.globalData.userInfo = res.data;
      }
    })
  },

})
