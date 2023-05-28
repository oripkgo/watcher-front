<template>
  <commHeader/>
  <form id="commentForm" name="commentForm">
    <div class="section uline2">
      <div class="ani-in manage_layout">
        <div class="manage_conts">
          <commMenu/>
          <div class="manage_box_wrap">
            <div class="sub_title01">
              댓글 설정
              <div class="btn_tb_wrap">
                <div class="btn_tb">
                  <a href="javascript:;" class="on" v-on:click="settingObj.saveSettingInfo('#commentForm')">변경사항 저장</a>
                </div>
              </div>
            </div>

            <div class="review_write">
              <span>댓글 작성은</span>
              <select id="commentPermStatus" name="commentPermStatus">
                <option value="01">모두</option>
                <option value="02">작성자</option>
              </select>
              <span>가능합니다.</span>
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
import settingObj from "@/resources/task/js/business/management/setting";
import comm from "@/resources/task/js/common/comm";

  export default {
    name : "managementSetting",
    components: {
      commHeader,
      commMenu,
    },
    data(){
      const $this = this;
      return {
        settingObj : settingObj,
        managementInfo : $this.getManagementSetInfo($this),
      }
    },

    methods: {
      getManagementSetInfo : function($this){
        let path = $this.$route['fullPath'];
        let result = {};
        comm.request({url: path, method: "GET", async: false}, function (resp) {
          // 수정 성공
          if (resp.code == '0000') {
            result = JSON.parse(resp['managementInfo']);
          }
        })

        return result
      }
    },

    mounted() {
      const $this = this;
      $("#commentPermStatus").val($this.managementInfo['COMMENT_PERM_STATUS']);
    }
  }
</script>

