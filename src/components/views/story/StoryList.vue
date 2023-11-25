
<template>
  <form name="searchForm" id="searchForm">
  <div class="section ani-in">
    <div class="layout_02">
      <div class="ani_y layout_sub title_box_02">
        <div class="sub_title_top"><p>Story</p></div>
        <div class="sub_title_bottom">
          <p class="title_description">다양한 이야기를 공유 해보세요</p>
          <div class="search_box_02">
            <div class="search_group">
              <select id="seachCategory">
                <option value="">카테고리</option>
              </select>
              <input type="text" id="keyword" placeholder="키워드 입력">
              <a href="javascript:;" id="search"><img src="@/resources/img/btn_search_b.png"></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </form>

  <div class="section">
    <div class="ani-in layout">

      <div class="tab_wrap ani_y delay2">
        <!--탭메뉴-->
        <div id="tab_box">
          <div id="tab_cnt" class="category_tab"></div>

          <div class="grap" id="tab_parent"></div>

        </div>
        <!--//탭메뉴 끝-->
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import comm from "@/resources/task/js/common/comm.js";

export default {
  data() {
    return {
      SEARCH_CATEGORY_ID : this.$route['query']['search_category_id'],
      SEARCH_KEYWORD : this.$route['query']['search_keyword'],
      CATEGORY_LIST : comm.category.get(),
      pageNo : this.$route['query']['pageNo'] || '1',
      listNo : this.$route['query']['listNo'] || '10',
      pagigRange : this.$route['query']['pagigRange'] || '10',
      listUrl : '/story/list/data',
    }
  },

  mounted() {
    //스크롤 페이드인
    window.triggerJqueryFadeIn();

    const $this = this;
    this.initCategory($this);
    this.initKeywordSearch($this);
    if( this.SEARCH_CATEGORY_ID && this.SEARCH_KEYWORD ){
      $("#seachCategory").val(this.SEARCH_CATEGORY_ID);
      $("#keyword").val(this.SEARCH_KEYWORD);
      $("#search").click();
    }
  },

  methods: {
    initCategory : function($this){
      $this.CATEGORY_LIST.forEach(function(obj,idx){
        const id = obj['ID'];
        const nm = obj['CATEGORY_NM'];

        $('#seachCategory').append('<option value="'+id+'">'+nm+'</option>')

        if( idx == 0 ){
          $('.category_tab').append('<a href="javascript:;" class="tab_ov tab_'+id+'"><span>'+nm+'</span></a>');
        }else{
          $('.category_tab').append('<a href="javascript:;" class="tab_'+id+'"><span>'+nm+'</span></a>');
        }

        const tabObj = $this.appendTab(id, $("#tab_parent"));
        $(tabObj).html($this.draw_tags_in_tabs(id));

        $this.tabEvent();

        // 추천순 목록
        $this.recommendedList(id, $this);

        // 기본 목록
        $this.defaultList(id, null, $this);
      })
    },

    initKeywordSearch : function($this){
      $("#search").on("click", function () {
        let id = $("#seachCategory").val();

        if (!id) {
          comm.message.alert("카테고리를 선택해주세요.",function(){
            $("#seachCategory").focus();
          });
          return;

          // if (CATEGORY_LIST.length > 0) {
          //     id = CATEGORY_LIST[0]['ID'];
          // }
        }

        comm.dom.appendInput($('#defaultListForm' + id), 'search_keyword', $("#searchForm").find("#keyword").val());

        $("#defaultList"+id).empty();

        // 기본 목록
        $this.defaultList(id, function(){
          $(".tab_"+id).click();
        }, $this);
      })

      $("#keyword").on("keypress", function (e) {
        if (e.keyCode == 13) {
          $("#search").click();
          return false;
        }
      });
    },

    tabEvent : function(){
      var param = "#tab_box";
      var btn = "#tab_cnt>a";
      var obj = "#tab_box .obj";
      var img = false;
      var event = "click";
      window.document_tab(param,btn,obj,img,event);
    },

    recommendedList : function(id, $this){
      comm.request({
        form: $("#RecommendedListForm" + id)
        , url: $this.listUrl
        , method: "GET"
        , headers: {"Content-type": "application/x-www-form-urlencoded"}
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

            tag_arr.forEach(function(tag){
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

    defaultList : function(id, callback, $this){
      comm.paging.getList('#defaultListForm'+id, $this.listUrl,function(data){
        comm.paging.emptyList("#defaultList"+id);

        for (let i = 0; i < data.list.length; i++) {
          let obj = data.list[i];
          let listHtml = '';
          // let listNum = ((data.vo.pageNo - 1) * data.vo.listNo) + (i + 1);

          listHtml += '<li>';
          listHtml += '    <a href="' + window.getStoryViewUrl(obj['ID'], obj['MEMBER_ID']) + '">';
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

          listHtml += '</span>';

          if( obj['THUMBNAIL_IMG_PATH'] ){
            listHtml += '        <img src="' + window.getServerImg(obj['THUMBNAIL_IMG_PATH']) + '">';
          }

          listHtml += '    </a>';
          listHtml += '    <div class="story_key">';

          if( obj.TAGS ){
            let tag_arr = obj.TAGS.split(',');

            tag_arr.forEach(function(tag){
              listHtml += '        <a href="javascript:;">#'+tag.trim()+'</a>';
            })
          }

          listHtml += '    </div>';
          listHtml += '    <div class="story_key">';
          // listHtml += '        <a href="javascript:;">#컬처</a>';
          // listHtml += '        <a href="javascript:;">#영화</a>';
          // listHtml += '        <a href="javascript:;">#영화컬처</a>';
          listHtml += '        <span>'+comm.date.getPastDate(obj.REG_DATE)+'</span>';
          listHtml += '        <span>공감 ' + obj.LIKE_CNT + '</span>';
          listHtml += '        <em>by ' + obj.NICKNAME + '</em>';
          listHtml += '    </div>';
          listHtml += '</li>';
          listHtml += '';

          listHtml = $(listHtml);

          $(listHtml).data(obj);

          $("#defaultList"+id).append(listHtml);
        }

        if( callback ){
          callback();
        }
      }, $this.pageNo, $this.listNo, $this.pagigRange);
    },

    appendTab : function(id,target){
      let tabId = 'tabObj_'+id;
      let tabHtml = '';

      tabHtml += '<div class="obj" id="'+tabId+'">';
      tabHtml += '<a href="javascript:;" class="btn_story2"></a>';
      tabHtml += '</div>';

      $(target).append(tabHtml);

      return $("#"+tabId, target);
    },

    draw_tags_in_tabs : function(id){
      let div = $('<div></div>')
      let recommendedListForm = comm.dom.appendForm('RecommendedListForm'+id);
      let defaultListForm = comm.dom.appendForm('defaultListForm'+id);

      comm.dom.appendInput(recommendedListForm, "SortByRecommendationYn", "YY", true);
      comm.dom.appendInput(recommendedListForm, "search_category_id", id, true);
      comm.dom.appendInput(recommendedListForm, "limitNum", "3", true);
      $(recommendedListForm).append('<ul class="story_wrap" id="RecommendedDataList'+id+'"></ul>')

      comm.dom.appendInput(defaultListForm, "SortByRecommendationYn", "NN", true);
      comm.dom.appendInput(defaultListForm, "search_category_id", id, true);
      $(defaultListForm).append('<div class="story_wrap01"><ul id="defaultList'+id+'"></ul></div>');
      $(defaultListForm).append('<div class="pagging_wrap"></div>');

      $(div).append(recommendedListForm);
      $(div).append(defaultListForm);

      return $(div).html();
    },

  },
}

</script>
