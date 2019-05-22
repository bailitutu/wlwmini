import {getItem} from "../../../utils/util";
import {ajax} from "../../../utils/api";
import { isEmpty,isPhone } from "../../../utils/validate";
import {goPage} from "../../../utils/common";


Page({

    /**
     * 页面的初始数据
     */
    data: {
        isReady: false,
        show: false,
        ActivityId: '',
        detail: {},
        Remarks: '',
        MobilePhone: '',
        CallName: '',
        hasSign: false, //是否报名
        recommendList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            ActivityId: options.ActivityId
        })
        this.loadData();
        this.loadRecommendData();
    },
    loadData() {
        let {ActivityId} = this.data;
        let UserId = getItem('hd_userId') || '';
        let Token = getItem('hd_token') || '';
        let personData = {
            UserId: UserId,
            Token: Token,
            ActivityId
        };
        ajax({
            url: '/App/Activity/Detail',
            method: 'POST',
            data: personData
        }).then((res) => {
            let content = res.Data.TxtContent.replace(/\<img/gi, '<img style="max-width:100%;height:auto"');
            this.setData({
                detail: {
                    ...res.Data,
                    TxtContent: content
                },
                isReady: true,
                hasSign: res.Data.IsSignUp
            })
        }).catch((error) => {
            console.log(error)
        })
    },
    // 收藏
    handleCollect() {
        let collect_status = this.data.detail.IsCollection;
        let UserId = getItem('hd_userId') || '';
        let Token = getItem('hd_token') || '';
        let personData = {
            UserId,
            Token,
            ActivityId: this.data.ActivityId
        };
        ajax({
            url: '/App/Activity/Collection',
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

    // 报名

    handleSignUp() {
        if (this.data.hasSign) {
            wx.showToast({
                title: '已报名',
                icon: 'none'
            })
            return;
        };

        this.setData({
            show: true
        })
    },
    handleChangeCallName(e) {
        this.setData({
            CallName: e.detail
        })
    },
    handleChangePhone(e) {
        this.setData({
            MobilePhone: e.detail
        })
    },
    bindTextAreaBlur(e) {
        this.setData({
            Remarks: e.detail.value
        })
    },
    handleCancel() {
        this.setData({
            show: false,
            Remarks: '',
            MobilePhone: '',
            CallName: ''
        })
    },
    handleConfirm() {
        let { ActivityId, CallName, MobilePhone, Remarks } = this.data;
        let UserId = getItem('hd_userId') || '';
        let Token = getItem('hd_token') || '';
        let personData = {
            UserId: UserId,
            Token: Token,
            ActivityId,
            CallName,
            MobilePhone,
            Remarks
        };

        if (isEmpty(CallName)) {
            wx.showToast({
                title: '请输入姓名',
                icon: 'none'
            })
            return;
        }
        if (isEmpty(MobilePhone)) {
            wx.showToast({
                title: '请输入联系方式',
                icon: 'none'
            })
            return;
        }
        if (!isPhone(MobilePhone)) {
            wx.showToast({
                title: '请输入正确的手机号',
                icon: 'none'
            })
            return;
        }
        ajax({
            url: '/App/Activity/AddSignUp',
            method: 'POST',
            data: personData
        }).then((res) => {
            this.setData({
                show: false,
                Remarks: '',
                MobilePhone: '',
                CallName: '',
                hasSign: true
            })
            wx.showToast({
                title: '报名已提交',
                icon: 'success'
            })

        }).catch((error) => {
            console.log(error);
        })

    },
    // 投诉
    handleComplain(){
        let { ActivityId } = this.data;
        goPage('投诉',{ OtherId: ActivityId,OtherTypeId:4})
    },
    // 获取推荐内容
    loadRecommendData(){
        ajax({
            url:'/App/UserCenter/ActivityIsRecommend',
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
        goPage('活动详情',{ ActivityId: id})
    }
})
