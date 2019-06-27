// components/text-area/text-area.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        height: {
            type: Number,
            value: 400
        },
        value: {
            type: String,
			value: ''
        },
        placeholderClass:{
            type: String,
			value:''
        },
        placeholder:{
            type: String,
			value:''
        },
        disabled:{
            type:Boolean,
			value:false,
        },
        maxlength:{
            type: Number,
			value:140
		},
		bgColor: {
			type: String,
			value: '#f4f4f4'
		}
    },

    data: {
        focus: false
	},
	created () {
		console.log(this)
		console.log(this.data.bgColor,'bg');
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
