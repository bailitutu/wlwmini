import {getItem, setItem} from "./util";
import {ajax} from "./api";
// 获取应用领域

const getApplicationList = () => {
    let ApplicationList = getItem('DomainApplicationList') || null;
    if (!ApplicationList) {

        ajax({
            url: '/App/Product/DomainApplicationList',
            method: 'POST',
            data: {}
        }).then((res) => {
            setItem("DomainApplicationList", JSON.stringify({value: res.Data}));
            return res.Data;
        }).catch((error) => {
            console.log(error)
        })
    } else {
        let list = JSON.parse(ApplicationList);
        return list.value
    }
}

// 获取技术领域父级
const getDomainList = () => {
    let DomainList = getItem('DomainList') || null;
    if (!DomainList) {
        ajax({
            url: '/app/Product/GetByParent',
            method: 'POST',
            data: {}
        }).then((res) => {
            setItem("DomainList", JSON.stringify({value: res.Data}));
            return res.Data;
        }).catch((error) => {
            console.log(error)
        })
    } else {
        let list = JSON.parse(DomainList);
        return list.value;
    }
}


const getDomainOutDto = () => {
    // 筛选项
    let DomainOutDto = getItem('DomainOutDto') || null;
    if (!DomainOutDto) {
        ajax({
            url: '/App/Product/GetDomainOutDto',
            method: 'POST',
            data: {}
        }).then((res) => {
            setItem("DomainOutDto", JSON.stringify({value: res.Data}));
            return res.Data;
        }).catch((error) => {
        })
    } else {
        return JSON.parse(DomainOutDto).value;
    }

}
const getMainClassList = () => {
    // 筛选项
    let MainClass = getItem('MainClass') || false;
    if (!MainClass) {
        ajax({
            url: '/app/Product/SubLevelClassList',
            method: 'POST',
            data: {
                classId: 0
            }
        }).then((res) => {
            setItem("MainClass", JSON.stringify({value: res.Data}));
            return res.Data;
        }).catch((error) => {
            console.log(error)
        })
    } else {
        return JSON.parse(MainClass).value;
    }
}

const getSenior = ()=>{
    let Senior = getItem('Senior') || false;
    if (!Senior) {
        ajax({
            url: '/App/Product/SeniorList',
            method: 'POST',
            data: {}
        }).then((res) => {
            setItem("Senior", JSON.stringify({value: res.Data}));
            return res.Data;
        }).catch((error) => {
            console.log(error)
        })
    } else {
        return JSON.parse(Senior).value;
    }
}


module.exports = {
    getDomainList,
    getApplicationList,
    getDomainOutDto,
    getMainClassList,
    getSenior
}
