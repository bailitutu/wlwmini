import {getItem} from '../../../utils/util'
import {ajax} from "../../../utils/api";
import {isEmpty} from "../../../utils/validate";
import {getApplicationList, getDomainList, getMainClassList} from "../../../utils/services";
import { goPage } from '../../../utils/common'

Page({
    data: {
        isReady: false,
        isEdit: false,
        MainClass: {
            columnsData: [],
            list: [],
            value: '',
            id: '',
            show: false
        },
        SubClass: {
            columnsData: [],
            list: [],
            value: '',
            id: '',
            show: false
        },
        Application: {
            columnsData: [],
            list: [],
            value: '',
            id: '',
            show: false
        },
        DomainList: {
            columnsData: [],
            list: [],
            value: '',
            id: '',
            show: false
        },
        DomainCell: {
            columnsData: [],
            list: [],
            value: '',
            id: '',
            show: false
        },
        SeniorOne: {
            columnsData: [],
            list: [],
            value: '',
            id: '',
            show: false
        },
        SeniorTwo: {
            columnsData: [],
            list: [],
            value: '',
            id: '',
            show: false
        },
        ProductName: '',
        ProductPrice: '',
        PicUrls: [], //图片列表
        TxtContent: ''
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
        } else {
            this.loadApplicationList();
            this.loadDomainList();
            this.loadMainClassList();
            this.loadSeniorList();
        }

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
            } = res.Data;
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
                ['MainClass.id']: MainClassId,
                ['SubClass.id']: SecondaryClassId,
                ['Application.id']:AppDominId,
                ['DomainList.id']:TeachDominParentId,
                ['DomainCell.id']:TeachDominId,
                ['SeniorOne.id']: Senior1,
                ['SeniorTwo.id']: Senior2,
            })
            this.loadApplicationList();
            this.loadDomainList();
            this.loadMainClassList();
            this.loadSeniorList();
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

    fillApplication() {
		let {Application} = this.data;
		let proId = Application.id || Application.list[0].Id;
        if (proId) {
            let pro = Application.list.find((item) => {
                return proId == item.Id
			})
            this.setData({
				['Application.value']: pro ? pro.Name : Application.list[0].Name,
				['Application.id']: pro ? proId : Application.list[0].Id
            })
        }
    },


    // 选择应用领域
    handleApplicationList() {
        this.setData({
            ['Application.show']: true,
        })
    },
    handleApplicationConfirm(event) {
        const {value, index} = event.detail;
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
    loadMainClassList() {
        let MainClass = getMainClassList();
        let columnsData = MainClass && MainClass.map(item => {
            return item.ClassName;
        })
        this.setData({
            ['MainClass.columnsData']: columnsData,
            ['MainClass.list']: MainClass,
        })
        this.fillMainClass();
    },

    fillMainClass() {
        let {MainClass} = this.data;
        let proId = MainClass.id || MainClass.list[0].ClassId;
        if (proId) {
            let pro = MainClass.list.find((item) => {
                return proId == item.ClassId
            })
            this.setData({
				['MainClass.value']: pro ? pro.ClassName : MainClass.list[0].ClassName,
				['MainClass.id']: pro ? proId : MainClass.list[0].ClassId
            })
            this.loadSubClass(proId);
        }
    },
    // 获取技术领域子级
    loadSubClass(ParentId) {
        ajax({
            url: '/app/Product/SubLevelClassList',
            method: 'POST',
            data: {
                classId: ParentId
            }
        }).then((res) => {
            let [...list] = res.Data;
            let columnsData = list && list.map(item => {
                    return item.ClassName;
                })
            this.setData({
                ['SubClass.list']: res.Data || [],
                ['SubClass.columnsData']: columnsData || [],
            })
            this.fileSubClass();
        }).catch((error) => {
            console.log(error)
        })
    },
    fileSubClass() {
        let {SubClass} = this.data;
        let proId = SubClass.id || SubClass.list[0].ClassId;
        if (proId) {
            let pro = SubClass.list.find((item) => {
                return proId == item.ClassId
            })
            this.setData({
				['SubClass.value']: pro ? pro.ClassName : SubClass.list[0].ClassName,
				['SubClass.id']:pro ? proId : SubClass.list[0].ClassId
            })
        }
    },

    // 一级选择
    handleSelectMainClass() {
        this.setData({
            ['MainClass.show']: true,
        })
    },
    handleMainClassConfirm(event) {
        const {value, index} = event.detail;
        let id = this.data.MainClass.list[index].ClassId;
        this.setData({
            ['MainClass.value']: value,
            ['MainClass.id']: id,
            ['SubClass.value']: '',
            ['SubClass.id']: '',
            ['MainClass.show']: false,
        })
        this.loadSubClass(id)
    },
    handleMainClassCancel() {
        this.setData({
            ['MainClass.show']: false,
        })
    },
    // 二级选择
    handleSelectSubClass() {
        this.setData({
            ['SubClass.show']: true,
        })
    },
    handleSubClassConfirm(event) {
        const {value, index} = event.detail;
        let id = this.data.SubClass.list[index].ClassId;
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
    loadDomainList() {
        let DomainList = getDomainList();
        let columnsData = DomainList && DomainList.map(item => {
            return item.Name;
        })
        this.setData({
            ['DomainList.list']: DomainList,
            ['DomainList.columnsData']: columnsData,
        })
        this.fillDomainList();
    },
    fillDomainList() {
        let {DomainList} = this.data;
        let proId = DomainList.id || DomainList.list[0].Id;
        if (proId) {
            let pro = DomainList.list.find((item) => {
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
                ['DomainCell.columnsData']: columnsData,
            })
            this.fillDomainCell();
        }).catch((error) => {
            console.log(error)
        })
    },
    fillDomainCell() {
        let {DomainCell} = this.data;
        let proId = DomainCell.id || DomainCell.list[0].Id;
        if (proId) {
            let pro = DomainCell.list.find((item) => {
                return proId == item.Id
            })
            this.setData({
				['DomainCell.value']: pro ? pro.Name : DomainCell.list[0].Name,
				['DomainCell.id']: pro ? proId : DomainCell.list[0].Id
            })
        }
    },
    // 一级选择
    handleDomainListList() {
        this.setData({
            ['DomainList.show']: true,
        })
    },
    handleDomainListConfirm(event) {
        const {value, index} = event.detail;
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
    handleDomainCellList() {
        this.setData({
            ['DomainCell.show']: true,
        })
    },
    handleDomainCellConfirm(event) {
        const {value, index} = event.detail;
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
    loadSeniorList () {
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
            let [...list ]= res.Data;
            let SeniorOne = [];
            let SeniorTwo = [];
            let SeniorOneData = [];
			let SeniorTwoData = [];
            list.forEach(item => {
                if (item.Type == 1) {
                    SeniorOne.push(item.Name);
                    SeniorOneData.push(item)
                } else {
                    SeniorTwo.push(item.Name);
                    SeniorTwoData.push(item)
                }
            });
            this.setData({
                ['SeniorOne.list']: SeniorOneData,
                ['SeniorOne.columnsData']: SeniorOne,
                ['SeniorTwo.list']: SeniorTwoData,
                ['SeniorTwo.columnsData']: SeniorTwo,
            })
            this.fillSeniorOne();
            this.fillSeniorTwo();
        }).catch((error) => {
            console.log(error)
        })

    },
    fillSeniorOne() {
        let {SeniorOne} = this.data;
        let proId = SeniorOne.id || SeniorOne.list[0].Id;
        if (proId) {
            let pro = SeniorOne.list.find((item) => {
                return proId == item.Id
            })
            this.setData({
                ['SeniorOne.value']: pro.Name,
                ['SeniorOne.id']: proId
            })
        }
    },
    fillSeniorTwo() {
        let {SeniorTwo} = this.data;
        let proId = SeniorTwo.id || SeniorTwo.list[0].Id;
        if (proId) {
            let pro = SeniorTwo.list.find((item) => {
                return proId == item.Id
            })
            this.setData({
                ['SeniorTwo.value']: pro.Name,
                ['SeniorTwo.id']: proId
            })
        }
    },


    // 高级选项选择
    handleSeniorOneList() {
        this.setData({
            ['SeniorOne.show']: true,
        })
    },
    handleSeniorOneConfirm(event) {
        const {value, index} = event.detail;
        let id = this.data.SeniorOne.list[index].Id;
        this.setData({
            ['SeniorOne.value']: value,
            ['SeniorOne.id']: id,
            ['SeniorOne.show']: false,
        })
    },
    handleSeniorOneCancel() {
        this.setData({
            ['SeniorOne.show']: false,
        })
    },
    // 二级选择
    handleSeniorTwoList() {
        this.setData({
            ['SeniorTwo.show']: true,
        })
    },
    handleSeniorTwoConfirm(event) {
        const {value, index} = event.detail;
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
        let {cell} = e.currentTarget.dataset;
        this.setData({
            [cell]: e.detail
        })
    },

    //上传图片
    handleUploadImg(e) {
        this.setData({
            PicUrls: e.detail
        })
    },
    // 移除图片
    handleRemoveImg(e) {
        this.setData({
            PicUrls: e.detail
        })
    },
    //输入简介
    bindTextAreaChange(e) {
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
        if (isEmpty(ProductName)) {
            wx.showToast({
                title: '请输入产品名称',
                icon: 'none'
            })
            return;
        }
        if (isEmpty(ProductPrice)) {
            wx.showToast({
                title: '请输入产品价格',
                icon: 'none'
            })
            return;
        }
        if (isEmpty(MainClass.id)) {
            wx.showToast({
                title: '请选择产品分类',
                icon: 'none'
            })
            return;
        }
        if (isEmpty(Application.id)) {
            wx.showToast({
                title: '请选择应用领域',
                icon: 'none'
            })
            return;
        }

        if (isEmpty(DomainList.id) || isEmpty(DomainCell.id)) {
            wx.showToast({
                title: '请选择技术领域',
                icon: 'none'
            })
            return;
        }
        if (PicUrls.length == 0) {
            wx.showToast({
                title: '请上传产品图片',
                icon: 'none'
            })
            return;
        }

        if (isEmpty(TxtContent)) {
            wx.showToast({
                title: '请输入描述内容',
                icon: 'none'
            })
            return;
        }
        let UserId = getItem('hd_userId') || '';
        let Token = getItem('hd_token') || '';
        let PicUrlsList = PicUrls.map(item => {
            return item.imgUrl
        });
        if (!isEdit) {
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
                    TeachDominParentId: DomainList.id,
                    TeachDominId: DomainCell.id,
                    ProudctPrice: ProductPrice,
                    PicUrls: PicUrlsList,
                    PicUrlsMagnifier: PicUrlsList,
                    Senior1: SeniorOne.id,
                    Senior2: SeniorTwo.id,
                    TxtContent,
                    ProductName
                }
            }).then((res) => {
                wx.showToast({
                    title: '发布成功',
                    icon: 'success',
                    success: () => {
                        setTimeout(() => {
							goPage('我发布的产品', {}, 3);
                        }, 1000)
                    }
                })

            }).catch((error) => {
                console.log(error)
            })

        } else {
            //编辑
            ajax({
                url: '/app/Product/ProductUpdate',
                method: 'POST',
                data: {
                    UserId,
                    Token,
                    productId: ProductId,
                    MainClassId: MainClass.id,
                    SecondaryClassId: SubClass.id,
                    AppDominId: Application.id,
                    TeachDominParentId: DomainList.id,
                    TeachDominId: DomainCell.id,
                    ProudctPrice: ProductPrice,
                    ProductName,
                    PicUrlsMagnifier: PicUrlsList,
                    Senior1: SeniorOne.id,
                    Senior2: SeniorTwo.id,
                    PicUrls:PicUrlsList,
                    TxtContent
                }
            }).then((res) => {
                wx.showToast({
                    title: '修改成功',
                    icon: 'success',
                    success: () => {
                        setTimeout(() => {
                            wx.navigateBack();
                        }, 1000)
                    }
                })
            }).catch((error) => {
                console.log(error)
            })
        }
    },


})
