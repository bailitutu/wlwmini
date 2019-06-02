import {ajax} from "../../../utils/api";
import {getItem} from "../../../utils/util";

Page({

    data: {
        isReady: false,
        MsgId: '',
        UserId:'',
        Token:'',
        messageList: {
            list: [],
            noData: false,
            noMore: false,
            page:1,
        },
        isBottom: false,
        show:false,
        backMsg: '', //回复 的内容
        backMsgId: '' //回复的消息id
    },

    onLoad: function (opt) {
        let UserId = getItem('hd_userId') || '';
        let Token = getItem('hd_token') || '';
        this.setData({
            MsgId: opt.MsgId,
            UserId,
            Token,
        })
        this.loadData();
    },
    loadData(){
        let { UserId, Token, MsgId ,messageList } = this.data;
        ajax({
            url:'/App/UserCenter/UserMessageDetail',
            method: 'POST',
            data:{
                page: messageList.page || 1,
                pagesize: 10,
                UserId,
                Token,
                MsgId
            }
        }).then( ( res) => {
            let data = res.Data;
            let list = res.Data.UserMessageReplyList || [];
            let detail =  res.Data.UserMessageDetailModel || { };
            let noData = (!list || list.length == 0) ? true : false;
            let total = list.RowCount && list.RowCount > 0 ?  Math.ceil(list.RowCount/10) : 0;
            let noMore = total == messageList.page ? true :false;
            this.setData({
                detail: {
                    ...detail
                },
                messageList: {
                    list: list.Data || [],
                    noMore,
                    noData,
                },
                isReady: true
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
        let { messageList } = this.data;

        if(messageList.noMore){
            return;
        }
        let page = messageList.page += 1;
        this.setData({
            [ 'messageList.page']: page,
        })
        this.loadData();
    },
    handleBackMessage(e){
        let { msgid } = e.currentTarget.dataset;
        this.setData({
            show: 1,
            backMsgId:msgid
        })
    },

    bindTextAreaBlur(e){
        this.setData({
            backMsg: e.detail.value
        })
    },
    handleConfirm(){
        let { backMsg,UserId,Token ,backMsgId} = this.data;
        if(backMsg == ''){
            wx.showToast({
               title: '回复内容不能为空',
                mask:true,
                icon: 'none'
            })
            return;
        }

        var personData = {
            UserId,
            Token,
            MsgId:backMsgId,
            Msg: backMsg,
            MsgType:1
        };

        ajax({
            url:'/App/Home/AddMsgReply',
            method: 'POST',
            data:{
                ...personData
            }
        }).then( ( res) => {
            wx.showToast({
                title: '回复成功',
                icon: 'success'
            })
            this.setData({
                backMsg: '',
                show: false,
            })
            this.loadData();
        }).catch((error) =>{
            console.log(error)
        })
    },

    handleCancel(){
      this.setData({
          backMsg: '',
          show: false,
      })
    }
})
