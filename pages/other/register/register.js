// pages/other/register/register.js
import Toast from "../../../dist/toast/toast";
import {isPhone, isEmpty} from "../../../utils/validate";
import {ajax} from "../../../utils/api";
import {getItem, setItem} from "../../../utils/util";

Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentTab: 1,
        companyInfo: {
            UserName: "",
            UserPwd: '',
            UserPwdTwo: '',
            Code: '',
            NickName: '',
            HeadUrl: '',
            UserTypeId: '',
            UniqueIdentification: '',
            EnterpriseName: '',
            Abbreviation: '',
            EnterpriseLogo: '',
            TeachDominParentId: '',
            TeachDominId: '',
            WebsiteUrl: '',
            Address: '',
            FixedTelephone: '',
            WechatNum: '',
            Abstract: '',
            BusinessLicense: '',
            Contacts: '',
            ContactInformation: '',
            ContactsCardUrl: '',
            Email: '',
            QQ: '',
            RealName: '',
        },
        showDomainList: false,
        DomainListData: [],
        DomainList: [],
        DomainCellData: [],
        DomainCell: [],
        TeachDominParentId: '',
        TeachDominParentName: '',
        TeachDominId: '',
        TeachDominName: '',
        personInfo: {
            UserName: '',
            UserPwd: '',
            UserPwdTwo: '',
            phone: '',
            Code: '',
            NickName: '',
            HeadUrl: '',
            UserTypeId: '',
            UniqueIdentification: '',
            RealName: '',
            EnterpriseName: '',
            Occupation: '',
            TeachDominParentId: '',
            TeachDominParentName: '',
            TeachDominId: '',
            TeachDominName: '',
            leftTime: 60,
            hasSend: false,
            showDomainList: false,
            showDomainCell: false,
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getDomainList();
    },
    //切换
    handleType(e) {
        let {type} = e.currentTarget.dataset;
        this.setData({
            currentTab: type
        })
    },
    // 获取技术领域父级
    getDomainList() {
        let DomainList = getItem('DomainList') || null;
        if (!DomainList) {
            ajax({
                url: '/app/Product/GetByParent',
                method: 'POST',
                data: {}
            }).then((res) => {
                console.log(res, 'res1');
                let list = [ ...res.data ];
                let listData = list.map(item => {
                    return item.Name;
                })
                setItem("DomainList", JSON.stringify(list));

                this.setData({
                    DomainListData: res.Data,
                    DomainList: listData
                })
            }).catch((error) => {
                console.log(error)
            })
        } else {
            let listData = JSON.parse(DomainList).map(item => {
                return item.Name;
            })
            this.setData({
                DomainListData: JSON.parse(DomainList),
                DomainList:listData
            })
        }
    },
    // 获取技术领域子级
    getDomainCell(ParentId) {
        ajax({
            url: '/app/Product/GetByParentId',
            method: 'POST',
            dataType: '',
            data: {
                ParentId
            }
        }).then((res) => {
            let list = [ ...res.Data ];
            let cellList = list.map(item => {
                return item.Name;
            })
            this.setData({
                DomainCellData: res.Data,
                DomainCell:cellList
            })
        }).catch((error) => {
            console.log(error)
        })
    },

    // 企业注册部分
    handleCompanyDomainList() {
        this.setData({
            ['companyInfo.showDomainList']: true
        })
    },
    handleCompanyDomainCell() {
        this.setData({
            ['companyInfo.showDomainCell']: true
        })
    },

    handleCompanyDomainListConfirm(event) {
        const { value, index} = event.detail;
        let parentId = this.data.DomainListData[index].Id;
        this.setData({
            ['companyInfo.TeachDominParentId']: parentId,
            ['companyInfo.TeachDominParentName']: value,
            ['companyInfo.showDomainList']: false
        })
        this.getDomainCell(parentId)
    },
    handleCompanyDomainListCancel() {
        this.setData({
            ['companyInfo.showDomainList']: false
        })
    },

    handleCompanyDomainCellConfirm(event) {
        const { value, index} = event.detail;
        let { DomainCellData } = this.data;
        let cell_id = DomainCellData[index].Id;
        let  domainId = 'companyInfo.TeachDominId';
        let  domainName = 'companyInfo.TeachDominName';
        this.setData({
            [domainId]: cell_id,
            [domainName] : value,
            ['companyInfo.showDomainCell']: false,
        })
    },
    handleCompanyDomainCellCancel() {
        this.setData({
            ['companyInfo.showDomainCell']: false
        })
    },

    // 图片上传
    handleAddImg(){
        console.log('点击了')
    },



    // 个人注册部分
    // 企业名称
    handleChangeInput(e) {
        let {type, cell} = e.currentTarget.dataset;
        let changeString = type == 1 ? 'personInfo.' + cell : 'companyInfo.' + cell;
        this.setData({
            [changeString]: e.detail
        })
    },

    //主营领域

    handlePersonDomainList() {
        this.setData({
            ['personInfo.showDomainList']: true
        })
    },
    handlePersonDomainCell() {
        this.setData({
            ['personInfo.showDomainCell']: true
        })
    },

    handlePersonDomainListConfirm(event) {
        const { value, index} = event.detail;

        let parentId = this.data.DomainListData[index].Id;
        this.setData({
            ['personInfo.TeachDominParentId']: parentId,
            ['personInfo.TeachDominParentName']: value,
            ['personInfo.showDomainList']: false
        })
        this.getDomainCell(parentId)
    },
    handlePersonDomainListCancel() {
        this.setData({
            ['personInfo.showDomainList']: false
        })
    },

    handlePersonDomainCellConfirm(event) {
        const { value, index} = event.detail;
        let { DomainCellData } = this.data;
        let cell_id = DomainCellData[index].Id;
        let  domainId = 'personInfo.TeachDominId';
        let  domainName = 'personInfo.TeachDominName';
        this.setData({
            [domainId]: cell_id,
            [domainName] : value,
            ['personInfo.showDomainCell']: false,
        })
    },
    handlePersonDomainCellCancel() {
        this.setData({
            ['personInfo.showDomainCell']: false
        })
    },
    // 发送个人手机号验证码
    handleSendPersonCode(e) {
        let {personInfo} = this.data;
        if (personInfo.hasSend) {
            return;
        }
        let phone = personInfo.phone;
        if (phone == '') {
            Toast('请先输入手机号');
            return;
        }
        if (!isPhone(phone)) {
            Toast('手机号格式错误');
            return;
        }
        let postData = {
            userName: phone,
        }
        ajax({
            url: '/App/User/RegisterSendCode',
            method: 'POST',
            data: postData
        }).then((res) => {
            this.setData({
                ['personInfo.hasSend']: true
            })
            Toast.success('验证码已发送');
            // 倒计时
            this.personDownCount();
        }).catch((error) => {
            console.log(error)
        })
    },
    // 倒计时处理
    personDownCount() {
        let left_time = 60;
        let timer = setInterval(() => {
            if (left_time === 0) {
                this.setData({
                    ['personInfo.hasSend']: false
                })
                clearInterval(timer);
                return;
            }
            left_time--
            this.setData({
                ['personInfo.leftTime']: left_time
            })
        }, 1000)
    },

    // 个人注册
    handlePersonRegister() {
        let {
            UserName,
            UserPwd,
            Code,
            NickName,
            UserPwdTwo,
            HeadUrl,
            UserTypeId,
            UniqueIdentification,
            EnterpriseName,
            Occupation,
            RealName,
            TeachDominParentId,
            TeachDominId
        } = this.data.personInfo;
        console.log(EnterpriseName)

        if (isEmpty(EnterpriseName)) {
            wx.showToast({
                title: '所属企业不能为空',
                icon: 'none'
            })
            return;
        }
        if (isEmpty(Occupation)) {
            wx.showToast({
                title: '职业必填',
                icon: 'none'
            })
            return;
        }
        if (TeachDominParentId == '' || TeachDominId == '') {
            wx.showToast({
                title: '请选择主营领域',
                icon: 'none'
            })
            return;
        }

        if (isEmpty(RealName)) {
            wx.showToast({
                title: '真实姓名必填',
                icon: 'none'
            })
            return;
        }

        if (isEmpty(UserPwd)) {
            wx.showToast({
                title: '请先设置密码',
                icon: 'none'
            })
            return;
        }
        if (isEmpty(UserPwdTwo)) {
            wx.showToast({
                title: '请确认密码',
                icon: 'none'
            })
            return;
        }
        if (isEmpty(UserName)) {
            wx.showToast({
                title: '手机号必填',
                icon: 'none'
            })
            return;
        }
        if (!isPhone(UserName)) {
            Toast('手机号格式错误');
            return;
        }
        if (isEmpty(Code)) {
            wx.showToast({
                title: '请先输入验证码',
                icon: 'none'
            })
            return;
        }
        ajax({
            url: '/app/User/PersonalRegister',
            method: 'POST',
            data: {
                UserName,
                UserPwd,
                Code,
                NickName,
                HeadUrl,
                UserTypeId,
                UniqueIdentification,
                EnterpriseName,
                Occupation,
                RealName,
                TeachDominParentId,
                TeachDominId
            }
        }).then((res) => {
            wx.showToast({
                title: '注册成功',
                success: () => {
                    wx.navigateBack();
                }
            })
        }).catch((error) => {
            console.log(error)
        })

    }
    , onClose() {

    }

})
