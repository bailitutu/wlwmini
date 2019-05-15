// components/contact-dialog/contact-dialog.js
Component({
  properties: {
      show:{
          type: Boolean,
          value: false
      }
  },

  data: {
      content:''
  },

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
