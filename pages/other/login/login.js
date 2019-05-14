// pages/other/login/login.js
import {goPage} from '../../../utils/common'
import {ajax} from '../../../utils/api'
import {isPhone} from '../../../utils/validate'
import {setItem} from "../../../utils/util";

Page({
    data: {
        show: false,
        phone: '',
        code: '',
        hasSend: false,
        leftTime: 60,
        nickName: '',
        HeadUrl: ''
    },
    getUserInfo: function (e) {
        wx.getSetting({
            success:(res) => {
                if (!res.authSetting['scope.userInfo']) {
                    wx.authorize({
                        scope: 'scope.userInfo',
                        success:(user) => {
                            this.userInfo();
                        }
                    })
                }else{
                    this.userInfo();
                }
            }
        })
    },
    userInfo(){
        wx.getUserInfo({
            withCredentials: false,
            lang: 'zh_CN',
            success:(res) => {
                if(res.errMsg == 'getUserInfo:ok'){
                    let {
                        nickName,
                        avatarUrl
                    } = res.userInfo
                    this.setData({
                        nickName,
                        HeadUrl: avatarUrl
                    })
                    this.userLogin();
                }else{
                    wx.showToast({
                        title: '获取用户信息失败，请重试',
                        icon: 'none'
                    })
                }
            },
            fail:()=>{
                wx.showToast({
                    title: '获取用户信息失败，请重试',
                    icon: 'none'
                })
            }
        })
    },
    userLogin(){
        wx.login({
            success: res => {
                ajax({
                    url: '/app/auth/AuthWeChat',
                    method: 'GET',
                    data: {
                        code: res.code,
                    }
                }).then((data) => {
                    this.AuthorizedLogin();
                }).catch((error) => {
                    console.log(error)
                })

            }
        })
    },

    AuthorizedLogin(openId) {
        ajax({
            url: '/App/User/AuthorizedLogin',
            method: 'POST',
            data: {
                appToken: openId,
                userTypeId: 4
            }
        }).then((res) => {
            setItem('hd_token', res.Data.Token)
            setItem('hd_userId', res.Data.UserId);
            setItem('hd_IsEnterprise', res.Data.IsEnterprise);
            goPage('首页',{},4)
        }).catch((error) => {
            console.log(error);
            //  授权失败跳转注册；

            let { nickName,HeadUrl } = this.data;
            goPage('注册', { nickName, HeadUrl, openId })


        })
    },

    changePhone(e) {
        this.setData({
            phone: e.detail
        })
    },
    changePwdCode(e) {
        this.setData({
            code: e.detail
        })
    },
    //验证码登录
    handleYzmLogin() {
        this.setData({
            show: true
        })
    },
    // 密码登录
    handlePwdLogin() {
        goPage('密码登录')
    },
    // 关闭弹窗
    handleClosePopup() {
        this.setData({
            show: false
        })
    },
    // 发送验证码
    handleSendCode() {
        if (this.data.hasSend) {
            return;
        }
        let phone = this.data.phone;
        if (phone == '') {
            wx.showToast({
                title: '请先输入手机号',
                icon: 'none'
            });
            return;
        }
        if (!isPhone(phone)) {
            wx.showToast({
                title: '手机号格式错误',
                icon: 'none'
            });
            return;
        }
        let postData = {
            userName: phone,
            isPhone: true,
        }
        ajax({
            url: '/App/User/QuickLoginSendCode',
            method: 'POST',
            data: postData
        }).then((res) => {
            this.setData({
                hasSend: true
            })
            wx.showToast({
                title: '验证码已发送',
                icon: 'none'
            });
            // 倒计时
            this.downcount();
        }).catch((error) => {
            console.log(error)
        })
    },
    // 倒计时处理
    downcount() {
        let left_time = 60;
        let timer = setInterval(() => {
            if (left_time === 0) {
                this.setData({
                    hasSend: false
                })
                clearInterval(timer);
                return;
            }
            left_time--
            this.setData({
                leftTime: left_time
            })
        }, 1000)
    },
    //登录
    handleLogin() {
        let postData = {
            userName: this.data.phone,
            Code: this.data.code
        }
        ajax({
            url: '/app/User/QuickLogin',
            method: 'POST',
            data: postData
        }).then((res) => {
            setItem('hd_token', res.Data.Token)
            setItem('hd_userId', res.Data.UserId);
            goPage('首页', {}, 4)
        }).catch((error) => {
            console.log(error)
        })
    },
    // 前往注册
    handleRegister() {
        goPage('注册')
    },

})
