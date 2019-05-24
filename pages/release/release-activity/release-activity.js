import {goPage} from '../../../utils/common'
import {getItem, setItem,formatDate} from '../../../utils/util'
import {ajax} from "../../../utils/api";
import { isEmpty } from "../../../utils/validate";

Page({
    data: {
        isReady: false,
        isEdit: false,

        Province: {
            columnsData:[],
            list: [],
            value: '',
            id: '',
            show: false
        },
        City:{
            columnsData:[],
            list: [],
            value: '',
            id: '',
            show: false
        },
        Area: {
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
        BeginTime:'',
        EndTime:'',
        Address:'',
        mapAddress:'',
        ProvinceId:'',
        CityId:'',
        AreaId: '',
        Longitude:'',
        Latitude:'',
        HostUnit:'',
        Organizer:'',
        ActivityName:'',
        ScaleNum:'',
        MainPicUrl: [],
        TxtContent:''
    },
    onLoad: function (opts) {
        if (opts.isEdit) {
            this.setData({
                isEdit: true,
                ActivityId: opts.ActivityId
            })
            wx.setNavigationBarTitle({
                title: '编辑活动'
            })
            this.loadData(opts.ActivityId);
        }
        this.getApplicationList();
        this.getDomainList();
        this.loadProvince()

        let nowDate = formatDate(new Date());
        this.setData({
            nowDate
        })
    },
    loadData(ActivityId) {
        let UserId = getItem('hd_userId') || '';
        let Token = getItem('hd_token') || '';
        ajax({
            url: '/App/UserCenter/GetActivityInfo',
            method: 'POST',
            data: {
                UserId,
                Token,
                ActivityId
            }
        }).then((res) => {
            let {
                ActivityName,
                BeginTimeTxt,
                EndTimeTxt,
                Latitude,
                Longitude,
                Organizer,
                HostUnit,
                ProvinceId,
                CityId,
                AreaId,
                Address,
                AppDominId,
                TeachDominParentId,
                TeachDominId,
                ScaleNum,
                MainPicUrl,
                TxtContent,

            } =  res.Data;

            let [ ...ApplicationList] = this.data.Application.list;
            let [...DomainList] = this.data.DomainList.list;
            let [...DomainCell ]= this.data.DomainCell.list;
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
            MainPicUrl.split(',').forEach(item => {
                img_list.push({
                    imgUrl: item
                })
            })
            this.setData({
                ActivityName,
                BeginTime: BeginTimeTxt,
                EndTime: EndTimeTxt,
                ScaleNum,
                MainPicUrl: img_list,
                TxtContent,
                Latitude,
                Longitude,
                Organizer,
                HostUnit,
                Address,
                ['Province.id']: ProvinceId,
                ['City.id']: CityId,
                ['Area.id']: AreaId,
                ['Application.value']: ApplicationValue,
                ['Application.id']: AppDominId,
                ['DomainList.value']:DomainListValue,
                ['DomainList.id']:TeachDominParentId,
                ['DomainCell.value']:DomainCellValue,
                ['DomainCell.id']:TeachDominId
            })
            this.loadProvince()
        }).catch((error) => {
            console.log(error)
        })
    },
    bindStartDateChange(e){
        this.setData({
            BeginTime: e.detail.value
        })
    },
    bindEndDateChange(e){
        this.setData({
            EndTime: e.detail.value
        })
    },

    // 获取省市区
    loadProvince(){
        ajax({
            url: '/Home/GetProvince',
            method: 'POST',
            data: {}
        }).then((res) => {
            let [ ...list ] = res.Data;
            let columnsData = list.map(item => {
                return item.ProvinceName;
            });
            this.setData({
                ['Province.columnsData']: columnsData,
                ['Province.list']: res.Data,
            })
            this.fillProvince();
        }).catch((error) => {
            console.log(error)
        });
    },
    fillProvince(){
        let { Province } = this.data;
        let proId = Province.id || Province.list[0].ProvinceId;
        if( proId ){
            let pro = Province.list.find((item)=>{
                return proId == item.ProvinceId
            })
            this.setData({
                ['Province.value'] : pro.ProvinceName,
                ['Province.id'] : proId
            })
            this.loadCity(proId);
        }
    },
    loadCity(ProvinceId){
        ajax({
            url: '/Home/GetCity',
            method: 'POST',
            data: {
                ProvinceId
            }
        }).then((res) => {

            let [ ...list ] = res.Data;
            let columnsData = list.map(item => {
                return item.CityName;
            });
            this.setData({
                ['City.columnsData']: columnsData,
                ['City.list']: res.Data,
            })
            this.fillCity();
        }).catch((error) => {
            console.log(error)
        });
    },
    fillCity(){
        let { City } = this.data;
        let proId = City.id || City.list[0].CityId;
        console.log(proId,'proId')
        if( proId ){
            let pro = City.list.find((item)=>{
                return proId == item.CityId
            })
            this.setData({
                ['City.value'] : pro.CityName,
                ['City.id'] : proId
            })
            this.loadArea(proId);
        }
    },
    loadArea(CityId){
        ajax({
            url: '/Home/GetArea',
            method: 'POST',
            data: {
                CityId
            }
        }).then((res) => {
            let [ ...list ] = res.Data;
            let columnsData = list.map(item => {
                return item.AreaName;
            });
            this.setData({
                ['Area.columnsData']: columnsData,
                ['Area.list']: res.Data,
                ['Area.id']: res.Data[0].AreaId,
            })
            this.fillArea();
        }).catch((error) => {
            console.log(error)
        });
    },
    fillArea(){
        let { Area } = this.data;
        let proId = Area.id || Area.list.AreaId;
        if( proId ){
            let pro = Area.list.find((item)=>{
                return proId == item.AreaId
            })
            this.setData({
                ['Area.value'] : pro.AreaName,
                ['Area.id'] : proId
            })
        }
    },
    // 选择省
    handleProvinceList(){
        this.setData({
            ['Province.show']: true,
        })
    },
    handleProvinceConfirm(event) {
        const { value,index } = event.detail;
        let id = this.data.Province.list[index].ProvinceId;
        this.setData({
            ['Province.id']: id,
            ['Province.show']: false,
            ['City.id']: '',
        })
        this.fillProvince();
    },
    handleProvinceCancel() {
        this.setData({
            ['Province.show']: false,
        })
    },

    // 选择市
    handleCityList(){
        this.setData({
            ['City.show']: true,
        })
    },

    handleCityConfirm(event) {
        const { value,index } = event.detail;
        let id = this.data.City.list[index].CityId;
        this.setData({
            ['City.id']: id,
            ['City.show']: false,
            ['Area.id']: '',
        })
        this.fillCity();

    },
    handleCityCancel() {
        this.setData({
            ['City.show']: false,
        })
    },
    // 选择区
    handleAreaList(){
        this.setData({
            ['Area.show']: true,
        })
    },
    handleAreaConfirm(event) {
        const { value,index } = event.detail;
        let id = this.data.Area.list[index].AreaId;
        this.setData({
            ['Area.id']: id,
            ['Area.show']: false,
        })
        this.fillArea();
    },
    handleAreaCancel() {
        this.setData({
            ['Area.show']: false,
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


    // 获取技术领域父级
    getDomainList() {
        let DomainList = getItem('DomainList') || null;
        if (!DomainList) {
            ajax({
                url: '/app/Product/GetByParent',
                method: 'POST',
                data: {}
            }).then((res) => {
                let [...list] =  res.Data;
                let columnsData = list.map(item => {
                    return item.Name;
                })
                setItem("DomainList", JSON.stringify( res.Data));

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
            let [...list] =  JSON.parse(DomainList);
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
            let [...list] =  res.Data;
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

    //地图选址
    handleMapSelect(){
        wx.getSetting({
            success:(res) => {
                if (!res.authSetting['scope.userLocation']) {
                    wx.authorize({
                        scope: 'scope.userLocation',
                        success:() => {
                            this.chooseLocation();
                        }
                    })
                }else{
                    this.chooseLocation();
                }
            }
        })
    },
    chooseLocation(){
        wx.chooseLocation({
            success:res=>{
                if(res.errMsg == 'chooseLocation:ok'){
                    let { address ,latitude, longitude, name} = res;
                    this.setData({
                        // mapAddress: name,
                        Longitude:longitude,
                        Latitude:latitude,
                        // Address: address,
                    })
                }
            }
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
            MainPicUrl: e.detail
        })
    },
    // 移除图片
    handleRemoveImg(list){
        this.setData({
            MainPicUrl: list
        })
    },
    //输入简介
    bindTextAreaChange(e){
        this.setData({
            TxtContent: e.detail
        })
    },
    //发布/修改
    handleSubmit() {
        let {
            isEdit,
            ActivityName,
            ActivityId,
            BeginTime,
            EndTime,
            Address,
            Province,
            City,
            Area,
            Longitude,
            Latitude,
            HostUnit,
            Organizer,
            ScaleNum,
            MainPicUrl,
            TxtContent,
            Application,
            DomainList,
            DomainCell
        } = this.data;
        // 验证
        if( isEmpty( ActivityName) ){
            wx.showToast({
                title: '请输入活动名称',
                icon:'none'
            })
            return;
        }
        if( isEmpty( BeginTime) ){
            wx.showToast({
                title: '请选择活动开始时间',
                icon:'none'
            })
            return;
        }
        if( isEmpty( EndTime) ){
            wx.showToast({
                title: '请选择活动结束时间',
                icon:'none'
            })
            return;
        }
        if( isEmpty( ScaleNum) ){
            wx.showToast({
                title: '请输入活动规模',
                icon:'none'
            })
            return;
        }
        if( isEmpty( Address) ){
            wx.showToast({
                title: '请输入活动详细地点',
                icon:'none'
            })
            return;
        }
        if( isEmpty( HostUnit) ){
            wx.showToast({
                title: '请输入主办单位',
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
        if( MainPicUrl.length == 0 ){
            wx.showToast({
                title: '请上传活动图片',
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

        let MainPic = MainPicUrl[0].imgUrl;
        if(!isEdit){
            // 发布
            ajax({
                url: '/app/UserCenter/AddActivity',
                method: 'POST',
                data: {
                    UserId,
                    Token,
                    AppDominId: Application.id,
                    TeachDominParentId:DomainList.id ,
                    TeachDominId: DomainCell.id,
                    MainPicUrl:MainPic ,
                    ActivityName,
                    ProvinceId: Province.id,
                    CityId: City.id,
                    AreaId:Area.id,
                    ActivityId,
                    BeginTime,
                    EndTime,
                    Address,
                    Longitude,
                    Latitude,
                    HostUnit,
                    Organizer,
                    ScaleNum,
                    TxtContent,
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
                url: '/app/UserCenter/ActivityEdit',
                method: 'POST',
                data: {
                    UserId,
                    Token,
                    ActivityId,
                    ProvinceId: Province.id,
                    CityId: City.id,
                    AreaId:Area.id,
                    BeginTime,
                    EndTime,
                    Address,
                    Longitude,
                    Latitude,
                    HostUnit,
                    Organizer,
                    AppDominId: Application.id,
                    TeachDominParentId:DomainList.id ,
                    TeachDominId: DomainCell.id,
                    ScaleNum,
                    ActivityName,
                    MainPicUrl: MainPic ,
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
