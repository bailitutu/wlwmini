import { goPage  } from '../../../utils/common'
import { ajax } from '../../../utils/api'
import { hex_md5 } from '../../../utils/md5'
import { setItem } from '../../../utils/util'
Page({

    data: {
        account: '',
        password: ''
    },

    changeAccount(e) {
        this.setData({
            account: e.detail
        })
    },
    changePassword(e) {
        this.setData({
            password: e.detail
        })
    },

    handleLogin() {
        let personData = {
            userName: this.data.account,
            pwd: hex_md5(this.data.password)
        };
        ajax({
            url: '/app/User/Login',
            method: 'POST',
            data: personData,
        }).then((res) => {
            setItem('hd_token', res.Data.Token)
            setItem('hd_userId', res.Data.UserId);
            setItem('hd_IsEnterprise', res.Data.IsEnterprise);
            goPage('首页',{},4)
        }).catch((error) => {
            console.log(error)
        })

    },

    // 忘记密码
    handleFindPwd() {
        goPage('忘记密码')
    }
})
