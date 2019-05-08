import { PageURL } from './utils/config'
import { getItem } from './utils/util'
App({
    onLaunch: function() {
        // let hd_token = getItem('hd_token') || '';
        // let hd_userId = getItem('hd_userId') || '';
        //
        // // 检测本地用户信息
        // if( !hd_token || !hd_userId){
        //     wx.reLaunch({
        //         url: PageURL['登录']
        //     })
        // }else{
        //     wx.reLaunch({
        //         url: PageURL['首页']
        //     })
        // }
    }

})
