
<template>
  <div class="section">
    <div class="ani-in sub_layout">
      <div class="detail_top ani_y delay1">
        <div class="detail_kind">스토리</div>
        <strong>{{vo['TITLE']}}</strong>
        <div class="detail_memo">
          <em><a class="hover_line" :href="memStoryUrl">by {{vo['NICKNAME']}}</a></em>
          <img src="@/resources/img/line.png">
          <span id="last_time"></span>

          <div class="btn_basic" v-if="isModifyAuthorityYn === 'Y'">
            <a href="javascript:;" id="story_update">수정</a>
            <img src="@/resources/img/line.png">
            <a href="javascript:;" id="story_delete">삭제</a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <form id="storyViewForm" name="storyViewForm">
    <div class="section uline2">
      <div class="ani-in sub_layout rline">
        <div class="conts_wrap ani_y delay2">
          <div id="storyContents"></div>
          <div class="conts_sns">
            <a href="javascript:;" class="zimm like" :data-likecnt="vo['LIKE_CNT']">공감 {{ vo['LIKE_CNT'] }}</a>
          </div>
          <div class="conts_tag">
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
    data() {
      return {
        type: "STORY",
        memId: this.$route.params.memId,
        id: this.$route.query.id,
        vo: {},
        isModifyAuthorityYn: 'N',
        regDate: null,
        memStoryUrl: "/"+this.$route.params.memId+"/myStory"
      }
    },

    mounted() {
      const $this = this;
      comm.request({url: "/" + $this.memId + "/story/view?id=" + $this.id, method: "GET", async: false}, function (resp) {
        // 삭제 성공
        if (resp.code == '0000') {
          $this.isModifyAuthorityYn = resp['modify_authority_yn'];
          $this.vo = resp['view'];
          $this.regDate = resp['view']['REG_DATE'];

          $("#storyContents").replaceWith($this.vo['CONTENTS'])
        }
      })

      // 지난 시간 세팅
      $("#last_time").html(comm.last_time_cal($this.regDate));

      comm.board_view_init(
          $this.type,
          $this.id,
          function () {},
          {"likeTarget": ".like", "tagsTarget": ".conts_tag", "commentTarget": ".conts_review"}
      );

      // 수정
      $("#story_update").on("click", function () {
        location.href = "/story/update?id=" + $this.id;
      });

      // 삭제
      $("#story_delete").on("click", function () {
        comm.message.confirm("스토리를 삭제하시겠습니까?", function (status) {
          if (status) {
            comm.request({
              url: "/story/delete",
              data: JSON.stringify({id: $this.id})
            }, function (resp) {
              if (resp.code == '0000') {
                comm.message.alert('삭제가 완료되었습니다.', function () {
                  location.href = '/story/list';
                });
              }
            });
          }
        })
      });

      $(".sns_btn").click(function () {
        $(".sns_view").slideToggle("fast");
      });
    },
  };
</script>




