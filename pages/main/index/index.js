import { ajax } from "../../../utils/api";
import { goPage } from '../../../utils/common'
import { getItem, setItem } from '../../../utils/util'
import Toast from "../../../dist/toast/toast";
Page({

    /**
     * 页面的初始数据
     */
    data: {
        DomainApplicationList:[],
        DomainOutDto:[],
        isBottom: false,
        headerBarActive: 0,
        headBarList: [{
            isActive: true,
            iconNormal: '/images/hp_list_product_nor@2x.png',
            iconActive: '/images/hp_list_product_hig@2x.png',
            name: '产品'
        }, {
            isActive: false,
            iconNormal: '/images/hp_list_plan_nor@2x.png',
            iconActive: '/images/hp_list_plan_hig@2x.png',
            name: '方案'
        }, {
            isActive: false,
            iconNormal: '/images/hp_list_requirement_nor@2x.png',
            iconActive: '/images/hp_list_requirement_hig@2x.png',
            name: '求购'
        }, {
            isActive: false,
            iconNormal: '/images/hp_list_activity_nor@2x.png',
            iconActive: '/images/hp_list_activity_hig@2x.png',
            name: '活动'
        }, {
            isActive: false,
            iconNormal: '/images/hp_list_company_nor@2x.png',
            iconActive: '/images/hp_list_company_hig@2x.png',
            name: '企业'
        }],
        tabBarActive: 0,
        tabBarList: [{
            normal: '/images/hp_label_hp_nor@2x.png',
            active: '/images/hp_label_hp_hig@2x.png'
        }, {
            normal: '/images/hp_label_issue_nor@2x.png',
            active: '/images/hp_label_issue_hig@2x.png'
        }, {
            normal: '/images/hp_label_about_nor@2x.png',
            active: '/images/hp_label_about_hig@2x.png'
        }],
        Keyword:'', //搜索关键词
        AppDominId:0, //应用领域
        TeachDominId: 0, //技术领域
        productInfo: {
            list: [],
            page:1,
            orderBy:1,
            noData:false,
            noMore:false,
        },
        planInfo: {
            list: [],
            page:1,
            orderBy:1,
            noData:false,
            noMore:false,
        },
        purchaseInfo: {
            list: [],
            page:1,
            orderBy:1,
            noData:false,
            noMore:false,
        },
        activityInfo: {
            list: [],
            page:1,
            orderBy:1,
            noData:false,
            noMore:false,
        },
        companyInfo: {
            list: [],
            page:1,
            orderBy:0,
            noData:false,
            noMore:false,
        },
        productList:[],
        productOrderBy:0,

        planList:[],
        planOrderBy:0,
        purchaseList:[],
        purchaseOrderBy:0,
        activityList:[],
        activityOrderBy:0,
        companyList:[],
        companyOrderBy:0,
        show: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getProductList();
        this.loadFilterData();
    },

    // 切换列表
    changeHeadTab(e) {
        const { idx }  = e.currentTarget.dataset;
        const { headBarList } = this.data;
        headBarList.map((item,index)=>{
            item.isActive =  index === idx ? true : false;
        })
        this.setData({
            headerBarActive: idx,
            headBarList: headBarList,
            Keyword:''
        })

        //处理页面切换
        switch(idx){
            case 1:
                this.getPlanList()
                break;
            case 2:
                this.getPurchaseList()
                break;
            case 3:
                this.getActivityList()
                break;
            case 4:
                this.getCompanyList();
                break;
            default:
                // 默认产品页面
                this.getProductList();
                break;
        }
    },
    // 输入关键词
    handleChangeSearch(e){
        console.log(e.detail)
        this.setData({
            Keyword: e.detail
        })
    },
    // 搜索
    handleSearch(){
        let { headerBarActive, productInfo,planInfo,purchaseInfo,activityInfo,companyInfo } = this.data;
        switch(headerBarActive){
            case 1:
                this.setData({
                    [ 'planInfo.list']: [],
                    [ 'planInfo.page']: 1,
                    [ 'planInfo.noData']: false,
                    [ 'planInfo.noMore']: false,
                })
                this.getPlanList();
                break;
            case 2:
                this.setData({
                    [ 'purchaseInfo.list']: [],
                    [ 'purchaseInfo.page']: 1,
                    [ 'purchaseInfo.noData']: false,
                    [ 'purchaseInfo.noMore']: false,
                })
                this.getPurchaseList()
                break;
            case 3:
                this.setData({
                    [ 'activityInfo.list']: [],
                    [ 'activityInfo.page']: 1,
                    [ 'activityInfo.noData']: false,
                    [ 'activityInfo.noMore']: false,
                })
                this.getActivityList()
                break;
            case 4:
                this.setData({
                    [ 'companyInfo.list']: [],
                    [ 'companyInfo.page']: 1,
                    [ 'companyInfo.noData']: false,
                    [ 'companyInfo.noMore']: false,
                })
                this.getCompanyList();
                break;
            default:
                // 默认产品页面
                this.setData({
                    [ 'productInfo.list']: [],
                    [ 'productInfo.page']: 1,
                    [ 'productInfo.noData']: false,
                    [ 'productInfo.noMore']: false,
                })
                this.getProductList();
                break;
        }
    },
    // 加载更多
    loadMore(){
        let { headerBarActive, productInfo,planInfo,purchaseInfo,activityInfo,companyInfo } = this.data;
        switch(headerBarActive){
            case 1:
                if(planInfo.noMore){
                    return;
                }
                let planPage = planInfo.page += 1;
                this.setData({
                    [ 'planInfo.page']: planPage,
                })
                this.getPlanList();
                break;
            case 2:
                if(purchaseInfo.noMore){
                    return;
                }
                let purchasePage = purchaseInfo.page += 1;

                this.setData({
                    [ 'purchaseInfo.page']: purchasePage,
                })
                this.getPurchaseList()
                break;
            case 3:
                if(activityInfo.noMore){
                    return;
                }
                let activityPage = activityInfo.page += 1;

                this.setData({
                    [ 'activityInfo.page']: activityPage,
                })
                this.getActivityList()
                break;
            case 4:
                if(companyInfo.noMore){
                    return;
                }
                let companyPage = companyInfo.page += 1;
                this.setData({
                    [ 'companyInfo.page']: companyPage,
                })
                this.getCompanyList();
                break;
            default:
                if(productInfo.noMore){
                    return;
                }
                let productPage = productInfo.page += 1;
                this.setData({
                    [ 'productInfo.page']: productPage,
                })
                console.log(this.data.productInfo.page);
                this.getProductList();
                break;
        }
    },
    //左侧排序
    handleOrderBy(e){
        let { order,type } = e.currentTarget.dataset;
        let orderBy;
        switch (type) {
            case '2':
                orderBy = 'planInfo.orderBy'
                this.setData({
                    [orderBy]:order
                })
                break;
            case '3':
                orderBy = 'purchaseInfo.orderBy'
                this.setData({
                    [orderBy]:order
                })
                break;
            case '4':
                orderBy = 'activityInfo.orderBy'
                this.setData({
                    [orderBy]:order
                })
                break;
            case '5':
                orderBy = 'companyInfo.orderBy'
                this.setData({
                    [orderBy]:order
                })
                break;
            default:
                orderBy = 'productInfo.orderBy'
                this.setData({
                    [orderBy]:order
                })
                console.log(this.data)
                break;
        }
        this.handleSearch();
    },
    // 获取产品列表信息
    getProductList( ) {
        let { Keyword ,AppDominId, TeachDominId, productInfo } = this.data;
        let page = productInfo.page;
        let pageSize = 20;
        let personData = {
            page: page || 1,
            pagesize: pageSize,
            OrderBy: productInfo.orderBy || 0,
            AppDominId ,
            TeachDominId,
            Keyword,
        };
        ajax({
            url:'/App/Product/ProductList',
            method: 'POST',
            data:personData
        }).then( ( res) => {
            let total = res.RowCount && res.RowCount>0 ?  Math.ceil(res.RowCount/pageSize) : 0;
            let noMore = total == page ? true :false;
            let noData = total == 0 ? true : false;
            let list = this.data.productInfo.list;
            this.setData({
                ['productInfo.list']: [
                    ...list,
                    ...res.Data
                ],
                ['productInfo.noMore']: noMore,
                ['productInfo.noData']: noData,
                isBottom: false
            })
        }).catch((error) =>{
            console.log(error)
        })
    },
    // 获取方案列表信息
    getPlanList(){
        console.log('plan')
        let { Keyword ,AppDominId, TeachDominId,planInfo } = this.data;
        let page = planInfo.page;
        let pageSize = 20;
        let personData = {
            page: page || 1,
            pagesize: pageSize,
            OrderBy: planInfo.orderBy || 0,
            AppDominId ,
            TeachDominId,
            Keyword,
        };
        ajax({
            url:'/App/Scheme/List',
            method: 'POST',
            data:personData
        }).then( ( res) => {
            let total = res.RowCount && res.RowCount>0 ?  Math.ceil(res.RowCount/pageSize) : 0;
            let noMore = total == page ? true :false;
            let noData = total == 0 ? true : false;
            let list = this.data.planInfo.list;
            this.setData({
                ['planInfo.list']: [
                    ...list,
                    ...res.Data
                ],
                ['planInfo.noMore']: noMore,
                ['planInfo.noData']: noData,
                isBottom: false
            })
        }).catch((error) =>{
            console.log(error)
        })
    },
    // 获取求购列表信息
    getPurchaseList(){
        let { Keyword ,AppDominId, TeachDominId,purchaseInfo} = this.data;
        let page = purchaseInfo.page;
        let pageSize = 20;
        let personData = {
            page: page || 1,
            pagesize: pageSize,
            OrderBy: purchaseInfo.orderBy || 0,
            AppDominId,
            TeachDominId,
            Keyword,
        };
        ajax({
            url:'/App/WantBuy/List',
            method: 'POST',
            data:personData
        }).then( ( res) => {
            let total = res.RowCount && res.RowCount>0 ?  Math.ceil(res.RowCount/pageSize) : 0;
            let noMore = total == page ? true :false;
            let noData = total == 0 ? true : false;
            let list = this.data.purchaseInfo.list;
            this.setData({
                ['purchaseInfo.list']: [
                    ...list,
                    ...res.Data
                ],
                ['purchaseInfo.noMore']: noMore,
                ['purchaseInfo.noData']: noData,
                isBottom: false
            })
        }).catch((error) =>{
            console.log(error)
        })

    },
    // 获取活动列表信息
    getActivityList(){
        let { Keyword ,AppDominId, TeachDominId,activityInfo } = this.data;
        let page = activityInfo.page;
        let pageSize = 20;
        let personData = {
            page: page || 1,
            pagesize: pageSize,
            OrderBy: activityInfo.orderBy || 0,
            AppDominId ,
            TeachDominId,
            Keyword,
        };
        ajax({
            url:'/App/Activity/ActivityList',
            method: 'POST',
            data:personData
        }).then( ( res) => {
            let total = res.RowCount && res.RowCount>0 ?  Math.ceil(res.RowCount/pageSize) : 0;
            let noMore = total == page ? true :false;
            let noData = total == 0 ? true : false;
            let list = this.data.activityInfo.list;
            this.setData({
                ['activityInfo.list']: [
                    ...list,
                    ...res.Data
                ],
                ['activityInfo.noMore']: noMore,
                ['activityInfo.noData']: noData,
                isBottom: false
            })
        }).catch((error) =>{
            console.log(error)
        })

    },
    // 获取企业列表信息
    getCompanyList(){
        let { Keyword ,AppDominId, TeachDominId,companyInfo } = this.data;
        let page = companyInfo.page;
        let pageSize = 20;
        let personData = {
            page: page || 1,
            pagesize: pageSize,
            OrderBy: companyInfo.orderBy || 0,
            AppDominId,
            TeachDominId,
            Keyword,
        };
        ajax({
            url:'/App/User/UserEnterpriseList',
            method: 'POST',
            data:personData
        }).then( ( res) => {
            let total = res.RowCount && res.RowCount>0 ?  Math.ceil(res.RowCount/pageSize) : 0;
            let noMore = total == page ? true :false;
            let noData = total == 0 ? true : false;
            let list = this.data.companyInfo.list;
            this.setData({
                ['companyInfo.list']: [
                    ...list,
                    ...res.Data
                ],
                ['companyInfo.noMore']: noMore,
                ['companyInfo.noData']: noData,
                isBottom: false
            })
        }).catch((error) =>{
            console.log(error)
        })

    },
    onReachBottom(){
        if(this.data.isBottom){
            return;
        }
        this.setData({
            isBottom: true
        })
        // 请求更多数据
        this.loadMore();
    },
    handleFilter(){
        this.setData({ show: true });
    },

    // 查看详情
    handleProductDetail(e){
        let { id } = e.currentTarget.dataset;
        goPage('产品详情',{ ProductId: id})
    },
    handlePlanDetail(e){
        let { id } = e.currentTarget.dataset;
        goPage('方案详情',{ SchemeId: id})
    },
    handlePurchaseDetail(e){
        let { id } = e.currentTarget.dataset;
        goPage('求购详情',{ WantBuyId: id})
    },
    handleActivityDetail(e){
        let { id } = e.currentTarget.dataset;
        goPage('活动详情',{ ActivityId: id})
    },
    handleCompanyDetail(e){
        let { id } = e.currentTarget.dataset;
        goPage('企业详情',{ CompanyId: id})
    },
    // 跳转发布
    handleTabBarChange(page){
        if(page.detail == 1 ){
            if(getItem('hd_IsEnterprise')){
                goPage('企业发布')
            } else{
                goPage('个人发布')
            }
        }else if(page.detail == 2){
            goPage('个人中心')
        }
        this.setData({
            tabBarActive: page.detail
        })
    },

    //预设筛选
    loadFilterData(){
        let DomainApplicationList = getItem( 'DomainApplicationList') || null;
        if(!DomainApplicationList){
            ajax({
                url:'/App/Product/DomainApplicationList',
                method: 'POST',
                data:{}
            }).then( ( res) => {
                console.log(res.Data);
                this.setData({
                    DomainApplicationList: res.data
                })
                setItem("DomainApplicationList", JSON.stringify(res.Data) );
            }).catch((error) =>{
                console.log(error)
            });
        }else{
            this.setData({
                DomainApplicationList: JSON.parse(DomainApplicationList)
            })
        }
        let DomainOutDto = getItem( 'DomainOutDto') || null;
        if(!DomainOutDto){
            ajax({
                url:'/App/Product/GetDomainOutDto',
                method: 'POST',
                data:{}
            }).then( ( res) => {
                this.setData({
                    DomainOutDto: res.Data
                })
                setItem("DomainOutDto", JSON.stringify(res.Data) );
            }).catch((error) =>{
                console.log(error)
            })
        }else{
            this.setData({
                DomainOutDto: JSON.parse(DomainOutDto)
            })
        }
    },
    // 选择筛选项
    handleFilterOne(e){
        let { id }  = e.currentTarget.dataset;
        if( this.data.AppDominId == id ){
            this.setData({
                AppDominId: 0
            })
        }else{
            this.setData({
                AppDominId: id
            })
        }
    },
    handleFilterTwo(e) {
        let { id }  = e.currentTarget.dataset;
        if( this.data.TeachDominId == id ){
            this.setData({
                TeachDominId: 0
            })
        }else{
            this.setData({
                TeachDominId: id
            })
        }
    },
    // 重置筛选
    handleResetFilter(){
        this.setData({
            AppDominId: 0,
            TeachDominId: 0,
            show: false
        })
        this.handleSearch();
    },
    //确定筛选
    handleSubmitFilter(){
        this.handleSearch();
        this.setData({
            show: false
        })
    },

    // 关闭弹层
    onClose(){
        this.setData({ show: false });
    },
    onShow() {
        this.setData({
            tabBarActive: 0
        })
    },
})
