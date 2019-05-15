import { getItem } from "../../../utils/util";
import { ajax } from "../../../utils/api";
import { goPage } from "../../../utils/common";
Page({

    /**
    * 页面的初始数据
    */
    data: {
        isReady:false,
        imgUrls: [],
        detail:{},
        indicatorDots: false,
        autoplay: false,
        ProductId:'',
        interval: 5000,
        duration: 1000,
        showContact: false,
    },
    onLoad: function (options) {
      this.setData({
          ProductId: options.ProductId
      })
      this.loadData();
    },
    loadData(){
        let UserId = getItem('hd_userId');
        let Token = getItem('hd_token');
        let ProductId = this.data.ProductId
        let personData = {
            UserId,
            Token,
            ProductId
        };
        ajax({
            url:'/App/Product/ProductDetail',
            method: 'POST',
            data:personData
        }).then( ( res) => {
            let content = res.Data.TxtContent.replace(/\<img/gi, '<img style="max-width:100%;height:auto"');

            this.setData({
                detail: {
                    ...res.Data,
                    TxtContent: content
                },
                isReady:true
            })
        }).catch((error) =>{
            console.log(error)
        })

    },
    // 收藏
    handleCollect(){
        let collect_status = this.data.detail.IsCollection;
        let UserId = getItem('hd_userId') || '' ;
        let Token = getItem('hd_token') || '';
        let personData = {
            UserId,
            Token,
            ProductId: this.data.ProductId
        };
        ajax({
            url:'/App/Product/Collection',
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
        let OtherId = this.data.ProductId;
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
                OtherTypeId: 1,
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
                    this.setData({
                        showContact:false
                    })
                }
            })
        }).catch((error) =>{
            console.log(error)
        })
    },
    // 投诉
    handleComplain(){
        let { ProductId } = this.data;
        goPage('投诉',{ OtherId: ProductId,OtherTypeId:1})
    }

})
