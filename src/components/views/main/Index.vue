<template>
  <form name="mainNoticeForm" id="mainNoticeForm"></form>

  <div class="section">
    <div class="ani-in">

      <div class="swiper_product ani_y delay1">
        <div class="swiper-wrapper">
          <div class="swiper-slide">
            <img src="@/resources/img/main_visual01.jpg">
          </div>
        </div>
        <div class="swiper-pagination"></div>

        <div class="notice_wrap" style="display: none;">
          <div class="notice_tit">공지사항</div>
          <div class="notice_area" id="noticeList"></div>
          <div class="notice_btn">
            <a href="javascript:;" class="prev_a"></a>
            <a href="javascript:;" class="next_a"></a>
          </div>
        </div>

      </div>
    </div>
  </div>

  <div class="section bg_grey" id="popularStorys">
    <div class="ani-in layout">

      <div class="issue_wrap ani_y delay1">
        <div class="stip"></div>
        <div class="title_main"><span>issue</span></div>

        <div class="swiper_banner">
          <div class="swiper-wrapper" id="popularStoryList"></div>
          <div class="swiper-pagination"></div>
        </div>
      </div>
    </div>
  </div>


  <div class="section">
    <div class="ani-in layout">

      <div class="tab_wrap ani_y delay2">
        <!--탭메뉴-->
        <div id="tab_box">
          <div id="tab_cnt" class="category_tab">
          </div>
          <div class="grap" id="tab_parent"></div>
        </div>
        <!--//탭메뉴 끝-->

      </div>

    </div>
  </div>

  <div class="section bg_grey2">
    <div class="ani-in layout">
      <div class="keyword_wrap ani_y delay2">
        <div class="keyword_tit">keyword</div>
        <div class="keyword_search">
          <input type="text" v-on:keypress="mainObj.keyword.search(this);" name="keyword" id="keyword"
                 placeholder="나의 감성을 더해줄 이야기를 찾아보세요.">
          <a href="javascript:;" v-on:click="mainObj.keyword.search(this);"><img
              src="@/resources/img/btn_search_b.png"></a>
        </div>
        <div class="keyword_box_wrap" id="popularKeywordList"></div>
      </div>
    </div>
  </div>
</template>

<script>
import mainObj from "@/resources/task/js/business/main/main.js";
import comm from "@/resources/task/js/common/comm.js";

const categoryApiUrl = '/comm/category/list';

  export default {
    name: 'mainPage',
    props: {
      msg: String
    },

    data() {
      return {
        mainObj:mainObj,
      };
    },

    mounted() {

      comm.request({url: categoryApiUrl, method: "GET"}, function (resp) {
        // 수정 성공
        if (resp.code == '0000') {
          mainObj.category.init(resp.category_list);
        }
      })

      mainObj.swiper.init();
      mainObj.notice.init();
      mainObj.story.init();
      mainObj.keyword.init();

    },
  }
</script>
