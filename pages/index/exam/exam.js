Page({

  /**
   * 页面的初始数据
   */
  data: {


    decode_answer: "",
    see_answer: false,
    store: true,
    error: false, // 报错
    myChecked: 0,
    currentValue: 0, //当前选择答案
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
    hidden: false,
    layerlayer: {
      isLayerShow: false,//默认弹窗
      layerAnimation: {},//弹窗动画
    },
    answers: {
      start: 0,//初始题号
      end: 0,//结束题号
      allList: [],//题号数据
      activeNum: 0,//当前显示条数
      onceLoadLength: 5,//一次向俩端加载条数，因我使用本地数据，此属性未实际使用
      isShowTip: false//默认是否显示提示
    }
  },


  //页码切换列表效果
  pageClick: function () {
    let layerAnimation = wx.createAnimation({
      transformOrigin: '50% 50%',
      duration: 500,
      timingFunction: 'ease',
      delay: 0
    })
    if (!this.data.layerlayer.isLayerShow) {
      layerAnimation.translate3d(0, 0, 0).step()
    } else {
      layerAnimation.translate3d(0, '100%', 0).step()
    }
    this.data.layerlayer.isLayerShow = !this.data.layerlayer.isLayerShow
    this.data.layerlayer.layerAnimation = layerAnimation
    this.setData(this.data)
  },
  //页码切换列表收缩
  layerFooterClick: function () {
    let layerAnimation = wx.createAnimation({
      transformOrigin: '50% 50%',
      duration: 500,
      timingFunction: 'ease',
      delay: 0
    })
    layerAnimation.translate3d(0, '100%', 0).step()
    this.data.layerlayer.isLayerShow = false
    this.data.layerlayer.layerAnimation = layerAnimation
    this.setData(this.data)
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
    }
    var that = this;
    console.log("options.bank_id:", options.bank_id)
    //  查询所有题信息，即顺序练题
    if (options.bank_id) {
      wx.request({
        url: 'https://xlyt.zlzyy.club:444/API/kaoti.aspx',
        data: {
          bank_id: options.bank_id
        },
        success: function(res) {
          console.log("返回过来的值：", res.data)
          console.log(res.data.index)
          that.setData({
            questionList: res.data,
            hidden: false
          })
          setTimeout(function() {
            that.setData({
              hidden: true
            })
          }, 300)
        }
      })
    }

    //  查询章节信息，即章节练题
    console.log("options.chapter_id:", options.chapter_id)
    if (options.chapter_id) {
      wx.request({
        url: 'https://xlyt.zlzyy.club:444/API/kaoti.aspx',
        data: {
          chapter_id: options.chapter_id
        },
        success: function(res) {
          console.log("返回过来的值：", res.data)
          console.log(res.data.index)
          that.setData({
            questionList: res.data,
            hidden: false
          })
          setTimeout(function() {
            that.setData({
              hidden: true
            })
          }, 300)
        }
      })
    }
    //  查询专题信息，即专题练题
    console.log("options.type:", options.type)
    if (options.type) {
      wx.request({
        url: 'https://xlyt.zlzyy.club:444/API/kaoti.aspx',
        data: {
          type: options.type
        },
        success: function(res) {
          console.log("返回过来的值：", res.data)
          console.log(res.data.index)
          that.setData({
            questionList: res.data,
            hidden: false
          })
          setTimeout(function() {
            that.setData({
              hidden: true
            })
          }, 300)
        }
      })
    }
  },
  //用户点击查看答案
  tap_answer: function(res) {
    this.data.see_answer = !this.data.see_answer
    this.setData({
      see_answer: this.data.see_answer
    })
  },
  //实现收藏功能
  select_store: function() {
    this.data.store = !this.data.store
    this.setData({
      store: this.data.store
    })
    //实现上一题的添加功能,当满足store
    if (!this.data.store) {
      wx.request({
        url: 'https://xlyt.zlzyy.club:444/API/get_question_collection.aspx',
        data: {
          uid: wx.getStorageSync('uid'),
          details_id: this.data.questionList[this.data.current].details_id,
          type: "收藏"
        },
        success: function(res) {
          console.log(res.data)
          wx.showToast({
            title: '收藏成功',
            icon: 'success',
            duration: 1000,
          })
        }
      })
    }
  },
  // 报错按钮，点击展开报错输入
  get_error: function() {
    this.data.error = !this.data.error
    this.setData({
      error: this.data.error
    })
  },
  //报错答案输入
  valuechange: function(res) {
    console.log(res.detail.value)
    this.setData({
      tmp: res.detail.value
    })
  },
  // 报错答案提交
  submit: function() {
    //正则表达控制
    var regCapitalLetter = new RegExp('^[A-E]{1,5}$', 'g'); //判断报错输入的是否为A-E的字母
    var rsCapitalLetter = regCapitalLetter.exec(this.data.tmp);
    if (rsCapitalLetter) {
      wx.request({
        url: 'https://xlyt.zlzyy.club:444/API/get_comments.aspx',
        data: {
          uid: wx.getStorageSync('uid'),
          opinion: rsCapitalLetter,
          type: "答案报错",
          details_id: this.data.questionList[this.data.current].details_id,
        },
        success: function(res) {
          console.log(res.data)
          wx.showModal({
            title: '成功',
            content: '提交成功',
          })
        }
      })

    } else {
      wx.showModal({
        title: '失败',
        content: '请检查你要报错的答案',
      })
    }
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
      var temp1 = event.detail.value //获取多选中的value
      var temp2 = 0 //初始
      console.log(temp1)
      if (temp1.length != 0) {
        for (var i = 0, len = temp1.length; i < len; i++) {
          temp1[i] = parseInt(temp1[i])
          temp2 = temp2 + temp1[i]
          console.log(temp2)
        }
        this.setData({ //在data数据里更新当前选择的值
          currentValue: temp2
        })
      }
      // var selectId = parseInt(event.currentTarget.dataset.selectid); //获取当前选项id
      // var multiIndex = this.data.multiIndex;
      // multiIndex[index].checked = !multiIndex[index].checked; //单击取反
      // if (multiIndex[index].checked) { //单击加减赋值
      //   this.setData({
      //     myChecked: this.data.myChecked + selectId
      //   })
      // } else {
      //   this.setData({
      //     myChecked: this.data.myChecked - selectId
      //   })
      // }
      // selectId = selectId + parseInt(event.currentTarget.dataset.selectid);
      // this.setData({ //上传至视图层
      //   multiIndex: multiIndex,
      //   currentValue: selectId
      // })

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
    console.log("选择 ", this.data.currentValue)
    console.log("答案 ", correctItem)
    //判断当前选择与答案是否相等
    if (this.data.currentValue === correctItem) {
      console.log("恭喜您答题正确")
      this.setData({
        //分数加2分

      })
      console.log("我的得分：", this.data.score)
    } else if (this.data.currentValue != correctItem && this.data.currentValue != "") {
      var error_answer = this.data.currentValue
      var decode_answer = ''
      switch (error_answer) {
        case 1:
          decode_answer = 'A'
          break;
        case 10:
          decode_answer = 'B'
          break;
        case 100:
          decode_answer = 'C'
          break;
        case 1000:
          decode_answer = 'D'
          break;
        case 10000:
          decode_answer = 'E'
          break;
        case 11:
          decode_answer = 'AB'
          break;
        case 101:
          decode_answer = 'AC'
          break;
        case 1001:
          decode_answer = 'AD'
          break;
        case 10001:
          decode_answer = 'AE'
          break;
        case 110:
          decode_answer = 'BC'
          break;
        case 1010:
          decode_answer = 'BD'
          break;
        case 10010:
          decode_answer = 'BE'
          break;
        case 1100:
          decode_answer = 'CD'
          break;
        case 10100:
          decode_answer = 'CE'
          break;
        case 11000:
          decode_answer = 'DE'
          break;
        case 111:
          decode_answer = 'ABC'
          break;
        case 1011:
          decode_answer = 'ABD'
          break;
        case 10011:
          decode_answer = 'ABE'
          break;
        case 1110:
          decode_answer = 'BCD'
          break;
        case 10110:
          decode_answer = 'BCE'
          break;
        case 11100:
          decode_answer = 'CDE'
          break;
        case 1111:
          decode_answer = 'ABCD'
          break;
        case 10111:
          decode_answer = 'ABCE'
          break;
        case 11111:
          decode_answer = 'ABCDE'
          break;
      }
      console.log("原始答案 ", error_answer)
      console.log("解密后的答案 ", decode_answer)
      wx.request({
        url: 'https://xlyt.zlzyy.club:444/API/get_question_collection.aspx',
        data: {
          uid: wx.getStorageSync('uid'),
          details_id: this.data.questionList[this.data.current].details_id,
          type: "错题",
          error_answer: decode_answer
        },
        success: function(res) {
          console.log(res.data)
          console.log("答错了，已帮你添加为错题")
        }
      })
    }

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
        title: '答题结束',
        // 您的成绩为' + this.data.score
        content: '恭喜您,答题结束',
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
        //收藏与报错功能初始化
        store: true,
        error: false,
        //查看答案按钮复原
        see_answer: false,

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