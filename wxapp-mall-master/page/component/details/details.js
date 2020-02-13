// page/component/details/details.js
var app = getApp();
Page({
  data:{
    goods: {
      id: 1,
      image: '/image/goods1.png',
      title: '新鲜梨花带雨',
      price: 0.01,
      stock: '有货',
      detail: '这里是梨花带雨详情。',
      parameter: '125g/个',
      service: '不支持退货'
    },
    num: 1,
    totalNum: 0,
    hasCarts: false,
    curIndex: 0,
    show: false,
    scaleCart: false,
    proId:{}
  },
  onLoad: function (option){
    this.getDetial(option.id);
  },
  getDetial: function (proId){
    const self = this;
    wx.request({
      url: app.globalData.URL + '/produce/produce',
      data: {
        proId: proId
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'post',
      success: function (res) {
        console.log(res)
        var data = res.data;
        data.proOne = app.globalData.imgUrl + data.proOne
        data.image = data.proOne
        // data.title = data.proName
        // data.detail = data.proDetial
        self.setData({
          goods: data
        })
      }
    })
  },
  addCount() {
    let num = this.data.num;
    num++;
    this.setData({
      num : num
    })
  },

  addToCart() {
    const self = this;
    const num = this.data.num;
    let total = this.data.totalNum;

    self.setData({
      show: true
    })
    setTimeout( function() {
      self.setData({
        show: false,
        scaleCart : true
      })
      setTimeout( function() {
        self.setData({
          scaleCart: false,
          hasCarts : true,
          totalNum: num + total
        })
      }, 200)
    }, 300)

  },

  bindTap(e) {
    const index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
  }
 
})