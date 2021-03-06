import { getItem } from './utils/util'
import {getApplicationList, getDomainList, getDomainOutDto, getMainClassList, getSenior} from "./utils/services";

App({
	onLaunch: function() {
		let hd_token = getItem('hd_token') || '';
		let hd_userId = getItem('hd_userId') || '';
		getApplicationList()
		getDomainList();
		getDomainOutDto();
		getMainClassList();
		getSenior();
		// 检测本地用户信息
		// if( !hd_token || !hd_userId){
		// 	wx.reLaunch({
		// 		url: '/pages/other/login/login'
		// 	})
		// }else{
		// 	wx.reLaunch({
		// 		url: '/pages/main/index/index'
		// 	})
		// }
	},

})
