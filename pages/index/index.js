Page({
  data: {
   
  },
  bindSequence:function(){
    //跳转页面
    wx.navigateTo({
      url: '/pages/index/exam/exam?bank_id=1',
    })
  },
  bindRandom: function () {
    //跳转页面
    wx.navigateTo({
      url: '/pages/chapter/chapter',
    })
  },
  bindFavorite: function () {
    //跳转页面
    wx.navigateTo({
      url: '/pages/type_pre/type_pre', 
    })
  },
  bindStore:function(){
    //跳转收藏页面
    wx.navigateTo({
      url: '/pages/index/store/store',
    })
  },
  bindError: function () {
    //跳转收藏页面
    wx.navigateTo({
      url: '/pages/index/error/error',
    })
  }
  
})
