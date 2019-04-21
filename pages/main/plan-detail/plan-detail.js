// pages/main/plan-detail/plan-detail.js
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
      SchemeId:'',
      detail:{

      },
      indicatorDots: false,
      autoplay: false,
      interval: 5000,
      duration: 1000
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
          SchemeId: options.SchemeId
      })
      this.loadData();
  },

    loadData(){
        let SchemeId = this.data.SchemeId
        let personData = {
            UserId: UserId,
            Token: Token,
            SchemeId
        };
        ajax({
            url:'/App/Scheme/Detail',
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
            SchemeId: this.data.SchemeId
        };
        ajax({
            url:'/App/Scheme/Collection',
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

    // 联系
    handleConnect(){

    },

    // 投诉
    handleComplain(){
        let { SchemeId } = this.data;
        goPage('投诉',{ OtherId: SchemeId,OtherTypeId:2})
    }
})
