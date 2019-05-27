import {goPage} from '../../../utils/common'
import {getItem,} from '../../../utils/util'

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
        let {type} = e.currentTarget.dataset;
        goPage(type)
    }

})
