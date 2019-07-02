import {goPage} from '../../../utils/common'
import {getItem, setItem,} from '../../../utils/util'
import {ajax} from "../../../utils/api";
import { isEmpty } from "../../../utils/validate";
import {getApplicationList, getDomainList} from "../../../utils/services";

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
        }else{
            this.loadApplicationList();
            this.loadDomainList();
        }

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
            let img_list =  PicUrls != '' ? [{ imgUrl: PicUrls }] : [];
            this.setData({
                WantBuyName,
                WantBuyPrice,
                PicUrls: img_list,
                TxtContent,
                ['Application.id']: AppDominId,
                ['DomainList.id']:TeachDominParentId,
                ['DomainCell.id']:TeachDominId
            })
            this.loadApplicationList();
            this.loadDomainList();
        }).catch((error) => {
            console.log(error)
        })
    },

    // 获取应用领域
    loadApplicationList() {
        let ApplicationList = getApplicationList();
        let columnsData = ApplicationList && ApplicationList.map(item => {
            return item.Name;
        })
        this.setData({
            ['Application.columnsData']: columnsData,
            ['Application.list']: ApplicationList,
        })
        this.fillApplication();
    },

    fillApplication(){
        let { Application } = this.data;
        let proId = Application.id || Application.list[0].Id;
        if( proId ){
            let pro = Application.list.find((item)=>{
                return proId == item.Id
            })
            this.setData({
				['Application.value']: pro ? pro.Name : Application.list[0].Name,
				['Application.id']: pro ? proId : Application.list[0].Id
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
            ['Application.id']: id,
            ['Application.show']: false,
        })
        this.fillApplication();
    },
    handleApplicationCancel() {
        this.setData({
            ['Application.show']: false,
        })
    },

    // 获取技术领域父级
    loadDomainList() {
        let DomainList = getDomainList();
        let columnsData = DomainList.map(item => {
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
				['DomainList.value']: pro ? pro.Name : DomainList.list[0].Name,
				['DomainList.id']: pro ? proId : DomainList.list[0].Id
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
				['DomainCell.value']: pro ? pro.Name : DomainCell.list[0].Name,
				['DomainCell.id']: pro ? proId : DomainCell.list[0].Id
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
            ['DomainCell.value']: '',
            ['DomainCell.id']: '',
            ['DomainList.show']: false,
        })
        this.loadDomainCell(id)
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
						   goPage('我发布的求购',{}, 3);
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
