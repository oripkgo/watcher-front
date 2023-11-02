<template>
  <div class="canvasDiv">
    <canvas class="graph_canvas" style="width: 100%; height: 100%;"></canvas>
  </div>
</template>

<script>
import chartVisitor from "@/resources/task/js/common/utils/chartVisitor";

  export default {
    name: 'commCharts',
    data(){
      return {
        chartDate : new Date(),
      }
    },

    mounted() {
      chartVisitor.init("graph_canvas", this.chartDate);
      chartVisitor.drawDailyVisitor();
      window['commCharts'] = this;
    },
    methods:{
      drawDailyVisitor : function(){
        chartVisitor.drawDailyVisitor();
      },

      drawMonthVisitor : function(){
        chartVisitor.drawMonthVisitor();
      },
    },
  }
</script>
