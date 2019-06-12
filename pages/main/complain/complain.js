// pages/main/complain/complain.js
import {getItem} from "../../../utils/util";
import {ajax} from "../../../utils/api";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        ReportEnumList: [],
        OtherId: '',
        OtherType: '',
        ReportEnum: '',
        ReportContent: '',
        ReportImg: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (opt) {
        this.setData({
            OtherId: opt.OtherId || '',
            OtherType: opt.OtherTypeId || '',
        })

        this.loadReportEnumList();
    },
    loadReportEnumList() {
        let UserId = getItem('hd_userId') || 0;
        let Token = getItem('hd_token') || '';
        let {OtherId, OtherType} = this.data;
        ajax({
            url: '/App/UsersReport/ReportEnumList',
            method: 'POST',
            data: {
                UserId,
                Token,
                OtherId,
                OtherType,
            }
        }).then((res) => {
            this.setData({
                ReportEnumList: res.Data || [],
                isReady: true,
                ReportEnum: res.Data[0].ReportEnum
            })

        }).catch((error) => {
            console.log(error)
        })
    },
    // 选择类型
    handleReportEnum(e) {
        let {id} = e.currentTarget.dataset;
        this.setData({
            ReportEnum: id
        })
    },
    // 举报内容
    bindTextAreaBlur(e) {
        this.setData({
            ReportContent: e.detail
        })
    },

    handleUploadImg(e) {
        this.setData({
            ReportImg: e.detail[0].imgUrl
        })
    },
    handleRemoveImg(e) {
        this.setData({
            ReportImg: ''
        })
    },
    handleSubmit() {
        let {
            OtherId,
            OtherType,
            ReportEnum,
            ReportContent,
            ReportImg
        } = this.data;
        let UserId = getItem('hd_userId') || 0;
		let Token = getItem('hd_token') || '';

        ajax({
            url: '/App/UsersReport/AddReport',
            method: 'POST',
            data: {
                UserId,
                Token,
                OtherId,
                OtherType,
                ReportEnum,
                ReportContent,
                ReportImg
            }
        }).then((res) => {
            wx.showToast({
                title: '投诉成功！',
                icon: 'none',
                success: () => {
                    setTimeout(() => {
                        wx.navigateBack();
                    }, 1500)
                }
            })
        }).catch((error) => {
            console.log(error)
        })
    }

})
