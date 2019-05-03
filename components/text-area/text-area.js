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

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        handleTextClick(){

            this.trigger('handleTextArea')
        }

    }
})
