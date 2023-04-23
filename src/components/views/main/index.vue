<template>
  <form name="mainNoticeForm" id="mainNoticeForm"></form>

  <div class="section">
    <div class="loading" v-show="loading">
      <div class="loading-overlay">
        <div class="loading-spinner"></div>
      </div>
    </div>

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
          <input type="text" onkeypress="mainObj.keyword.search(this);" name="keyword" id="keyword" placeholder="나의 감성을 더해줄 이야기를 찾아보세요.">
          <a href="javascript:;" onclick="mainObj.keyword.search(this);"><img src="@/resources/img/btn_search_b.png"></a>
        </div>
        <div class="keyword_box_wrap" id="popularKeywordList"></div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";

export default {
  name: 'mainPage',
  props: {
    msg: String
  },

  data() {
    return {
      loading: true // 초기에 로딩바를 보여주기 위해 true로 설정합니다.
    };
  },

  mounted() {
    $("body").css("overflow","hidden");
    setTimeout(() => {
      this.loading = false;
      $("body").css("overflow","");
    }, 2000);
  },
}
</script>


<style>
.wrapper {
  position: relative;
  height: 300px; /* 예제를 위해 높이를 설정합니다. */
  width: 500px; /* 예제를 위해 너비를 설정합니다. */
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1; /* 로딩바가 요소 위에 나타나도록 z-index를 설정합니다. */
}

.loading-spinner {
  border: 5px solid #f3f3f3;
  border-top: 5px solid #3498db;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

.content {
  z-index: 0; /* 요소가 로딩바 위에 나타나도록 z-index를 설정합니다. */
}

.loading {
  /* 요소가 로딩 중인 경우, 로딩바를 표시합니다. */
  pointer-events: none; /* 로딩 중에는 요소를 클릭할 수 없도록 합니다. */
}

/* 로딩바를 회전시키는 애니메이션을 정의합니다. */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
