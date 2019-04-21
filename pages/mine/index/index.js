import {delItem, getItem} from "../../../utils/util";
import { goPage } from "../../../utils/common";
import Toast from "../../../dist/toast/toast";
import { ajax } from "../../../utils/api";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isPerson: true,
        info:{}
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        this.loadData();
    },
    loadData(){
        let hd_token = getItem('hd_token') || '';
        let hd_userId = getItem('hd_userId') || '';
        if( !hd_token || !hd_userId){
            wx.showModal({
                showCancel:false,
                title:'提示',
                content:'请先登录',
                success: ()=>{
                    goPage('登录',{ }, 4)
                }
            })
            return;
        }
        let personData = {
            UserId: hd_userId,
            Token: hd_token,
        };
        ajax({
            url: '/App/UserCenter/Index',
            method: 'POST',
            data: personData,
        }).then((res) => {
            console.log(res)
            this.setData({
                info: res.Data
            })
        }).catch((error) => {
            console.log(error,'error')
        })




    }
})
