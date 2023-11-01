<template>
  <div class="canvasDiv">
    <canvas class="graph_canvas" style="width: 100%; height: 100%;"></canvas>
  </div>
</template>

<script>
import chart from "@/resources/task/js/common/utils/chart";

  export default {
    name: 'commCharts',
    data(){
      return {
        chartDate : new Date(),
      }
    },

    mounted() {
      chart.init("graph_canvas", this.chartDate);
      chart.drawDailyVisitor();
      window['commCharts'] = this;
    },
    methods:{
      drawDailyVisitor : function(){
        chart.drawDailyVisitor();
      },

      drawMonthVisitor : function(){
        chart.drawMonthVisitor();
      },
    },
  }
</script>
