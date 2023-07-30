<template>
  <div class="section bg_grey3">
    <div class="ani-in layout">
      <div class="footer_wrap">
        <div class="footer_left">
          <div class="footer_logo">WATCHER</div>
          <span>COPYRIGHT ©ALAND ALL RIGHTS RESERVED</span>
        </div>

        <div class="footer_right">
          <router-link to="/terms/use">이용약관</router-link><br>
          <router-link to="/terms/privacy">개인정보처리방침</router-link><br>
        </div>

        <div class="footer_right">
          <router-link to="/terms/copyright">저작권 및 지적재산권</router-link><br>
          <router-link to="/terms/advertisement">광고 정책</router-link><br>
        </div>
      </div>
    </div>
  </div>
  <div id="backbg"></div>
</template>

<script>

  export default {
    name: 'footerPage',
    props: {
      msg: String
    },

  }
</script>



