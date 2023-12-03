import $ from 'jquery';
import comm from "@/resources/task/js/common/comm.js";

const categoryInsertUrl = "/management/category";
const categListSpaceNm = "category_left";
const categoryMemberListIdNm = "categoryMemberList";
const categListNm = "category_1st";
const categSelectNm = "categorySelect";
const formId = '#managementCategoryForm';

let CATEGORY_LIST;
let MEMBER_CATEGORY_LIST;
let thisObj;
const categoryObj = {
    init : function(categoryList, memberCategoryList){
        CATEGORY_LIST = categoryList;
        MEMBER_CATEGORY_LIST = memberCategoryList;
        thisObj = this;

        thisObj.initCategory();
        thisObj.initFields();
    },

    getCategoryTagObj : function(){
        return $('<a href="javascript:;" class="'+categListNm+'"></a>');
    },

    getSelectCategoryOptionObj : function(){
        return $('<option></option>');
    },

    setCategorySelectElement : function(){
        CATEGORY_LIST.forEach(function(obj){
            const option = thisObj.getSelectCategoryOptionObj();

            $(option).text(obj.CATEGORY_NM);
            $(option).attr("value", obj.ID);

            $(option).data(obj);
            $("." + categSelectNm).append(option);
        })
    },

    setCategoryMemberList : function(){
        MEMBER_CATEGORY_LIST.forEach(function(obj){
            let category = thisObj.getCategoryTagObj();
            $(category).text(obj.CATEGORY_NM);
            $(category).attr("id", "mem_category_"+obj.ID);
            $(category).data(Object.assign({},obj));
            $("." + categListSpaceNm).append(category);

            let categoryOption = thisObj.getSelectCategoryOptionObj();
            $(categoryOption).text(obj.CATEGORY_NM);
            $(categoryOption).attr("value", obj.ID);
            $("#" + categoryMemberListIdNm).append(categoryOption);
        })
    },

    makeEventClick : function(target, callback){
        $(target).off("click").on("click", callback)
    },

    setCategoryInfoInField : function(data){
        $("#categoryNm").val(data.CATEGORY_NM);
        $("#categoryComents").val(data.CATEGORY_COMENTS);
        $("#defalutCategId").val(data.DEFALUT_CATEG_ID);
        $("[name='showYn'][value='"+(data.SHOW_YN || "Y")+"']").prop("checked",true);
    },

    applyCategoryMemberSelectEvents : function(){
        const thisObj = this;
        $("#" + categoryMemberListIdNm).on("change", function(){
            if( $("option:selected",this).val() == "" ){
                if( thisObj.checkCategorySelect() ){
                    return;
                }

                thisObj.disableFields();
                return;
            }

            $("#mem_category_"+$(this).val()).click();

            // const thisData = $("option:selected",this).data();
            // thisObj.enableFields();
            // thisObj.setCategoryInfoInField(thisData);
        })
    },

    checkCategorySelect : function(){
        if ($("." + categListNm+".on", "." + categListSpaceNm).length > 0) {
            const result = comm.validation(formId);
            if( result.checkVal ){
                comm.message.alert(result.message, function(){
                    $(result.failTarget).focus();
                    let categorySelectEleId = $("." + categListNm+".on", "." + categListSpaceNm).attr("id").replace("mem_category_","");
                    $("#"+categoryMemberListIdNm).val(categorySelectEleId);
                })

                return true;
            }
        }

        return false;
    },

    applyCategoryMemberListEvents : function(){
        const thisObj = this;
        $("." + categListNm, "." + categListSpaceNm).off("click").on("click", function(){
            if( thisObj.checkCategorySelect() ){
                return;
            }

            const thisData = $(this).data();
            thisObj.enableFields();
            thisObj.setCategoryInfoInField(thisData);

            $("." + categListNm, "." + categListSpaceNm).removeClass("on");
            $(this).addClass("on");
        })
    },

    initCategory : function(){
        thisObj.setCategorySelectElement();
        thisObj.setCategoryMemberList();
        thisObj.applyCategoryMemberListEvents();
        thisObj.applyCategoryMemberSelectEvents();
    },

    applyEventCategoryInfoFields : function(){
        $("#categoryNm").on("keyup", function () {
            $("." + categListNm+".on", "." + categListSpaceNm).text($(this).val());
            $("#" + categoryMemberListIdNm).find("option:selected").text($(this).val())
        })

        $("select, input, textarea", "#fieldsObj").on("blur", function () {
            let category_nm = $("#categoryNm").val();
            let category_coments = $("#categoryComents").val();
            let defalut_categ_id = $("#defalutCategId").val();
            let show_yn = $("[name='showYn']:checked").val();

            if( $("." + categListNm+".on", "." + categListSpaceNm).length == 0 ){
                return;
            }

            const data = $("." + categListNm+".on", "." + categListSpaceNm).data();
            data.CATEGORY_NM = category_nm;
            data.CATEGORY_COMENTS = category_coments;
            data.DEFALUT_CATEG_ID = defalut_categ_id;
            data.SHOW_YN = show_yn;

            $("." + categListNm+".on", "." + categListSpaceNm).data(data);
        })
    },

    initFields : function(){
        thisObj.disableFields();
        thisObj.applyEventCategoryInfoFields();
    },

    disableFields : function(){
        $("#categoryComents, #categoryNm, #defalutCategId", "#fieldsObj").val("");
        $("[name='showYn'][value='Y']").prop("checked",true);
        $("select, input, textarea", "#fieldsObj").not(".not_disabled").prop("disabled", true);
        $(".category_1st.on").removeClass("on");
        $("#"+categoryMemberListIdNm).val("");
    },

    enableFields : function(){
        $("select, input, textarea", "#fieldsObj").not(".not_disabled").prop("disabled", false);
    },

    insertCategory : function(){
        if ($("." + categListNm+".on", "." + categListSpaceNm).length > 0) {
            const result = comm.validation(formId);
            if( result.checkVal ){
                comm.message.alert(result.message, function(){
                    $(result.failTarget).focus();
                })

                return;
            }
        }

        let obj = thisObj.getCategoryTagObj();

        const tagId = comm.generateUUID();
        $(obj).attr("id", "mem_category_"+tagId);
        $(obj).data()['TAG_ID'] = "mem_category_"+tagId;
        $(obj).data()['DELETE_YN'] = "N";
        $("#fieldsObj .category_left").append(obj)
        thisObj.applyCategoryMemberListEvents();
        $(obj).click();

        let categoryOption = thisObj.getSelectCategoryOptionObj();
        $(categoryOption).attr("value", tagId);
        $("#" + categoryMemberListIdNm).append(categoryOption);
        $("#" + categoryMemberListIdNm).val(tagId);

        $("#categoryNm").focus();
    },

    deleteCategory : function(){
        if( $("." + categListNm+".on", "." + categListSpaceNm).length <= 0 ){
            comm.message.alert("선택된 카테고리가 없습니다.");
            return;
        }

        if( $('.category_1st').length == 1 ){
            comm.message.alert("카테고리 더이상 삭제할수 없습니다.");
            return;
        }

        comm.message.confirm("선택한 카테고리를 삭제하시겠습니까?",function(result){
            if( result ){
                const target = $("." + categListNm+".on", "." + categListSpaceNm);

                if( !$(target).data()['ID'] ){
                    $(target).remove();
                }else{
                    $(target).data()["DELETE_YN"] = "Y";
                    $(target).hide();
                }

                $("#"+categoryMemberListIdNm).find("[value='"+$(target).data()['ID']+"']").remove();
                thisObj.disableFields();
            }
        });
    },

    getIdx : function(obj){
        return $("#fieldsObj .category_left").find(".category_1st").index(obj);
    },

    setIdToNewCategory : function(newIds){
        const ids = newIds;
        const ids_keys = Object.keys(ids);

        for (let i = 0; i < ids_keys.length; i++) {
            const key = ids_keys[i];
            const val = ids[ ids_keys[i] ];
            $("#"+key).data()["ID"] = val;
        }
    },

    saveCategory : function(){
        if( thisObj.isCategoryListCheck() ){
            return;
        }

        comm.message.confirm("카테고리를 저장하시겠습니까?",function(result){
            if( result ){
                let jsonArr = [];

                $("." + categListNm, "." + categListSpaceNm).each(function(){
                    const categObj = $(this).data();
                    jsonArr.push(categObj);
                })

                let param = {};
                param.paramJson = JSON.stringify(jsonArr);

                comm.request({url: categoryInsertUrl , method : "POST", data : JSON.stringify(param)},function(resp){
                    // 수정 성공
                    if( resp.code == '0000'){
                        thisObj.setIdToNewCategory(JSON.parse(resp['insertIds']));

                        comm.message.alert("카테고리가 저장되었습니다.", function(){
                            thisObj.disableFields();
                        });
                    }
                })
            }
        });
    },

    isCategoryListCheck : function(){
        let checkVal = false;
        $('.category_1st').each(function(){
            const clickTargetObj = $(this);
            const data = $(clickTargetObj).data();

            if( checkVal )
                return;

            if( (!data['CATEGORY_NM']) || !(data['DEFALUT_CATEG_ID']) ){
                checkVal = true;

                $("." + categListNm, "." + categListSpaceNm).removeClass("on")
                $(clickTargetObj).addClass("on");
                thisObj.setCategoryInfoInField($("." + categListNm+".on", "." + categListSpaceNm).data());

                if( !(data['CATEGORY_NM']) ){
                    comm.message.alert("카테고리 이름을 입력해주세요.");
                    $("#categoryNm").focus();
                    return;
                }

                if( !(data['DEFALUT_CATEG_ID']) ){
                    comm.message.alert("카테고리 주제를 선택해주세요.");
                    $("#defalutCategId").focus();
                    return;
                }
            }
        })

        return checkVal;
    },
};

export default categoryObj;