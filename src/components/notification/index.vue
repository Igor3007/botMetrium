<template>
  <div>
    <div class="status" :class="{'is-active': text.length}" >{{ text }}</div>
  </div>
  </template>
  
  <script>
  export default {
    name: 'notification',
    data() {
      return {
         text: '',
      }
    },
    
    
    methods: {
      msg(text) {
        this.text = text
        setTimeout(() => {this.text = ''}, 3000)
      }
    }
  }
  </script>
  
  <style scoped>

  .status {
    transform: translateX(-50%) translateY(-10px);
    transition: transform 0.3s ease;
    opacity: 0;
  }

  .status.is-active {
    background-color: #000000b5;
    position: fixed;
    left: 50%;
    top: 7%;
    color: #fff;
    font-size: 14px;
    padding: 10px 25px;
    border-left: 2px solid #00cc03;
    border-radius: 13px;
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  
}
  </style>