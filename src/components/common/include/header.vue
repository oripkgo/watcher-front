<template>
  <div class="head_wrap">
    <div class="logo">
      <a href="/main">WATCHER</a>
    </div>
    <div class="menu_wrap">
      <a href="/story/list">STORY</a>
      <a href="/notice/list">NOTICE</a>
    </div>
    <div class="top_navi">
<!--      <a href="javascript:;" class="member_set logOut"><img src="@/resources/img/member_ico_b.png"></a>-->
      <a href="javascript:;" class="btn_start loginStart" >시작하기</a>
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
    mounted() {
      comm.loginObj.init(window.loginType);
      comm.loginObj.kakaoInit(window.Kakao);
      comm.loginObj.naverInit(window.naver_id_login);
      comm.visitor.save(window.nowStoryMemId, window.refererUrl);
    }
  }
</script>
