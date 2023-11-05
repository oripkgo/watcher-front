import request from "@/resources/task/js/common/utils/request";
import comm from "@/resources/task/js/common/comm";
import $ from "jquery";

const boardViewInitApiUrl = '/board/view/init';
const boardlikeModifyApiUrl = '/board/like/modify';
const commentListApiUrl = '/board/comment/select';
const likeYImgUrl = require("@/resources/img/icon_heart_on.png");
const likeNImgUrl = require("@/resources/img/zim_ico.png");


const getBoardInitDefaultData = function (id, type) {
    let result = {};
    request.send(boardViewInitApiUrl, "GET", {
        "contentsId": id,
        "contentsType": type,
    }, function (resp) {
        result = resp;
    }, null, null, false)

    return result
}

const updateBoardLike = function (contentsId, contentsType, likeId, likeYn) {
    let result = {};
    let param = {};

    if (contentsId) {
        param.contentsId = contentsId;
    }

    if (contentsType) {
        param.contentsType = contentsType;
    }

    if (likeId) {
        param.likeId = likeId;
    }

    if (likeYn) {
        param.likeYn = likeYn;
    }

    request.send(boardlikeModifyApiUrl, "POST", param, function (resp) {
        result = resp;
    }, null, {'Content-type': "application/json"}, false);

    return result;
}


