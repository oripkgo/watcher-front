<template>
  <div class="section uline2">
    <div class="ani-in manage_layout">
      <div class="manage_conts">
        <commMenu/>
        <div class="manage_box_wrap">
          <commVisitorInfo/>
          <div  class="graph_wrap">
            <commCharts/>
          </div>
          <commPopularArticles/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import commMenu from "@/components/views/management/include/CommMenu";
import commVisitorInfo from "@/components/views/management/include/CommVisitorInfo";
import commCharts from "@/components/views/management/include/CommCharts";
import commPopularArticles from "@/components/views/management/include/CommPopularArticles";

export default {
  components: {
    commMenu,
    commVisitorInfo,
    commCharts,
    commPopularArticles,
  },
}

</script>