<template>
  <commHeader/>
  <div class="section uline2">
    <div class="ani-in manage_layout">
      <div class="manage_conts">
        <commMenu/>
        <div class="manage_box_wrap">
          <commVisitorInfo/>
          <div class="graph_wrap">
            <commCharts/>
          </div>
          <commPopularArticles/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import commHeader from "@/components/views/management/include/CommHeader";
import commMenu from "@/components/views/management/include/CommMenu";
import commVisitorInfo from "@/components/views/management/include/CommVisitorInfo";
import commCharts from "@/components/views/management/include/CommCharts";
import commPopularArticles from "@/components/views/management/include/CommPopularArticles";

export default {
  name: "managementMain",
  components: {
    commHeader,
    commMenu,
    commVisitorInfo,
    commCharts,
    commPopularArticles,
  },

  mounted() {
    //스크롤 페이드인
    window.triggerJqueryFadeIn();
  },
}

</script>