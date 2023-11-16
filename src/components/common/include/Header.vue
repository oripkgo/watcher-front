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
<!--      <a v-if="loginInfo.isLogin" href="javascript:;" class="member_set logout">
        <img v-if="loginInfo.memProfileImg" :src="loginInfo.memProfileImg">
        <img v-else src="@/resources/img/member_ico_b.png">
      </a>
      <a v-else href="javascript:;" class="btn_start loginStart">시작하기</a>-->
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
import naverLoginSuccess from "@/resources/task/js/business/login/naverLoginSuccess.js";

const token = process.env.VUE_APP_LOGIN_TOKEN_NAVER;
const callbackUrl = process.env.VUE_APP_LOGIN_CALLBACK_NAVER;

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
    window.comm = comm;
    window.naverLoginSuccess = naverLoginSuccess;
    window.token = token;
    window.callbackUrl = callbackUrl;
    comm.token.init();


    comm.navigation.init(
        document.querySelector(".top_navi"),
        [
          {url: "/myStory/" + window.memberId, name: "내 스토리"},
          {url: "/management/main", name: "관리"},
          {url: window.storyUrlWrite, name: "글쓰기"},
        ],
    );

    // comm.sign.init(window.loginType);
    // comm.sign.initKakao(window['Kakao']);
    // comm.sign.initNaver(token, window['naver_id_login']);
    comm.visitor.save(window.nowStoryMemId, window.refererUrl);
  }
}
</script>
