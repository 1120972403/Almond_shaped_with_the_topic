Page({

  /**
   * 页面的初始数据
   */
  data: {
    store: false,
    myChecked: 0,
    currentValue: null, //当前选择答案
    current: 0, //当前题号
    score: 0,
    questionList: [],
    nowQuestion: [],
    multiIndex: [{
      checked: false
    }, {
      checked: false
    }, {
      checked: false
    }, {
      checked: false
    }, {
      checked: false
    }],
    tmp: '',
    hidden: false

  },
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
      return;
    }

    var that = this;
    wx.request({
      url: 'https://xlyt.zlzyy.club:444/API/collection_list.aspx',
      data: {
        uid: wx.getStorageSync('uid'),
        type: '收藏'
      },
      success: function(res) {
        if (res.data!="") {
          console.log("返回过来的值：", res.data)
          console.log(res.data.index)
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
            content: '亲,您还没有收藏哦',
            showCancel: false,
            confirmText: "确定",

          })
          wx.navigateBack()
        }

      }
    })

  },
  //实现收藏取消功能
  select_store: function() {
    this.data.store = !this.data.store
    this.setData({
      store: this.data.store
    })
    wx.request({
      url: 'https://xlyt.zlzyy.club:444/API/get_question_collection.aspx',
      data: {
        uid: wx.getStorageSync('uid'),
        details_id: this.data.questionList[this.data.current].details_id,
        type: "取消收藏"
      },
      success: function(res) {
        console.log(res.data)
      }
    })
  },

  //单选和判断函数，选择选项函数
  selectItem(event) {
    console.log('event', event)
    var num = this.data.current;
    if (this.data.questionList[num].type == '单选' || this.data.questionList[num].type == '判断') {
      //type_id为1与0时则进行下列赋值(单选或判断)
      console.log("看看我有没有进入单选判断");
      console.log("类型：" + this.data.questionList[num].type);
      var selectId = parseInt(event.currentTarget.dataset.selectid); //将携带的参数selectid赋值给selectId,即编号的1，10。。。。

      this.setData({ //在data数据里更新myChecked的值和当前选择的值
        myChecked: selectId,
        currentValue: selectId
      })
    } else if (this.data.questionList[num].type == '多选') {
      console.log("看看我有没有进入多选");
      console.log("类型：" + this.data.questionList[num].type);
      var index = event.currentTarget.dataset.index; //获取当前索引
      var selectId = parseInt(event.currentTarget.dataset.selectid); //获取当前选项id
      var multiIndex = this.data.multiIndex;
      multiIndex[index].checked = !multiIndex[index].checked; //单击取反
      if (multiIndex[index].checked) { //单击加减赋值
        this.setData({
          myChecked: this.data.myChecked + selectId
        })
      } else {
        this.setData({
          myChecked: this.data.myChecked - selectId
        })
      }
      this.setData({ //上传至视图层
        multiIndex: multiIndex,
        currentValue: selectId
      })

    }
  },
  // 下一题next_question函数
  next_question() {
    //判断正误
    //获得当前题号
    var num = this.data.current;
    //获得正确答案
    var correct = this.data.questionList[num].answer;
    // 将ABCD答案转换为数字
    var correctItem = 0;
    switch (correct) {
      case 'A':
        correctItem = 1
        break;
      case 'B':
        correctItem = 10
        break;
      case 'C':
        correctItem = 100
        break;
      case 'D':
        correctItem = 1000
        break;
      case 'E':
        correctItem = 10000
        break;
      case 'AB':
        correctItem = 11
        break;
      case 'AC':
        correctItem = 101
        break;
      case 'AD':
        correctItem = 1001
        break;
      case 'AE':
        correctItem = 10001
        break;
      case 'BC':
        correctItem = 110
        break;
      case 'BD':
        correctItem = 1010
        break;
      case 'BE':
        correctItem = 10010
        break;
      case 'CD':
        correctItem = 1100
        break;
      case 'CE':
        correctItem = 10100
        break;
      case 'DE':
        correctItem = 11000
        break;
      case 'ABC':
        correctItem = 111
        break;
      case 'ABD':
        correctItem = 1011
        break;
      case 'ABE':
        correctItem = 10011
        break;
      case 'BCD':
        correctItem = 1110
        break;
      case 'BCE':
        correctItem = 10110
        break;
      case 'CDE':
        correctItem = 11100
        break;
      case 'ABCD':
        correctItem = 1111
        break;
      case 'ABCE':
        correctItem = 10111
        break;
      case 'ABCDE':
        correctItem = 11111
        break;
    }
    //判断当前选择与答案是否相等
    if (this.data.currentValue === correctItem) {
      this.setData({
        //分数加2分
        score: this.data.score + 2

      })

    }
    console.log("我的得分：", this.data.score)
    //下标加1进入下一题
    //判断是否最后一题,解决最后一题无限加分问题
    if (this.data.current >= this.data.questionList.length - 1) {
      //为最后一题时，值清零，
      this.setData({
        //多选值清零
        multiIndex: [{
          checked: false
        }, {
          checked: false
        }, {
          checked: false
        }, {
          checked: false
        }],
        myChecked: 0,
        //当前选项值清0
        currentValue: 0,
        current: 0
      })
      //弹出结果框
      wx.showModal({
        title: '阅览结束',
        content: '恭喜您,阅览结束',
        success(res) {
          if (res.confirm) {
            wx.navigateTo({
              url: "/pages/index/end/end"
            })
            console.log('用户点击确定')
          } else if (res.cancel) {
            wx.navigateTo({
              url: "/pages/index/index"
            })
            console.log('用户点击取消')
          }
        }
      })
    } else if (this.data.current < this.data.questionList.length - 1) {
      this.setData({
        //清零当前多选值
        multiIndex: [{
          checked: false
        }, {
          checked: false
        }, {
          checked: false
        }, {
          checked: false
        }, {
          checked: false
        }],
        current: this.data.current + 1,
        //选项圆点清0
        myChecked: 0,
        //当前选项值清0
        currentValue: 0,
        //收藏功能初始化
        store: false,


      })
      //获取更新后下一题current的值来更新当前题目
      var current = this.data.current;
      console.log("我想看看是哪个题号：", current)
      // this.setData({
      //   ////更新当前题目
      //   questionList: this.data.questionList[current]
      // })
      console.log("当前题号为" + this.data.current + "对应的questionList为：");
      console.log(this.data.questionList);

    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})