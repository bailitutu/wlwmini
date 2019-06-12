import {goPage} from '../../../utils/common'
import { getItem, delItem} from '../../../utils/util'

Page({

    data: {
        isPerson: true,
        isShow: false,
    },

    onLoad: function (options) {
        let hd_IsEnterprise = getItem('hd_IsEnterprise');
        this.setData({
            isPerson: !hd_IsEnterprise,
            isShow: true
        })
    },
    onShow() {
        this.setData({
            isShow: true
        })
    },
    handleRelease(e) {
		let UserId = getItem('hd_userId') || 0;
		let Token = getItem('hd_token') || '';
		if(!UserId || !Token){
			wx.showModal({
				showCancel: true,
				title: '提示',
				content: '登录过期,请先登录！',
				success: (res) => {
					if (res.confirm) {
						delItem('hd_token');
						delItem('hd_userId');
						goPage('登录', {}, 4)
					}
				}
			})
			return;
		}
        let {type} = e.currentTarget.dataset;
        goPage(type)
    }

})
