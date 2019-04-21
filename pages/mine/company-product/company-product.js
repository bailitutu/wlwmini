import { goPage } from "../../../utils/common";
import {delItem, getItem} from "../../../utils/util";
import {ajax} from "../../../utils/api";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        isReady:false,
        list:[],
        noMore:false,
        noData: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getProductList();
    },
    // 获取求购列表信息
    getProductList(){
        let UserId = getItem('hd_userId') || '';
        let Token = getItem('hd_token') || '';
        let personData = {
            UserId: UserId,
            Token: Token,
        };
        ajax({
            url:'/App/Product/UserProductList',
            method: 'POST',
            data:personData
        }).then( ( res) => {
            let noData = !res.Data && res.Data.length == 0 ? true : false;
            this.setData({
                isReady:true,
                list:res.Data,
                noMore:true,
                noData,
            })
        }).catch((error) =>{
            console.log(error)
        })

    },
    handleEdit() {

    },
    handleDelete(){

    },
    // 查看详情
    handleProductDetail(e){
        let { id } = e.currentTarget.dataset;
        goPage('产品详情',{ ProductId: id})
    },

})
