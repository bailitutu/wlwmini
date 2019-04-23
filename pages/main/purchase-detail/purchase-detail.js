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
      WantBuyId:'',
      detail:{},

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
          WantBuyId: options.WantBuyId
      })
      this.loadData();
  },
    loadData(){
        let WantBuyId = this.data.WantBuyId
        let personData = {
            UserId: UserId,
            Token: Token,
            WantBuyId
        };
        ajax({
            url:'/App/WantBuy/Detail',
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
            WantBuyId: this.data.WantBuyId
        };
        ajax({
            url:'/App/WantBuy/Collection',
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
        this.setData({
            showContact: true
        })
    },
    handleConfirmContact(e){
        let  contactText =  e.detail;
        let UserId = getItem('hd_userId');
        let Token = getItem('hd_token');
        let OtherId = this.data.WantBuyId;
        if( contactText == ''){
            wx.showToast({
                title: '请输入咨询内容',
                icon: 'none'
            })
            return;
        }
        ajax({
            url:'/App/Home/AddMessage',
            method: 'POST',
            data:{
                OtherId,
                OtherTypeId: 3,
                Msg:contactText,
                MsgType:1,
                UserId,
                Token,
            }
        }).then( ( res) => {
            wx.showToast({
                title: '留言成功！',
                icon:'none',
                success: () => {
                    setTimeout(()=>{
                        this.setData({
                            showContact:false
                        })
                    },1500)
                }
            })
        }).catch((error) =>{
            console.log(error)
        })
    },

    // 投诉
    handleComplain(){
        let { WantBuyId } = this.data;
        goPage('投诉',{ OtherId: WantBuyId,OtherTypeId:3})
    }
})
