// components/img-picker/img-picker.js
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
        noMore: {
            type: Boolean,
            value: false
        }
    },
    data: {
        imgList: [], // 图片列表
        lock: false,
    },

    /**
     * 组件的方法列表
     */
    methods: {
        // 添加款式图片
        _handleAddImg() {
            this.triggerEvent('handleAddImg');

            const that = this;
            let {imgList, max} = this.data;
            console.log(max, 'max')
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
                        url: app.globalData.httpUrl + '/upload/uploadFile',//这里是你图片上传的接口
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
            let that = this,
                i = data.i ? data.i : 0,//当前上传的哪张图片
                success = data.success ? data.success : 0,//上传成功的个数
                fail = data.fail ? data.fail : 0;//上传失败的个数

            let {imgList} = this.data;
            wx.uploadFile({
                url: data.url,
                filePath: data.path[i],
                name: 'file',//这里根据自己的实际情况改
                formData: null,//这里是上传图片时一起上传的数据
                success: (resp) => {
                    success++;//图片上传成功，图片上传成功的变量+1
                    var data = JSON.parse(resp.data);
                    if (data.head.respCode === '0000000') {

                        imgList.push({
                            imgUrl: data.body.uploadFilePath
                        });
                        that.setData({
                            imgList: imgList
                        })
                    }

                },
                fail: (res) => {
                    fail++;
                },
                complete: () => {
                    i++;//这个图片执行完上传后，开始上传下一张
                    if (i == data.path.length) {   //当图片传完时，停止调用
                        wx.hideLoading();
                        return false;
                    } else {//若图片还没有传完，则继续调用函数
                        data.i = i;
                        data.success = success;
                        data.fail = fail;
                        that.uploadImg(data);
                    }

                }
            });
        },

        // 移除图片
        removeImg(e) {
            this.setData({lock: true});
            const {index} = e.currentTarget.dataset;
            let {imgList} = this.data;
            const that = this;
            wx.showModal({
                title: '提示',
                content: '确定删除吗？',
                success: function (res) {
                    if (res.confirm) {
                        imgList.splice(index, 1);
                        that.setData({
                            imgList: imgList
                        })
                    }
                }
            })

            return false;
        },

        // 预览图片

        previewImg(e) {

            if (this.data.lock) {
                return;
            }
            const {index} = e.currentTarget.dataset;
            let {imgList} = this.data;
            const that = this;
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
