
<template>
  <form id="notice_write_form">
    <input type="hidden" name="id" id="id" :value="vo.ID">
    <input type="hidden" name="contents" id="contents">

    <div class="section uline2">
      <div class="ani-in manage_layout">
        <div class="manage_conts">
          <div class="notice_tb">
            <table>
              <tbody>
              <tr>
                <th>공개여부</th>
                <td class="notice_top">
                  <select id="secretYn" name="secretYn">
                    <option value="N">공개</option>
                    <option value="Y">비공개</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>제목</th>
                <td><input type="text" name="title" id="title" placeholder="제목을 입력하세요" :value="vo.TITLE">
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <div id="editor" class="editor" v-html="vo['CONTENTS']"></div>
                </td>
              </tr>
              <tr>
                <th class="non">첨부파일1</th>
                <td class="non notice_thumbnailImg">
                  <label for="thumbnailImgPathParam" class="input-file-button">파일 첨부</label>
                  <input type="file" name="thumbnailImgPathParam" id="thumbnailImgPathParam"
                         accept="image/gif, image/jpeg, image/png">
                  <input type="text" disabled name="thumbnailImgPathParam_text"
                         id="thumbnailImgPathParam_text" placeholder="첨부파일을 선택하세요"
                         :value="vo.THUMBNAIL_IMG_PATH">
                </td>
              </tr>
              </tbody>
            </table>

          </div>

          <div class="not_btn">
            <a href="javascript:;" class="on write_confirm">작성완료</a>
            <a href="javascript:;" class="write_cancel">작성취소</a>
          </div>
        </div><!-------------//manage_conts------------->
      </div>
    </div>
  </form>
</template>

<!--<c:set var="vo" value="${view}"/>-->

<script>
import $ from 'jquery';
import comm from "@/resources/task/js/common/comm.js";

export default {
  data() {
    const $this = this;
    const vo = $this.getNoticeInfo() || {};

    return {
      vo : vo,
      id : vo.ID,
      contents_obj: '#editor',
      toolbarOptions : [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],

        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction

        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],

        ['clean']                                         // remove formatting button
      ],
      noticeInsertUrl : "/notice/insert",
    }
  },

  methods: {
    getNoticeInfo : function(){
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
          data = resp['view'];
        }
      })

      return data;
    },
  },
  mounted() {
    const $this = this;

    debugger;
    $(".write_confirm").on("click",function(){
      if($("#title").val() == ''){
        comm.message.alert("제목을 입력해주세요.");
        return;
      }

      $("#contents").val($(".ql-editor","#editor").html());

      comm.appendInput('#notice_write_form'    , 'summary' ,String($(".ql-editor","#editor").text()).substring(0,200)  );
      comm.appendInput('#notice_write_form'    , 'regId'   ,window.loginId  );
      comm.appendInput('#notice_write_form'    , 'uptId'   ,window.loginId  );

      var form = $('#notice_write_form')[0]
      var formData = new FormData(form);

      comm.request({
        url: $this.noticeInsertUrl,
        data : formData,
        // headers : {"Content-type":"application/x-www-form-urlencoded"},
        processData : false,
        contentType : false,
      },function(res){
        // 성공
        if( res.code == '0000' ){
          if ($this.id) {
            comm.message.alert('스토리가 수정되었습니다.', function () {
              location.href = window.managementNotice;
            });
          } else {
            comm.message.alert('공지가 등록되었습니다.', function () {
              location.href = window.managementNotice;
            });
          }
        }
      })
    });

    $(".write_cancel").on("click",function(){
      history.back();
    });

    $("#thumbnailImgPathParam").on("change",function(){
      $("#thumbnailImgPathParam_text").val(this.value);
    });

    $($this.contents_obj).css({"height":"400px","font-size":"14px"});
    new window['Quill']($this.contents_obj, {
      modules: {
        //toolbar: '#toolbar-container',
        toolbar: $this.toolbarOptions
      },

      theme: 'snow'
    });
  },

}
</script>



