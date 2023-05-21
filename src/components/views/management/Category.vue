<template>
  <form id="managementCategoryForm">
    <div class="section uline2">
      <div class="ani-in manage_layout">
        <div class="manage_conts">
          <commMenu/>
          <div class="manage_box_wrap">
            <div class="sub_title01">
              카테고리
              <div class="btn_tb_wrap">
                <div class="btn_tb">
                  <a href="javascript:;" v-on:click="categoryObj.insertCategory();">카테고리 추가</a>
                  <a href="javascript:;" v-on:click="categoryObj.deleteCategory();">카테고리 삭제</a>
                  <a href="javascript:;" v-on:click="categoryObj.saveCategory();">카테고리 저장</a>
                </div>
              </div>
            </div>

            <div class="category_wrap" id="fieldsObj">
              <div class="category_left">
                <a href="javascript:;" class="category_list">카테고리 목록</a>
              </div>

              <div class="category_right">
                <table>
                  <tr>
                    <th>카테고리명</th>
                    <td><input type="text" id="categoryNm" name="categoryNm" checkYn="Y" title="카테고리명"></td>
                  </tr>
                  <tr>
                    <th>주제</th>
                    <td>
                      <select id="defalutCategId" name="defalutCategId" class="categorySelect" checkYn="Y" title="카테고리 주제">
                        <option value="" selected>선택</option>
                      </select>
                    </td>
                  </tr>
                  <tr>
                    <th>공개여부</th>
                    <td>
                      <input type="radio" name="showYn" id="showYn01" value="Y" checked><label for="showYn01">공개</label>&nbsp;&nbsp;
                      <input type="radio" name="showYn" id="showYn02" value="N"><label for="showYn02">비공개</label>
                    </td>
                  </tr>
                  <tr>
                    <th>카테고리 소개</th>
                    <td><textarea id="categoryComents" name="categoryComents"></textarea></td>
                  </tr>
                </table>
              </div>
            </div>
          </div><!-------------//manage_box_wrap------------->
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import categoryObj from "@/resources/task/js/business/management/category";
import comm from "@/resources/task/js/common/comm";
import commMenu from "@/components/views/management/include/CommMenu";

export default {
  name : "managementCategory",

  components: {
    commMenu,
  },

  data(){
    return {
      categoryObj : categoryObj,
      category_list : JSON.parse(comm.category.getCategory()),
      member_category_list : JSON.parse(comm.category.getCategoryMember()),
    }
  },
  mounted() {
    const $this = this;
    categoryObj.init($this.category_list, $this.member_category_list);
  }
}
</script>


