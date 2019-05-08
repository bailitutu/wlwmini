// components/text-area/text-area.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        height: {
            type: Number,
            default: 400
        },
        value: {
            type: String,
            default: ''
        },
        placeholderClass:{
            type: String,
            default:''
        },
        placeholder:{
            type: String,
            default:''
        },
        disabled:{
            type:Boolean,
            default:false,
        },
        maxlength:{
            type: Number,
            default:140
        }
    },

    data: {
        focus: false
    },
    methods: {
        handleTextClick(){
            this.setData({
                focus : true
            });
            setTimeout(()=>{
                this.setData({
                    showFocus: true
                });
            },200)
        },
        handleChangeValue(e){
            this.setData({
                value: e.detail.value
            })
            this.triggerEvent('w-input', e.detail.value)
        },
        handleBlur(){
            this.setData({
                focus : false
            });
        },
        handleTextAreaClick(){
            return false;
        }
    }
})
