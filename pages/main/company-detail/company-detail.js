// pages/main/company-detail/company-detail.js
import {getItem} from "../../../utils/util";
import {ajax} from "../../../utils/api";
import {goPage} from "../../../utils/common";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabActive: 0,
        info: {},
        Product:{
            list: [],
            noData: false,
            noMore: false,
        },
        Activity:{
            list: [],
            noData: false,
            noMore: false,
        },
        Scheme:{
            list: [],
            noData: false,
            noMore: false,
        },
        CompanyId:'',
        IsCollection: false,
        showContact: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let CompanyId = options.CompanyId || '';
        let UserId = getItem('hd_userId') || '';
        let Token = getItem('hd_token') || '';
        this.setData({
            CompanyId: options.CompanyId
            ,UserId,
            Token
        })
        this.loadData(UserId,CompanyId);
    },

    loadData(ColleUserId ,UserId){
        let personData = {
            UserId ,
            ColleUserId
        };
        ajax({
            url:'/App/UserCenter/UserEnterpriseDetail',
            method: 'POST',
            data:personData
        }).then( ( res) => {
            console.log(res);
            let info = res.Data.UserEnterprise;
            let ProductNoData = !res.Data.Product || res.Data.Product.length == 0 ? true : false;
            let ActivityNoData = !res.Data.Activity || res.Data.Activity.length == 0 ? true : false;
            let SchemeNoData = !res.Data.Scheme || res.Data.Scheme.length == 0 ? true : false;
            let IsCollection = res.Data.IsCollection;
            this.setData({
                isReady:true,
                info,
                IsCollection,
                Product: {
                    list:res.Data.Product || [],
                    noMore:true,
                    noData:ProductNoData,
                },
                Activity: {
                    list:res.Data.Activity || [],
                    noMore:true,
                    noData:ActivityNoData,
                },
                Scheme: {
                    list:res.Data.Scheme || [],
                    noMore:true,
                    noData:SchemeNoData,
                },
            })
        }).catch((error) =>{
            console.log(error)
        })

    },

    handleProductDetail(e){
        let { id } = e.currentTarget.dataset;
        goPage('产品详情',{ ProductId: id})
    },
    handlePlanDetail(e){
        let { id } = e.currentTarget.dataset;
        goPage('方案详情',{ SchemeId: id})
    },
    handleActivityDetail(e){
        let { id } = e.currentTarget.dataset;
        goPage('活动详情',{ ActivityId: id})
    },
    onTabChange() { },
    // 收藏
    handleCollect() {
        let collect_status = this.data.IsCollection || false;
        let { UserId,Token, CompanyId }= this.data;
        let personData = {
            UserId,
            Token,
            EnterpriseUserId: CompanyId ,
        };
        ajax({
            url: '/App/UserCenter/EnterpriseCollection',
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
                IsCollection: !collect_status
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
        let { UserId,Token ,CompanyId }= this.data;
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
                OtherId: CompanyId ,
                OtherTypeId: 5,
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

})
