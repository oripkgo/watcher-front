<template>
  <div class="canvasDiv">
    <canvas class="graph_canvas" style="width: 100%; height: 100%;"></canvas>
  </div>
</template>

<script>
import comm from "@/resources/task/js/common/comm.js";

  export default {
    name: 'commCharts',
    mounted() {
      const $this = this;
      $this.getDailyVisitors($this);
      window['commCharts'] = $this;
    },
    methods:{
      getDrawTarget : function(){
        return document.getElementsByClassName('graph_canvas')[0];
      },

      drawChart : function(obj, datas, customTitle){
        let toDay = new Date();
        const m = toDay.getMonth() == 12 ? 1 : toDay.getMonth() + 1;

        let title = m + "월 방문자수";
        let labels = [];
        let maxData = 0;
        let visitorDatas = [];

        if (customTitle) {
          title = customTitle;
        }

        labels = Object.keys(datas);

        for(let key in datas){

          if( datas[key] && datas[key] > maxData ){
            maxData = datas[key];
          }

          visitorDatas.push(datas[key]);
        }

        const chartData = {
          labels: labels,
          datasets: [{
            label: title,
            backgroundColor: '#333',
            borderColor: '#333',
            data: visitorDatas,
          }]
        };

        const config = {
          type: 'line',
          data: chartData,
          options: {
            scales: {
              y: {
                beginAtZero: true,
                // min: 0,
                // max: 25
              },
            }
          }
        };

        // if( maxData <= 0 ){
          config.options.scales.y.min = 0;
          config.options.scales.y.max = maxData+5;
        // }

        if( window.myChart ){
          window.myChart.data = config.data;
          window.myChart.options = config.options;
          window.myChart.update();
        }else{
          window.myChart = new window['Chart'](
              (obj),
              config
          );
        }
      },

      getChartData : function(visitList){
        let result = {};
        let toDay = new Date();
        const y = toDay.getFullYear();
        const m = toDay.getMonth() == 12 ? 1 : toDay.getMonth() + 1;
        const d = toDay.getDate();

        const last_day = new Date(y, m, 0).getDate();

        for (let i = 1; i <= last_day; i++) {
          if(i > d){
            result[i] = null;
          }else{
            result[i] = 0;
          }

        }

        visitList.forEach(function(obj){
          if( obj['VISIT_DATE'] ){
            result[ (obj['VISIT_DATE'].substring(6)*1) ] = obj['CNT'];
          }
        })

        return result;
      },

      getMonthChartData : function(visitList){
        let result = {};

        let toDay = new Date();
        // const y = toDay.getFullYear();
        const m = toDay.getMonth() == 12 ? 1 : toDay.getMonth() + 1;
        // const d = toDay.getDate();


        for (let i = 1; i <= 12; i++) {
          if(i > m){
            result[i+'월'] = null;
          }else{
            result[i+'월'] = 0;
          }

        }

        visitList.forEach(function(obj){
          if( obj['VISIT_MONTH'] ){
            result[ (obj['VISIT_MONTH'].substring(4)*1)+'월' ] = obj['CNT'];
          }
        })

        return result;
      },

      getDailyVisitors : function($this){
        comm.request({url:"/visitor/chart/cnts", method : "GET"},function(resp){
          if( resp.code == '0000'){
            $this.drawChart($this.getDrawTarget(), $this.getChartData(resp['visitInfoList']));
          }
        })
      },

      getMonthVisitors : function($this){
        comm.request({url:"/visitor/chart/cnts/month", method : "GET"},function(resp){
          if( resp.code == '0000'){
            $this.drawChart($this.getDrawTarget(), $this.getMonthChartData(resp['visitInfoList']), '월별 방문자수');
          }
        })
      },
    },
  }
</script>
