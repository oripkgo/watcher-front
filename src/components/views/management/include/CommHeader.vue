
<template>
  <div class="section">
    <div class="ani-in manage_layout">
      <div class="manage_top ani_y delay1">
        <div class="mystory_title">{{storyTitle}}</div>
        <a href="javascript:;" class="manage_btn"></a>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'commHeaders',
  components: {

  },

  data(){
    return {
      storyTitle : window.storyTitle,
      loginYn : window.loginYn,
      memProfileImg: window.memProfileImg,
    }
  },

  mounted() {

  }
}
</script>
