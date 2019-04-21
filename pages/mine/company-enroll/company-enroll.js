// pages/mine/company-enroll/company-enroll.js
import {ajax} from "../../../utils/api";
import {getItem} from "../../../utils/util";

Page({

  /**
   * 页面的初始数据
   */
  data: {
      ActivityId:'',
      isReady:false,
      SignInList: [],
      VisitorList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
    onLoad: function (options) {
        let UserId = getItem('hd_userId') || '';
        let Token = getItem('hd_token') || '';
        this.setData({
            ActivityId: options.ActivityId || '',
            UserId,
            Token
        })
        this.loadData();
    },
    loadData(){
        let { UserId, Token ,ActivityId } = this.data;

        let promiseOne =  new Promise( (resolve, reject)=>{
             ajax({
                url:'/App/UserCenter/ActivitySignInList',
                method: 'POST',
                data:{
                    UserId,
                    Token,
                    ActivityId
                }
            }).then( ( res) => {
                 console.log(res,'res1');
                 resolve( res);
             }).catch((error) =>{
                 console.log(error)
                 reject(error)
             })
        })
        let promiseTwo =  new Promise( (resolve, reject)=>{
            ajax({
                url:'/App/UserCenter/VisitorList',
                method: 'POST',
                data:{
                    UserId,
                    Token,
                    ActivityId
                }
            }).then( ( res) => {
                console.log(res,'res2');
                resolve( res);
            }).catch((error) =>{
                console.log(error)
                reject(error)
            })
        })

        Promise.all( [ promiseOne, promiseTwo]).then((res)=>{
            this.setData({
                SignInList: res[0].Data || [],
                VisitorList: res[1].Data || [],
                isReady: true
            })
          }).catch((error)=>{
            console.log(error)
        })

    }
})
