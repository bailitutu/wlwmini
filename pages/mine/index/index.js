import { getItem, delItem } from "../../../utils/util";
import { goPage } from "../../../utils/common";
import { ajax } from "../../../utils/api";
import {BASE_URL} from "../../../utils/config";
import MD5 from '../../../utils/new_md5'
function setRequestHeader(data) {
    var headers = { IsJosn: "ok" };
    headers.Timestamp = new Date().getTime(); //13位时间戳
    headers.Nonce = Math.random(); //随机数
    var signObj = {};
    if (data) { signObj = Object.assign(signObj, data, headers); }
    headers.Sign = getSign(signObj).Encrypt;
    return headers;
}

function getSign(data) { //签名
    let array = [];
    let param = '';
    for(let key in data){
        array[array.length] = key;
    }
    array.sort(function (array, t) { var a = array.toLowerCase(); var b = t.toLowerCase(); if (a < b) return -1; if (a > b) return 1; return 0; });//排序
    array.forEach((key,i)=>{
        param += key + data[key]
    })
    return { Text: param, Encrypt: MD5.md5(param) };
}
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isPerson: true,
        info:{}
    },
    onLoad(){
        let UserId = getItem('hd_userId');
        let Token = getItem('hd_token');
        this.setData({
            UserId,
            Token
        })
    },
    onShow: function() {
        this.loadData();
    },
    loadData(){
        let { UserId, Token } = this.data;

        if( !Token || !UserId){
            wx.showModal({
                showCancel:true,
                title:'提示',
                content:'请先登录',
                success: (res)=>{
					if (res.confirm) {
						delItem('hd_token');
						delItem('hd_userId');
						goPage('登录', {}, 4)
					}else{
						wx.navigateBack();
					}
                }
            })
            return;
        }
        ajax({
            url: '/App/UserCenter/Index',
            method: 'POST',
            data:  {
                UserId,
                Token,
            },
        }).then((res) => {
            this.setData({
                info: res.Data
            })
        }).catch((error) => {
            console.log(error,'error')
        })
    },
    handleChangeHeader(){
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success:  (res) => {
                var imageSrc = res.tempFilePaths;
                wx.showLoading({
                    title: '上传中...',
                    icon: 'loading',
                    mask: true
                })
                this.uploadImg({
                    url: BASE_URL + '/App/Home/UpLoadFile',//这里是你图片上传的接口
                    path: imageSrc,//这里是选取的图片的地址数组
                });
            },
            fail: function ({errMsg}) {
                console.log('chooseImage fail, err is', errMsg)
            }
        })

    },
    uploadImg(data) {
        let headers = setRequestHeader({});
        let header = {
            ...headers,
            "Content-Type": "multipart/form-data"
        };
        wx.uploadFile({
            url: data.url,
            filePath: data.path[0],
            name: 'file',//这里根据自己的实际情况改
            header: header,
            formData: {},//这里是上传图片时一起上传的数据
            success: (res) => {
                var data = JSON.parse(res.data);
                if (data.Status ) {
                    this.setData({
                        HeadeUrl:data.Data
                    })
                    this.changeHeadeImg();
                }
            },
            fail: (err) => {
                console.log(err)
            },

        });
    },
    changeHeadeImg(){
        let { UserId,Token,HeadeUrl } = this.data
        ajax({
            url: '/App/User/UpdateHeadeUrl',
            method: 'POST',
            data: {
                UserId,
                Token,
                HeadeUrl
            },
        }).then((res) => {
            wx.hideLoading();
            this.setData({
                ['info.HeadUrl']: HeadeUrl
            })
        }).catch((error) => {
            console.log(error,'error')
        })
    }
})
