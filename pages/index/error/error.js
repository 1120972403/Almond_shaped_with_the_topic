Page({
  /**
   * 页面的初始数据
   */
  data: {
    see_answer:false,
    indicatorDots: true, 
    questionList: [],
    hidden: false
  },
  delWrong:function(e){
    console.log("e传递过来的值", e.currentTarget.dataset.details_id)
    var that = this
    //  移除错题
    wx.request({
      url: 'https://xlyt.zlzyy.club:444/API/get_question_collection.aspx',
      data: {
        uid: wx.getStorageSync('uid'),
        details_id: e.currentTarget.dataset.details_id,
        type: '删除错题'
      },
      success: function (res) {
        console.log("返回过来的值：", res.data)
        wx.showToast({
          title: '删除错题成功',
          icon: 'success',
          duration: 1000,
        })
        that.onLoad();//刷新页面
      }
    })
    
  },
  
  //查看我的错误答案，并解密数字对应的选项
  // tap_answer:function(event){
  //   console.log(event)
  //   console.log("event传递过来的值", event.currentTarget.dataset.id)
  //   //获取对应的序号
  //   var num = event.currentTarget.dataset.id
  //   //获得正确答案
  //   var error_answer = this.data.questionList[num].error_answer;
  //   // 将ABCD答案转换为数字
  //   var decode_answer =this.data.decode_answer
  //   switch (error_answer) {
  //     case 1:
  //       decode_answer = 'A'
  //       break;
  //     case 10:
  //       decode_answer = 'B'
  //       break;
  //     case 100:
  //       decode_answer = 'C'
  //       break;
  //     case 1000:
  //       decode_answer = 'D'
  //       break;
  //     case 10000:
  //       decode_answer = 'E'
  //       break;
  //     case 11:
  //       decode_answer = 'AB'
  //       break;
  //     case 101:
  //       decode_answer = 'AC'
  //       break;
  //     case 1001:
  //       decode_answer = 'AD'
  //       break;
  //     case 10001:
  //       decode_answer = 'AE'
  //       break;
  //     case 110:
  //       decode_answer = 'BC'
  //       break;
  //     case 1010:
  //       decode_answer = 'BD'
  //       break;
  //     case 10010:
  //       decode_answer = 'BE'
  //       break;
  //     case 1100:
  //       decode_answer = 'CD'
  //       break;
  //     case 10100:
  //       decode_answer = 'CE'
  //       break;
  //     case 11000:
  //       decode_answer = 'DE'
  //       break;
  //     case 111:
  //       decode_answer = 'ABC'
  //       break;
  //     case 1011:
  //       decode_answer = 'ABD'
  //       break;
  //     case 10011:
  //       decode_answer = 'ABE'
  //       break;
  //     case 1110:
  //       decode_answer = 'BCD'
  //       break;
  //     case 10110:
  //       decode_answer = 'BCE'
  //       break;
  //     case 11100:
  //       decode_answer = 'CDE'
  //       break;
  //     case 1111:
  //       decode_answer = 'ABCD'
  //       break;
  //     case 10111:
  //       decode_answer = 'ABCE'
  //       break;
  //     case 11111:
  //       decode_answer = 'ABCDE'
  //       break;
  //   }
  //   console.log("原始答案 ", error_answer)
  //   console.log("解密后的答案 ", decode_answer)
  //   //求反操作
  //   this.data.see_answer = !this.data.see_answer
  //   this.setData({
  //     decode_answer: decode_answer,
  //     see_answer: this.data.see_answer
  //   })
  //},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //用uid判断用户是否登录
    if (!wx.getStorageSync('uid')) {
      wx.showModal({
        title: '提示',
        content: '亲，您还没有登录哦!',
      })
      wx.switchTab({
        url: '/pages/myinfo/myinfo',
      })
     
    }
    else{
      var that = this
      //  查询所有错题信息
      wx.request({
        url: 'https://xlyt.zlzyy.club:444/API/collection_list.aspx',
        data: {
          uid: wx.getStorageSync('uid'),
          type: '错题'
        },
        success: function (res) {
          if (res.data != "") {
            console.log("返回过来的值：", res.data)
            that.setData({
              questionList: res.data,
              hidden: false
            })
            setTimeout(function () {
              that.setData({
                hidden: true
              })
            }, 300)
          } else {
            wx.showModal({
              title: '提示',
              content: '亲,恭喜您!没有错题',
              showCancel: false,
              confirmText: "确定",

            })
            wx.navigateBack()
          }

        }
      })
    }
 
    }

})