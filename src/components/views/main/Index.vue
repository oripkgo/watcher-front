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
import $ from "jquery";
import comm from "@/resources/task/js/common/comm";
import Swiper from "swiper";

export default {
  name: 'mainPage',
  props: {
    msg: String
  },

  data() {
    const keywordApiUrl = '/keyword/popular';
    const storyListUrl = '/story/list/data';
    const noticeListUrl = '/notice/list/data';
    const popularStoryListUrl = '/story/popular/main';

    const keyword = {
      listUrl : keywordApiUrl,
      init : function(){
        this.getPopularList();
      },

      search : function(/*obj*/){
        if( event.type == 'keypress' && event.keyCode != 13 ){
          return;
        }

        const $this = this;
        const param = {};
        param.keyword = $("#keyword").val();

        comm.request({url: keywordApiUrl, method: "POST", data: JSON.stringify(param)}, function (resp) {
          // 수정 성공
          if (resp.code == '0000') {
            $this.render(resp.list);
          }
        })
      },

      getPopularList : function(){
        const $this = this;
        comm.request({
          url:this.listUrl,
          method : "GET",
          headers : {"Content-type":"application/x-www-form-urlencoded"}
        },function(data){
          if (data.code == '0000' && data.list) {
            $this.render(data.list);
          }
        });
      },

      render: function (list) {
        let $node = $('<a href="javascript:;"></a>');
        $("#popularKeywordList").empty();
        list.forEach(function (obj/*, idx*/) {
          let $nodeCopy = $($node).clone(true);
          let nodeHtml = '';

          if (obj['CATEGORY_IMG_PATH']) {
            nodeHtml += '<img src="' + require('@'+obj['CATEGORY_IMG_PATH']) + '">';
          }

          nodeHtml += '<div>';
          nodeHtml += '	<strong>' + obj['CATEGORY_NM'] + '</strong>';
          nodeHtml += '	<span>#' + obj['TAGS'] + '</span>';
          nodeHtml += '</div>';

          $($nodeCopy).attr("href", window.getStoryListUrl(obj['CATEGORY_ID'], obj['TAGS']))

          $($nodeCopy).data(obj);
          $($nodeCopy).html(nodeHtml);

          $("#popularKeywordList").append($nodeCopy);
        })
      },
    };
    const category = {
      categoryApiUrl  : '/category/list',
      listUrl : storyListUrl,
      data : [],
      init : function(){
        this.data = comm.category.get();
        const categoryObj = this;
        categoryObj.data.forEach(function(obj,idx){
          const id = obj['ID'];
          const nm = obj['CATEGORY_NM'];

          if( idx == 0 ){
            $('.category_tab').append('<a href="javascript:;" class="tab_ov tab_'+id+'"><span>'+nm+'</span></a>');
          }else{
            $('.category_tab').append('<a href="javascript:;" class="tab_'+id+'"><span>'+nm+'</span></a>');
          }

          const tabObj = categoryObj.tab.append(id, $("#tab_parent"));
          $(tabObj).html(categoryObj.tab.drawInTags(id));

          categoryObj.tab.event();

          // 추천순 목록
          categoryObj.recommendedList(id);
        })
      },

      recommendedList : function(id){
        comm.request({
          form:$("#RecommendedListForm"+id)
          , url:this.listUrl
          , method : "GET"
          , headers : {"Content-type":"application/x-www-form-urlencoded"}
        },function(data){
          $("#RecommendedDataList"+id).empty();

          for (let i = 0; i < data.list.length; i++) {
            let obj = data.list[i];
            let listHtml = '';
            // let listNum = ((data.vo.pageNo - 1) * data.vo.listNo) + (i + 1);

            listHtml += '<li>';
            listHtml += '    <a href="' + window.getStoryViewUrl(obj['ID'], obj['MEMBER_ID']) + '">';

            if( obj.THUMBNAIL_IMG_PATH ){
              listHtml += '<div><img src="' + window.getServerImg(obj.THUMBNAIL_IMG_PATH.replace(/[\\]/g, '/')) + '"></div>';
            }

            listHtml += '        <strong>'+obj.TITLE+'</strong>';
            listHtml += '        <span>';

            if( !obj.SUMMARY ){
              obj.SUMMARY = '';
            }

            if( obj.SUMMARY.length < 100 ){
              listHtml += obj.SUMMARY;
            }else{
              listHtml += (obj.SUMMARY || '').substring(0,100)+' ...';
            }

            listHtml += '        </span>';
            listHtml += '    </a>';
            listHtml += '    <div class="story_key">';

            if( obj.TAGS ){
              let tag_arr = obj.TAGS.split(',');

              tag_arr.forEach(function(tag/*,index*/){
                listHtml += '        <a href="javascript:;">#'+tag.trim()+'</a>';
              })
            }
            listHtml += '    </div>';
            listHtml += '    <div class="story_key">';

            listHtml += '        <span>'+comm.date.getPastDate(obj.REG_DATE)+'</span>';
            listHtml += '        <span>공감 ' + obj.LIKE_CNT + '</span>';
            listHtml += '        <em>by ' + obj.NICKNAME + '</em>';


            // listHtml += '        <a href="javascript:;">#컬처</a>';
            // listHtml += '        <a href="javascript:;">#영화</a>';
            // listHtml += '        <a href="javascript:;">#영화컬처</a>';
            listHtml += '    </div>';
            listHtml += '</li>';
            listHtml = $(listHtml);

            $(listHtml).data(obj);

            $("#RecommendedDataList"+id).append(listHtml);
          }
        });
      },

      tab : {
        drawInTags : function(id){
          let div = $('<div></div>')
          let recommendedListForm = comm.dom.appendForm('RecommendedListForm'+id);

          comm.dom.appendInput(recommendedListForm, "SortByRecommendationYn", "YY");
          comm.dom.appendInput(recommendedListForm, "search_category_id", id);
          comm.dom.appendInput(recommendedListForm, "limitNum", "3");
          $(recommendedListForm).append('<ul class="story_wrap" id="RecommendedDataList'+id+'"></ul>')

          $(div).append(recommendedListForm);

          return $(div).html();
        },

        append : function(id, target){
          let tabId = 'tabObj_'+id;
          let tabHtml = '';

          tabHtml += '<div class="obj" id="'+tabId+'">';
          tabHtml += '<a href="javascript:;" class="btn_story2"></a>';
          tabHtml += '</div>';

          $(target).append(tabHtml);

          return $("#"+tabId, target);
        },

        event : function(){
          var param = "#tab_box";
          var btn = "#tab_cnt>a";
          var obj = "#tab_box .obj";
          var img = false;
          var event = "click";
          window.document_tab(param,btn,obj,img,event);
        },
      },
    };
    const swiper = {
      init : function(){
        if( $(".swiper-wrapper", ".swiper_product").find(".swiper-slide").length > 1 ){
          this.product();
        }else{
          $(".swiper-pagination", ".swiper_product").hide();
        }
      },

      setSwiper : function(target, option){
        const swp = new Swiper(target, option);

        return swp;
      },

      product : function(){
        this.setSwiper('.swiper_product', {
          centeredSlides: true,
          loop: true,
          autoplay: {
            delay: 6000,
          },
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          }
        });
      },
      banner : function(){
        this.setSwiper('.swiper_banner', {
          slidesPerView: 'auto',
          speed : 600,
          spaceBetween: 0,
          loop: true,
          autoplay: {
            delay: 8000,
          },
          //initialSlide: 1,
          //freeMode: true,
          //centeredSlides: true,
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          }
        });
      },
    };
    const notice = {
      init : function(){
        this.list();
      },

      isHide : function(regDt){
        let result = false;
        let regDate = new Date(regDt);
        let toDay = new Date();

        var dateDif = (toDay.getTime() - regDate.getTime()) / (1000*60*60*24) ;

        if( dateDif > 14) {
          result = true;
        }

        return result;
      },

      list : function(){
        const noticeObj = this;
        comm.paging.getList('#mainNoticeForm', noticeListUrl, function (data) {
          let node = $('<a href="javascript:;" style="display:none;"></a>')
          if (data.code == '0000' && (data.list && data.list.length > 0)) {
            if( noticeObj.isHide(data.list[0]['REG_DATE']) ){
              return;
            }

            data.list.forEach(function (obj/*, idx*/) {
              let copyNode = $(node).clone(true);
              $(copyNode).text(obj['TITLE']);
              $(copyNode).attr("href", window.getNoticeViewUrl(obj['ID']));

              $(copyNode).data(obj)

              $("#noticeList").append(copyNode)
            })
            $("#noticeList").parents(".notice_wrap").show();
            $("a:eq(0)", "#noticeList").show();

            $(".notice_wrap").find(".prev_a, .next_a").on("click", function () {
              let aIndex = $("a", "#noticeList").index($("a:visible", "#noticeList"));
              let target;

              if ($(this).hasClass("prev_a")) {
                target = $($("a", "#noticeList")[--aIndex]);
              } else {
                target = $($("a", "#noticeList")[++aIndex]);
              }
              if( $(target).length > 0 ){
                $("a", "#noticeList").hide();
                $(target).show();
              }
            })
          }
        }, 1, 5);
      }
    };
    const story = {
      init : function(){
        this.getPopularList();
      },
      getPopularList : function(){
        comm.request({
          url: popularStoryListUrl,
          method : "GET",
          headers : {"Content-type":"application/x-www-form-urlencoded"},
        },function(data){
          if( data.code == '0000' && ( data.popularStorys && data.popularStorys.length > 0 ) ){

            data.popularStorys.forEach(function(obj){
              let story = $('<div class="swiper-slide"></div>')
              let storyHtml = '';

              if( obj.THUMBNAIL_IMG_PATH ){
                storyHtml += '<img class="main-middel-banner" src="' + window.getServerImg(obj.THUMBNAIL_IMG_PATH.replace(/[\\]/g, '/')) + '">';
              }else{
                return;
              }

              storyHtml += '<div class="issue_box">';
              storyHtml += '<span class="kind">'+obj.CATEGORY_NM+'</span>';
              storyHtml += '<strong>'+obj.TITLE+'</strong>';

              let summary = obj.SUMMARY || '';
              if( !(summary.length < 100) ){
                summary = summary.substring(0,100)+' ...';
              }

              storyHtml += '<span>'+summary+'</span>';
              storyHtml += '<em>by ' + obj.NICKNAME + '</em>';
              storyHtml += '<a href="' + window.getStoryViewUrl(obj['ID'], obj['MEMBER_ID']) + '"><img src="' + require('@/resources/img/btn_more.png') + '"></a>';
              storyHtml += '</div>';

              $(story).html(storyHtml)
              $(story).data(obj);

              $("#popularStoryList").append(story);
            })
          }

          if( $(".swiper-slide","#popularStoryList").length == 0 ){
            $("#popularStorys").remove();
          }else{
            swiper.banner();
          }
        });
      },
    };

    return {
      keyword : keyword,
      category : category,
      swiper : swiper,
      notice : notice,
      story : story,
    };
  },

  mounted() {
    const $this = this;

    //스크롤 페이드인
    window.triggerJqueryFadeIn();

    $this.swiper.init();
    $this.notice.init();
    $this.story.init();
    $this.keyword.init();
    $this.category.init();
  },
}
</script>
