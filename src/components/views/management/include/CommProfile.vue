<template>
  <div class="manage_photo">
    <img v-if="loginYn" :src="memProfileImg"/>
    <img v-else src="@/resources/img/member_ico_s.png"/>
  </div>
</template>

<script>
  export default {
    name: 'commProfile',
    data(){
      return {
        loginYn : window.loginYn,
        memProfileImg: window.memProfileImg,
      }
    },
  }
</script>