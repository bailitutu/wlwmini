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
        WantBuyName:'',
        WantBuyPrice: 0,
        PicUrls: [],
        TxtContent:''
    },
    onLoad: function (opts) {
        if (opts.isEdit) {
            this.setData({
                isEdit: true,
                WantBuyId: opts.WantBuyId
            })
            wx.setNavigationBarTitle({
                title: '编辑求购'
            })
            this.loadData(opts.WantBuyId);
        }
        this.getApplicationList();
        this.getDomainList();
    },
    loadData(WantBuyId) {
        let UserId = getItem('hd_userId') || '';
        let Token = getItem('hd_token') || '';
        ajax({
            url: '/App/UserCenter/GetWantBuyInfo',
            method: 'POST',
            data: {
                UserId,
                Token,
                WantBuyId
            }
        }).then((res) => {
            let {
                WantBuyName,
                AppDominId,
                TeachDominParentId,
                TeachDominId,
                WantBuyPrice,
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
            let img_list =  PicUrls != '' ? [{ imgUrl: PicUrls }] : [];
            this.setData({
                WantBuyName,
                WantBuyPrice,
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
        console.log(DomainApplicationList);
        if (!DomainApplicationList) {
            ajax({
                url: '/App/Product/DomainApplicationList',
                method: 'POST',
                data: {}
            }).then((res) => {
                let list = res.Data;
                console.log(res.Data)
                let columnsData = []
                for( let i=0 ;i< list.length ;i++){
                    columnsData.push(list[i].Name);
                }

                // let columnsData = res.Data.map(item => {
                //     return item.Name;
                // })
                console.log(list);
                // return;
                this.setData({
                    ['Application.columnsData']: columnsData,
                    ['Application.list']: list,
                    ['Application.value']: list[0].name,
                    ['Application.id']: list[0].Id,
                })
                setItem("DomainApplicationList", JSON.stringify(list));
            }).catch((error) => {
                console.log(error)
            });
        } else {
            var list = JSON.parse(DomainApplicationList);
            console.log(list);
            let columnsData = [];
            for( let i=0 ;i< list.length ;i++){
                columnsData.push(list[i].Name);
            }
            console.log(list);
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
                let [...list] = res.Data;
                let columnsData = list.map(item => {
                    return item.Name;
                })
                setItem("DomainList", JSON.stringify(res.Data));

                this.setData({
                    ['DomainList.list']: res.Data,
                    ['DomainList.columnsData']:columnsData,
                    ['DomainList.value']:res.Data[0].Name,
                    ['DomainList.id']:res.Data[0].Id,
                })
                this.getDomainCell(list[0].Id);
            }).catch((error) => {
                console.log(error)
            })
        } else {
            let  [...list] = JSON.parse(DomainList);
            let columnsData = list.map(item => {
                return item.Name;
            })
            this.setData({
                ['DomainList.list']: JSON.parse(DomainList),
                ['DomainList.columnsData']:columnsData,
                ['DomainList.value']:JSON.parse(DomainList)[0].Name,
                ['DomainList.id']:JSON.parse(DomainList)[0].Id,
            })
            this.getDomainCell(JSON.parse(DomainList)[0].Id);
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
            let [...list] = res.Data;
            let columnsData = list.map(item => {
                return item.Name;
            })
            this.setData({
                ['DomainCell.list']: res.Data,
                ['DomainCell.columnsData']:columnsData,
                ['DomainCell.value']:res.Data[0].Name,
                ['DomainCell.id']:res.Data[0].Id,
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
            ['DomainCell.value']: '',
            ['DomainCell.id']: '',
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
    bindTextAreaChange(e){
        this.setData({
            TxtContent: e.detail
        })
    },
    //发布/修改
    handleSubmitPurchase() {
        let {
            isEdit,
            WantBuyName,
            WantBuyId,
            WantBuyPrice,
            PicUrls,
            TxtContent,
            Application,
            DomainList,
            DomainCell
        } = this.data;
        // 验证
        if( isEmpty( WantBuyName) ){
            wx.showToast({
                title: '请输入求购名称',
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
                url: '/app/UserCenter/AddWantBuy',
                method: 'POST',
                data: {
                    UserId,
                    Token,
                    AppDominId: Application.id,
                    TeachDominParentId:DomainList.id ,
                    TeachDominId: DomainCell.id,
                    WantBuyPrice,
                    PicUrls: PicUrls[0].imgUrl ,
                    TxtContent,
                    WantBuyName
                }
            }).then((res) => {
                wx.showToast({
                    title:  '发布成功',
                    icon: 'success',
                    success:() =>{
                       setTimeout(()=>{
                           wx.navigateBack();
                       },1000)
                    }
                })

            }).catch((error) => {
                console.log(error)
            })

        }else{
            //编辑
            ajax({
                url: '/app/UserCenter/WantBuyEdit',
                method: 'POST',
                data: {
                    UserId,
                    Token,
                    WantBuyId,
                    AppDominId: Application.id,
                    TeachDominParentId:DomainList.id ,
                    TeachDominId: DomainCell.id,
                    WantBuyPrice,
                    WantBuyName,
                    PicUrls:PicUrls[0].imgUrl ,
                    TxtContent
                }
            }).then((res) => {
                wx.showToast({
                    title:  '修改成功',
                    icon: 'success',
                    success:() =>{
                        setTimeout(()=>{
                            wx.navigateBack();
                        },1000)
                    }
                })
            }).catch((error) => {
                console.log(error)
            })
        }
    },



})
