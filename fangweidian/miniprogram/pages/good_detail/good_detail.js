// pages/good_detail/good_detail.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    cart_good: '',
    collection_good: '',
    collection_id: '',
    cart_id: '',
    isLike: false,
    good_: [],
    imgUrls: [
      "/imgs/shop_goods_img/shop1_goods1.jpg",
      "/imgs/shop_goods_img/shop1_goods2.jpg",
      "/imgs/shop_goods_img/shop1_goods3.jpg",
    ],
    // 商品详情介绍
    detailImg: [
      "/images/comment_good_detail.PNG"
    ],
    context:"花芽原创月夜森林情侣戒指一对纯银日韩简约潮人学生开口对戒礼物",
    price: 138,
    type:"月夜森林系列"
  },

  // 收藏
  addLike() {
    this.setData({
      isLike: !this.data.isLike
    });
    const db = wx.cloud.database();
    // 查询当前用户所有的 counters
    db.collection('collection').where({
      _openid: this.data.openid,
      good_id: this.data.good_[0]._id
    }).get({
      success: res => {
        this.setData({
          collection_good: res.data
        });
        console.log('[数据库] [查询记录] 成功: ', res.data);
        if (res.data.length == 0) {  //不存在与当前商品_id相同的记录，新增一行记录到collection
          db.collection('collection').add({
            data: {
              good_id: this.data.good_[0]._id,
              context: this.data.good_[0].context,
              pic: this.data.good_[0].imgpath1,
              price: this.data.good_[0].price
            },
            success: res => {
              // 在返回结果中会包含新创建的记录的 _id
              this.setData({
                collection_id: res._id,
              })
              wx.showToast({
                title: '收藏成功',
              })
              console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
            },
            fail: err => {
              wx.showToast({
                icon: 'none',  
                title: '新增记录失败'
              })
              console.error('[数据库] [新增记录] 失败：', err)
            }
          })
        } else {   //collection 中已有当前商品记录，不添加并提示
          wx.showToast({
            title: '该商品已在收藏夹',
          })
        }
      },
      fail: err => {
        wx.showToast({ title: '查询记录失败' });
        console.error('[数据库] [查询记录] 失败：', err);
      }
    });
    
  },
  // 跳到购物车
  toCar() {
    wx.switchTab({
      url: '/pages/cart/cart'
    })
  },
  //加入购物车
  addCar(){
    const db = wx.cloud.database();
    // 查询 cart中是否已有相同good_id的记录
    db.collection('cart').where({
      _openid: this.data.openid,
      good_id: this.data.good_[0]._id
    }).get({
      success: res => {
        console.log('[数据库] [查询记录] 成功: ', res.data);
        this.setData({
          cart_good: res.data
        })
        if(res.data.length==0){  //不存在与当前商品_id相同的记录，新增一行记录到cart
          db.collection('cart').add({
            data: {
              check: false,
              good_id: this.data.good_[0]._id,
              name: this.data.good_[0].context,
              num: 1,
              pic: this.data.good_[0].imgpath1,
              price: this.data.good_[0].price,
              type: this.data.good_[0].type
            },
            success: res => {
              // 在返回结果中会包含新创建的记录的 _id
              this.setData({
                cart_id: res._id,
              })
              wx.showToast({
                title: '加入购物车成功',
              })
              console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
            },
            fail: err => {
              wx.showToast({
                icon: 'none',
                title: '新增记录失败'
              })
              console.error('[数据库] [新增记录] 失败：', err)
            }
          })
        }else{   //cart 中已有当前商品记录，修改num的值
          const newNum = this.data.cart_good[0].num + 1
          db.collection('cart').doc(this.data.cart_good[0]._id).update({
            data: {
              num: newNum  
            },
            success: res => {
              wx.showToast({
                icon: 'none',
                title: '已加入购物车'
              })
              console.error('[数据库] [更新记录] 成功：')
            },
            fail: err => {
              wx.showToast({
                icon: 'none',
                title: '更新记录失败'
              })
              console.error('[数据库] [更新记录] 失败：', err)
            }
          })
        }
      },
      fail: err => {
        wx.showToast({ title: '查询记录失败' });
        console.error('[数据库] [查询记录] 失败：', err);
      }
    });
  },
  // 立即购买
  immeBuy() {
    wx.showToast({
      title: '购买成功',
      icon: 'success',
      duration: 2000
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var good_id = options.good_id;
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }
    const db = wx.cloud.database();
    // 查询当前用户所有的 counters
    db.collection('shop_goods').where({
      _openid: this.data.openid,
      _id: good_id
    }).get({
      success: res => {
        this.setData({
          good_: res.data
        });
        console.log('[数据库] [查询记录] 成功: ', res.data);
      },
      fail: err => {
        wx.showToast({ title: '查询记录失败' });
        console.error('[数据库] [查询记录] 失败：', err);
      }
    });
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
    wx.navigateBack();  //返回上一个页面
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