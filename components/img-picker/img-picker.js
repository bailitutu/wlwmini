import {BASE_URL} from '../../utils/config'
import MD5 from '../../utils/new_md5'

function setRequestHeader(data) {
    var headers = {IsJosn: "ok"};
    headers.Timestamp = new Date().getTime(); //13位时间戳
    headers.Nonce = Math.random(); //随机数
    var signObj = {};
    if (data) {
        signObj = Object.assign(signObj, data, headers);
    }
    headers.Sign = getSign(signObj).Encrypt;
    return headers;
}

function getSign(data) { //签名
    let array = [];
    let param = '';
    for (let key in data) {
        array[array.length] = key;
    }
    array.sort(function (array, t) {
        var a = array.toLowerCase();
        var b = t.toLowerCase();
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    });//排序
    array.forEach((key, i) => {
        param += key + data[key]
    })
    return {Text: param, Encrypt: MD5.md5(param)};
}


Component({
    properties: {
        multiple: {
            type: Boolean,
            value: false
        },
        max: {
            type: String,
            value: 1,
        },
        imgList: {
            type: Array,
            value: [] // 图片列表
        }
    },
    data: {
        lock: false,
    },
    methods: {
        // 添加图片
        _handleAddImg() {
            const that = this;
            let {imgList, max} = this.data;
            let len = max - imgList.length;
            wx.chooseImage({
                count: len,
                sizeType: ['compressed'],
                sourceType: ['album', 'camera'],
                success: function (res) {
                    var imageSrc = res.tempFilePaths;
                    wx.showLoading({
                        title: '上传中...',
                        icon: 'loading',
                        mask: true
                    })
                    that.uploadImg({
                        url: BASE_URL + '/App/Home/UpLoadFile',//这里是你图片上传的接口
                        path: imageSrc,//这里是选取的图片的地址数组
                    });
                },
                fail: function ({errMsg}) {
                    console.log('chooseImage fail, err is', errMsg)
                }
            })
        },

        // 上传图片

        uploadImg(data) {
            let i = data.i ? data.i : 0;//当前上传的哪张图片
            let success = data.success ? data.success : 0;//上传成功的个数
            let fail = data.fail ? data.fail : 0;//上传失败的个数
            let { imgList } = this.data;
            let headers = setRequestHeader({});
            let header = {
                ...headers,
                "Content-Type": "multipart/form-data"
            };
            wx.uploadFile({
                url: data.url,
                filePath: data.path[i],
                name: 'file' + i,//这里根据自己的实际情况改
                header: header,
                formData: {},//这里是上传图片时一起上传的数据
                success: (resp) => {
                    console.log(resp.data)
                    success++;//图片上传成功，图片上传成功的变量+1
                    var data = JSON.parse(resp.data);
                    if (data.Status) {
                        imgList.push({
                            imgUrl: data.Data
                        });
                        this.setData({
                            imgList
                        })
                        this.triggerEvent('upload', imgList)
                    }

                },
                fail: (res) => {
                    fail++;
                },
                complete: () => {
                    i++;//这个图片执行完上传后，开始上传下一张
                    console.log(i)
                    if (i == data.path.length) {   //当图片传完时，停止调用
                        wx.hideLoading();
                        return;
                    } else {//若图片还没有传完，则继续调用函数
                        data.i = i;
                        data.success = success;
                        data.fail = fail;
                        this.uploadImg(data);
                    }

                }
            });
        },

        // 移除图片
        removeImg(e) {
            this.setData({lock: true});
            const {index} = e.currentTarget.dataset;
            let {imgList} = this.data;
            wx.showModal({
                title: '提示',
                content: '确定删除吗？',
                success: (res) => {
                    if (res.confirm) {
                        imgList.splice(index, 1);
                        this.setData({
                            imgList
                        })
                        this.triggerEvent('removeImg', imgList);
                    }
                }
            })
        },

        // 预览图片

        previewImg(e) {

            if (this.data.lock) {
                return;
            }
            const {index} = e.currentTarget.dataset;
            let {imgList} = this.data;
            let urls = [];

            imgList.map(function (item) {
                urls.push(item.imgUrl);
            })
            wx.previewImage({
                current: urls[index], // 当前显示图片的http链接
                urls: urls // 需要预览的图片http链接列表
            })
        },
        // 处理长按bug
        touchEnd() {
            if (this.data.lock) {
                setTimeout(() => {
                    this.setData({lock: false});
                }, 100);
            }
        },
    }
})
