// pages/chapter/chapter.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chapter_List:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!wx.getStorageSync('uid')) {
      wx.showModal({
        title: '提示',
        content: '亲，您还没有登录哦!',
      })
      wx.switchTab({
        url: '/pages/myinfo/myinfo',
      })
      
    }
    var that=this
    wx.request({
      url: 'https://xlyt.zlzyy.club:444/API/chapter_list.aspx',
      success:function(res){
        console.log(res.data)
        that.setData({
          chapter_List:res.data
        })
      }
})
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