import Toast from "../../../dist/toast/toast";
import { isPhone, isEmpty } from "../../../utils/validate";
import { ajax } from "../../../utils/api";
import { getItem, setItem } from "../../../utils/util";
import {getDomainList} from "../../../utils/services";
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
        DomainList:{
            columnsData:[],
            list: [],
            value: '',
            id: '',
            show: false
        },
        DomainCell: {
            columnsData:[],
            list: [],
            value: '',
            id: '',
            show: false
        },
    },
    onLoad: function (options) {
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
                ['DomainList.id']:TeachDominParentId,
                ['DomainCell.id']:TeachDominId
            })
            this.loadDomainList();
        }).catch((error) => {
            console.log(error)
        })

    },
    // 获取技术领域父级
    loadDomainList() {
        let DomainList = getDomainList();
        let columnsData = DomainList && DomainList.map(item => {
            return item.Name;
        })
        this.setData({
            ['DomainList.list']: DomainList,
            ['DomainList.columnsData']:columnsData,
        })
        this.fillDomainList();
    },
    fillDomainList(){
        let { DomainList } = this.data;
        let proId = DomainList.id || DomainList.list[0].Id;
        if( proId ){
            let pro = DomainList.list.find((item)=>{
                return proId == item.Id
            })
            this.setData({
                ['DomainList.value'] : pro.Name,
                ['DomainList.id'] : proId
            })
            this.loadDomainCell(proId);
        }
    },


    // 获取技术领域子级
    loadDomainCell(ParentId) {
        ajax({
            url: '/app/Product/GetByParentId',
            method: 'POST',
            dataType: '',
            data: {
                ParentId
            }
        }).then((res) => {
            let [...list] = res.Data;
            let columnsData = list.map(item => {
                return item.Name;
            })
            this.setData({
                ['DomainCell.list']: res.Data,
                ['DomainCell.columnsData']:columnsData,
            })
            this.fillDomainCell();
        }).catch((error) => {
            console.log(error)
        })
    },
    fillDomainCell(){
        let { DomainCell } = this.data;
        let proId = DomainCell.id || DomainCell.list[0].Id;
        if( proId ){
            let pro = DomainCell.list.find((item)=>{
                return proId == item.Id
            })
            this.setData({
                ['DomainCell.value'] : pro.Name,
                ['DomainCell.id'] : proId
            })
        }
    },

    // 一级选择
    handleDomainListList(){
        this.setData({
            ['DomainList.show']: true,
        })
    },
    handleDomainListConfirm(event) {
        const { value,index } = event.detail;
        let id = this.data.DomainList.list[index].Id;
        this.setData({
            ['DomainList.value']: value,
            ['DomainList.id']: id,
            ['DomainCell.id']: '',
            ['DomainList.show']: false,
        })
        this.loadDomainCell(id);
    },
    handleDomainListCancel() {
        this.setData({
            ['DomainList.show']: false,
        })
    },
    // 二级选择
    handleDomainCellList(){
        this.setData({
            ['DomainCell.show']: true,
        })
    },
    handleDomainCellConfirm(event) {
        const { value,index } = event.detail;
        let id = this.data.DomainCell.list[index].Id;
        this.setData({
            ['DomainCell.value']: value,
            ['DomainCell.id']: id,
            ['DomainCell.show']: false,
        })
    },
    handleDomainCellCancel() {
        this.setData({
            ['DomainCell.show']: false,
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
        let {
            DomainList,
            DomainCell
        } = this.data;
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
        if (DomainList.id == '' || DomainCell.id == '') {
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
                TeachDominParentId: DomainList.id,
                TeachDominId: DomainCell.id ,
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
