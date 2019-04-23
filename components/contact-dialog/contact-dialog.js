// components/contact-dialog/contact-dialog.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      show:{
          type: Boolean,
          value: false
      }
  },

  /**
   * 组件的初始数据
   */
  data: {
      content:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
      handleCancel(){
          this.setData({
              show: false
          })
          this.triggerEvent('cancel');
      },
      handleConfirm(){
          this.triggerEvent('confirm', this.data.content)
      },
      bindTextAreaBlur(e){
          this.setData({
              content: e.detail.value
          })
      }
  }
})
