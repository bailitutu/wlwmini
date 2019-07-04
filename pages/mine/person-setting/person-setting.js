import { goPage } from "../../../utils/common";
import { delItem } from "../../../utils/util";
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
					delItem('hd_token');
					delItem('hd_userId');
                    goPage('登录',{ },4);
                    return;
                }
            }
        })
    }
})
