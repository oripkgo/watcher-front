
<template>
  <div class="manage_line">인기글</div>
  <div class="conts_rel">
    <ul style="padding:20px 0px;" class="articleList">
    </ul>
  </div>
</template>


<script>
import $ from 'jquery';
import comm from "@/resources/task/js/common/comm.js";

export default {
  name : 'commPopularArticles',
  data(){
    return {
      apiUrlManagementBoardPoularStorys : "/management/board/popularity/storys",
    }
  },
  mounted() {
    const $this = this;
    comm.request({url: $this.apiUrlManagementBoardPoularStorys, method: "GET"}, function (resp) {
      if (resp.code == '0000') {
        $(".articleList").empty();
        resp.list.forEach(function (obj) {
          let liObj = $("<li></li>");
          let liHtml = '';
          liHtml += '<a href="'+window.getStoryViewUrl(obj['ID'], obj['MEMBER_ID'])+'">                          ';
          liHtml += '    <img src="' + window.getServerImg(obj['THUMBNAIL_IMG_PATH']) + '">                  ';
          liHtml += '        <strong>[' + obj['CATEGORY_NM'] + '] ' + obj['TITLE'] + '</strong> ';
          liHtml += '        <span>' + obj['SUMMARY'] + '</span>                         ';
          liHtml += '</a>                                                         ';
          liHtml += '<p>                                                          ';
          liHtml += '    <em>댓글 ' + obj['COMMENT_CNT'] + '</em>                          ';
          liHtml += '    <img src="'+require("@/resources/img/line.png")+'">     ';
          liHtml += '        <em>공감 ' + obj['LIKE_CNT'] + '</em>                         ';
          liHtml += '</p>                                                         ';

          $(liObj).html(liHtml);
          $(".articleList").append(liObj);
        });
      }
    })
  }
}

</script>
