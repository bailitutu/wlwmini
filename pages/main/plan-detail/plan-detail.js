// pages/main/plan-detail/plan-detail.js
import {getItem} from "../../../utils/util";
import {ajax} from "../../../utils/api";
import {goPage} from "../../../utils/common";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isReady: false,
        SchemeId: '',
        detail: {},
        indicatorDots: false,
        autoplay: false,
        interval: 5000,
        duration: 1000,
        showContact: false,
        recommendList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let UserId = getItem('hd_userId') || 0;
        let Token = getItem('hd_token') || '';
        this.setData({
            SchemeId: options.SchemeId
            ,UserId,
            Token
        })
        this.loadData();
        this.loadRecommendData();
    },

    loadData() {
        let { SchemeId ,UserId,Token  }= this.data;
        let personData = {
            UserId,
            Token,
            SchemeId
        };
        ajax({
            url: '/App/Scheme/Detail',
            method: 'POST',
            data: personData
        }).then((res) => {
            let content = res.Data.TxtContent.replace(/\<img/gi, '<img style="max-width:100% !important;height:auto!important;"');
            this.setData({
                detail: {
                    ...res.Data,
                    TxtContent: content
                },
                isReady: true
            })
        }).catch((error) => {
            console.log(error)
        })

    },
    // 收藏
    handleCollect() {
        let collect_status = this.data.detail.IsCollection;
        let { UserId,Token  }= this.data;
        let personData = {
            UserId,
            Token,
            SchemeId: this.data.SchemeId
        };
        ajax({
            url: '/App/Scheme/Collection',
            method: 'POST',
            data: personData
        }).then((res) => {
            if (collect_status) {
                wx.showToast({
                    title: '取消收藏成功'
                })
            } else {
                wx.showToast({
                    title: '收藏成功'
                })
            }
            this.setData({
                ['detail.IsCollection']: !collect_status
            })
        }).catch((error) => {
            if (collect_status) {
                wx.showToast({
                    title: '取消收藏失败'
                })
            } else {
                wx.showToast({
                    title: '收藏失败'
                })
            }
        })
    },

    // 联系
    handleConnect() {
        this.setData({
            showContact: true
        })
    },
    handleConfirmContact(e) {
        let contactText = e.detail;
        let { UserId,Token ,SchemeId }= this.data;
        if (contactText == '') {
            wx.showToast({
                title: '请输入咨询内容',
                icon: 'none'
            })
            return;
        }
        ajax({
            url: '/App/Home/AddMessage',
            method: 'POST',
            data: {
                OtherId: SchemeId ,
                OtherTypeId: 2,
                Msg: contactText,
                MsgType: 1,
                UserId,
                Token,
            }
        }).then((res) => {
            wx.showToast({
                title: '留言成功！',
                icon: 'none',
                success: () => {
                    this.setData({
                        showContact: false
                    })
                }
            })
        }).catch((error) => {
            console.log(error)
        })
    },

    // 投诉
    handleComplain() {
        let {SchemeId} = this.data;
        goPage('投诉', {OtherId: SchemeId, OtherTypeId: 2})
    },
    // 获取推荐内容
    loadRecommendData(){
        ajax({
            url:'/App/UserCenter/SchemeIsRecommend',
            method: 'POST',
            data:{}
        }).then( ( res) => {
            this.setData({
                recommendList: res.Data || []
            })
        }).catch((error) =>{
            console.log(error,'error');
        })
    },
    // 查看推荐内容
    handleCheckRecommend(e){
        let { id } = e.currentTarget.dataset;
        goPage('方案详情',{ SchemeId: id})
    }
})
