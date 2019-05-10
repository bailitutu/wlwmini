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
            leftTime: 60,
            hasSend: false,
            Code: '',
            NickName: '',
            HeadUrl: '',
            UserTypeId: 0,
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
            Code: '',
            NickName: '',
            HeadUrl: '',
            UserTypeId: 0,
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

    onLoad: function (opt) {

        if(opt.nickName){
            this.setData({
                ['personInfo.NickName']: opt.nickName,
                ['personInfo.HeadUrl']: opt.HeadUrl,
                ['personInfo.UniqueIdentification']: opt.openId,
                currentTab: 2
            })
        }

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
    //上传logo
    handleUploadLogo(e){
        this.setData({
            ['companyInfo.EnterpriseLogo']: e.detail[0].imgUrl
        })
    },
    // 移除logo
    handleRemoveLogo(list){
        this.setData({
            ['companyInfo.EnterpriseLogo']: ''
        })
    },
    //上传营业执照
    handleUploadBusinessLicense(e){
        this.setData({
            ['companyInfo.BusinessLicense']: e.detail[0].imgUrl
        })
    },
    // 移除营业执照
    handleRemoveBusinessLicense(e){
        this.setData({
            ['companyInfo.BusinessLicense']: ''
        })
    },

    //上传logo
    handleUploadContactsCardUrl(e){
        this.setData({
            ['companyInfo.ContactsCardUrl']: e.detail[0].imgUrl
        })
    },
    // 移除logo
    handleRemoveContactsCardUrl(e){
        this.setData({
            ['companyInfo.ContactsCardUrl']: ''
        })
    },
    //企业简介
    handleChangeAbstract(val){
        this.setData({
            [ 'companyInfo.Abstract' ] : val.detail
        })
    },

    // 发送个人手机号验证码
    handleCompanySendCode(e) {
        let {companyInfo} = this.data;
        if (companyInfo.hasSend) {
            return;
        }
        let phone = companyInfo.phone;
        if (isEmpty(phone)) {
            wx.showToast({
                title: '请先输入手机号',
                icon:'none'
            })
            return;
        }
        if (!isPhone(phone)) {
            wx.showToast({
                title: '手机号格式错误',
                icon:'none'
            })
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
                ['companyInfo.hasSend']: true
            })
            wx.showToast({
                title: '验证码已发送',
                icon:'none'
            })
            // 倒计时
            this.companyDownCount();
        }).catch((error) => {
            console.log(error)
        })
    },
    // 倒计时处理
    companyDownCount() {
        let left_time = 60;
        let timer = setInterval(() => {
            if (left_time === 0) {
                this.setData({
                    ['companyInfo.hasSend']: false
                })
                clearInterval(timer);
                return;
            }
            left_time--
            this.setData({
                ['companyInfo.leftTime']: left_time
            })
        }, 1000)
    },

    // 企业注册
    handleCompanyRegister() {
        let {
            UserName,
            UserPwd,
            UserPwdTwo,
            Code,
            NickName,
            HeadUrl,
            UserTypeId,
            UniqueIdentification,
            EnterpriseName,
            Abbreviation,
            EnterpriseLogo,
            TeachDominParentId,
            TeachDominId,
            WebsiteUrl,
            Address,
            FixedTelephone,
            WechatNum,
            Abstract,
            BusinessLicense,
            Contacts,
            ContactInformation,
            ContactsCardUrl,
            Email,
            QQ,
            RealName,
    } = this.data.companyInfo;

        if (isEmpty(EnterpriseName)) {
            wx.showToast({
                title: '公司名称不能为空',
                icon: 'none'
            })
            return;
        }
        if (isEmpty(EnterpriseLogo)) {
            wx.showToast({
                title: '企业logo必传',
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

        if (isEmpty(Address)) {
            wx.showToast({
                title: '公司地址必填',
                icon: 'none'
            })
            return;
        }
        if (isEmpty(FixedTelephone)) {
            wx.showToast({
                title: '固定电话必填',
                icon: 'none'
            })
            return;
        }
        if (isEmpty(BusinessLicense)) {
            wx.showToast({
                title: '营业执照必传',
                icon: 'none'
            })
            return;
        }
        if (isEmpty(Contacts)) {
            wx.showToast({
                title: '企业联系人必填',
                icon: 'none'
            })
            return;
        }
        if (isEmpty(ContactsCardUrl)) {
            wx.showToast({
                title: '联系人名片必传',
                icon: 'none'
            })
            return;
        }
        if (isEmpty(Abstract)) {
            wx.showToast({
                title: '公司简介必填',
                icon: 'none'
            })
            return;
        }
        if (isEmpty(ContactInformation)) {
            wx.showToast({
                title: '联系方式必填',
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
            wx.showToast({
                title: '手机号格式错误',
                icon: 'none'
            })
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
            url: '/app/User/EnterpriseRegister',
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
                Abbreviation,
                EnterpriseLogo,
                TeachDominParentId,
                TeachDominId,
                WebsiteUrl,
                Address,
                FixedTelephone,
                WechatNum,
                Abstract,
                BusinessLicense,
                Contacts,
                ContactInformation,
                ContactsCardUrl,
                Email,
                QQ,
                RealName,
            }
        }).then((res) => {
            wx.showToast({
                title: '注册成功',
                icon:'none',
                success: () =>{
                    setTimeout(()=>{
                        wx.navigateBack();
                    },1500)
                }
            })
        }).catch((error) => {
            console.log(error)
        })
    },
    // 个人注册部分
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
        let { personInfo } = this.data;
        if ( personInfo.hasSend ) {
            return;
        }
        let UserName = personInfo.UserName;
        if (isEmpty(UserName)) {
            wx.showToast({
                title: '请先输入手机号',
                icon:'none'
            })
            return;
        }
        if (!isPhone(UserName)) {
            wx.showToast({
                title: '手机号格式错误',
                icon:'none'
            })
            return;
        }
        let postData = {
            userName: UserName,
        }
        ajax({
            url: '/App/User/RegisterSendCode',
            method: 'POST',
            data: postData
        }).then((res) => {
            this.setData({
                ['personInfo.hasSend']: true
            })
            wx.showToast({
                title: '验证码已发送',
                icon:'none'
            })
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

    handleUploadHeadUrl(e){
        this.setData({
            ['personInfo.HeadUrl']: e.detail[0].imgUrl
        })
    },
    handleRemoveHeadUrl(){
        this.setData({
            ['personInfo.HeadUrl']: ''
        })
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

        if (isEmpty(HeadUrl)) {
            wx.showToast({
                title: '请上传头像',
                icon: 'none'
            })
            return;
        }
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
            wx.showToast({
                title: '手机号格式错误',
                icon: 'none'
            })
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
                icon:'none',
                success: () =>{
                    setTimeout(()=>{
                        wx.navigateBack();
                    },1500)
                }
            })
        }).catch((error) => {
            console.log(error)
        })

    }
})
