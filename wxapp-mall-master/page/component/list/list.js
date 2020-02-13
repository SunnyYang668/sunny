// page/component/list/list.js
var app = getApp();

Page({
  data:{
    proType:{},
    proTypeList:[]
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.getProType(options.proTypeId);
    this.getProTypeList(options.proTypeId);
  },
  getProTypeList: function(proTypeId){
    var self = this;
    wx.request({
      url: app.globalData.URL + '/produce/typelist',
      data: {
        "proType": proTypeId,
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
        self.setData({
          proTypeList: data
        })
        console.log(data);
      }
    })
  },
  getProType: function(proTypeId){
    var self = this;
    wx.request({
      url: app.globalData.URL + '/protype/proType',
      data: {
        proTypeId: proTypeId
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'post',
      success: function (res) {
        var data = res.data;
        data.proImgurl = app.globalData.imgUrl + data.proImgurl;
        self.setData({
          proType: data
        })
        console.log(data);
      }
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})