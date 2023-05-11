
<template>
  <div class="section">
    <div class="ani-in sub_layout">

      <div class="detail_top ani_y delay1">
        <div class="detail_kind">공지사항</div>
        <strong>{{vo['TITLE']}}</strong>
        <div class="detail_memo">
          <em>by {{vo['NICKNAME']}}</em>
          <img src="@/resources/img/line.png">
          <span id="last_time"></span>
        </div>
      </div>

    </div>
  </div>


  <form id="noticeForm" name="noticeForm" method="get">
    <div class="section uline2">
      <div class="ani-in sub_layout rline">
        <div class="conts_wrap ani_y delay2">
          <div id="noticeContents"></div>

          <div class="conts_sns">
            <a href="javascript:;" class="zimm like" :data-likecnt="vo['LIKE_CNT']">공감 {{vo['LIKE_CNT']}}</a>
          </div>

          <div class="conts_tag" style="display: none;">
            <strong class="conts_tit">태그</strong>
          </div>

          <div class="conts_review"></div>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import $ from 'jquery';
import comm from "@/resources/task/js/common/comm.js";

  export default {
      data(){
        const data = this.getNoticeInfo();

        const result = {
          type : 'NOTICE',
          id : null,
          regDate : null,
          vo : {},
        };

        if( data.view ){
          result['vo'] = data.view;
        }

        if( result['vo'] && result['vo']['ID'] ){
          result['id'] = result['vo']['ID'];
        }

        if( result['vo'] && result['vo']['REG_DATE'] ){
          result['regDate'] = result['vo']['REG_DATE'];
        }

        return result
      },

      mounted() {
        const $this = this;
        // 지난 시간 세팅
        $("#last_time").html( comm.last_time_cal($this.regDate) );

        $("#noticeContents").replaceWith($this.vo['CONTENTS'].replace(/\/resources/g, window.apiHost +"/resources"))

        comm.initBoardView($this.type, $this.id, function(){},{"likeTarget":".like", "tagsTarget":".conts_tag", "commentTarget":".conts_review"});

        $(".sns_btn").click(function () {
          $(".sns_view").slideToggle("fast");
        });
      },

      methods : {
        getNoticeInfo: function () {
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
                modifyAuthorityYn: resp['modify_authority_yn'],
                view: resp['view'],
              };
            }
          })

          return data;
        },
      },
  }
</script>
