import { goPage } from "../../../utils/common";
import { getItem} from "../../../utils/util";
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
  onShow () {
    this.getPurchaseList();
  },
    // 获取求购列表信息
    getPurchaseList(){
        let UserId = getItem('hd_userId') || '';
        let Token = getItem('hd_token') || '';
        let personData = {
            UserId: UserId,
            Token: Token,
        };
        ajax({
            url:'/App/UserCenter/WantBuyList',
            method: 'POST',
            data:personData
        }).then( ( res) => {
            let noData = !res.Data || res.Data.length == 0 ? true : false;
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
    // 编辑
    handleEdit(e) {
        let { id } = e.currentTarget.dataset;
        goPage('发布求购',{ WantBuyId: id,isEdit: 1})
    },
    handlePurchaseDetail(e){
        let { id } = e.currentTarget.dataset;
        goPage('求购详情',{ WantBuyId: id})
    },
})
