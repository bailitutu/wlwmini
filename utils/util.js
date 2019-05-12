export const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

export const formatDate = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    return [year, month, day].map(formatNumber).join('-') ;
}

export const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const isAvailable = (function isAvailableIffe() {
    const test = 'test';
    try {
        wx.setStorageSync(test, test);
        wx.removeStorageSync(test);
        return true;
    } catch (e) {
        return false;
    }
}());
/**
 * 设置缓存
 * @param key 保存的键值
 * @param val 保存的内容
 */
export const setItem = (key, val)  => {
    if (isAvailable) {
        wx.setStorageSync(key, val);
    }
};
/**
 * 获取缓存
 * @param  {[String]} key 获取的键值
 * @return {Object}
 */
export const getItem = (key) => {
    if (isAvailable) {
        return wx.getStorageSync(key);
    }
};
/**
 * 删除缓存
 * @param  {[String]} key 删除的键值
 */
export const delItem = (key)  => {
    if (isAvailable) {
        wx.removeStorageSync(key);
    }
};

/**
 * 删除所有缓存
 * @param  {[String]} key 删除的键值
 */
export const clearAllItem = ()  => {
    if (isAvailable) {
        wx.clearStorageSync();
    }
};


const  setRequestHeader = (data) => {
    var headers = { IsJosn: "ok" };
    headers.Timestamp = new Date().getTime(); //13位时间戳
    headers.Nonce = Math.random(); //随机数

    var signObj = {};
    if (data) { signObj = $.extend(signObj, data, headers); }

    headers.Sign = getSign(signObj).Encrypt;
    return headers;

}

const getSign = (data) => { //签名
    var arry = []; var param = "";
    $.each(data, function (key, val) { arry[arry.length] = key; });
    arry.sort(function (arry, t) { var a = arry.toLowerCase(); var b = t.toLowerCase(); if (a < b) return -1; if (a > b) return 1; return 0; });//排序
    $.each(arry, function (i, key) { param += key + data[key]; });
    return { Text: param, Encrypt: $.md5(param) };
}


