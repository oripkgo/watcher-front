<template>

  <div class="section">
    <div class="ani-in new_mystory_layout">
      <div class="new_mystory_title_box ani_y">
        <a class="new_mystory_title" :href="this.myStoryMainUrl">{{ storyTitle }}</a>
        <a href="javascript:;" class="new_mystory_mobile_menu_btn"></a>
      </div>
    </div>
  </div>


  <div class="section uline2">
    <div class="ani-in new_mystory_layout">
      <div class="new_mystory_contents_box ani_y">
        <div class="new_mystory_menu_box">
          <div class="new_mystory_photo">
            <img :src="memProfileImg"/>
          </div>
          <div class="new_mystory_menu_list">
            <ul></ul>
          </div>
        </div>
        <div class="new_mystory_contents">
          <div class="new_mystory_notice">
            <div class="board_title" v-if="this.categoryListYn != 'Y'">
              공지사항
              <a href="javascript:;" id="notice_more">더보기 <img src="@/resources/img/down_arrow.png"></a>
            </div>
            <ul class="notice_list" v-if="this.categoryListYn != 'Y'"></ul>
          </div>
          <div class="new_mystory_list">
            <div class="board_title">
              {{ boardTitle }}
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
    </div>
  </div>
</template>


<script>
import $ from 'jquery';
import comm from "@/resources/task/js/common/comm.js";

export default {
  name: "myStoryMain",

  data() {
    const $this = this;
    const data = $this.getMyStoryInfo();
    const dto = data['dto'];

    const result = {
      notice_show_cnt: 4,
      myStory_search_memberId: data['memId'],
      memberCategoryList: JSON.parse(data['memberCategoryList']),
      myStoryMainUrl: "/myStory/" + data['memId'],
      myStorylistDataUrl: '/myStory/list',
      noticeListDataUrl: '/notice/list/data?searchMemId=' + data['memId'],
      noticeMoreUrl: "/" + data['memId'] + "/notice/list?myStoryTitle=" + data['policy']['STORY_TITLE'],
      categoryListYn: 'N',
      storyTitle: data['policy']['STORY_TITLE'],
      policy: data['policy'],
      dto: {},
      memProfileImg: window.memProfileImg,
    };

    if (dto) {
      result['dto'] = dto;
      result['pageNo'] = dto['pageNo'] || '1',
          result['listNo'] = dto['listNo'] || '10',
          result['pagigRange'] = dto['pagigRange'] || '10',
          result['categoryId'] = dto['categoryId'],
          result['boardTitle'] = (dto['category_nm'] || '전체글')
    }

    if (data.categoryListYn) {
      result['categoryListYn'] = data.categoryListYn;
    }

    return result
  },

  mounted() {
    //스크롤 페이드인
    window.triggerJqueryFadeIn();

    const $this = this;

    // 회원 카테고리 세팅
    $this.initCategory($this.memberCategoryList, $this);

    // 공지사항 세팅
    $this.initNotice($this.myStory_search_memberId, $this);

    // 나의 스토리 세팅
    $this.initMyStory($this.myStory_search_memberId, $this.categoryId, $this);

    $(".new_mystory_mobile_menu_btn").click(function(){
      $(".new_mystory_menu_box").toggleClass("on");
    });

  },

  methods: {
    getMyStoryInfo: function () {
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
            memberCategoryList: resp['memberCategoryList'],
            policy: resp['policy'],
            memId: resp['memId'],
            dto: resp['dto'],
          };
        }
      })

      return data;
    },

    initCategory: function (list, $this) {
      if (list && list.length > 0) {
        list.forEach(function (obj) {
          const li = $('<li></li>');
          const a = $('<a></a>');
          $(a).text(obj.CATEGORY_NM);
          $(a).attr('href', "/myStory/" + $this.myStory_search_memberId + "/" + obj.ID + "?category_nm=" + encodeURIComponent(obj.CATEGORY_NM));

          if( $this.$route.query['category_nm'] == obj.CATEGORY_NM ){
            $(a).addClass("on");
          }

          $(li).append(a)
          $(".new_mystory_menu_list ul").append(li);
        })
      }
    },

    initMyStory: function (uid, categId, $this) {
      comm.dom.appendInput('#myStoryForm', "search_memId", uid);
      comm.dom.appendInput('#myStoryForm', "search_member_category_id", categId);

      comm.paging.getList('#myStoryForm', $this.myStorylistDataUrl, function (data) {
        comm.paging.emptyList("#myStoryList")

        for (let i = 0; i < data.list.length; i++) {
          let obj = data.list[i];
          let listHtml = '';

          listHtml += '<li>';
          listHtml += '    <a href="' + window.getStoryViewUrl(obj['ID'], obj['MEMBER_ID']) + '">';
          listHtml += '        <em>' + obj.CATEGORY_NM + '</em>';
          listHtml += '        <strong>' + obj.TITLE + '</strong>';

          listHtml += '        <span>';
          if (!obj.SUMMARY) {
            obj.SUMMARY = '';
          }

          if (obj.SUMMARY.length < 100) {
            listHtml += obj.SUMMARY;
          } else {
            listHtml += (obj.SUMMARY || '').substring(0, 100) + ' ...';
          }

          listHtml += '</span>';

          if (obj.THUMBNAIL_IMG_PATH) {
            listHtml += '        <img src="' + window.getServerImg(obj['THUMBNAIL_IMG_PATH']) + '">';
          }

          listHtml += '    </a>';
          listHtml += '    <div class="story_key">';

          if (obj.TAGS) {
            let tag_arr = obj.TAGS.split(',');

            tag_arr.forEach(function (tag) {
              listHtml += '        <a href="javascript:;">#' + tag.trim() + '</a>';
            })
          }

          listHtml += '    </div>';
          listHtml += '    <div class="story_key">';
          // listHtml += '        <a href="javascript:;">#컬처</a>';
          // listHtml += '        <a href="javascript:;">#영화</a>';
          // listHtml += '        <a href="javascript:;">#영화컬처</a>';
          listHtml += '        <span>' + comm.date.getPastDate(obj.REG_DATE) + '</span>';
          listHtml += '        <span>공감 ' + obj.LIKE_CNT + '</span>';
          listHtml += '        <em>by ' + obj.NICKNAME + '</em>';
          listHtml += '    </div>';
          listHtml += '</li>';
          listHtml += '';

          listHtml = $(listHtml);

          $(listHtml).data(obj);

          comm.paging.drawList("#myStoryList", listHtml);
        }

      }, $this.pageNo, $this.listNo, $this.pagigRange);
    },

    initNotice: function (id, $this) {
      comm.request({
        url: $this.noticeListDataUrl
        , method: "GET"
        , headers: {"Content-type": "application/x-www-form-urlencoded"}
      }, function (data) {
        if (data.code == '0000' && (data.list && data.list.length > 0)) {

          $(".notice_list").empty();

          if ($this.notice_show_cnt > data.list.length) {
            $this.notice_show_cnt = data.list.length;
          }

          for (let i = 0; i < $this.notice_show_cnt; i++) {
            const obj = data.list[i];
            let li = $('<li></li>');

            li.append('<a href="' + window.getNoticeViewUrl(obj.ID, id) + '">' + obj['TITLE'] + '</a>');
            li.append('<em>' + (obj['UPT_DATE'] || obj['REG_DATE']) + '</em>');
            $(".notice_list").append(li);
          }
        }
      });

      $("#notice_more").on("click", function () {
        location.href = $this.noticeMoreUrl;
      });
    },
  },
}

</script>
