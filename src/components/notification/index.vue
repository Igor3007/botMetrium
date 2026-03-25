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
        //setTimeout(() => {this.text = ''}, 3000)
      }
    }
  }
  </script>
  
  <style scoped>
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
	transform: translateY(10px);
 
}
  </style>