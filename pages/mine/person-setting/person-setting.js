import { goPage } from "../../../utils/common";
import {delItem, getItem} from "../../../utils/util";
import {ajax} from "../../../utils/api";
let UserId = getItem('hd_userId') || '';
let Token = getItem('hd_token') || '';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isReady:false,
        detail: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.loadData();
    },
    loadData(){
        let personData = {
            UserId: UserId,
            Token: Token,
        };
        ajax({
            url:'/App/User/GetUserInfo',
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
    loginOut() {
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
