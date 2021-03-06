import {getItem} from "../../../utils/util";
import {ajax} from "../../../utils/api";
import {goPage} from "../../../utils/common";

Page({
    data: {
        tabActive: 0,
        Token: '',
        UserId: '',
        publicInfo: {
            list: [],
            noMore: false,
            noData: false
        },
        signInfo: {
            list: [],
            noMore: false,
            noData: false
        },
        collectInfo: {
            list: [],
            noMore: false,
            noData: false
        }
    },
    onLoad: function (options) {
        let UserId = getItem('hd_userId') || '';
        let Token = getItem('hd_token') || '';
        this.setData({
            UserId,
            Token,
        })
        this.onTabChange({
            detail: {
                index: 0
            }
        });
    },

    onTabChange(e) {
        switch (e.detail.index) {
            case 1:
                this.setData({
                    tabActive: 1,
                    signInfo: {
                        list: [],
                        noMore: false,
                        noData: false
                    }
                });
                this.getSignList();
                break;
            case 2:
                this.setData({
                    tabActive: 2,
                    collectInfo: {
                        list: [],
                        noMore: false,
                        noData: false
                    }
                });
                this.getCollectList();
                break;
            default:
                this.setData({
                    tabActive: 0,
                    publicInfo: {
                        list: [],
                        noMore: false,
                        noData: false
                    }
                });
                this.getPublicList();
                break;
        }
    },
    getPublicList() {
        let {UserId, Token} = this.data;
        ajax({
            url: '/App/UserCenter/ActivityList',
            method: 'POST',
            data: {
                UserId,
                Token
            }
        }).then((res) => {
            let noData = !res.Data || res.Data.length == 0 ? true : false;
            this.setData({
                publicInfo: {
                    list:res.Data,
                    noMore: true,
                    noData,
                }
            })
        }).catch((error) => {
            console.log(error)
        })

    },
    getSignList() {
        let {UserId, Token} = this.data;
        ajax({
            url: '/App/UserCenter/ActivitySignList',
            method: 'POST',
            data: {
                UserId,
                Token
            }
        }).then((res) => {
            let noData = !res.Data || res.Data.length == 0 ? true : false;
            this.setData({
                signInfo: {
                    list:res.Data,
                    noMore: true,
                    noData,
                }
            })
        }).catch((error) => {
            console.log(error)
        })

    },
    getCollectList() {
        let {UserId, Token} = this.data;
        ajax({
            url: '/App/UserCenter/ActivityCollect',
            method: 'POST',
            data: {
                UserId,
                Token
            }
        }).then((res) => {
            let noData = !res.Data || res.Data.length == 0 ? true : false;
            this.setData({
                collectInfo: {
                    list: res.Data || [],
                    noMore: true,
                    noData,
                }
            })
        }).catch((error) => {
            console.log(error)
        })
    },

    // 扫一扫
    handleScanCode(e){
        let { id } = e.currentTarget.dataset;
        let {UserId, Token} = this.data;
        wx.scanCode({
            success: (res) => {
                let { ActivityId,SigneId } = JSON.parse(res.result);
                ajax({
                    url: '/App/UserCenter/ConfirmActivitySignature',
                    method: 'POST',
                    data: {
                        ActivityId ,
                        SignId: SigneId,
                        UserId,
                        Token
                    }
                }).then((result) => {
                    wx.showModal({
                        title: '提示',
                        content: '您已签到成功！',
                        showCancel: false,
                        success:()=>{}
                    })
                }).catch((error) => {
                    console.log(error)
                })


            }
        })
    },

    // 查看详情
    handleCheckDetail(e) {
        let {id} = e.currentTarget.dataset;
        goPage('活动详情', {ActivityId: id})
    },
    // 查看报名情况
    handleCheckSignDetail(e) {
        let {id} = e.currentTarget.dataset;
        goPage('报名情况', {ActivityId: id})
    },
    // 编辑活动
    handleEditActivity(e) {
        let {id} = e.currentTarget.dataset;
        goPage('发布活动', {ActivityId: id, isEdit: 1})
    },
    // 查看签到二维码
    handleCheckSignCode(e){
        let { signeid,activityid } = e.currentTarget.dataset;
        goPage('签到二维码', {SigneId: signeid,ActivityId: activityid})

    },
    //退出活动
    handleQuitActivity(e) {
		let { id, index } = e.currentTarget.dataset;
		let { UserId, Token, signInfo } = this.data;
        wx.showModal({
            title: '提示',
            content: '确定退出该活动吗？',
            success: (res) => {
				if (res.confirm) {
					ajax({
						url: '/App/UserCenter/DeleteActivitySign',
						method: 'POST',
						data: {
							UserId,
							Token,
							signId: id
						}
					}).then((res) => {
						wx.showToast({
							title: '退出成功！',
							icon: 'none'
						})
						signInfo.list.splice(index, 1);
						this.setData({
							['signInfo.list']: signInfo.list
						})
					}).catch((error) => {
						console.log(error)
						wx.showToast({
							title: '退出失败，请重试！',
							icon: 'none'
						})
					})
				}
            }
        })

    },

    // 删除已发布活动
    handleDeleteActivity(e) {
        wx.showModal({
            title: '提示',
            content: '确定删除该活动吗？',
            success: (res) => {
				if (res.confirm) {
					let { id, index } = e.currentTarget.dataset;
					let { UserId, Token, publicInfo } = this.data;
					ajax({
						url: '/App/UserCenter/DeleteActivity',
						method: 'POST',
						data: {
							UserId,
							Token,
							ActivityId: id
						}
					}).then((res) => {
						wx.showToast({
							title: '删除成功！',
							icon: 'none'
						})
						publicInfo.list.splice(index, 1);
						this.setData({
							['publicInfo.list']: publicInfo.list
						})
					}).catch((error) => {
						console.log(error)
						wx.showToast({
							title: '删除失败，请重试！',
							icon: 'none'
						})
					})
				}

            }
        })
    },
    //删除已收藏活动
    handleDeleteCollect(e) {
        wx.showModal({
            title: '提示',
            content: '确定删除该活动吗？',
            success: (res) => {
				if (res.confirm) {
					let { id, index } = e.currentTarget.dataset;
					let { UserId, Token, collectInfo } = this.data;
					ajax({
						url: '/App/UserCenter/DelCollect',
						method: 'POST',
						data: {
							UserId,
							Token,
							Id: id
						}
					}).then((result) => {
						wx.showToast({
							title: '删除成功！',
							icon: 'none'
						})
						collectInfo.list.splice(index, 1);
						this.setData({
							['collectInfo.list']: collectInfo.list
						})
					}).catch((error) => {
						console.log(error)
						wx.showToast({
							title: '删除失败，请重试！',
							icon: 'none'
						})
					})
				}

            }
        })
    }

})
