// pages/other/login/login.js
import  Toast  from '../../../dist/toast/toast'
const APP = getApp();
import { goPage } from '../../../utils/common'
import { ajax } from '../../../utils/api'
import { isPhone } from '../../../utils/validate'
import { setItem } from "../../../utils/util";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        show: false,
        phone:'',
        code:'',
        hasSend: false,
        leftTime: 60
    },
    changePhone(e){
        this.setData({
            phone:e.detail
        })
    },
    changePwdCode(e) {
        this.setData({
            code:e.detail
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
        if(this.data.hasSend){
            return;
        }
        let phone = this.data.phone;
        if( phone == ''){
            Toast('请先输入手机号');
            return;
        }
        if(!isPhone(phone)){
            Toast('手机号格式错误');
            return;
        }
        let postData = {
            userName: phone,
            isPhone: true,
        }
        ajax({
            url:'/App/User/QuickLoginSendCode',
            method: 'POST',
            data:postData
        }).then( ( res) => {
            this.setData({
                hasSend:true
            })
            Toast.success('验证码已发送');
            // 倒计时
            this.downcount();
        }).catch((error) =>{
            console.log(error)
        })
    },
    // 倒计时处理
    downcount() {
        let left_time = 60;
        let timer = setInterval(() => {
            if(left_time === 0){
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
        },1000)
    },
    //登录
    handleLogin(){
        let postData={
            userName: this.data.phone,
            Code: this.data.code
        }
        ajax({
            url:'/app/User/QuickLogin',
            method: 'POST',
            data:postData
        }).then(( res) => {
            setItem('hd_token', res.Data.Token)
            setItem('hd_userId', res.Data.UserId);
            goPage('首页',{},4)
        }).catch((error) =>{
            console.log(error)
        })
    },
    // 前往注册
    handleRegister() {
        goPage('注册')
    },

})
