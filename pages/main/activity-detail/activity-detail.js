import {getItem} from "../../../utils/util";
import {ajax} from "../../../utils/api";
import {goPage} from "../../../utils/common";
let UserId = getItem('hd_userId') || '';
let Token = getItem('hd_token') || '';

Page({

  /**
   * 页面的初始数据
   */
  data: {
      isReady:false,
      ActivityId:'',
      detail:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
          ActivityId: options.ActivityId
      })
      this.loadData();
  },
    loadData(){
        let { ActivityId }  = this.data
        let personData = {
            UserId: UserId,
            Token: Token,
            ActivityId
        };
        ajax({
            url:'/App/Activity/Detail',
            method: 'POST',
            data:personData
        }).then( ( res) => {
            console.log(res);
            this.setData({
                detail:res.Data,
                isReady:true
            })
        }).catch((error) =>{
            console.log(error)
        })
    },
    // 收藏
    handleCollect(){
        let collect_status = this.data.detail.IsCollection;
        let personData = {
            UserId,
            Token,
            ActivityId: this.data.ActivityId
        };
        ajax({
            url:'/App/Activity/Collection',
            method: 'POST',
            data:personData
        }).then( ( res) => {
            if( collect_status ){
                wx.showToast({
                    title: '取消收藏成功'
                })
            }else{
                wx.showToast({
                    title: '收藏成功'
                })
            }
            this.setData({
                ['detail.IsCollection']: !collect_status
            })
        }).catch((error) =>{
            console.log(error);
            if( collect_status ){
                wx.showToast({
                    title: '取消收藏失败'
                })
            }else{
                wx.showToast({
                    title: '收藏失败'
                })
            }
        })
    },

    // 报名
    handleSignUp(){

    },



})
