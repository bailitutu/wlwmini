import {ajax} from "../../../utils/api";
import {goPage} from "../../../utils/common";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        pwd_one: '',
        pwd_two: '',
        userName: '',
        code: '',
        isPhone: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options);
        let {userName, code, isPhone} = options.query;
        this.setData({
            userName,
            code,
            isPhone
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },
    handleChangePwdOne(e) {
        this.setData({
            pwd_one: e.detail
        })
    },
    handleChangePwdTwo(e) {
        this.setData({
            pwd_two: e.detail
        })
    },

    handleSubmit() {
        let {isPhone, code, userName, pwd_one, pwd_two} = this.data;

        if (pwd_one !== pwd_two) {
            wx.showToast({
                title: '两次输入的密码不一致',
                icon: 'none'
            })
            this.setData({
                pwd_two: ''
            })
            return;
        }

        let postData = {
            userName,
            code,
            pwd_one,
            isPhone
        };
        let url = isPhone == '2' ? "/app/User/EmailForgetPassword" : '/app/User/PhoneForgetPassword'
        ajax({
            url,
            method: 'POST',
            data: postData
        }).then((res) => {
            wx.showToast({
                title: '修改成功',
                icon: 'none',
                success: () => {
                    goPage('登录');
                }
            })
        }).catch((error) => {
            console.log(error)
        })


    }


})
