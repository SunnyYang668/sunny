var app = getApp();

Page({
    data: {
        category: [],
        detail:[],
        curIndex: 0,
        isScroll: false,
        toView: 'guowei'
    },
    onLoad(){
      var that = this;
      //获取产品分类
      wx.request({
        url: app.globalData.URL + '/protype/list',
        data: {
          "pageNum": 1,
          "pageSize":30
        },
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
            category: data
          })
          that.getProduceListByType("1");
        }
      })
    },
    onReady(){
        var self = this;
        wx.request({
            url:'http://www.gdfengshuo.com/api/wx/cate-detail.txt',
            success(res){
                self.setData({
                    detail : res.data
                })
            }
        });
        
    },
    getProduceListByType: function(id){
      var that = this;
      wx.request({
        url: app.globalData.URL + '/produce/typelist',
        data: {
          "proType": id,
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
            detail: data
          })
          console.log(data);
        }
      })
    },
    switchTab(e){
      const self = this;
      console.log(e.target.dataset.id);
      self.getProduceListByType(e.target.dataset.id);
      this.setData({
        isScroll: true
      })
      setTimeout(function(){
        self.setData({
          toView: e.target.dataset.id,
          curIndex: e.target.dataset.index
        })
      },0)
      setTimeout(function () {
        self.setData({
          isScroll: false
        })
      },1)
    }
    
})