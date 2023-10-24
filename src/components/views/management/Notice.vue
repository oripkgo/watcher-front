<template>
  <form id="noticeForm">
    <commHeader/>
    <div class="section uline2">
      <div class="ani-in manage_layout">
        <div class="manage_conts">
          <commMenu/>
          <div class="manage_box_wrap">
            <div class="sub_title01">
              공지 관리

              <div class="search_right_box">
                <select id="search_secret_yn" name="search_secret_yn">
                  <option value="">전체</option>
                  <option value="NN">공개</option>
                  <option value="YY">비공개</option>
                </select>
                <input type="text" id="search_keyword" name="search_keyword" placeholder="">
                <a href="javascript:;" id="search"></a>
              </div>
            </div>

            <div class="board_notice">
              <table id="noticeList"></table>
              <div class="pagging_wrap"></div>
            </div>
          </div><!-------------//manage_box_wrap------------->
        </div>
      </div>
    </div>
  </form>
</template>

<script>
  import commHeader from "@/components/views/management/include/CommHeader";
  import commMenu from "@/components/views/management/include/CommMenu";
  import comm from "@/resources/task/js/common/comm";
  import $ from 'jquery';

  export default {
    name : "managementNotice",

    components: {
      commHeader,
      commMenu,
    },

    data(){
      return {
        noticeApiUrl : "/management/board/notices",
        noticePublicUrl : "/management/board/notices/public",
        noticePrivateUrl : "/management/board/notices/private",
      }
    },
    mounted() {
      //스크롤 페이드인
      window.triggerJqueryFadeIn();

      const $this = this;
      window.vueComponent = this;

      $("#search").on("click", function () {
        $this.search($this);
      });

      $("#search_keyword").on("keypress", function (e) {
        if (e.keyCode == 13) {
          $this.search($this);
          return false;
        }
      });

      $this.search($this);
    },
    methods:{
      confirmCheckBox : function(){
        return $(".check:checked:not('.all')").length == 0 ? false : true ;
      },

      getSelCheckBoxObjs : function(){
        return $(".check:checked:not('.all')");
      },

      getNoticeIds : function($this){
        const checkObjs = $this.getSelCheckBoxObjs($this);
        const storyIds = [];

        checkObjs.each(function(idx,checkObj){
          const obj = $(checkObj).parents("tr").data();
          storyIds.push(obj.ID);
        })

        return storyIds;
      },

      deleteNotice : function($this){
        if( !$this.confirmCheckBox($this) ){
          comm.message.alert('공지사항을 선택해주세요.');
          return;
        }

        comm.message.confirm("선택한 공지사항을 삭제하시겠습니까?",function(result){
          if( result ){
            const param = JSON.stringify({paramJson:JSON.stringify($this.getNoticeIds($this))});
            comm.request({url:$this.noticeApiUrl, method : "DELETE", data : param},function(resp){
              // 수정 성공
              if( resp.code == '0000'){
                $($this.getSelCheckBoxObjs($this)).each(function(idx,checkObj){
                  $(checkObj).parents("tr").remove();
                })
              }
            })
          }
        })
      },

      updatePublic : function($this){
        if( !$this.confirmCheckBox($this) ){
          comm.message.alert('공지사항을 선택해주세요.');
          return;
        }

        comm.message.confirm("선택한 공지사항을 공개하시겠습니까?",function(result){
          if( result ){
            const param = JSON.stringify({paramJson:JSON.stringify($this.getNoticeIds($this))});
            comm.request({url:$this.noticePublicUrl, method : "PUT", data : param},function(resp){
              // 수정 성공
              if( resp.code == '0000'){
                $("#search_secret_yn").val("NN");
                $this.search($this);
              }
            })
          }
        })
      },

      updatePrivate : function($this){
        if( !$this.confirmCheckBox($this) ){
          comm.message.alert('공지사항을 선택해주세요.');
          return;
        }

        comm.message.confirm("선택한 공지사항을 비공개하시겠습니까?",function(result){
          if( result ){
            const param = JSON.stringify({paramJson:JSON.stringify($this.getNoticeIds($this))});
            comm.request({url:$this.noticePrivateUrl, method : "PUT", data : param},function(resp){
              // 수정 성공
              if( resp.code == '0000'){
                $("#search_secret_yn").val("YY");
                $this.search($this);
              }
            })
          }
        })
      },

      search : function($this){
        comm.list('#noticeForm', $this.noticeApiUrl, $this.listCallback, 1, 10);
      },

      initCheckBox : function(){
        $(".check").on("click",function(){
          let $clickTarget = this;

          if( $($clickTarget).hasClass("all") ){
            if( $($clickTarget).is(":checked") ){
              $(".check").prop("checked",true)
            }else{
              $(".check").prop("checked",false)
            }
          }

          if( $(".check:not('.all')").length == $(".check:checked:not('.all')").length ){
            $(".check.all").prop("checked",true)
          }else{
            $(".check.all").prop("checked",false)
          }
        })
      },

      listCallback : function(data){
        const $this = this;
        $("#noticeList").empty();
        $("#noticeList").append($this.getTrHead($this));

        for (let i = 0; i < data.list.length; i++) {
          let obj = data.list[i];
          let listHtml = '';
          // let listNum = ((data.vo.pageNo - 1) * data.vo.listNo) + (i + 1);

          listHtml += '<td><input type="checkbox" class="check"></td>';
          listHtml += '<td>';
          listHtml += '    <a href="' + window.getNoticeViewUrl(obj.ID) + '" class="subject_link">'+obj['TITLE']+'</a>';
          listHtml += '</td>';
          listHtml += '<td>';
          listHtml += obj['REG_DATE'];
          listHtml += '</td>';

          listHtml = $($this.getTr()).html(listHtml);
          $(listHtml).data(obj);

          $("#noticeList").append(listHtml);
        }

        $this.initCheckBox($this);
        window.scrollTo(0, 0);
      },

      getTr : function(){
        return $('<tr></tr>').clone(true);
      },

      getTrHead : function($this){
        let _TrHeadStr = '';

        _TrHeadStr += '<th><input type="checkbox" class="check all"></th>';
        _TrHeadStr += '<th colspan="2">';
        _TrHeadStr += '    <div class="btn_tb">';
        _TrHeadStr += '        <a href="javascript:;" onclick="vueComponent.deleteStory(vueComponent)">삭제</a>';
        _TrHeadStr += '        <a href="javascript:;" onclick="vueComponent.updatePublic(vueComponent);">공개</a>';
        _TrHeadStr += '        <a href="javascript:;" onclick="vueComponent.updatePrivate(vueComponent);">비공개</a>';
        _TrHeadStr += '        <a href="'+window.getNoticeWriteUrl()+'">공지쓰기</a>';
        _TrHeadStr += '    </div>';
        _TrHeadStr += '</th>';

        return $($this.getTr()).html(_TrHeadStr);
      },
    },
  };
</script>