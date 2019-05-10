import MD5 from './new_md5'
import { BASE_URL } from './config'
import { goPage } from './common'
import { delItem } from "./util";


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
        console.log()
        param += key + data[key]
    })
    return { Text: param, Encrypt: MD5.md5(param) };
}

const ajax = (options = {}) => {
    let {
        url,
        data,
        header,
        method,
        dataType,
        responseType,
        success,
        fail,
        complete
    } = options;

    url = BASE_URL + url;
    // 统一注入约定的header
    let headers = setRequestHeader(data);
    header = Object.assign({
        ...headers,
        'content-type':'application/x-www-form-urlencoded'
    }, options.header);

    return new Promise((res, rej) => {
        wx.request({
            url,
            data,
            header,
            method,
            dataType,
            responseType,
            success(r) {
                if(r.data.Status == true){
                    res(r.data);
                }else{
                    if( r.data.ErrNum == '10001'){
                        wx.showModal({
                            showCancel:false,
                            title:'提示',
                            content:'登录过期',
                            success: ()=>{
                                delItem('hd_token');
                                delItem('hd_userId');
                                goPage('登录',{ }, 4)
                            }
                        })
                    }else{
                        wx.showToast({
                            title: r.data.Msg || '',
                            icon:'none'
                        })
                    }
                }
            },
            fail(err) {
                rej(err);
            },
            complete
        });
    });
}

module.exports = {
    ajax
}


