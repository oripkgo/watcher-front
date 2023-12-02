<template>
  <form id="noticeForm" name="noticeForm" method="get">
    <div class="section ani-in">
      <div class="layout_02">
        <div class="ani_y layout_sub title_box_02">
          <div class="sub_title_top"><p>Notice</p></div>
          <div class="sub_title_bottom">
            <p class="title_description">다양한 소식을 만나보세요.</p>
            <div class="search_box_02">
              <div class="search_group">
                <select id="search_id" name="search_id">
                  <option value="">선택</option>
                  <option value="01">제목</option>
                  <option value="02">내용</option>
                </select>
                <input type="text" id="searchKeyword" name="searchKeyword" placeholder="키워드 입력">
                <a href="javascript:;" id="search"><img src="@/resources/img/btn_search_b.png"></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="section ani-in">
      <div class="layout_02">
        <div class="ani_y layout_sub title_box_02">
          <div class="board_notice list line">
            <table>
              <colgroup>
                <col width="5%"/>
                <col width="50%"/>
                <col width="20%"/>
                <col width="15%"/>
                <col width="5%"/>
              </colgroup>

              <thead>
              <tr>
                <th scope="col">No.</th>
                <th scope="col">제목</th>
                <th scope="col">작성자</th>
                <th scope="col">작성일</th>
                <th scope="col">조회수</th>
              </tr>
              </thead>
              <tbody id="dataList"></tbody>
            </table>

            <div class="pagging_wrap"></div>
          </div>
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
    const $this = this;

    const data = $this.getNoticeInfo();
    const result = {
      noticeListUrl: data['noticeListUrl'],
      listNo: data['dto']['listNo'],
      pageNoRange: data['dto']['pagigRange'],
      searchMemId: null,
    }

    if (data['dto'] && data['dto']['searchMemId']) {
      result['searchMemId'] = data['dto']['searchMemId'];
    }

    return result;
  },

  mounted() {
    const $this = this;

    //스크롤 페이드인
    window.triggerJqueryFadeIn();

    $("#search").on("click", function () {
      $("#dataList").empty();
      $this.search($this);
    });

    $("#searchKeyword").on("keypress", function (e) {
      if (e.keyCode == 13) {
        $("#dataList").empty();
        $this.search($this);
        return false;
      }
    });

    $(".manage_btn").click(function () {
      $(".manage_menu").toggleClass("on");
    });

    $this.search($this);
  },

  methods: {
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
            noticeListUrl: resp['noticeListUrl'],
            dto: resp['dto'],
          };
        }
      })

      return data;

    },

    search: function ($this) {
      comm.paging.getList('#noticeForm', $this.noticeListUrl, $this.listCallback, 1, $this.listNo, $this.pageNoRange);
    },

    listCallback(data) {
      const $this = this;
      comm.paging.emptyList("#dataList", data.dto.pageNo);

      for (let i = 0; i < data.list.length; i++) {
        let obj = data.list[i];
        let listHtml = '';
        let listNum = ((data.dto.pageNo - 1) * data.dto.listNo) + (i + 1);

        listHtml += '<tr>                                                                               ';
        // listHtml += '    <td><input type="checkbox"></td>                                            ';
        listHtml += '    <td>' + listNum + '</td>                                                         ';
        listHtml += '    <td>                                                                           ';
        listHtml += '        <a href="' + window.getNoticeViewUrl(obj.ID, $this.searchMemId) + '" class="subject_link">' + obj.TITLE + '</a>';
        listHtml += '    </td>                                                                          ';
        listHtml += '    <td>' + obj.NICKNAME + '</td>';
        listHtml += '    <td>' + obj.REG_DATE.substring(2) + '</td>';
        listHtml += '    <td>' + obj.VIEW_CNT + '</td>';
        listHtml += '</tr>                                                                           ';
        listHtml = $(listHtml);

        $(listHtml).data(obj);

        comm.paging.drawList("#dataList", listHtml)
      }
    },
  },
}
</script>

