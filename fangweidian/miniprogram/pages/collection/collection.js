// pages/collection/collection.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    collect: [
      {
        pic: "/imgs/shop_goods_img/shop1_goods1.jpg",
        context: "花芽原创月夜森林情侣戒指一对纯银日韩简约潮人学生开口对戒礼物",
        price: 138
      },
      {
        pic: "/imgs/shop_goods_img/shop2_goods1.jpg",
        context: "木制音乐盒天空之城八音盒创意木质摆件",
        price: 218
      }
    ],
    openid: '',
  },

  //查看商品详情
  detail_: function(event){
    console.log('goodlist[index]._id:______    ', event.currentTarget.dataset.id);
    wx.navigateTo({
      url: '/pages/good_detail/good_detail?good_id=' + event.currentTarget.dataset.id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }
    const db = wx.cloud.database();
    // 查询当前用户所有的 counters
    db.collection('collection').where({
      _openid: this.data.openid  
    }).get({
      success: res => {  
        this.setData({
          queryResult: JSON.stringify(res.data, null, 2),
          collect: res.data,
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