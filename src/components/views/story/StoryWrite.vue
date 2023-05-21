
<template>
  <form id="story_write_form">

    <input type="hidden"      name="id"                  id="id"                 :value="vo.ID" >
    <input type="hidden"      name="categoryId"          id="categoryId"                        >
    <input type="hidden"      name="memberCategoryId"    id="memberCategoryId"                  >
    <input type="hidden"      name="contents"            id="contents"                          >

    <div class="section uline2">
      <div class="ani-in manage_layout">

        <div class="manage_conts">

          <div class="story_tb">

            <table>
              <tbody>
              <tr>
                <th>카테고리</th>
                <td class="story_top">
                  <select id="story_category">
                    <option value="">카테고리</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>회원 카테고리</th>
                <td class="story_top">
                  <select id="story_category_member">
                    <option value="">카테고리</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>공개여부</th>
                <td class="story_top">
                  <select id="secretYn" name="secretYn">
                    <option value="N">공개</option>
                    <option value="Y">비공개</option>
                  </select>
                </td>
              </tr>
              <tr>
                <th>제목</th>
                <td><input type="text" name="title" id="title" placeholder="제목을 입력하세요" :value="vo['TITLE']"></td>
              </tr>
              <tr>
                <td colspan="2">
                  <div id="editor" class="editor" v-html="vo['CONTENTS']"></div>
                </td>
              </tr>
              <tr>
                <th class="non">태그</th>
                <td class="non"><input type="text" name="tags" id="tags" placeholder="태그를 입력하세요 (ex:태그1,태그2,태그3)" :value="vo['TAGS']"></td>
              </tr>
              <tr>
                <th class="non">첨부파일1</th>
                <td class="non story_thumbnailImg">
                  <label for="thumbnailImgPathParam" class="input-file-button">썸네일 이미지</label>
                  <input type="file" name="thumbnailImgPathParam" id="thumbnailImgPathParam" accept="image/gif, image/jpeg, image/png">
                  <input type="text" disabled name="thumbnailImgPathParam_text" id="thumbnailImgPathParam_text" placeholder="썸네일 이미지를 선택하세요" :value="vo['REAL_FILE_NAME']">
                </td>
              </tr>
              </tbody></table>

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

<script>
import $ from 'jquery';
import comm from "@/resources/task/js/common/comm.js";

const contents_obj = '#editor';
let quill;
let toolbarOptions = [
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
];

export default {
  data() {
    const $this = this;
    const vo = $this.getStoryInfo();
    const result = {
      category_list : JSON.parse(comm.category.getCategory()),
      category_list_member : JSON.parse(comm.category.getCategoryMemberPublic()),
      vo : {},
    };

    if( vo ){
      result['vo'] = vo;
      result['id'] = vo['ID'];
      result['categoryId'] = vo['CATEGORY_ID'];
      result['memberCategoryId'] = vo['MEMBER_CATEGORY_ID'];
    }

    return result;
  },

  mounted() {
    const $this = this;

    $this.initEdit($this);
    $this.setCategoryOptions($this);
    $this.valueSetting($this);
    $this.regEvents($this);

    if( $this.vo ){
      $("#story_category").val($this.vo['CATEGORY_ID']);
      $("#story_category").change();
      $("#story_category_member").val($this.vo['MEMBER_CATEGORY_ID']);
      $("#secretYn").val($this.vo['SECRET_YN'] || "N");
      $("#title").val($this.vo['TITLE']);
      $("#editor").val($this.vo['CONTENTS']);
      $("#tags").val($this.vo['TAGS']);
      $("#thumbnailImgPathParam_text").val($this.vo['REAL_FILE_NAME']);
    }
  },

  methods : {
    getStoryInfo: function () {
      const $this = this;
      let data = {};
      let path = $this.$route['fullPath'];
      let id = $this.$route['query'].id;

      comm.request({
        url: path + (id ? "?id=" + id : ""),
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

    insertStory: function($this){
      if($("#story_category").val() == ''){
        comm.message.alert("카테고리를 선택해주세요.");
        return;
      }

      if($("#title").val() == ''){
        comm.message.alert("제목을 입력해주세요.");
        return;
      }

      $("#categoryId").val($("#story_category").val());
      $("#memberCategoryId").val($("#story_category_member").val());
      $("#contents").val($(".ql-editor","#editor").html());

      comm.appendInput('#story_write_form', 'summary' ,String($(".ql-editor","#editor").text()).substring(0,200)  );

      var form = $('#story_write_form')[0]
      var formData = new FormData(form);

      comm.request({
        url: "/story/insert",
        data : formData,
        // headers : {"Content-type":"application/x-www-form-urlencoded"},
        processData : false,
        contentType : false,
      },function(res){
        // 성공
        if( res.code == '0000' ){
          comm.message.alert('스토리가 '+($this.id?'수정':'등록')+'되었습니다.', function(){
            location.href = window.getStoryViewUrl(res['storyId'], window.memberId);
          });
        }
      })
    },


    setCategoryOptions : function($this){
      $this.category_list.forEach(function(obj){
        let option = $("<option></option>");

        option.attr("value",obj['ID']);
        option.text(obj['CATEGORY_NM']);

        option.data(obj);
        $("#story_category").append(option);
      });
    },

    setCategoryMemberOptions : function($this, defaultCategoryId){
      $("#story_category_member").empty();
      $("#story_category_member").html("<option value=''>선택</option>")
      $this.category_list_member.forEach(function(obj){
        if( obj['DEFALUT_CATEG_ID'] != defaultCategoryId ){
          return;
        }

        let option = $("<option></option>");

        option.attr("value",obj['ID']);
        option.text(obj['CATEGORY_NM']);

        option.data(obj);
        $("#story_category_member").append(option);
      });
    },

    valueSetting : function($this){
      $("#story_category").val($this.categoryId);
    },

    initEdit : function(){
      $(contents_obj).css({"height":"400px","font-size":"15px"});
      quill = new window['Quill'](contents_obj, {

        modules: {
          //toolbar: '#toolbar-container',
          toolbar: toolbarOptions
        },

        theme: 'snow'
      });
      console.log(quill);
    },

    regEvents : function($this){
      $(".write_confirm").on("click",function(){
        $this.insertStory($this);
      });

      $(".write_cancel").on("click",function(){
        history.back();
      });

      $("#thumbnailImgPathParam").on("change",function(){
        $("#thumbnailImgPathParam_text").val(this.value);
      });

      $("#story_category").on("change",function(){
        $this.setCategoryMemberOptions($this,$(this).val());
      })
    },
  },
}
</script>

