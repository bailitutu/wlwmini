import { goPage } from "../../../utils/common";
import {delItem, getItem} from "../../../utils/util";
import {ajax} from "../../../utils/api";

Page({

    data: {
        isReady:false,
        detail: {}
    },

    onLoad: function (options) {
        this.loadData();
    },
    loadData(){
        let UserId = getItem('hd_userId') || '';
        let Token = getItem('hd_token') || '';
        let personData = {
            UserId: UserId,
            Token: Token,
        };
        ajax({
            url:'/App/UserCenter/EnterpriseCenter',
            method: 'POST',
            data:personData
        }).then( ( res) => {
            console.log(res.Data);
            this.setData({
                detail:res.Data,
                isReady:true
            })
        }).catch((error) =>{
            console.log(error)
        })
    },
    // 编辑
    handleEdit(){
        goPage('企业编辑')
    },

    //退出登录
    handleLoginOut() {
        wx.showModal({
            title: '提示',
            content: '确定退出吗？',
            success(res) {
                if (res.confirm) {
                    delItem('hd_token');
                    delItem('hd_userId');
                    goPage('登录', { },4)
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    }
})
