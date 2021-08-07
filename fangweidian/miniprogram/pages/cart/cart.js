// pages/cart/cart.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {  
    openid: '', 
    traceUser: '',
    adminShow: false,//管理  
    shopcarData: []
  },

  //查看商品详情  
  detail_: function(event){
    console.log('goodlist[index]._id:______    ', event.currentTarget.dataset.id);
    wx.navigateTo({
      url: '/pages/good_detail/good_detail?good_id=' + event.currentTarget.dataset.id,
    })
  },
  //点击全选  
  allcheckTap: function () {
    let shopcar = this.data.shopcarData,
      allsel = !this.data.allsel,//点击全选后allsel变化
      total = 0;
    for (let i = 0, len = shopcar.length; i < len; i++) {
      shopcar[i].check = allsel;//所有商品的选中状态和allsel值一样
      if (allsel) {//如果为选中状态则计算商品的价格
        total += shopcar[i].price * shopcar[i].num;  
      }  
    }
    this.data.selarr = allsel ? shopcar : [];//如果选中状态为true那么所有商品为选中状态，将物品加入选中变量，否则为空    
    this.setData({
      allsel: allsel,
      shopcarData: shopcar,
      total: total,
      selarr: this.data.selarr
    });
  },
  //点击移除商品  
  deleteshopTap: function () {
    var allsel = this.data.allsel,
      shopcar = this.data.shopcarData,
      selarr = this.data.selarr;
    if (allsel) {
      shopcar = [];
      this.setData({
        allsel: false
      });
    } else {
      console.log(selarr);
      for (var i = 0, len = selarr.length; i < len; i++) {//将选中的商品从购物车移除        
        console.log(selarr[i].id);
        for (var lens = shopcar.length - 1, j = lens; j >= 0; j--) {
          console.log(shopcar[j].id);
          if (selarr[i].id == shopcar[j].id) {
            shopcar.splice(j, 1);
          }
        }
      }
    }
    this.setData({
      shopcarData: shopcar,
      total: 0
    });
  },
  //点击加入收藏夹，这里按自己需求写吧  
  addcollectTap: function () {

  },
  //点击管理按钮，是否显示管理的选项  
  adminTap: function () {
    this.setData({
      adminShow: !this.data.adminShow
    });
  },
  //点击单个选择按钮  
  checkTap: function (e) {
    let Index = e.currentTarget.dataset.index,
      shopcar = this.data.shopcarData,
      total = this.data.total,
      selarr = this.data.selarr;
    shopcar[Index].check = !shopcar[Index].check || false;
    if (shopcar[Index].check) {
      total += shopcar[Index].num * shopcar[Index].price;
      selarr.push(shopcar[Index]);
    } else {
      total -= shopcar[Index].num * shopcar[Index].price;
      for (let i = 0, len = selarr.length; i < len; i++) {
        if (shopcar[Index].id == selarr[i].id) {
          selarr.splice(i, 1);
          break;
        }
      }
    }
    this.setData({
      shopcarData: shopcar,  
      total: total,
      selarr: selarr
    });
    this.judgmentAll();//每次按钮点击后都判断是否满足全选的条件  
  },

  //点击加减按钮  
  numchangeTap: function (e) {
    let Index = e.currentTarget.dataset.index,//点击的商品下标值        
      shopcar = this.data.shopcarData,
      types = e.currentTarget.dataset.types,//是加号还是减号        
      total = this.data.total;//总计    
    switch (types) {
      case 'add':
        shopcar[Index].num++;//对应商品的数量+1      
        shopcar[Index].check && (total += parseInt(shopcar[Index].price));//如果商品为选中的，则合计价格+商品单价      
        break;
      case 'minus':
        shopcar[Index].num--;//对应商品的数量-1      
        shopcar[Index].check && (total -= parseInt(shopcar[Index].price));//如果商品为选中的，则合计价格-商品单价      
        break;
    }
    this.setData({
      shopcarData: shopcar,
      total: total
    });
    const db = wx.cloud.database();
    db.collection('cart').doc(this.data.shopcarData[Index]._id).update({
      data: {
        num: shopcar[Index].num
      },
      success: res => {
        wx.showToast({
          icon: 'none',
          title: '更新数据成功'
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
  },

  //判断是否为全选  
  judgmentAll: function () {
    let shopcar = this.data.shopcarData,
      shoplen = shopcar.length,
      lenIndex = 0;//选中的物品的个数    
    for (let i = 0; i < shoplen; i++) {//计算购物车选中的商品的个数    
      shopcar[i].check && lenIndex++;
    }
    this.setData({
      allsel: lenIndex == shoplen//如果购物车选中的个数和购物车里货物的总数相同，则为全选，反之为未全选    
    });
    console.log('selarr：_____________', this.data.selarr);
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
    db.collection('cart').where({
      _openid: this.data.openid
    }).get({
      success: res => {
        this.setData({
          queryResult: JSON.stringify(res.data, null, 2),
          shopcarData: res.data,
        });
        console.log('[数据库] [查询记录] 成功: ', res.data);
        console.log('this.data.shopcarData[0].good_id_____  : ' + this.data.shopcarData[0].good_id);
        let total = 0, selarr = this.data.selarr, shopcarData = this.data.shopcarData;
        for (let i = 0, len = shopcarData.length; i < len; i++) {//这里是对选中的商品的价格进行总结    
          if (shopcarData[i].check) {
            total += shopcarData[i].num * shopcarData[i].price;
            selarr.push(shopcarData[i]);
          }
        }
        this.setData({
          total: total,
          selarr: selarr
        });

        this.judgmentAll();//判断是否全选
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
    this.onLoad();
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