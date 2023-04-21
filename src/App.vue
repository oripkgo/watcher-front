<template>
  <HelloWorld msg="Welcome to Your Vue.js App"/>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue';

export default {
  name: 'App',
  components: {
    HelloWorld
  },
  metaInfo:{
    title: 'MY스토리',
    meta: [
      { httpEquiv : 'Content-Type', content:'text/html; charset=utf-8'},
      { httpEquiv : 'Expires', content:'0'},
      { httpEquiv : 'Imagetoolbar', content:'no'},
      { httpEquiv : 'Cache-Control', content:'no-cache'},
      { httpEquiv : 'Pragma', content:'no-cache'},
      { httpEquiv : 'X-UA-Compatible', content:'IE=edge'},
      { name: 'viewport', content: 'user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, width=device-width' },
      { name: 'description', content: '' },
      { name: 'keywords', content: '' },
      { property:'og:type',content:'website'},
      { property:'og:title',content:'MY스토리'},
      { property:'og:description',content:''},
      { property:'og:keywords',content:''},
      { property:'og:image',content:'./resources/img/main_visual01.png'},
      { property:'og:url',content:''},
    ],
  },
}
</script>

<style src="./resources/css/style.css"></style>
<style src="./resources/css/swiper.css"></style>




