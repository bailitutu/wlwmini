// pages/mine/company-plan/company-plan.js
import {getItem} from "../../../utils/util";
import {ajax} from "../../../utils/api";
import {goPage} from "../../../utils/common";

Page({

  /**
   * 页面的初始数据
   */
  data: {
      list: [],
      noData:false,
      noMore:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadData();
  },
    loadData(){
        let UserId = getItem('hd_userId') || '';
        let Token = getItem('hd_token') || '';

        ajax({
            url:'/App/UserCenter/SchemeList',
            method: 'POST',
            data:{
                UserId,
                Token,
            }
        }).then( ( res) => {
            console.log(res,'res1');
            let noData = !res.Data || res.Data.length == 0 ? true : false;
            this.setData({
                list: res.Data || [],
                noData,
                noMore:true
            })

        }).catch((error) =>{
            console.log(error)
        })
    },
    handlePlanDetail(e){
        let { id } = e.currentTarget.dataset;
        goPage('方案详情',{ SchemeId: id})
    },
    // 编辑方案e
    handleEdit(e){
        let { id } = e.currentTarget.dataset;
        goPage('发布方案',{ SchemeId: id, isEdit: 1})
    },
})
