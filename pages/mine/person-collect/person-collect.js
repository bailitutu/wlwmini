// pages/mine/person-collect/person-collect.js
import {ajax} from "../../../utils/api";
import {getItem} from "../../../utils/util";
import {goPage} from "../../../utils/common";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        Token:'',
        UserId:'',
        currentTab: 0,
        activityInfo: {
            list: [],
            noData: false,
            noMore: false
        },
        purchaseInfo: {
            list: [],
            noData: false,
            noMore: false
        },
        planInfo: {
            list: [],
            noData: false,
            noMore: false
        },
        productInfo: {
            list: [],
            noData: false,
            noMore: false
        },
        companyInfo: {
            list: [],
            noData: false,
            noMore: false
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        let UserId = getItem('hd_userId') || '';
        let Token = getItem('hd_token') || '';
        this.setData({
            UserId,
            Token,
        })
        this.onTabChange({
            detail:{
                index: 0
            }
        });
    },

    onTabChange(e){
          switch (e.detail.index) {
              case 1:
                  this.setData({
                      currentTab:1,
                      purchaseInfo: {
                          list: [],
                          noMore: false,
                          noData: false
                      }
                  });
                  this.getPurchaseList();
                  break;
              case 2:
                  this.setData({
                      currentTab:2,
                      planInfo: {
                          list: [],
                          noMore: false,
                          noData: false
                      }
                  });
                  this.getPlanList();
                  break;
              case 3:
                  this.setData({
                      currentTab:3,
                      productInfo: {
                          list: [],
                          noMore: false,
                          noData: false
                      }
                  });
                  this.getProductList();
				  break;
			  case 4:
				  this.setData({
					  currentTab: 4,
					  companyInfo: {
						  list: [],
						  noMore: false,
						  noData: false
					  }
				  });
				  this.getCompanyList();
				  break;
              default:
                  this.setData({
                      currentTab: 0,
                      activityInfo: {
                          list: [],
                          noMore: false,
                          noData: false
                      }
                  });
                  this.getActivityList();
                  break;
          }
    },


    getActivityList(){
        let { UserId, Token  } = this.data;
        ajax({
            url:'/App/UserCenter/ActivityCollect',
            method: 'POST',
            data:{
                UserId,
                Token
            }
        }).then( ( res) => {
            let noData = !res.Data ||  res.Data.length == 0 ? true : false;
            this.setData({
                activityInfo: {
                    list:res.Data,
                    noMore:true,
                    noData,
                }
            })
        }).catch((error) =>{
            console.log(error)
        })
    },
    getPurchaseList() {
        let { UserId, Token  } = this.data;
        ajax({
            url:'/App/UserCenter/WantBuyCollect',
            method: 'POST',
            data:{
                UserId,
                Token
            }
        }).then( ( res) => {
            let noData = !res.Data || res.Data.length == 0 ? true : false;
            this.setData({
                purchaseInfo: {
                    list:res.Data,
                    noMore:true,
                    noData,
                }
            })
        }).catch((error) =>{
            console.log(error)
        })

    },
    getPlanList(){
        let { UserId, Token  } = this.data;
        ajax({
            url:'/App/UserCenter/SchemeCollect',
            method: 'POST',
            data:{
                UserId,
                Token
            }
        }).then( ( res) => {
            let noData = !res.Data || res.Data.length == 0 ? true : false;
            this.setData({
                planInfo: {
                    list:res.Data,
                    noMore:true,
                    noData,
                }
            })
        }).catch((error) =>{
            console.log(error)
        })
    },
    getProductList(){
        let { UserId, Token  } = this.data;
        ajax({
            url:'/App/UserCenter/ProductCollect',
            method: 'POST',
            data:{
                UserId,
                Token
            }
        }).then( ( res) => {
            let noData = !res.Data || res.Data.length == 0 ? true : false;
            this.setData({
                productInfo: {
                    list:res.Data,
                    noMore:true,
                    noData,
                }
            })
        }).catch((error) =>{
            console.log(error)
        })
	},
	getCompanyList() {
		let { UserId, Token } = this.data;
		ajax({
			url: '/App/UserCenter/EnterpriseCollect',
			method: 'POST',
			data: {
				UserId,
				Token
			}
		}).then((res) => {
			let noData = !res.Data || res.Data.length == 0 ? true : false;
			this.setData({
				companyInfo: {
					list: res.Data,
					noMore: true,
					noData,
				}
			})
		}).catch((error) => {
			console.log(error)
		})
	},
    handleDelete(e){
        wx.showModal({
            title:'提示',
            content: '确定删除该收藏吗？',
            success:(res)=>{
                if (res.confirm) {
                    let { id , index } = e.currentTarget.dataset;
					let { UserId, Token, currentTab, activityInfo, planInfo, purchaseInfo, productInfo, companyInfo } = this.data;
                    ajax({
                        url:'/App/UserCenter/DelCollect',
                        method: 'POST',
                        data:{
                            UserId,
                            Token,
                            Id: id
                        }
                    }).then( ( res) => {
                        switch (currentTab) {
                            case 1:
                                purchaseInfo.list.splice(index,1);
                                this.setData({
                                    [ 'purchaseInfo.list'] : purchaseInfo.list
                                })
                                break;
                            case 2:
                                planInfo.list.splice(index,1);
                                this.setData({
                                    [ 'planInfo.list'] : planInfo.list
                                })
                                break;
                            case 3:
                                productInfo.list.splice(index,1);
                                this.setData({
                                    [ 'productInfo.list'] : productInfo.list
                                })
                                break;
                            case 4:
								companyInfo.list.splice(index, 1);
								this.setData({
									['companyInfo.list']: companyInfo.list
								})
								break;
                            default:
                                activityInfo.list.splice(index,1);
                                this.setData({
                                    [ 'activityInfo.list'] : activityInfo.list
                                })
                                break;
                        }
                    }).catch((error) =>{
                        console.log(error);
                        wx.showToast({
                            title: '删除失败，请重试！',
                            icon: 'none'
                        })
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }


            }
        })
    },
    // 查看详情
    handleActivityDetail(e){
        const { id } = e.currentTarget.dataset;
        goPage('活动详情',{ ActivityId: id})
    },
    handleProductDetail(e){
        let { id } = e.currentTarget.dataset;
        goPage('产品详情',{ ProductId: id})
    },
    handlePlanDetail(e){
        let { id } = e.currentTarget.dataset;
        goPage('方案详情',{ SchemeId: id})
    },
    handlePurchaseDetail(e){
        let { id } = e.currentTarget.dataset;
        goPage('求购详情',{ WantBuyId: id})
	},
	handleCompanyDetail(e) {
		let { id } = e.currentTarget.dataset;
		goPage('企业详情', { CompanyId: id })
	}

})
