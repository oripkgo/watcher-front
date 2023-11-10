import $ from 'jquery';
import "./globalVar"
import CATEGORY from "@/resources/task/js/common/utils/category"
import DATE from "@/resources/task/js/common/utils/date"
import MESSAGE from "@/resources/task/js/common/utils/message"
import REQUEST from "@/resources/task/js/common/utils/request"
import AVAILABILITY from "@/resources/task/js/common/utils/availability"

import BOARD_COMMENT from "@/resources/task/js/common/utils/boardComment"
import BOARD_LIKE from "@/resources/task/js/common/utils/boardLike"
import BOARD_TAGS from "@/resources/task/js/common/utils/boardTags"

import PAGING from "@/resources/task/js/common/utils/paging"

let comm = function(){
    const kakaoKey = '16039b88287b9f46f214f7449158dfde';
    const comment_delete_msg = "해당 댓글을 삭제하시겠습니까?";
    const requiresLoginpageUrls = ['/management'];

    const privateObj = {
        comment : {
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
            getComment : function(commentObj){
                return  $(commentObj).val().replace(/[\n]/g,'<br>');
            },
            crud : function(commentObj){
                $(commentObj).find(".declaration, .update, .delete").on("click",function(obj){
                    // 댓글 이벤트
                    const target = obj.currentTarget;
                    const targetData = $(target).parents("li").data();
                    const comment_id = targetData.id || targetData.ID;
                    const reg_id = privateObj.comment.getRegId[comment_id];
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
                                const comment = privateObj.comment.getComment($($(thisObj).parents('.write_wrap')).find("textarea"));
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
                        comm.message.confirm(comment_delete_msg,function(Yn){
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

                        comment_insert_param.coment = privateObj.comment.getComment($(target).find("[name='coment']"));
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

                                privateObj.comment.getRegId[String(resp.comment.id)] = resp.comment.regId;

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

                                privateObj.comment.crud(comment_obj);

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
                        let comment_obj = $(this.getComentLi());

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

                        privateObj.comment.getRegId[String(listObj.ID)] = listObj.REG_ID;

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
                privateObj.comment.crud($('.reviewList', $conts_review));

                $(target).replaceWith($conts_review);

                if( list && list.length > 0 ){
                    $(target).append('<div class="pagging_wrap"></div>');
                }
            },
        },
    };

    const publicObj = {
        category : CATEGORY,
        date : DATE,
        message: MESSAGE,
        paging : PAGING,
        validation : function(target){
            const result = AVAILABILITY.check(target);

            comm.message.alert(result.message);
            $(result.failTarget).focus();

            return result.checkVal;
        },

        boardView : {
            init : function(id, type){
                const notLoginCallback = function(){
                    comm.message.confirm("해당 콘텐츠가 마음에 드시나요? 로그인 후 의견을 알려주세요.\n\n로그인 하시겠습니까?", function(Yn){
                        if( Yn ){
                            comm.loginObj.popup.open();
                        }
                    });
                }

                const confirmDeleteMsg = function(callback){
                    comm.message.confirm("댓글을 삭제하시겠습니까?",callback);
                }

                this.loginYn = window.loginYn?"Y":"N";
                this.tagObj = BOARD_TAGS;
                this.likeObj = BOARD_LIKE;
                this.commentObj = BOARD_COMMENT;

                this.tagObj.init(id, type);
                this.likeObj.init(id, type, this.loginYn, notLoginCallback);
                this.commentObj.init(id, type, this.loginYn, notLoginCallback, confirmDeleteMsg);
            },
            renderTag : function(tagId){
                this.tagObj.render(tagId);
            },
            renderLike : function(tagId){
                this.likeObj.render(tagId);
            },
            renderComment: function (tagId) {
                this.commentObj.render(tagId, comm.paging.getList);
            },
        },

        loginObj : {
            init : function(type){
                this.popup.init();

                this.loginProcessEvent(type);
                window['login_success_callback'] = this.login_success_callback;
            },

            getLoginProcessEventHtml : function(){
                let loginProcessEventHtml = '';

                loginProcessEventHtml += '<div class="member_app logOut" style="display: none;">';
                loginProcessEventHtml += '    <a href="/myStory/'+window.memberId+'" id="myStory">내 스토리</a>';
                loginProcessEventHtml += '    <a href="/management/main" id="management">관리</a>';
                loginProcessEventHtml += '    <a href="'+window.storyUrlWrite+'" id="writing">글쓰기</a>';
                loginProcessEventHtml += '    <a href="javascript:;" id="logout">로그아웃</a>';
                loginProcessEventHtml += '</div>';

                return loginProcessEventHtml;

            },

            kakaoInit : function(kakaoObj){
                kakaoObj.init(kakaoKey);
                kakaoObj.isInitialized();

                $(document).on("ready",function(){
                    $("#kakao-login-btn").on("click",function(){
                        kakaoObj.Auth.login({
                            success: function(authObj) { // eslint-disable-line no-unused-vars
                                kakaoObj.API.request({
                                    url: '/v2/user/me',
                                    success: function(res) {
                                        window.login_success_callback(Object.assign(res,{"type":"kakao"}));
                                    },
                                    fail: function(error) {
                                        comm.message.alert(
                                            'login success, but failed to request user information: ' +
                                            JSON.stringify(error)
                                        )
                                    },
                                })
                            },
                            fail: function(err) {
                                comm.message.alert(JSON.stringify(err))
                            },
                        })
                    })
                })
            },

            naverInit : function(naverKey, naverObj){
                window.name = 'parentWindow';
                const naver_id_login = new naverObj(naverKey, window.location.origin + "/index.html");
                let state = naver_id_login['getUniqState']();
                localStorage.setItem("naverLoginAuthData", state);
                naver_id_login['setButton']("white", 2,40);
                naver_id_login['setDomain'](window.location.origin);
                naver_id_login['setState'](state);
                naver_id_login['oauthParams'].state = state;
                naver_id_login['setPopup']();
                naver_id_login.is_callback = true;
                naver_id_login.init_naver_id_login_callback = function(){
                    $("img","#naver_id_login").attr("src",window.LOGIN_BTN_IMG_NAVER);
                    $("img","#naver_id_login").css({
                        width: 'auto',height: 'auto'
                    })
                }
                naver_id_login.init_naver_id_login();
                // 네이버 로그인 e
            },

            login_success_callback : function(obj){
                let param = {}

                if( obj.type == 'naver' ){
                    param.type 		= obj.type;
                    param.id 		= obj.id;
                    param.email 	= obj.email;
                    param.nickname 	= obj.nickname;
                    param.name 		= obj.name;
                    param.profile 	= obj.profile_image;

                    if( obj.gender ){
                        if( obj.gender == 'M' ){
                            param.gender = '1';
                        }else{
                            param.gender = '2';
                        }
                    }
                }else{
                    param.type 		= obj.type;
                    param.id 		= obj.id;

                    if( obj.properties ){
                        param.nickname 	= obj.properties.nickname;
                        param.profile 	= obj.properties.profile_image;
                    }

                    if( obj.kakao_account ){
                        param.email 	= obj.kakao_account.email;
                        //param.gender 	= obj.kakao_account.gender &&

                        if( obj.kakao_account.gender ){
                            if( obj.kakao_account.gender == "male" ){
                                param.gender = '1';
                            }else{
                                param.gender = '2';
                            }
                        }
                    }
                }

                comm.request({
                    url: "/sign/in",
                    data : JSON.stringify(param)
                },function(res){ // eslint-disable-line no-unused-vars
                    // 로그인 성공

                    //팝업 닫기
                    // comm.loginObj.popup.close();
                    //
                    // $(".member_set.logOut").show();
                    // $(".loginStart").hide();

                    comm.session.add(res);
                    window.location.reload();
                })
            },

            loginProcessEvent : function(type){
                const $this = this;
                $(document).on("ready",function(){

                    $('.member_set.logOut').after($this.getLoginProcessEventHtml())

                    $(".member_set").on("click",function(){
                        $(".member_app").slideToggle("fast");
                    })

                    $("#logout").on("click",function(){
                        comm.loginObj.logOut(type);
                    })
                })
            },

            popup : {
                init : function(){
                    let loginHtml = '';
                    loginHtml += '<div class="pop_wrap" id="loginHtmlObj">';
                    loginHtml += '	<a href="javascript:;" class="btn_close"></a>';
                    loginHtml += '	<div class="pop_tit">로그인</div>';
                    loginHtml += '	<div class="btn_pop">';
                    loginHtml += '		<a href="javascript:;" id="kakao-login-btn"><img src="'+window.LOGIN_BTN_IMG_KAKAO+'"/></a>';
                    loginHtml += '		<a href="javascript:;" id="naver_id_login"><img src="'+window.LOGIN_BTN_IMG_NAVER+'"/></a>';
                    loginHtml += '	</div>';
                    loginHtml += '</div>';

                    if( $("#loginHtmlObj").length > 0 ){
                        $("#loginHtmlObj").remove();
                    }

                    $("body").append(loginHtml);

                    $(".btn_start").on("click", function () {
                        $("#backbg").fadeIn("slow");
                        $(".pop_wrap").show();
                    });
                    $(".btn_close").click(function () {
                        $("#backbg").fadeOut("slow");
                        $(".pop_wrap").hide();
                    });
                },

                open : function(){
                    $("#backbg").fadeIn("slow");
                    $(".pop_wrap").show();
                },
                close : function(){
                    $("#backbg").fadeOut("slow");
                    $(".pop_wrap").hide();
                },
            },

            logOut : function(loginType, callback){
                comm.message.confirm("로그아웃 하시겠습니까?",function(Yn){
                    if( Yn ){
                        let logOutParam = {};

                        if( loginType == 'naver' ){
                            logOutParam.type = 'naver';
                            logOutParam.access_token = localStorage.getItem("access_token");
                        }else{
                            logOutParam.type = 'kakao';
                        }

                        comm.request({url:"/sign/out",data:JSON.stringify(logOutParam)},function(res){
                            $(".logOut").hide();
                            $(".loginStart").show();

                            if( callback ){
                                callback(res);
                            }

                            comm.session.remove();

                            if( requiresLoginpageUrls.some(function(ele){
                                return (window.location.pathname.indexOf(ele) > -1)
                            }) ){
                                window.location.href= '/main';
                            }else{
                                window.location.reload();
                            }
                        })
                    }
                });
            },
        },

        request: function (opt, succCall, errCall) {
            if( window['requestDissabled'] ){
                return;
            }

            if( opt.form ){
                opt.data = comm.serializeJson($(opt.form).serializeArray());
            }

            if( !opt.headers ){
                opt.headers = {};
            }

            //opt.headers['Authorization'] = 'Bearer '+ window.apiToken;

            if( opt['contentType'] != false ){
                opt.headers['Content-type'] = "application/json";
            }

            REQUEST.send(window.apiHost + opt.url, opt.method || 'POST', opt.data, function (result) {
                if (succCall) {
                    succCall(result);
                }
            }, function (result) {
                if (errCall) {
                    errCall(result);
                } else {
                    comm.message.alert(result.message);
                }
            }, opt.headers, opt['async'])
        },


        /**
         * form 요소에 serializeArray를 json 파라미터 형태로 리턴해준다
         * */
        serializeJson : function(arr){
            var obj = {};
            arr.forEach(function(data) {
                if( data.value ){
                    obj[data.name] = data.value;
                }

            })

            return obj;
        },

        getParamJson : function(queryStr){
            const urlParams = new URLSearchParams(queryStr);

            // JSON 형태로 변환
            const jsonParams = {};
            for (const [key, value] of urlParams) {
                jsonParams[key] = value;
            }

            return jsonParams;
        },

        appendForm: function (id, name) {
            let formObj = $('<form></form>');
            $(formObj).attr("id", id);
            $(formObj).attr("name", (name || (id || "")));
            return formObj;
        },

        appendInput : function(form, name, value, isHideId){
            if( $("#"+name).length > 0 ){
                $("#"+name).remove();
            }

            if(isHideId){
                $(form).append('<input type="hidden" name="'+name+'">');
            }else{
                $(form).append('<input type="hidden" name="'+name+'" id="'+name+'">');
            }

            $(form).find("input[name='"+name+"']").val(value);
            return $(form).find("input[name='"+name+"']");
        },

        generateUUID : function() {
            const array = new Uint32Array(4);
            window.crypto.getRandomValues(array);
            let uuid = '';
            array.forEach(function(number, index) {
                if (index === 2) {
                    uuid += '4';
                }
                else if (index === 3) {
                    uuid += (number & 0x3 | 0x8).toString(16);
                }
                else {
                    uuid += number.toString(16);
                }
            });
            return uuid;
        },

        mobile : {
            isYn : function(){
                return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
            }
        },

        visitor: {
            save : function(memId, refererUrl){
                const callUrl = location.href;
                const callSvc = location.pathname;
                const param = {
                    accessPath : refererUrl,
                    accPageUrl : callUrl,
                    callService : callSvc,
                    visitStoryMemId : memId,
                };

                comm.request({url:"/visitor/insert", method : "POST", data : JSON.stringify(param)},function(resp){
                    // 수정 성공
                    if( resp.code == '0000'){
                        // console.log('방문자 히스토리 저장성공');
                    }
                })
            }
        },

        session : {
            add : function(memData){
                sessionStorage.clear();
                sessionStorage.setItem("sessionData"    , JSON.stringify({
                    loginId                     : memData.loginId,
                    loginYn                     : (memData["loginId"] ? true : false),
                    loginType                   : (memData["loginType"] == '00' ? "naver" : "kakao"),
                    memberId                    : memData.memberId,
                    memProfileImg               : memData.memProfileImg,
                    sessionId                   : memData.sessionId,
                    commentPermStatus           : memData.commentPermStatus,
                    storyRegPermStatus          : memData.storyRegPermStatus,
                    storyCommentPublicStatus    : memData.storyCommentPublicStatus,
                    storyTitle                  : memData.storyTitle,
                }));
                sessionStorage.setItem("apiToken"       , memData.apiToken);
            },

            remove : function(){
                sessionStorage.clear();
                delete window.loginId;
                delete window.loginYn;
                delete window.loginType;
                delete window.memProfileImg;
                delete window.memberId;
                delete window.nowStoryMemId;
                delete window.apiToken;
            },

            token: {
                get: function () {
                    const param = {
                        token: (sessionStorage.getItem("apiToken") || "")
                    }

                    comm.request({
                        url: "/comm/token",
                        method: "POST",
                        data: JSON.stringify(param),
                        async: false
                    }, function (resp) {
                        // 수정 성공
                        if (resp.code == '0000') {
                            window.apiToken = resp.apiToken;
                            sessionStorage.setItem("apiToken", resp.apiToken);

                            if( window.loginYn && resp.loginYn == 'N' ){
                                window['requestDissabled'] = true;
                                comm.message.alert("세션유지 시간 초과");

                                comm.session.remove();
                                window.location.href = '/main';
                            }
                        }
                    },function (){
                        comm.session.remove();
                        window.location.href = '/main';
                    })
                },
            },
        },
    };

    return publicObj
}()

window.comm = comm;
export default comm;
