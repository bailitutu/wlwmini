import {ajax} from "../../../utils/api";
import {getItem} from "../../../utils/util";
import QR from "../../../utils/qrcode";
Page({

    data: {
        SigneId: '',
        hasSign: false, //是否已经签到过，
        isReady: false,
        canvasHidden: false,
        imagePath: '',
    },

    onLoad: function (opt) {
        console.log(opt.SigneId)
      this.loadCode(opt.SigneId,opt.ActivityId);
    },
    loadCode(SigneId,ActivityId){
        let UserId = getItem('hd_userId') || '';
        let Token = getItem('hd_token') || '';
        wx.showLoading();
        ajax({
            url: '/App/Activity/IsSigned',
            method: 'POST',
            data: {
                UserId,
                Token,
                SigneId,
            }
        }).then((res) => {
            if (res.Data) {
                this.setData({
                    hasSign: true,
                    isReady:true
                })
            }else{
                // 生成二维码
                var code = { OtherUserId:UserId, SigneId, ActivityId };
                this.createQrCode(JSON.stringify(code), "mycanvas", 250, 250);
            }
        }).catch((error) => {
            console.log(error)
        })
    },


    /**
     * 绘制二维码图片
     */
    createQrCode: function(url, canvasId, cavW, cavH) {
        //调用插件中的draw方法，绘制二维码图片
        QR.api.draw(url, canvasId, cavW, cavH);
        setTimeout(() => {
            this.canvasToTempImage();
        }, 1000);
    },

    /**
     * 获取临时缓存照片路径，存入data中
     */
    canvasToTempImage: function() {
        var that = this;
        //把当前画布指定区域的内容导出生成指定大小的图片，并返回文件路径。
        wx.canvasToTempFilePath({
            canvasId: 'mycanvas',
            success: function(res) {
                var tempFilePath = res.tempFilePath;
                wx.hideLoading();
                that.setData({
                    imagePath: tempFilePath,
                    isReady:true
                });
            },
            fail: function(res) {
                console.log(res);
            }
        });
    },

    // 返回上一页

    handleBackPage() {
        wx.navigateBack();
    }
})
