import { BASE_URL, PageURL } from './config'
/*
    *  跳转页面
    * page: 跳转页面的名称 String
    * param: 携带参数对象 Object;
    * type: 页面跳转类型 1：navigateTo；2： switchTab；3：redirectTo；4：reLaunch（关闭所有后打开）
    * */
const goPage = ( page ,param = { },type = 1) => {
    let paramArr = []
    let pageUrl = '';
    if(param){
        for( let item in param ){
            paramArr.push(item+ '='+ param[item]);
        }
        pageUrl =  PageURL[page] + '?'+ paramArr.join('&')
    }else{
        pageUrl =  PageURL[page];
    }

    switch (type) {
        case 2:
            wx.switchTab({
                url: pageUrl
            });
            break;
        case 3:
            wx.redirectTo({
                url: pageUrl
            });
            break;
        case 4:
            wx.reLaunch({
                url: pageUrl
            });
            break;
        default:
            wx.navigateTo({
                url: pageUrl
            });
            break;
    }
}

module.exports = {
    goPage,
}

