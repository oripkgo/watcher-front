<template>
  <commHeader/>
  <div class="section uline2">
    <div class="ani-in manage_layout">
      <div class="manage_conts">
        <commMenu/>
        <div class="manage_box_wrap">
          <div class="title_box">방문 통계</div>
          <commVisitorInfo/>
          <br><br>
          <div class="title_box">
            <p class="manager_statistics_today"></p>
            <div class="btn_sort">
              <a href="javascript:;" class="on" onclick="commCharts.drawDailyVisitor();">일간</a>
              <a href="javascript:;" onclick="commCharts.drawMonthVisitor();">월간</a>
            </div>
          </div>
          <div class="graph_wrap02">
            <commCharts/>
            <ul class="keys_wrap">
              <li class="searchVisitor">
                <div class="keys_txt">
                  <span>검색</span>
                  <strong class="all">0</strong>
                </div>
                <div class="keys_sub">
                  <span>네이버</span><em class="naver">0</em>
                  <span>다음</span><em class="daum">0</em>
                  <span>구글</span><em class="google">0</em>
                  <span>줌</span><em class="zoom">0</em>
                  <span>야후</span><em class="yahoo">0</em>
                  <span>기타</span><em class="etc">0</em>
                </div>
              </li>
              <li>
                <div class="keys_txt">
                  <span>SNS</span>
                  <strong>0</strong>
                </div>
                <div class="keys_sub">
                  <span>네이버</span><em>0</em>
                  <span>다음</span><em>0</em>
                  <span>구글</span><em>0</em>
                  <span>줌</span><em>0</em>
                  <span>야후</span><em>0</em>
                  <span>기타</span><em>0</em>
                </div>
              </li>
            </ul>
          </div>
          <commPopularArticles/>
        </div><!-------------//manage_box_wrap------------->
      </div>
    </div>
  </div>
</template>

<script>
import commHeader from "@/components/views/management/include/CommHeader";
import commMenu from "@/components/views/management/include/CommMenu";
import commCharts from "@/components/views/management/include/CommCharts";
import commVisitorInfo from "@/components/views/management/include/CommVisitorInfo";
import commPopularArticles from "@/components/views/management/include/CommPopularArticles";
import $ from 'jquery';
import comm from "@/resources/task/js/common/comm";

export default {
  name: "managementStatistics",
  components: {
    commHeader: commHeader,
    commMenu: commMenu,
    commCharts: commCharts,
    commVisitorInfo: commVisitorInfo,
    commPopularArticles: commPopularArticles,
  },

  data() {
    const $this = this;
    return {
      visitorCntSearchUrl: "/visitor/count/inflow/source",
      managementInfo: $this.getManagementSetInfo($this),
    }
  },

  methods: {
    getTodayDateAndWeekday: function () {
      const d = new Date();
      return comm.date.getDate(d, '.') + ' ' + comm.date.getDayOfTheWeek(d);
    },

    getLocaleString: function (numStr) {
      return (numStr * 1).toLocaleString();
    },

    setVisitorFromSearch: function (callback) {
      comm.request({url: this.visitorCntSearchUrl, method: "GET"}, function (resp) {
        if (resp.code == '0000' && callback) {
          callback(resp['visitInfo']);
        }
      })
    },
  },

  mounted() {
    const $this = this;

    //스크롤 페이드인
    window.triggerJqueryFadeIn();

    $(".manager_statistics_today").text($this.getTodayDateAndWeekday());

    $this.setVisitorFromSearch(function (visitInfo) {
      $(".all", ".searchVisitor").text($this.getLocaleString(visitInfo['ALL_CNT'] * 1));
      $(".naver", ".searchVisitor").text($this.getLocaleString(visitInfo['NAVER_CNT'] * 1));
      $(".daum", ".searchVisitor").text($this.getLocaleString(visitInfo['DAUM_CNT'] * 1));
      $(".google", ".searchVisitor").text($this.getLocaleString(visitInfo['GOOGLE_CNT'] * 1));
      $(".zoom", ".searchVisitor").text($this.getLocaleString(visitInfo['ZOOM_CNT'] * 1));
      $(".yahoo", ".searchVisitor").text($this.getLocaleString(visitInfo['YAHOO_CNT'] * 1));
      $(".etc", ".searchVisitor").text($this.getLocaleString(visitInfo['ETC_CNT'] * 1));

    });

    $('a', '.btn_sort').on("click", function () {
      $('a', '.btn_sort').removeClass('on')
      $(this).addClass('on');
    })
  }
}
</script>

