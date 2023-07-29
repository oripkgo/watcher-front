<template>
  <div class="head_wrap">
    <div class="logo">
      <router-link to="/main">WATCHER</router-link>
    </div>
    <div class="menu_wrap">
      <router-link to="/story/list">STORY</router-link>
      <router-link to="/notice/list">NOTICE</router-link>
    </div>
    <div class="top_navi">
      <a v-if="loginInfo.isLogin" href="javascript:;" class="member_set logOut">
        <img v-if="loginInfo.memProfileImg" :src="loginInfo.memProfileImg">
        <img v-else src="@/resources/img/member_ico_b.png">
      </a>
      <a v-else href="javascript:;" class="btn_start loginStart" >시작하기</a>
    </div>

  </div>
  <div class="head_tip"></div>

  <div class="quick_wrap">
    <a href="javascript:;" id="to_top"><img src="@/resources/img/btn_top.png"></a>
  </div>

</template>



<script>
  import "@/resources/task/js/common/globalVar";
  import "@/resources/js/tab"
  import comm from "@/resources/task/js/common/comm.js";

  export default {
    name: 'headerPage',
    props: {
      msg: String
    },
    data() {
      return {
        loginInfo: {
          loginId: window.loginId,
          isLogin: window.loginYn,
          loginType: window.loginType,
          memProfileImg: window.memProfileImg,
          memberId: window.memberId,
        },
      }
    },
    mounted() {
      comm.token.get();

      comm.loginObj.init(window.loginType);
      comm.loginObj.kakaoInit(window['Kakao']);
      comm.loginObj.naverInit(process.env.VUE_APP_LOGIN_TOKEN_NAVER, window['naver_id_login']);
      comm.visitor.save(window.nowStoryMemId, window.refererUrl);
    }
  }
</script>
