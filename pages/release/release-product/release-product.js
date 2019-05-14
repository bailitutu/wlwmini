import {goPage} from '../../../utils/common'
import {getItem, setItem,} from '../../../utils/util'
import {ajax} from "../../../utils/api";
import { isEmpty } from "../../../utils/validate";

Page({
    data: {
        isReady: false,
        isEdit: false,
        MainClass: {
            columnsData:[],
            list: [],
            value: '',
            id: '',
            show: false
        },
        SubClass: {
            columnsData:[],
            list: [],
            value: '',
            id: '',
            show: false
        },
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
        SeniorOne:{
            columnsData:[],
            list: [],
            value: '',
            id: '',
            show: false
        },
        SeniorTwo: {
            columnsData:[],
            list: [],
            value: '',
            id: '',
            show: false
        },
        ProductName:'',
        ProductPrice:'',
        PicUrls: [],
        TxtContent:''
    },
    onLoad: function (opts) {
        if (opts.isEdit) {
            this.setData({
                isEdit: true,
                ProductId: opts.ProductId
            })
            wx.setNavigationBarTitle({
                title: '编辑产品'
            })
            this.loadData(opts.ProductId);
        }
        this.getApplicationList();
        this.getDomainList();
        this.getMainClassList();
        this.getSeniorList();
    },
    loadData(productId) {
        let UserId = getItem('hd_userId') || '';
        let Token = getItem('hd_token') || '';
        ajax({
            url: '/App/Product/ProductInfo',
            method: 'POST',
            data: {
                UserId,
                Token,
                productId
            }
        }).then((res) => {
            let {
                ProductName,
                ProudctPrice,
                MainClassId,
                SecondaryClassId,
                Senior1,
                Senior2,
                AppDominId,
                TeachDominParentId,
                TeachDominId,
                ProductPrice,
                PicUrls,
                TxtContent,

            } =  res.Data;

            let MainClass = [ ...this.data.MainClass.list];
            let SubClass = [ ...this.data.SubClass.list];
            let ApplicationList = [ ...this.data.Application.list];
            let DomainList = [...this.data.DomainList.list];
            let DomainCell = [...this.data.DomainCell.list];
            let SeniorOne = [...this.data.SeniorOne.list];
            let SeniorTwo = [...this.data.SeniorTwo.list];
            let MainClassValue = '';
            let SubClassValue = '';
            let ApplicationValue = '';
            let DomainListValue = '';
            let DomainCellValue = '';
            let SeniorOneValue = '';
            let SeniorTwoValue = '';
            MainClass.map(item => {
                if(item.Id = MainClassId ){
                    MainClassValue = item.Name
                    return;
                }
            });
            SubClass.map(item => {
                if(item.Id = SecondaryClassId ){
                    SubClassValue = item.Name
                    return;
                }
            });
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
            SeniorOne.map(item => {
                if(item.Id = Senior1 ){
                    SeniorOneValue = item.Name
                    return;
                }
            });
            SeniorTwo.map(item => {
                if(item.Id = Senior2 ){
                    SeniorTwoValue = item.Name
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
                ProductName,
                ProductPrice: ProudctPrice,
                PicUrls: img_list,
                TxtContent,
                ['MainClass.value']: ApplicationValue,
                ['MainClass.id']: AppDominId,
                ['SubClass.value']: ApplicationValue,
                ['SubClass.id']: AppDominId,
                ['Application.value']: ApplicationValue,
                ['Application.id']: AppDominId,
                ['DomainList.value']:DomainListValue,
                ['DomainList.id']:TeachDominParentId,
                ['DomainCell.value']:DomainCellValue,
                ['DomainCell.id']:TeachDominId,
                ['SeniorOne.value']: ApplicationValue,
                ['SeniorOne.id']: AppDominId,
                ['SeniorTwo.value']: ApplicationValue,
                ['SeniorTwo.id']: AppDominId,
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
                let list = [...res.Data];
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

    // 获取产品分类父级
    getMainClassList() {
        let MainClass = getItem('MainClass') || false;
        if (!MainClass) {
            ajax({
                url: '/app/Product/SubLevelClassList',
                method: 'POST',
                data: {
                    classId: 0
                }
            }).then((res) => {
                let list = [...res.Data];
                let columnsData = list.map(item => {
                    return item.ClassName;
                })
                setItem("MainClass", JSON.stringify(list));
                this.setData({
                    ['MainClass.list']: list,
                    ['MainClass.columnsData']:columnsData,
                    ['MainClass.value']:list[0].ClassName,
                    ['MainClass.id']:list[0].ClassId,
                })
                this.getSubClass(list[0].ClassId);
            }).catch((error) => {
                console.log(error)
            })
        } else {
            let list = [...JSON.parse(MainClass)];
            let columnsData = list.map(item => {
                return item.ClassName;
            })
            this.setData({
                ['MainClass.list']: list,
                ['MainClass.columnsData']:columnsData || [],
                ['MainClass.value']:list[0].ClassName || '',
                ['MainClass.id']:list[0].ClassId || '',
            })
            this.getSubClass(list[0].ClassId);
        }
    },
    // 获取技术领域子级
    getSubClass(ParentId) {
        ajax({
            url: '/app/Product/SubLevelClassList',
            method: 'POST',
            data: {
                classId:ParentId
            }
        }).then((res) => {
            let list = [...res.Data];
            let columnsData = [];
            if(list.length){
                columnsData = list.map(item => {
                    return item.ClassName;
                })
            }
            this.setData({
                ['SubClass.list']: list || [],
                ['SubClass.columnsData']:columnsData || [],
                ['SubClass.value']:list[0].ClassName || '',
                ['SubClass.id']:list[0].ClassId || '',
            })
        }).catch((error) => {
            console.log(error)
        })
    },
    // 一级选择
    handleSelectMainClass(){
        this.setData({
            ['MainClass.show']: true,
        })
    },
    handleMainClassConfirm(event) {
        const { value,index } = event.detail;
        let id = this.data.DomainList.list[index].Id;
        this.setData({
            ['MainClass.value']: value,
            ['MainClass.id']: id,
            ['SubClass.value']: '',
            ['SubClass.id']: '',
            ['MainClass.show']: false,
        })
        this.getSubClass(id)
    },
    handleMainClassCancel() {
        this.setData({
            ['MainClass.show']: false,
        })
    },
    // 二级选择
    handleSelectSubClass(){
        this.setData({
            ['SubClass.show']: true,
        })
    },
    handleSubClassConfirm(event) {
        const { value,index } = event.detail;
        let id = this.data.SubClass.list[index].Id;
        this.setData({
            ['SubClass.value']: value,
            ['SubClass.id']: id,
            ['SubClass.show']: false,
        })
    },
    handleSubClassCancel() {
        this.setData({
            ['SubClass.show']: false,
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

    //获取高级选项：
    getSeniorList(){
        let UserId = getItem('hd_userId') || '';
        let Token = getItem('hd_token') || '';
        ajax({
            url: '/App/Product/SeniorList',
            method: 'POST',
            data: {
                UserId,
                Token
            }
        }).then((res) => {
            let list = [...res.Data];
            let SeniorOne = [];
            let SeniorTwo = [];
            let SeniorOneData = [];
            let SeniorTwoData = [];
            list.forEach(item => {
                if(item.Type == 1){
                    SeniorOne.push(item.Name);
                    SeniorOneData.push(item)
                }else{
                    SeniorTwo.push(item.Name);
                    SeniorTwoData.push(item)
                }
            });
            this.setData({
                ['SeniorOne.list']: SeniorOneData,
                ['SeniorOne.columnsData']:SeniorOne,
                ['SeniorOne.value']:SeniorOneData[0].Name,
                ['SeniorOne.id']:SeniorOneData[0].Id,
                ['SeniorTwo.list']: SeniorTwoData,
                ['SeniorTwo.columnsData']:SeniorTwo,
                ['SeniorTwo.value']:SeniorTwoData[0].Name,
                ['SeniorTwo.id']:SeniorTwoData[0].Id,
            })
        }).catch((error) => {
            console.log(error)
        })

    },
    // 高级选项选择
    handleSeniorOneList(){
        this.setData({
            ['SeniorOne.show']: true,
        })
    },
    handleSeniorOneConfirm(event) {
        const { value,index } = event.detail;
        let id = this.data.SeniorOne.list[index].Id;
        this.setData({
            ['SeniorOne.value']: value,
            ['SeniorOne.id']: id,
            ['SeniorTwo.value']: '',
            ['SeniorTwo.id']: '',
            ['SeniorOne.show']: false,
        })
    },
    handleSeniorOneCancel() {
        this.setData({
            ['SeniorOne.show']: false,
        })
    },
    // 二级选择
    handleSeniorTwoList(){
        this.setData({
            ['SeniorTwo.show']: true,
        })
    },
    handleSeniorTwoConfirm(event) {
        const { value,index } = event.detail;
        let id = this.data.SeniorTwo.list[index].Id;
        this.setData({
            ['SeniorTwo.value']: value,
            ['SeniorTwo.id']: id,
            ['SeniorTwo.show']: false,
        })
    },
    handleSeniorTwoCancel() {
        this.setData({
            ['SeniorTwo.show']: false,
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
            PicUrls: e.detail[0].imgUrl
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
            ProductName,
            ProductId,
            MainClass,
            SubClass,
            SeniorOne,
            SeniorTwo,
            ProductPrice,
            PicUrls,
            TxtContent,
            Application,
            DomainList,
            DomainCell
        } = this.data;
        // 验证
        if( isEmpty( ProductName) ){
            wx.showToast({
                title: '请输入产品名称',
                icon:'none'
            })
            return;
        }
        if( isEmpty( ProductPrice) ){
            wx.showToast({
                title: '请输入产品价格',
                icon:'none'
            })
            return;
        }
        if( isEmpty( MainClass.id)){
            wx.showToast({
                title: '请选择产品分类',
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
                title: '请上传产品图片',
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
                url: '/app/Product/AddProduct',
                method: 'POST',
                data: {
                    UserId,
                    Token,
                    MainClassId: MainClass.id,
                    SecondaryClassId: SubClass.id,
                    AppDominId: Application.id,
                    TeachDominParentId:DomainList.id ,
                    TeachDominId: DomainCell.id,
                    ProudctPrice:ProductPrice,
                    PicUrls,
                    PicUrlsMagnifier: PicUrls,
                    Senior1: SeniorOne.id,
                    Senior2: SeniorTwo.id,
                    TxtContent,
                    ProductName
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
                url: '/app/Product/ProductUpdate',
                method: 'POST',
                data: {
                    UserId,
                    Token,
                    productId:ProductId,
                    MainClassId: MainClass.id,
                    SecondaryClassId: SubClass.id,
                    AppDominId: Application.id,
                    TeachDominParentId:DomainList.id ,
                    TeachDominId: DomainCell.id,
                    ProudctPrice:ProductPrice,
                    ProductName,
                    PicUrlsMagnifier: PicUrls,
                    Senior1: SeniorOne.id,
                    Senior2: SeniorTwo.id,
                    PicUrls,
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
