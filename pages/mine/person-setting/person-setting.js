import { goPage } from "../../../utils/common";
import {clearAllItem} from "../../../utils/util";
Page({
    data: {
        isReady:false,
        HeadUrl:'',
        NickName:'',
        Phone:'',
    },
    onLoad: function (opts) {
        this.setData({
            HeadUrl:opts.HeadUrl,
            NickName:opts.NickName,
            Phone:opts.Phone
        })
    },
    onShow(){
        this.setData({
            isReady:true
        })
    },
    loginOut() {
        wx.showModal({
            title: '提示',
            content: '确定退出吗？',
            success(res) {
                if (res.confirm) {
                    clearAllItem();
                    goPage('登录',{ },4);
                    return;
                }
            }
        })
    }
})
