
<template>
  <div class="manage_menu">
    <commProfile/>

    <div class="manage_menu_link">
      <a :href="managementMain" class="menu_1st">홈</a>
      <a href="javascript:;" class="menu_1st">콘텐츠</a>
      <div class="menu_2st">
        <a :href="managementBoard">게시글 관리</a>
        <a :href="managementCategory">카테고리 관리</a>
        <a :href="managementNotice">공지관리</a>
      </div>
      <a href="javascript:;" class="menu_1st">스토리</a>
      <div class="menu_2st">
        <a :href="managementSetting">설정</a>
      </div>
      <a href="javascript:;" class="menu_1st">통계</a>
      <div class="menu_2st">
        <a :href="managementStatistics">방문 통계</a>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import commProfile from "@/components/views/management/include/CommProfile";

export default {
  name: 'commMenu',
  components: {
    commProfile,
  },
  data(){
    return {
      managementMain : window.managementMain,
      managementBoard : window.managementBoard,
      managementCategory : window.managementCategory,
      managementNotice : window.managementNotice,
      managementSetting : window.managementSetting,
      managementStatistics : window.managementStatistics,

    }
  },

  mounted() {
    $(".manage_btn").click(function(){
      $(".manage_menu").toggleClass("on");
    });

    $("[href='"+location.pathname+"']").addClass("on");
  }
}
</script>
