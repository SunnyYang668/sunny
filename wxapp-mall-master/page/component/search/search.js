let timeId = null;
var app = getApp();
Page({
  data: {
    history: [],
    hot: [],
    result: [],
    showKeywords: false,
    keywords: [],
    value: '',
    showResult: false,
  },
  searchHotKeywords() {
    var self = this;
    wx.request({
      url: app.globalData.URL + '/keyword/hotlist',
      data: {
        "pageNum": "1",
        "pageSize": "30"
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'post',
      success: function(res) {
        var data = res.data.data.list;
        var dataResult = [];
        console.log(data);
        if (data.list !== null) {
          for (let i = 0; i < data.length; i++) {
            dataResult.push(data[i].hotKeyName);
          }
        }
        self.setData({
          hot: dataResult
        })
        console.log(dataResult)
      }
    })
  },
  searchKeywords(value) {
    var self = this;
    wx.request({
      url: app.globalData.URL + '/keyword/list',
      data: {
        "keyWordName": value,
        "pageNum": "1",
        "pageSize": "30"
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'post',
      success: function(res) {
        var data = res.data.data.list;
        var dataResult = [];
        console.log(data);
        if (data.list !== null) {
          for (let i = 0; i < data.length; i++) {
            dataResult.push(data[i].keyWordName);
          }
        }
        self.setData({
          keywords: dataResult
        })
        console.log(dataResult)
      }
    })
  },
  showSearch() {
    this.setData({
      showResult: true,
      showKeywords: false,
      value: this.data.value
    })
    this.historyHandle(this.data.value)
    this.searchResult(this.data.value)
  },
  searchResult: function(name) {
    var self = this;
    wx.request({
      url: app.globalData.URL + '/produce/producename',
      data: {
        "proName": name,
        "pageNum": "1",
        "pageSize": "30"
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'post',
      success: function(res) {
        var data = res.data.data.list;
        if (data.list !== null) {
          for (let i = 0; i < data.length; i++) {
            data[i].proImgurl = app.globalData.imgUrl + data[i].proOne;
          }
        }
        self.setData({
          result: data
        })
      }
    })
  },
  cancelSearch() {
    this.setData({
      showResult: false,
      showKeywords: false,
      value: ''
    })
  },
  iconTap: function(event) {
    console.log(event)
  },
  searchInput(e) {
    if (!e.detail.value) {
      this.setData({
        showKeywords: false,
      })
      console.log(e.detail.value)
    } else {
      this.searchKeywords(e.detail.value)
      if (!this.data.showKeywords) {
        timeId && clearTimeout(timeId);
        timeId = setTimeout(() => {
          this.setData({
            showKeywords: true,
            value: e.detail.value
          })
        }, 1000)
      }
    }
  },
  keywordHandle(e) {
    const text = e.target.dataset.text;
    this.setData({
      value: text,
      showKeywords: false,
      showResult: true
    })
    this.showSearch();
    this.historyHandle(text);
  },
  addHistoryKeyWord(value) {
    var self = this;
    wx.request({
      url: app.globalData.URL + '/keyword/addkey',
      data: {
        "keyWordName": value,
        "isNew": 1
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'post',
      success: function(res) {
        console.log(res)
      }
    })
  },
  historyHandle(value) {
    if (value.trim() === '') {
      return;
    }
    this.addHistoryKeyWord(value.trim());
    let history = this.data.history;
    const idx = history.indexOf(value);
    if (idx === -1) {
      // 搜索记录只保留8个
      if (history.length > 7) {
        history.pop();
      }
    } else {
      history.splice(idx, 1);
    }
    history.unshift(value);
    wx.setStorageSync('history', JSON.stringify(history));
    this.setData({
      history
    });
  },
  onLoad() {
    this.searchHotKeywords();
    const history = wx.getStorageSync('history');
    if (history) {
      this.setData({
        history: JSON.parse(history)
      })
      console.log(this.data.history);
    }
  }
})