// pages/mini_tao/mini_tao.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    traceUser: '',
    shoplist: [],
    goodlist: [],
    goods: [
      {
        pic1: "/imgs/shop_goods_img/shop6_goods1.jpg",
        pic2: "/imgs/shop_goods_img/shop6_goods2.jpg",
        pic3: "/imgs/shop_goods_img/shop6_goods3.jpg",
        name: "39-128元包邮 5.13号0点上新 原创森女部落借东西的小人连衣裙萌",
        shopName: "森女部落",
        shopPic: "/imgs/shops_img/shop6.png",
        price: 200,
      },
      {
        pic1: '/imgs/shop_goods_img/shop5_goods1.jpg',
        pic2: "/imgs/shop_goods_img/shop5_goods2.jpg",
        pic3: "/imgs/shop_goods_img/shop5_goods3.jpg",
        name: "韩版2018秋冬新款日系森女连帽上衣喇叭袖樱田川岛长袖宽松t恤女",
        shopName: "时光被我偷偷卖了",
        shopPic: "/imgs/shops_img/shop5.png",
        price: 340,
      },
      {
        pic1: '/imgs/shop_goods_img/shop4_goods1.jpg',
        pic2: "/imgs/shop_goods_img/shop4_goods2.jpg",
        pic3: "/imgs/shop_goods_img/shop4_goods3.jpg",
        name: "桔子点点 原创《 百合花柄图》日本和服女 和风改良浴衣 年会装",
        shopName: "桔子点点和服",
        shopPic: "/imgs/shops_img/shop4.png",
        price: 390,
      },
      {
        pic1: '/imgs/shop_goods_img/shop3_goods1.jpg',
        pic2: "/imgs/shop_goods_img/shop3_goods2.jpg",
        pic3: "/imgs/shop_goods_img/shop3_goods3.jpg",
        name: "枝头小芽 2019夏季新款 日系宽松休闲上衣 凉爽纯色短袖衬衫女",
        shopName: "枝头小芽Small tender bud",
        shopPic: "/imgs/shops_img/shop3.png",
        price: 490,
      },
      {
        pic1: '/imgs/shop_goods_img/shop2_goods1.jpg',
        pic2: "/imgs/shop_goods_img/shop2_goods2.jpg",
        pic3: "/imgs/shop_goods_img/shop2_goods3.jpg",
        name: "木制音乐盒天空之城八音盒创意木质摆件",
        shopName: "MUACY木与西",
        shopPic: "/imgs/shops_img/shop2.png",
        price: 289,
      },
      {
        pic1: "/imgs/shop_goods_img/shop1_goods1.jpg",
        pic2: "/imgs/shop_goods_img/shop1_goods2.jpg",
        pic3: "/imgs/shop_goods_img/shop1_goods3.jpg",
        name: "花芽原创月夜森林情侣戒指一对纯银日韩简约潮人学生开口对戒礼物",
        shopName: "花芽原创饰品",
        shopPic: "/imgs/shops_img/shop1.png",
        price: 230,
      },
    ],
  },
  //跳转到详情页
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
    db.collection('shops').where({
      _openid: this.data.openid  
    }).get({
      success: res => {
        this.setData({
          queryResult: JSON.stringify(res.data, null, 2),
          shoplist: res.data,
        });
        console.log('[数据库] [查询记录] 成功: ', res.data);
        console.log('this.data.shoplist[0].name_____  : ' + this.data.shoplist[0].name);
        for (var i = 0; i < this.data.shoplist.length; i++){
          db.collection('shop_goods').where({
            _openid: this.data.openid,
            shop_id: this.data.shoplist._id
          }).get({
            success: res => {
              this.setData({
                queryResult: JSON.stringify(res.data, null, 2),
                goodlist: res.data
              });
              console.log('[数据库] [查询记录] 成功: ', res.data);
              console.log('this.data.goodlist[0].name_____  : ' + this.data.goodlist[0].name);
            },
            fail: err => {
              wx.showToast({ title: '查询记录失败' });
              console.error('[数据库] [查询记录] 失败：', err);
            }
          });
        }
      },
      fail: err => {  
        wx.showToast({title: '查询记录失败'});
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