import {getItem} from "../../../utils/util";
import {ajax} from "../../../utils/api";
import {goPage} from "../../../utils/common";

Page({
    data: {
        isReady: false,
        WantBuyId: '',
        detail: {},
        UserId: '',
        Token: "",
    },
    onLoad: function (options) {
        let UserId = getItem('hd_userId') || '';
        let Token = getItem('hd_token') || '';
        this.setData({
            UserId,
            Token,
            WantBuyId: options.WantBuyId
        })
        this.loadData();
    },
    loadData() {
        let {UserId, Token, WantBuyId} = this.data

        let personData = {
            UserId,
            Token,
            WantBuyId
        };
        ajax({
            url: '/App/WantBuy/Detail',
            method: 'POST',
            data: personData
        }).then((res) => {
            let content = res.Data.TxtContent.replace(/\<img/gi, '<img style="max-width:100%;height:auto"');

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
        let {UserId, Token, WantBuyId} = this.data
        let personData = {
            UserId,
            Token,
            WantBuyId
        };
        ajax({
            url: '/App/WantBuy/Collection',
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
        let {UserId, Token, WantBuyId} = this.data
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
                OtherId:WantBuyId,
                OtherTypeId: 3,
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
        let {WantBuyId} = this.data;
        goPage('投诉', {OtherId: WantBuyId, OtherTypeId: 3})
    }
})
