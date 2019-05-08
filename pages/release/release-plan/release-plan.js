import {goPage} from '../../../utils/common'
import {getItem, setItem,} from '../../../utils/util'
import {ajax} from "../../../utils/api";
import { isEmpty } from "../../../utils/validate";

Page({
    data: {
        isReady: false,
        isEdit: false,
        Application: {
            columnsData:[],
            list: [],
            value: '',
            id: '',
            show: false
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
        Abstract:'',
        SchemeName:'',
        SchemePrice:'',
        PicUrls: [],
        TxtContent:''
    },
    onLoad: function (opts) {
        if (opts.isEdit) {
            this.setData({
                isEdit: true,
                SchemeId: opts.SchemeId
            })
            wx.setNavigationBarTitle({
                title: '编辑方案'
            })
            this.loadData(opts.SchemeId);
        }
        this.getApplicationList();
        this.getDomainList();
    },
    loadData(SchemeId) {
        let UserId = getItem('hd_userId') || '';
        let Token = getItem('hd_token') || '';
        ajax({
            url: '/App/UserCenter/GetSchemeInfo',
            method: 'POST',
            data: {
                UserId,
                Token,
                SchemeId
            }
        }).then((res) => {
            let {
                SchemeName,
                AppDominId,
                Abstract,
                TeachDominParentId,
                TeachDominId,
                SchemePrice,
                PicUrls,
                TxtContent,
            } =  res.Data;

            let ApplicationList = [ ...this.data.Application.list];
            let DomainList = [...this.data.DomainList.list];
            let DomainCell = [...this.data.DomainCell.list];
            let ApplicationValue = '';
            let DomainListValue = '';
            let DomainCellValue = '';
            ApplicationList.map(item => {
                if(item.Id = AppDominId ){
                    ApplicationValue = item.Name
                    return;
                }
            });
            DomainList.map(item => {
                if(item.Id = TeachDominParentId ){
                    DomainListValue = item.Name
                    return;
                }
            });
            DomainCell.map(item => {
                if(item.Id = TeachDominId ){
                    DomainCellValue = item.Name
                    return;
                }
            });
            let img_list = []
            PicUrls.split(',').forEach(item => {
                img_list.push({
                    imgUrl: item
                })
            })
            this.setData({
                SchemeName,
                Abstract,
                SchemePrice,
                PicUrls: img_list,
                TxtContent,
                ['Application.value']: ApplicationValue,
                ['Application.id']: AppDominId,
                ['DomainList.value']:DomainListValue,
                ['DomainList.id']:TeachDominParentId,
                ['DomainCell.value']:DomainCellValue,
                ['DomainCell.id']:TeachDominId
            })

        }).catch((error) => {
            console.log(error)
        })
    },
    // 获取应用领域
    getApplicationList() {
        let DomainApplicationList = getItem('DomainApplicationList') || null;
        if (!DomainApplicationList) {
            ajax({
                url: '/App/Product/DomainApplicationList',
                method: 'POST',
                data: {}
            }).then((res) => {
                let list = [...res.data];
                let columnsData = list.map(item => {
                    return item.Name;
                })
                this.setData({
                    ['Application.columnsData']: columnsData,
                    ['Application.list']: list,
                    ['Application.value']: list[0].name,
                    ['Application.id']: list[0].Id,
                })
                setItem("DomainApplicationList", JSON.stringify(res.Data));
            }).catch((error) => {
                console.log(error)
            });
        } else {
            let list = [ ...JSON.parse(DomainApplicationList) ] ;
            let columnsData = list.map(item => {
                return item.Name;
            })
            this.setData({
                ['Application.columnsData']: columnsData,
                ['Application.list']: list,
                ['Application.value']: list[0].Name,
                ['Application.id']: list[0].Id,
            })
        }
    },

    // 选择应用领域
    handleApplicationList(){
        this.setData({
            ['Application.show']: true,
        })
    },
    handleApplicationConfirm(event) {
        const { value,index } = event.detail;
        let id = this.data.Application.list[index].Id;
        this.setData({
            ['Application.value']: value,
            ['Application.id']: id,
            ['Application.show']: false,
        })
    },
    handleApplicationCancel() {
        this.setData({
            ['Application.show']: false,
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
                let list = [...res.Data];

                let columnsData = list.map(item => {
                    return item.Name;
                })
                setItem("DomainList", JSON.stringify(list));

                this.setData({
                    ['DomainList.list']: list,
                    ['DomainList.columnsData']:columnsData,
                    ['DomainList.value']:list[0].Name,
                    ['DomainList.id']:list[0].Id,
                })
                this.getDomainCell(list[0].Id);
            }).catch((error) => {
                console.log(error)
            })
        } else {
            let list = [...JSON.parse(DomainList)];
            let columnsData = list.map(item => {
                return item.Name;
            })
            this.setData({
                ['DomainList.list']: list,
                ['DomainList.columnsData']:columnsData,
                ['DomainList.value']:list[0].Name,
                ['DomainList.id']:list[0].Id,
            })
            this.getDomainCell(list[0].Id);
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
            let list = [...res.Data];
            let columnsData = list.map(item => {
                return item.Name;
            })
            this.setData({
                ['DomainCell.list']: list,
                ['DomainCell.columnsData']:columnsData,
                ['DomainCell.value']:list[0].Name,
                ['DomainCell.id']:list[0].Id,
            })
        }).catch((error) => {
            console.log(error)
        })
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
            ['DomainList.show']: false,
        })
        this.getDomainCell(id)
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
    //输入
    handleChangeInput(e) {
        let { cell } = e.currentTarget.dataset;
        this.setData({
            [ cell ]: e.detail
        })
    },

    //上传图片
    handleUploadImg(e){
        this.setData({
            PicUrls: e.detail
        })
    },
    // 移除图片
    handleRemoveImg(list){
        this.setData({
            PicUrls: list
        })
    },
    //输入简介
    bindAbstractChange(e){
        this.setData({
            Abstract: e.detail
        })
    },
    //输入描述
    bindTextAreaChange(e){
        this.setData({
            TxtContent: e.detail
        })
    },
    //发布/修改
    handleSubmitPurchase() {
        let {
            isEdit,
            SchemeName,
            Abstract,
            SchemeId,
            SchemePrice,
            PicUrls,
            TxtContent,
            Application,
            DomainList,
            DomainCell
        } = this.data;
        // 验证
        if( isEmpty( SchemeName) ){
            wx.showToast({
                title: '请输入方案名称',
                icon:'none'
            })
            return;
        }
        if( isEmpty(Abstract) ){
            wx.showToast({
                title: '请输入方案简介',
                icon:'none'
            })
            return;
        }
        if( isEmpty( SchemePrice) ){
            wx.showToast({
                title: '请输入方案价格',
                icon:'none'
            })
            return;
        }
        if( isEmpty( Application.id) ){
            wx.showToast({
                title: '请选择应用领域',
                icon:'none'
            })
            return;
        }
        if( isEmpty( DomainList.id) ||  isEmpty( DomainCell.id) ){
            wx.showToast({
                title: '请选择技术领域',
                icon:'none'
            })
            return;
        }
        if( PicUrls.length == 0 ){
            wx.showToast({
                title: '请上传方案图片',
                icon:'none'
            })
            return;
        }
        if( isEmpty( TxtContent) ){
            wx.showToast({
                title: '请输入描述内容',
                icon:'none'
            })
            return;
        }
        let UserId = getItem('hd_userId') || '';
        let Token = getItem('hd_token') || '';
        if(!isEdit){
            // 发布
            ajax({
                url: '/app/UserCenter/AddScheme',
                method: 'POST',
                data: {
                    UserId,
                    Token,
                    Abstract,
                    AppDominId: Application.id,
                    TeachDominParentId:DomainList.id ,
                    TeachDominId: DomainCell.id,
                    SchemePrice,
                    PicUrls: PicUrls.join(',') ,
                    TxtContent,
                    SchemeName
                }
            }).then((res) => {
                wx.showToast({
                    title:  '发布成功',
                    icon: 'success',
                    success:() =>{
                        wx.navigateBack();
                    }
                })

            }).catch((error) => {
                console.log(error)
            })

        }else{
            //编辑
            ajax({
                url: '/app/UserCenter/SchemeEdit',
                method: 'POST',
                data: {
                    UserId,
                    Token,
                    SchemeId,
                    AppDominId: Application.id,
                    TeachDominParentId:DomainList.id ,
                    TeachDominId: DomainCell.id,
                    SchemePrice,
                    Abstract,
                    SchemeName,
                    PicUrls: PicUrls.join(',') ,
                    TxtContent
                }
            }).then((res) => {
                wx.showToast({
                    title:  '修改成功',
                    icon: 'success',
                    success:() =>{
                        wx.navigateBack();
                    }
                })
            }).catch((error) => {
                console.log(error)
            })
        }
    },
})
