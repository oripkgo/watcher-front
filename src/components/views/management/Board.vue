<template>
  <commHeader/>
  <form id="managementBoardForm">
    <div class="section uline2">
      <div class="ani-in manage_layout">

        <div class="manage_conts">
          <commMenu/>
          <div class="manage_box_wrap">
            <div class="sub_title01">
              게시글 관리
              <div class="search_right_box">
                <select id="seachCategory" name="search_category_id"></select>
                <input type="text" placeholder="" name="search_keyword" id="search_keyword">
                <a href="javascript:;" id="search"></a>
              </div>
            </div>

            <div class="board_basic">
              <table>
                <tbody>
                  <th><input type="checkbox" class="check all"></th>
                  <th>공개여부</th>
                  <th>카테고리</th>
                  <th>회원 <br>카테고리</th>
                  <th colspan="2">
                    <div class="btn_tb">
                      <a href="javascript:;" onclick="boardObj.deleteStory();">삭제</a>
                      <a href="javascript:;" onclick="boardObj.updatePublic();">공개</a>
                      <a href="javascript:;" onclick="boardObj.updatePrivate();">비공개</a>
                      <a href="javascript:;" onclick="boardObj.goWritingPage();">글쓰기</a>
                    </div>
                  </th>
                </tbody>
                <tbody id="storyList"></tbody>
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
import $ from 'jquery';
import boardObj from "@/resources/task/js/business/management/board";
import comm from "@/resources/task/js/common/comm";

export default {
  name: "managementBoard",

  components: {
    commHeader,
    commMenu,
  },

  data() {
    return {
      categoryList: comm.category.get(),
      boardObj:boardObj,
    }
  },

  mounted() {
    //스크롤 페이드인
    window.triggerJqueryFadeIn();

    const $this = this;
    boardObj.init($this.categoryList);
    boardObj.initCategory();
    boardObj.search();

    $("#search").on("click", function () {
      boardObj.search();
    });

    $("#search_keyword").on("keypress", function (e) {
      if (e.keyCode == 13) {
        boardObj.search();
        return false;
      }
    });
  }
}
</script>


