<template>
  <form id="noticeForm">
    <commHeader/>
    <div class="section uline2">
      <div class="ani-in manage_layout">
        <div class="manage_conts">
          <commMenu/>
          <div class="manage_box_wrap">

            <div class="new_manage_head_box">
              <div class="new_manage_title_box">
                <p class="new_manage_title">
                  공지 관리
                </p>
                <div class="new_manage_btn_and_search_box">
                  <div class="new_search_right_box">
                    <div class="search_right_box">
                      <select id="searchSecretYn" name="searchSecretYn">
                        <option value="">전체</option>
                        <option value="NN">공개</option>
                        <option value="YY">비공개</option>
                      </select>
                      <input type="text" id="searchKeyword" name="searchKeyword" placeholder="">
                      <a href="javascript:;" id="search"></a>
                    </div>
                  </div>
                </div>
              </div>
              <div class="new_manage_btn_and_search_box">
                <div class="new_btn_right_box">
                  <div class="btn_tb">
                    <a href="javascript:;" onclick="vueComponent.deleteNotices(vueComponent)">삭제</a>
                    <a href="javascript:;" onclick="vueComponent.updatePublic(vueComponent);">공개</a>
                    <a href="javascript:;" onclick="vueComponent.updatePrivate(vueComponent);">비공개</a>
                    <router-link :to="noticeWriteUrl">공지쓰기</router-link>
                  </div>
                </div>
              </div>
            </div>

            <div class="board_notice">
              <table class="board_list_table">
                <tbody class="list_header">
                  <tr>
                    <th><input type="checkbox" class="check all"></th>
                    <th colspan="2"></th>
                  </tr>
                </tbody>
                <tbody class="noticeList"></tbody>

              </table>
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
        noticeWriteUrl : window.getNoticeWriteUrl(),
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

      $("#searchKeyword").on("keypress", function (e) {
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

      deleteNotices : function($this){
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
                $("#searchSecretYn").val("NN");
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
                $("#searchSecretYn").val("YY");
                $this.search($this);
              }
            })
          }
        })
      },

      search : function($this){
        comm.paging.getList('#noticeForm', $this.noticeApiUrl, $this.listCallback, 1, 10);
      },

      initCheckBox : function(){
        $(".check").off().on("click",function(){
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

      getMobileRecord : function(target, arr){
        let tempDiv = $("<div></div>");
        let dataElement = $(document.createElement(target));
        let rowElement = $('<div class="mobile-data-row"></div>');
        $(dataElement).addClass("mobile-data");

        for(let obj of arr){
          const col = $('<div class="mobile-data-col"></div>');
          if( obj.type == 'image' ){
            $(col).addClass("image");
            const a = $('<a></a>');
            const img = $('<img></img>');
            $(a).attr("href",obj.href);
            $(img).attr("src",obj.src);
            $(a).append(img);
            $(col).append(a);
          }else{
            $(col).append('<div class="col-name"><strong>'+obj.col+'</strong></div>');
            $(col).append('<div class="col-value">'+obj.val+'</div>');
          }

          $(rowElement).append(col);
        }
        $(dataElement).html(rowElement);
        return  $(tempDiv).html(dataElement).html();
      },

      listCallback : function(data){
        const $this = this;

        comm.paging.emptyList(".noticeList");

        if( data.dto.pageNo == 1 && data.list.length == 0 ){
          $(".list_header").hide();
        }else{
          $(".list_header").show();
        }

        for (let i = 0; i < data.list.length; i++) {
          let obj = data.list[i];
          let trHtml = '';

          // let listNum = ((data.dto.pageNo - 1) * data.dto.listNo) + (i + 1);

          trHtml += '<td><input type="checkbox" class="check"></td>';
          trHtml += '<td>';
          trHtml += '    <a href="' + window.getNoticeViewUrl(obj.ID) + '" class="subject_link">'+obj['TITLE']+'</a>';
          trHtml += '</td>';
          trHtml += '<td>';
          trHtml += obj['REG_DATE'];
          trHtml += '</td>';

          trHtml += $this.getMobileRecord('td',[
            {col:"제목",val:('<a href="' + window.getNoticeViewUrl(obj.ID) + '" className="subject_link">'+obj['TITLE']+'</a>')},
            {col:"작성일",val:obj['REG_DATE']},
          ])

          trHtml = $($this.getTr()).html(trHtml);
          $(trHtml).data(obj);
          comm.paging.drawList(".noticeList", trHtml);
        }

        $this.initCheckBox($this);
      },

      getTr : function(){
        return $('<tr></tr>').clone(true);
      },
    },
  };
</script>