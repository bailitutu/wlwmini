import { PageURL } from './utils/config'
import { getItem } from './utils/util'
App({
    onLaunch: function() {
        let hd_token = getItem('hd_token') || '';
        let hd_userId = getItem('hd_userId') || '';

        // 检测本地用户信息
        if( !hd_token || !hd_userId){
            wx.reLaunch({
                url: PageURL['登录']
            })
        }else{
            wx.reLaunch({
                url: PageURL['首页']
            })
        }



        // // 展示本地存储能力
        // var logs = wx.getStorageSync('logs') || [];
        // logs.unshift(Date.now())
        // wx.setStorageSync('logs', logs)
        //
        // // 登录
        // wx.login({
        //         success: res => {
        //             // 发送 res.code 到后台换取 openId, sessionKey, unionId
        //         }
        //     })
        //     // 获取用户信息
        // wx.getSetting({
        //     success: res => {
        //         if (res.authSetting['scope.userInfo']) {
        //             // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        //             wx.getUserInfo({
        //                 success: res => {
        //                     // 可以将 res 发送给后台解码出 unionId
        //                     this.globalData.userInfo = res.userInfo
        //
        //                     // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        //                     // 所以此处加入 callback 以防止这种情况
        //                     if (this.userInfoReadyCallback) {
        //                         this.userInfoReadyCallback(res)
        //                     }
        //                 }
        //             })
        //         }
        //     }
        // })
    },
    globalData: {
        userInfo: null,
    },
    // 获取用户openID；
    getUserOpenId: function(callback) {
        var self = this;
        if (self.globalData.openId) {
            callback(null, self.globalData.openId);
        } else {
            wx.login({
                success: function(data) {
                    self.submit('/business/GetOpenid', {
                        code: data.code
                    }, function(res) {
                        callback(null, self.globalData.openId)
                    })
                },
                fail: function(err) {
                    callback(err)
                }
            })
        }
    },
})
