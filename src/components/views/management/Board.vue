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
              <table id="storyList"></table>
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
      categoryListStr: comm.category.getCategory(),
      boardObj:boardObj,
    }
  },

  mounted() {
    const $this = this;
    boardObj.init($this.categoryListStr);
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


