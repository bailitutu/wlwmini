import {goPage} from '../../../utils/common'
import { getItem, delItem} from '../../../utils/util'

Page({

    data: {
        isPerson: true,
        isShow: false,
    },
    onShow() {
		this.checkLogin();
        this.setData({
            isShow: true
        })
	},
	checkLogin(){
		let UserId = getItem('hd_userId') || 0;
		let Token = getItem('hd_token') || '';
		if (!UserId || !Token) {
			wx.showModal({
				showCancel: true,
				title: '提示',
				content: '登录过期,请先登录！',
				success: (res) => {
					if (res.confirm) {
						delItem('hd_token');
						delItem('hd_userId');
						goPage('登录', {}, 4)
					}else{
						goPage('主页', {}, 2);
					}
				}
			})
			return;
		}else{
			let hd_IsEnterprise = getItem('hd_IsEnterprise');
			this.setData({
				isPerson: !hd_IsEnterprise,
				isShow: true
			})
		}
	},
    handleRelease(e) {
		let {type} = e.currentTarget.dataset;
		goPage(type)
    }

})
