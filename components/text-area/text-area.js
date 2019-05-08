// components/text-area/text-area.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        height: {
            type: Number,
            default: 300
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
            console.log(1111)
            this.setData({
                focus : true
            });
            this.triggerEvent('handleTextArea');
        },
        handleChangeValue(e){
            console.log('change')
            console.log(e);
            this.setData({
                value: e.detail.value
            })
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
