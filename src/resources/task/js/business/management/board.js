import $ from 'jquery';
import comm from "@/resources/task/js/common/comm.js";

const storyPublicUrl = '/management/board/storys/public';
const storyPrivateUrl = '/management/board/storys/private';
const storyDeleteUrl = '/management/board/storys';
const storyListUrl = '/management/board/storys';

let CATEGORY_LIST;
let thisObj;

const boardObj = {
    init : function(categoryList){
        CATEGORY_LIST = categoryList;
        thisObj = this;
    },

    goWritingPage : function(){
        window.location.href = window.getStoryWriteUrl();
    },

    confirmCheckBox : function(){
        return $(".check:checked:not('.all')").length == 0 ? false : true ;
    },

    changeCheckBoxOff : function(){
        $(".check:checked").prop("checked", false);
    },

    getSelCheckBoxObjs : function(){
        return $(".check:checked:not('.all')");
    },

    getStoryIds : function(){
        const checkObjs = thisObj.getSelCheckBoxObjs();
        const storyIds = [];

        checkObjs.each(function(idx,checkObj){
            const obj = $(checkObj).parents("tr").data();
            storyIds.push(obj.ID);
        })

        return storyIds;
    },

    updatePublic: function () {
        if (!thisObj.confirmCheckBox()) {
            comm.message.alert('스토리를 선택해주세요.');
            return;
        }

        comm.message.confirm("선택한 스토리를 공개하시겠습니까?", function (result) {
            if (result) {
                const param = JSON.stringify({paramJson: JSON.stringify(thisObj.getStoryIds())});
                comm.request({url: storyPublicUrl, method: "PUT", data: param}, function (resp) {
                    // 수정 성공
                    if (resp.code == '0000') {
                        $(thisObj.getSelCheckBoxObjs()).each(function (idx, checkObj) {
                            const trObj = $(checkObj).parents("tr");
                            $("td:eq(1)", trObj).text("공개");
                        })

                        thisObj.changeCheckBoxOff();
                    }
                })
            }
        })
    },

    updatePrivate: function () {
        if (!thisObj.confirmCheckBox()) {
            comm.message.alert('스토리를 선택해주세요.');
            return;
        }

        comm.message.confirm("선택한 스토리를 비공개하시겠습니까?", function (result) {
            if (result) {
                const param = JSON.stringify({paramJson: JSON.stringify(thisObj.getStoryIds())});
                comm.request({url: storyPrivateUrl, method: "PUT", data: param}, function (resp) {
                    // 수정 성공
                    if (resp.code == '0000') {
                        $(thisObj.getSelCheckBoxObjs()).each(function (idx, checkObj) {
                            const trObj = $(checkObj).parents("tr");
                            $("td:eq(1)", trObj).text("비공개");
                        })
                    }
                })
            }
        })
    },

    deleteStory: function () {
        if (!thisObj.confirmCheckBox()) {
            comm.message.alert('스토리를 선택해주세요.');
            return;
        }

        comm.message.confirm("선택한 스토리를 삭제하시겠습니까?", function (result) {
            if (result) {
                const param = JSON.stringify({paramJson: JSON.stringify(thisObj.getStoryIds())});
                comm.request({url: storyDeleteUrl, method: "DELETE", data: param}, function (resp) {
                    // 수정 성공
                    if (resp.code == '0000') {
                        $(thisObj.getSelCheckBoxObjs()).each(function (idx, checkObj) {
                            $(checkObj).parents("tr").remove();
                        })
                    }
                })
            }
        })
    },

    initCheckBox: function () {
        $(".check").on("click",function(){
            let $this = this;

            if( $($this).hasClass("all") ){
                if( $($this).is(":checked") ){
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

    initCategory: function (obj) {
        const selObj = obj || '#seachCategory';

        $(selObj).empty();
        $(selObj).append('<option value="">카테고리</option>')

        CATEGORY_LIST.forEach(function(obj){
            const id = obj['ID'];
            const nm = obj['CATEGORY_NM'];

            $(selObj).append('<option value="'+id+'">'+nm+'</option>')
        })
    },

    getTr: function () {
        return $('<tr></tr>').clone(true);
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

    listCallback: function (data) {
        comm.paging.emptyList("#storyList");

        if( data.dto.pageNo == 1 && data.list.length == 0 ){
            $(".list_header").hide();
        }else{
            $(".list_header").show();
        }

        for (let i = 0; i < data.list.length; i++) {
            let obj = data.list[i];
            let listHtml = '';
            // let listNum = ((data.vo.pageNo - 1) * data.vo.listNo) + (i + 1);
            let secretStatus = obj['SECRET_YN'] == 'Y' ? "비공개" : "공개";

            listHtml += '<td><input type="checkbox" class="check"></td>                                                         ';
            listHtml += '<td>'+secretStatus+'</td>                                                                              ';
            listHtml += '<td><a href="' + window.getStoryViewUrl(obj['ID'], obj['MEMBER_ID']) + '" class="kind_link">'+obj['CATEGORY_NM']+'</a></td>           ';
            listHtml += '<td><a href="' + window.getStoryViewUrl(obj['ID'], obj['MEMBER_ID']) + '" class="kind_link">'+(obj['MEMBER_CATEGORY_NM']||"")+'</a></td>           ';
            listHtml += '<td>                                                                                                   ';
            listHtml += '    <a href="' + window.getStoryViewUrl(obj['ID'], obj['MEMBER_ID']) + '" class="subject_link">                                    ';
            listHtml += '        <strong>'+obj['TITLE']+'</strong>                                                                 ';
            listHtml += '        <span>'+obj['SUMMARY']+'</span>                                                                   ';
            listHtml += '    </a>                                                                                               ';
            listHtml += '    <div class="story_key">                                                                            ';

            if( obj['TAGS'] ){
                let tag_arr = obj['TAGS'].split(',');

                tag_arr.forEach(function(tag){
                    listHtml += '        <a href="javascript:;">#'+tag.trim()+'</a>';
                })
            }

            listHtml += '    </div>                                                                                        ';
            listHtml += '    <div class="story_key">                                                                       ';
            listHtml += '        <span>'+comm.date.getPastDate(obj['REG_DATE'])+'</span>                                         ';
            listHtml += '        <span>공감 ' + obj['LIKE_CNT'] + '</span>                                                      ';
            listHtml += '        <span>댓글 ' + obj['COMMENT_CNT'] + '</span>                                                   ';
            listHtml += '    </div>                                                                                        ';
            listHtml += '</td>                                                                                             ';
            listHtml += '<td>                                                                                              ';
            listHtml += '    <a href="' + window.getStoryViewUrl(obj['ID'], obj['MEMBER_ID']) + '" class="pic_link">                                   ';

            if( obj['THUMBNAIL_IMG_PATH'] ){
                listHtml += '<img src="'+ window.getServerImg(obj['THUMBNAIL_IMG_PATH']) +'">';
            }else{
                listHtml += '<img src="">';
            }

            listHtml += '    </a>                                                                                               ';
            listHtml += '</td>                                                                                                  ';

            listHtml += boardObj.getMobileRecord("td", [
                {
                    type: "image",
                    href: window.getStoryViewUrl(obj['ID'], obj['MEMBER_ID']),
                    src: obj['THUMBNAIL_IMG_PATH']
                },
                {col: "공개여부", val: secretStatus},
                {col: "카테고리", val: obj['CATEGORY_NM']},
                {col: "회원 카테고리", val: (obj['MEMBER_CATEGORY_NM'] || "")},
                {col: "제목", val: obj['TITLE']},
                {col: "내용", val: obj['SUMMARY']},
                {col: "공감", val: obj['LIKE_CNT']},
                {col: "댓글", val: obj['COMMENT_CNT']},
                {col: "작성일", val: obj['REG_DATE']},
            ])

            listHtml = $(thisObj.getTr()).html(listHtml);
            $(listHtml).data(obj);
            comm.paging.drawList("#storyList", listHtml)
        }

        thisObj.initCheckBox();
    },

    search: function () {
        comm.paging.getList("#managementBoardForm", storyListUrl, thisObj.listCallback, 1, 10, 10);
    },
};

export default boardObj;
window['boardObj'] = boardObj;