const boardView = {
    init: function (id, type) {
        this.viewInitResult = getBoardInitDefaultData(id, type);

        this.tag.init(id, type, this.viewInitResult);
        this.like.init(id, type, this.viewInitResult);
        this.comment.init(id, type, this.viewInitResult);
    },

    tag: {
        init: function (id, type, viewInitData) {
            this.id = id;
            this.type = type;
            this.viewInitResult = viewInitData;
        },

        render: function (tagId) {
            let result = "<strong class=\"conts_tit\">태그</strong>";
            let targetElement = document.getElementById(tagId);

            let tags = this.viewInitResult['tags'] || this.viewInitResult['TAGS'];

            if (!tags) {
                targetElement.style.display = 'none';
                return;
            }

            let tags_arr = tags.split(",");

            for (let i = 0; i < tags_arr.length; i++) {
                result += '<a href="javascript:;">#' + tags_arr[i] + '</a>';
            }

            targetElement.innerHTML = result;
            targetElement.style.display = 'block';
        },
    },
    like: {
        init: function (id, type, viewInitData) {
            this.id = id;
            this.type = type;
            this.viewInitResult = viewInitData;
        },

        setLikeElementDataSet: function (targetObj, data) {
            if (data.id) {
                targetObj.dataset['contentsId'] = data.id;
            }
            if (data.type) {
                targetObj.dataset['contentsType'] = data.type;
            }
            if (data.viewInitResult['LIKE_ID']) {
                targetObj.dataset['likeId'] = data.viewInitResult['LIKE_ID'];
            }
            if (data.viewInitResult['LIKE_YN']) {
                targetObj.dataset['likeYn'] = data.viewInitResult['LIKE_YN'];
            }
        },

        changeLikeElementDataSet: function (targetObj, likeYn, likeId) {
            if (likeYn == 'Y') {
                let likecnt = (targetObj.dataset['likecnt'] * 1) + 1;
                targetObj.innerText = ('공감 ' + likecnt);
                targetObj.dataset['likecnt'] = likecnt;

                targetObj.dataset['likeId'] = likeId;
                targetObj.dataset['likeYn'] = 'Y';

            } else {
                let likecnt = (targetObj.dataset['likecnt'] * 1) - 1

                if (likecnt < 0) {
                    likecnt = 0;
                }

                targetObj.innerText = ('공감 ' + likecnt);
                targetObj.dataset['likecnt'] = likecnt;
                delete targetObj.dataset['likeId'];
            }

        },

        changeTheLikeImageWithLikeYnValue: function (targetObj, likeYn) {
            if (likeYn == 'N') {
                targetObj.style.background = "url('" + likeNImgUrl + "') no-repeat left center";
            } else {
                targetObj.style.background = "url('" + likeYImgUrl + "') no-repeat left center";
            }
        },

        render: function (tagId, callbackNotLogin) {
            const likeThis = this;
            let targetElement = document.getElementById(tagId);

            likeThis.setLikeElementDataSet(targetElement, likeThis);

            likeThis.changeTheLikeImageWithLikeYnValue(targetElement, likeThis.viewInitResult['LIKE_YN']);

            targetElement.addEventListener("click", function () {
                // const $this = this;
                const data = targetElement.dataset;

                if (likeThis.viewInitResult['loginYn'] == 'Y') {
                    const resp = updateBoardLike(data.contentsId, data.contentsType, data.likeId, data.likeYn);

                    targetElement.dataset['likeYn'] = (targetElement.dataset['likeYn'] == 'Y' ? 'N' : 'Y');

                    likeThis.changeLikeElementDataSet(targetElement, targetElement.dataset['likeYn'], resp['like_id']);
                    likeThis.changeTheLikeImageWithLikeYnValue(targetElement, targetElement.dataset['likeYn']);
                } else {
                    console.log('비로그인 상태에서 좋아요 클릭');
                    if (callbackNotLogin) {
                        callbackNotLogin();
                    }
                }
            });
        },
    },
    comment: {
        init: function (id, type, viewInitData) {
            this.deleteMsg = "해당 댓글을 삭제하시겠습니까?";
            this.id = id;
            this.type = type;
            this.viewInitResult = viewInitData;
        },

        getRegId : {},

        getComentLi : function(){
            let comment_li = '';

            comment_li += '<li>';
            comment_li += '    <div class="member_re"><img class="profile" src="'+require("@/resources/img/member_ico.png")+'"></div>';
            comment_li += '    <div class="review_info">';
            comment_li += '        <em class="writer"></em>';
            comment_li += '        <img src="'+require("@/resources/img/line.png")+'">';
            comment_li += '            <span class="writer_time"></span>';
            comment_li += '            <img src="'+require("@/resources/img/line.png")+'" class="declaration_line">';
            comment_li += '                <span class="accuse declaration">신고</span>';
            comment_li += '            <img src="'+require("@/resources/img/line.png")+'" class="update_line">';
            comment_li += '                 <span class="accuse update">수정</span>';
            comment_li += '            <img src="'+require("@/resources/img/line.png")+'" class="delete_line">';
            comment_li += '                 <span class="accuse delete">삭제</span>';
            comment_li += '                <strong class="contents"></strong>';
            comment_li += '                <div class="write_wrap" style="display: none;">';
            comment_li += '                     <textarea placeholder="입력" name="coment_modify"></textarea><a href="javascript:;" id="coment_modify">확인</a></div>';
            comment_li += '                </div>';
            // comment_li += '                <a href="javascript:;" class="see_replies">답글보기</a>';
            // comment_li += '                <a href="javascript:;" class="Write_a_reply">답글달기</a>';
            comment_li += '    </div>';
            comment_li += '</li>';

            return comment_li;
        },

        getComment : function(commentInputObj){
            return  $(commentInputObj).val().replace(/[\n]/g,'<br>');
        },

        crud : function(commentObj){
            const commentThis = this;
            $(commentObj).find(".declaration, .update, .delete").on("click",function(obj){
                // 댓글 이벤트
                const target = obj.currentTarget;
                const targetData = $(target).parents("li").data();
                const comment_id = targetData.id || targetData.ID;
                const reg_id = commentThis.getRegId[comment_id];
                const param = {
                    commentId : comment_id,
                    regId : reg_id,
                };

                if( $(target).hasClass('declaration') ){
                    // 댓글 신고
                    alert('댓글 신고');

                }else if( $(target).hasClass('update') ){
                    // 댓글 수정
                    if( $(target).hasClass("ing") ){
                        $(target).removeClass("ing");

                        let parent = $(target).parents("li");
                        $('.review_info .write_wrap', parent).find("textarea").val($('.review_info .contents', parent).text());
                        $('.review_info .write_wrap', parent).hide();
                        $('.review_info .contents', parent).show();

                        $(target).text("수정");
                    }else{
                        $(target).addClass("ing");

                        let parent = $(target).parents("li");
                        $('.review_info .write_wrap', parent).show();
                        $('.review_info .contents', parent).hide();

                        $(target).text("수정 취소");

                        $('.review_info #coment_modify', parent).off("click").on("click", function(){
                            // write_wrap" style="display: none;">';
                            // comment_li += '                     <textarea placeholder="입력" name="coment_modify"
                            const thisObj = $(this);
                            const comment = commentThis.getComment($($(thisObj).parents('.write_wrap')).find("textarea"));
                            param.coment = comment;
                            comm.request({url:"/board/comment/update", data : JSON.stringify(param)},function(resp){
                                // 수정 성공
                                if( resp.code == '0000'){
                                    const review_info = $(thisObj).parents(".review_info");

                                    $(".contents", review_info).html(comment);

                                    $(target).removeClass("ing");
                                    $('.write_wrap', review_info).hide();
                                    $('.contents', review_info).show();

                                    $(target).text("수정");
                                }
                            })
                        });
                    }
                }else if( $(target).hasClass('delete') ){
                    // 댓글 삭제
                    comm.message.confirm(commentThis.deleteMsg,function(Yn){
                        if( Yn ){
                            comm.request({url:"/board/comment/delete", data : JSON.stringify(param)},function(resp){
                                // 삭제 성공
                                if( resp.code == '0000'){
                                    $(target).parents("li").remove();

                                    let cmtCnt = $('.comment_cnt').data("cnt")*1;

                                    if( cmtCnt > 0 ){
                                        cmtCnt = cmtCnt-1;
                                    }

                                    $('.comment_cnt').data('cnt',cmtCnt);
                                    $('.comment_cnt').html('댓글<em>'+cmtCnt+'</em>');
                                }
                            })
                        }
                    });
                }
            })
        },
        setting: function(contents_type, contents_id, target, cnt, list, login_yn){
            const $this = this;
            let $conts_review = $('<div class="conts_review" id="conts_review"></div>');

            $($conts_review).html('<strong class="conts_tit comment_cnt" data-cnt="'+cnt+'">댓글<em>'+cnt+'</em></strong>');

            if( login_yn == 'N' ){
                $($conts_review).append('<div class="write_wrap"><textarea placeholder="로그인하고 댓글을 입력해보세요!"></textarea><a href="javascript:;">확인</a></div>');

                $($conts_review).find('.write_wrap').on("focus click", function(){

                    comm.loginObj.popup.open();
                });
            }else{
                $($conts_review).append('<div class="write_wrap"><textarea placeholder="댓글 입력" name="coment"></textarea><a href="javascript:;" id="coment_insert">확인</a></div>');

                // 댓글 등록
                $($conts_review).find('#coment_insert').on("click", function(){
                    let comment_insert_param = {
                        "contentsType":contents_type,
                        "contentsId":contents_id,
                        "refContentsId":"0",

                    };

                    // comm.message.confirm(
                    //     '댓글을 등록하시겠습니까?'
                    // )

                    comment_insert_param.coment = $this.getComment($(target).find("[name='coment']"));
                    comm.request({url:"/board/comment/insert",data:JSON.stringify(comment_insert_param)},function(resp){
                        let profile_img = "/resources/img/member_ico.png";

                        if( resp.comment['profile'] ){
                            profile_img = resp.comment['profile'];
                        }

                        // 등록성공
                        if( resp.code == '0000'){
                            let comment_obj = $($this.getComentLi());

                            $(".profile"                , comment_obj).attr("src",profile_img);
                            $(".writer"                 , comment_obj).html(resp.comment['nickName']);
                            $(".writer_time"            , comment_obj).html("방금");
                            $(".contents"               , comment_obj).html(resp.comment['coment']);
                            $("[name='coment_modify']"  , comment_obj).val(resp.comment['coment']);
                            //$(".write_wrap"  , comment_obj).show();

                            $this.getRegId[String(resp.comment.id)] = resp.comment.regId;

                            $(comment_obj).data(resp.comment);

                            $(".declaration_line", comment_obj ).hide();
                            $(".declaration"     , comment_obj ).hide();
                            $(".update_line"     , comment_obj ).hide();
                            $(".update"          , comment_obj ).hide();
                            $(".delete_line"     , comment_obj ).hide();
                            $(".delete"          , comment_obj ).hide();

                            if( window.loginId == resp.comment.regId ){
                                $(".update_line"     , comment_obj ).show();
                                $(".update"          , comment_obj ).show();
                                $(".delete_line"     , comment_obj ).show();
                                $(".delete"          , comment_obj ).show();

                            }else{
                                $(".declaration_line", comment_obj ).show();
                                $(".declaration"     , comment_obj ).show();
                            }

                            $this.crud(comment_obj);

                            $(target).find(".reviewList","#conts_review").prepend(comment_obj);
                            $("[name='coment']",target).val('');

                            let cnt = ( ($('.comment_cnt').data('cnt') || 0) * 1 )+1;

                            $('.comment_cnt').data('cnt',cnt);
                            $('.comment_cnt').html('댓글<em>'+cnt+'</em>');
                        }
                    })
                });
            }

            $($conts_review).append('<ul class="reviewList"></ul>');

            if( list && list.length > 0 ){
                for(let i=0;i<list.length;i++){
                    let listObj = list[i];
                    let comment_obj = $($this.getComentLi());

                    let profile_img_arr = "/resources/img/member_ico.png";

                    if( listObj['MEM_PROFILE_IMG'] ){
                        profile_img_arr = listObj['MEM_PROFILE_IMG'];
                    }

                    $(".profile"    , comment_obj).attr("src",profile_img_arr);
                    $(".writer"     , comment_obj).html(listObj['NICKNAME']);
                    $(".writer_time", comment_obj).html(comm.date.getPastDate( listObj['REG_DATE'] ));
                    $(".contents"   , comment_obj).html((listObj['COMENT']?listObj['COMENT']:""));
                    $("[name='coment_modify']"  , comment_obj).val((listObj['COMENT']?listObj['COMENT']:""));
                    //$(".write_wrap"  , comment_obj).show();

                    $this.getRegId[String(listObj.ID)] = listObj.REG_ID;

                    $(comment_obj).data(listObj);

                    $(".declaration_line", comment_obj ).hide();
                    $(".declaration"     , comment_obj ).hide();
                    $(".update_line"     , comment_obj ).hide();
                    $(".update"          , comment_obj ).hide();
                    $(".delete_line"     , comment_obj ).hide();
                    $(".delete"          , comment_obj ).hide();

                    if( window.loginId == listObj.REG_ID ){
                        $(".update_line"     , comment_obj ).show();
                        $(".update"          , comment_obj ).show();
                        $(".delete_line"     , comment_obj ).show();
                        $(".delete"          , comment_obj ).show();
                    }else{
                        $(".declaration_line", comment_obj ).show();
                        $(".declaration"     , comment_obj ).show();
                    }

                    $('.reviewList', $conts_review).append(comment_obj);
                }
            }

            // 댓글 삭제, 신고, 수정 처리
            $this.crud($('.reviewList', $conts_review));

            $(target).replaceWith($conts_review);

            if( list && list.length > 0 ){
                $(target).append('<div class="pagging_wrap"></div>');
            }
        },

        render: function (tagId, commentForm, commentListPaginFunc) {
            let commentThis = this;

            if( tagId.substring(0,1) !== '#' ){
                tagId = '#' + tagId;
            }

            let inputContentsId = document.createElement('input');
            inputContentsId.type = 'hidden';
            inputContentsId.name = 'contentsId';
            inputContentsId.value = commentThis.id;


            let inputContentsType = document.createElement('input');
            inputContentsType.type = 'hidden';
            inputContentsType.name = 'contentsType';
            inputContentsType.value = commentThis.type;

            commentForm.appendChild(inputContentsId);
            commentForm.appendChild(inputContentsType);

            commentListPaginFunc(commentForm, commentListApiUrl, function (resp) {
                commentThis.setting(
                    commentThis.type,
                    commentThis.id,
                    tagId,
                    resp.comment['cnt'],
                    resp.comment['list'],
                    commentThis.viewInitResult['loginYn']
                );
            });
        },
    },
}


export default boardView;