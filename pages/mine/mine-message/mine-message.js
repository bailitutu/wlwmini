import { ajax } from "../../../utils/api";
import { getItem } from "../../../utils/util";
import { goPage } from '../../../utils/common'
Page({

    data: {
        currentTab: 0,
        isBottom: false,
        outboxList: {
            list: [],
            noData: false,
            noMore: false,
            page: 1,
        },
        inboxList: {
            list: [],
            noData: false,
            noMore: false,
            page:1,
        },
    },
    onLoad: function () {
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
                this.getInboxList();
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
                this.geOutboxList();
                break;
        }
    },
    geOutboxList(){
        let { UserId, Token, outboxList  } = this.data;
        ajax({
            url:'/App/UserCenter/OutboxList',
            method: 'POST',
            data:{
                page: outboxList.page,
                pagesize: 10,
                UserId,
                Token
            }
        }).then( ( res) => {
            let noData = !res.Data ||  res.Data.length == 0 ? true : false;
            this.setData({
                outboxList: {
                    list:res.Data,
                    noMore:true,
                    noData,
                }
            })
        }).catch((error) =>{
            console.log(error)
        })
    },
    getInboxList(){
        let { UserId, Token ,inboxList } = this.data;
        ajax({
            url:'/App/UserCenter/InboxList',
            method: 'POST',
            data:{
                UserId,
                Token,
                page:inboxList.page,
                pagesize: 10
            }
        }).then( ( res) => {
            let noData = !res.Data ||  res.Data.length == 0 ? true : false;
            this.setData({
                inboxList: {
                    list:res.Data,
                    noMore:true,
                    noData,
                }
            })
        }).catch((error) =>{
            console.log(error)
        })
    },
    onReachBottom(){
        if(this.data.isBottom){
            return;
        }
        this.setData({
            isBottom: true
        })
        // 请求更多数据
        this.loadMore();
    },
    loadMore(){
        let { currentTab, outboxList,inboxList } = this.data;
        switch(currentTab){
            case 1:
                if(inboxList.noMore){
                    return;
                }
                let inboxPage = inboxList.page += 1;
                this.setData({
                    [ 'inboxList.page']: inboxPage,
                })
                this.getInboxList();
                break;
            default:
                if(outboxList.noMore){
                    return;
                }
                let outboxPage = outboxList.page += 1;
                this.setData({
                    [ 'outboxList.page']: outboxPage,
                })
                this.geOutboxList();
                break;
        }
    },
    handleCheckDetail(e){
        let { id } = e.currentTarget.dataset
        goPage('消息详情',{ MsgId: id })
    }
})
