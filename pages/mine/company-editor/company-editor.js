import Toast from "../../../dist/toast/toast";
import { isPhone, isEmpty } from "../../../utils/validate";
import { ajax } from "../../../utils/api";
import { getItem, setItem } from "../../../utils/util";
Page({

    data: {
        companyInfo: {
            showDomainList:false,
            showDomainCell:false,
            HeadUrl: '',
            EnterpriseName: '',
            Abbreviation: '',
            EnterpriseLogo: '',
            TeachDominParentId: '',
            TeachDominParentName:'',
            TeachDominName:'',
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
            RegYear:'',
            Capital:'',
            Scale:''
        },
        DomainListData: [],
        DomainList: [],
        DomainCellData: [],
        DomainCell: [],
    },
    onLoad: function (options) {
        this.getDomainList();
        this.loadData();
    },
    //获取企业信息
    loadData(){

        let UserId = getItem('hd_userId') || '';
        let Token = getItem('hd_token') || '';
        ajax({
            url: '/App/UserCenter/EnterpriseEdit',
            method: 'POST',
            data: {
                UserId,
                Token
            }
        }).then((res) => {
            let {
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
                RegYear,
                Capital,
                Scale
            } = res.Data;


            let EnterpriseLogoList = [{
              imgUrl: EnterpriseLogo
            }];
            let BusinessLicenseList = [{
                imgUrl: BusinessLicense
            }]

            let ContactsCardUrlList = [{
                imgUrl: ContactsCardUrl
            }]
            this.setData({
                ['companyInfo.EnterpriseName']: EnterpriseName,
                ['companyInfo.Abbreviation']: Abbreviation,
                ['companyInfo.EnterpriseLogo']: EnterpriseLogoList|| [],
                ['companyInfo.WebsiteUrl']: WebsiteUrl,
                ['companyInfo.Address']: Address,
                ['companyInfo.FixedTelephone']: FixedTelephone,
                ['companyInfo.WechatNum']: WechatNum,
                ['companyInfo.Abstract']: Abstract,
                ['companyInfo.BusinessLicense']: BusinessLicenseList || [],
                ['companyInfo.Contacts']: Contacts,
                ['companyInfo.ContactInformation']: ContactInformation,
                ['companyInfo.ContactsCardUrl']:ContactsCardUrlList || [],
                ['companyInfo.EnterpriseName']: EnterpriseName,
                ['companyInfo.TeachDominParentId']: TeachDominParentId,
                ['companyInfo.TeachDominId']: TeachDominId,
                ['companyInfo.RegYear']: RegYear,
                ['companyInfo.Capital']: Capital,
                ['companyInfo.Scale']: Scale,
            })

        }).catch((error) => {
            console.log(error)
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
                let list = [ ...res.Data ];
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
            ['companyInfo.EnterpriseLogo']: e.detail
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
            ['companyInfo.BusinessLicense']: e.detail
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
            ['companyInfo.ContactsCardUrl']: e.detail
        })
    },
    // 移除logo
    handleRemoveContactsCardUrl(e){
        this.setData({
            ['companyInfo.ContactsCardUrl']: ''
        })
    },
    //企业简介
    handleChangeAbstract(e){
        this.setData({
            [ 'companyInfo.Abstract' ] : e.detail.value
        })
    },

    // 企业信息修改
    handleCompanyRegister() {
        let {
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
            RegYear,
            Capital,
            Scale
        } = this.data.companyInfo;

        if (isEmpty(EnterpriseName)) {
            wx.showToast({
                title: '公司名称不能为空',
                icon: 'none'
            })
            return;
        }
        if (EnterpriseLogo.length == 0) {
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
        if (BusinessLicense.length == 0) {
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
        if (ContactsCardUrl.length == 0) {
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

        let UserId = getItem('hd_userId') || '';
        let Token = getItem('hd_token') || '';
        ajax({
            url: '/app/UserCenter/EnterpriseUpdate',
            method: 'POST',
            data: {
                UserId,
                Token,
                EnterpriseName,
                Abbreviation,
                EnterpriseLogo:EnterpriseLogo[0].imgUrl || '',
                TeachDominParentId,
                TeachDominId,
                WebsiteUrl,
                Address,
                FixedTelephone,
                WechatNum,
                Abstract,
                BusinessLicense:BusinessLicense[0].imgUrl || '',
                Contacts,
                ContactInformation,
                ContactsCardUrl:ContactsCardUrl[0].imgUrl || '',
                RegYear,
                Capital,
                Scale
            }
        }).then((res) => {
            wx.showToast({
                title: '修改成功',
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
})
