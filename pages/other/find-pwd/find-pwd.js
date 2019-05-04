import { isPhone } from "../../../utils/validate"
import { goPage } from '../../../utils/common'
import { ajax } from '../../../utils/api'

let app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        hasSend:false,
        leftTime: 60,
        code:'',
        phone:'',
        findType: '1',
    },
    handleSelectType(e){
        let { type } = e.currentTarget.dataset;
        this.setData({
            findType: type
        })
    },
    changePhone(e) {
        this.setData({
            phone:e.detail
        })
    },
    // 输入验证码
    changePwdCode(e) {
        this.setData({
            code:e.detail
        })
    },
    //下一步
    handleNext(){
        let { phone,code ,findType} = this.data;
        let  is_phone = findType == '1' ? true : false
        let postData = {
            userName: phone,
            code: code,
            SendType: 2,
            isPhone: is_phone
        };
        ajax({
            url:'/app/User/VerificationCode',
            method: 'POST',
            data:postData
        }).then( ( res) => {
            goPage('重置密码',{ isPhone: findType, code: code ,userName: phone })
        }).catch((error) =>{
            console.log(error)
        })
    },



    // 发送验证码
    handleSendCode() {
        let { phone,findType,hasSend }= this.data;

        let is_phone = false;
        if(hasSend){
            return;
        }
        if( findType == '1'){
            is_phone = true ;
            if( phone == ''){
                wx.showToast({
                    title: '请先输入手机号/邮箱',
                    icon:'none'
                })
                return;
            }
            if(!isPhone(phone)){
                wx.showToast({
                    title: '手机号格式错误',
                    icon:'none'
                })
                return;
            }
        }else{
            if( phone == ''){
                wx.showToast({
                    title: '请先输入手机号/邮箱',
                    icon:'none'
                })
                return;
            }
        }

        let postData = {
            userName: phone,
            isPhone: is_phone,
        }
        ajax({
            url:'/App/User/ForgetPasswordSendCode',
            method: 'POST',
            data:postData
        }).then( ( res) => {
            this.setData({
                hasSend:true
            })
            wx.showToast({
                title: '验证码已发送'
            })
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

})
