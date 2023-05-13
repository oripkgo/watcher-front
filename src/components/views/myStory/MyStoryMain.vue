
<template>
  <div class="section">
    <div class="ani-in my_layout">
      <div class="mystory_top ani_y delay1">
        <div class="mystory_title"><a :href="myStoryMainUrl">태균스토리</a></div>
        <div class="storybox_search_wrap">
        </div>
      </div>
    </div>
  </div>

  <div class="section uline2">
    <div class="ani-in my_layout rline">
      <div class="mystory_menu">
        <div class="title_line">카테고리 전체보기</div>
      </div>

      <div class="conts_wrap2 ani_y delay2">
        <div class="mystory_menu_mobile">
          <div class="board_title">카테고리 전체보기</div>
        </div>

        <div class="board_title" v-if="categoryListYn != 'Y'">
          공지사항
          <a href="javascript:;" id="notice_more">더보기 <img src="@/resources/img/down_arrow.png"></a>
        </div>
        <ul class="notice_list" v-if="categoryListYn != 'Y'">
        </ul>

        <div class="board_title">
          {{boardTitle}}
        </div>

        <form id="myStoryForm">
          <input type="hidden" name="search_memId" id="search_memId">
          <input type="hidden" name="search_category_id" id="search_category_id">

          <ul class="board_list" id="myStoryList"></ul>
          <div class="pagging_wrap"></div>
        </form>
      </div>
    </div>
  </div>
</template>


<script>
import $ from 'jquery';
import comm from "@/resources/task/js/common/comm.js";

  export default {
    data() {
      const $this = this;
      const data = $this.getMyStoryInfo();
      const vo = data['vo'];

      const result = {
        notice_show_cnt: 4,
        myStory_search_memberId: data['memId'],
        member_category_list: JSON.parse(data['member_category_list']),
        myStoryMainUrl: "/" + data['memId'] + '/myStory',
        myStorylistDataUrl: '/myStory/list/data',
        noticeListDataUrl: '/notice/list/data?search_memId=' + data['memId'],
        noticeMoreUrl: "/" + data['memId'] + "/notice/list",
        categoryListYn: 'N',
        vo: {},
      };

      if (vo) {
        result['vo'] = vo;
        result['pageNo'] = vo['pageNo'] || '1',
        result['listNo'] = vo['listNo'] || '10',
        result['pagigRange'] = vo['pagigRange'] || '10',
        result['categoryId'] = vo['categoryId'],
        result['boardTitle'] = (vo['category_nm'] || '전체글')
      }

      if( data.categoryListYn ){
        result['categoryListYn'] = data.categoryListYn;
      }

      return result
    },

    mounted() {
      const $this = this;

      // 회원 카테고리 세팅
      $this.initCategory($this.member_category_list, $this);

      // 공지사항 세팅
      $this.initNotice($this.myStory_search_memberId, $this);

      // 나의 스토리 세팅
      $this.initMyStory($this.myStory_search_memberId, $this.categoryId, $this);
    },

    methods: {
      getMyStoryInfo : function(){
        const $this = this;
        let data = {};
        let path = $this.$route['fullPath'];

        comm.request({
          url: path,
          method: "GET",
          async: false
        }, function (resp) {
          // 삭제 성공
          if (resp.code == '0000') {
            data = {
              categoryListYn: resp['categoryListYn'],
              member_category_list: resp['member_category_list'],
              memId: resp['memId'],
              vo: resp['vo'],
            };
          }
        })

        return data;
      },

      initCategory : function(list, $this){
        if( list &&  list.length > 0 ){
          list.forEach(function(obj){
            const a = $('<a></a>');
            $(a).text(obj.CATEGORY_NM);
            $(a).attr('href', "/"+$this.myStory_search_memberId+"/myStory/"+ obj.DEFALUT_CATEG_ID+"?category_nm="+encodeURIComponent(obj.CATEGORY_NM));
            $(".mystory_menu, .mystory_menu_mobile").append(a);
          })
        }
      },

      initMyStory : function(uid, categId, $this){
        comm.appendInput('#myStoryForm', "search_memId"         , uid       );
        comm.appendInput('#myStoryForm', "search_category_id"   , categId   );

        comm.list('#myStoryForm', $this.myStorylistDataUrl,function(data){

          $("#myStoryList").empty();

          for (let i = 0; i < data.list.length; i++) {
            let obj = data.list[i];
            let listHtml = '';

            listHtml += '<li>';
            listHtml += '    <a href="'+ window.getStoryViewUrl(obj['ID'], obj['MEMBER_ID']) + '">';
            listHtml += '        <em>'+obj.CATEGORY_NM+'</em>';
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

            if( obj.THUMBNAIL_IMG_PATH ){
              listHtml += '        <img src="' + window.apiHost + obj.THUMBNAIL_IMG_PATH + '">';
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
            listHtml += '        <span>'+comm.last_time_cal(obj.REG_DATE)+'</span>';
            listHtml += '        <span>공감 ' + obj.LIKE_CNT + '</span>';
            listHtml += '        <em>by ' + obj.NICKNAME + '</em>';
            listHtml += '    </div>';
            listHtml += '</li>';
            listHtml += '';

            listHtml = $(listHtml);

            $(listHtml).data(obj);

            $("#myStoryList").append(listHtml);
          }

        }, $this.pageNo, $this.listNo, $this.pagigRange);
      },

      initNotice : function(id, $this){
        comm.request({
          url: $this.noticeListDataUrl
          , method: "GET"
          , headers: {"Content-type": "application/x-www-form-urlencoded"}
        }, function (data) {
          if( data.code == '0000' && ( data.list && data.list.length > 0 ) ){

            $(".notice_list").empty();

            if( $this.notice_show_cnt > data.list.length ){
              $this.notice_show_cnt = data.list.length;
            }

            for( let i=0;i<$this.notice_show_cnt;i++ ){
              const obj = data.list[i];
              let li = $('<li></li>');

              li.append('<a href="'+ window.getNoticeViewUrl(obj.ID, id) +'">'+obj['TITLE']+'</a>');
              li.append('<em>'+(obj['UPT_DATE'] || obj['REG_DATE'])+'</em>');
              $(".notice_list").append(li);
            }
          }
        });

        $("#notice_more").on("click", function(){
          location.href= $this.noticeMoreUrl;
        });
      },
    },
  }

</script>
