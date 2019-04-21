// pages/main/company-detail/company-detail.js
import {getItem} from "../../../utils/util";
import {ajax} from "../../../utils/api";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabActive: 0,
        info: {},
        Product:{
            list: [],
            noData: false,
            noMore: false,
        },
        Activity:{
            list: [],
            noData: false,
            noMore: false,
        },
        Scheme:{
            list: [],
            noData: false,
            noMore: false,
        }

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let UserId = options.CompanyId || ''
        this.loadData(UserId);
    },

    loadData(UserId ){
        let personData = {
            UserId,
        };
        ajax({
            url:'/App/UserCenter/UserEnterpriseDetail',
            method: 'POST',
            data:personData
        }).then( ( res) => {
            console.log(res);
            let info = res.Data.UserEnterprise;
            let ProductNoData = !res.Data.Product || res.Data.Product.length == 0 ? true : false;
            let ActivityNoData = !res.Data.Activity || res.Data.Activity.length == 0 ? true : false;
            let SchemeNoData = !res.Data.Scheme || res.Data.Scheme.length == 0 ? true : false;

            this.setData({
                isReady:true,
                info,
                Product: {
                    list:res.Data.Product || [],
                    noMore:true,
                    noData:ProductNoData,
                },
                Activity: {
                    list:res.Data.Activity || [],
                    noMore:true,
                    noData:ActivityNoData,
                },
                Scheme: {
                    list:res.Data.Scheme || [],
                    noMore:true,
                    noData:SchemeNoData,
                },
            })
        }).catch((error) =>{
            console.log(error)
        })

    },


    onTabChange() {


    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    }


})
