//验证是否为金额
const isMoney = (money) => {
    var reg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
    var isMoney = reg.test(money);
    return isMoney;
}
// 验证是否为手机号
const isPhone = (phone) => {
    let phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!phoneReg.test(phone)) {
        return false;
    } else {
        return true;
    }
}
// 验证是否为6-20为字母或数字组合（密码）
const isPassword = (password) => {
    let pass = /[a-zA-Z0-9]{6,20}$/;
    if (!pass.test(password)) {
        return false;
    } else {
        return true;
    }
}
module.exports = {
    isMoney,
    isPhone,
    isPassword
}
