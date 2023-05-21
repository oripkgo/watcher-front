import $ from 'jquery';
import "./globalVar"

let comm = function(){
    const kakaoKey = '16039b88287b9f46f214f7449158dfde';
    const naverKey = 'ThouS3nsCEwGnhkMwI1I';
    const comment_delete_msg = "해당 댓글을 삭제하시겠습니까?";

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
                        $(".writer_time", comment_obj).html(comm.last_time_cal( listObj['REG_DATE'] ));
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
        category : {
            categoryApiUrl  : '/comm/category/list',
            categoryMemberApiUrl  : '/comm/category/list/member',
            getCategory : function(){
                let category_list = "[]";
                comm.request({url: this.categoryApiUrl, method: "GET", async: false}, function (resp) {
                    // 수정 성공
                    if (resp.code == '0000') {
                        category_list = resp['category_list'];
                    }
                })

                return category_list;
            },
            getCategoryMember : function(){
                let category_list = "[]";
                comm.request({url: this.categoryMemberApiUrl, method: "GET", async: false}, function (resp) {
                    // 수정 성공
                    if (resp.code == '0000') {
                        category_list = resp['member_category_list'];
                    }
                })

                return category_list;
            },
        },
        validation : function(target){
            let checkVal = false;
            $("input:not([type='hidden']),select,textarea",target).each(function(){
                if( checkVal )return;

                const thisObj = $(this);
                const tagNm = $(thisObj).prop("tagName").toLowerCase();
                const tagTp =  $(thisObj).prop("type").toLowerCase();
                const title = $(thisObj).attr("title");
                const checkYn = $(thisObj).attr("checkYn");
                const checkMsg = $(thisObj).attr("checkMsg");

                if( checkYn == 'Y' ){
                    if( !$(thisObj).val() ){
                        checkVal = true;
                        let msg;
                        if( checkMsg ){
                            msg = checkMsg;
                        }

                        if( title ){
                            msg = title;

                            if( tagNm == 'select' || tagTp == 'file' ){
                                msg += ' 선택은 필수입니다.';
                            }else{
                                msg += ' 입력은 필수입니다.';
                            }
                        }

                        comm.message.alert(msg,function(){

                        });

                        $(thisObj).focus();
                    }
                }
            });

            return checkVal;
        },

        initBoardView : function(viewType, viewId, callback, option){
            let param = {
                "contentsType"  : viewType,
                "contentsId"    : viewId,
            };

            comm.request({url:"/board/view/init",data:JSON.stringify(param)},function(resp){
                let call_resp_obj = resp;

                // 태그 세팅 s
                call_resp_obj.tagsHtml = comm.tags_setting_val(call_resp_obj.tags || call_resp_obj.TAGS);
                if( option && option.tagsTarget && call_resp_obj.tagsHtml ){
                    $('.conts_tag').show();
                    $('.conts_tag').append(call_resp_obj.tagsHtml);
                }
                // 태그 세팅 e

                // 공감하기 세팅 s
                if( option && option.likeTarget ){
                    $(option.likeTarget).data({
                        "likeId"        : call_resp_obj.LIKE_ID,
                        "contentsType"  : param.contentsType,
                        "contentsId"    : param.contentsId,
                        "likeType"      : '01',
                        "likeYn"        : call_resp_obj.LIKE_YN,
                    });

                    if( call_resp_obj.LIKE_YN == 'N' ){
                        $(option.likeTarget).css({"background":"url('"+require("@/resources/img/zim_ico.png")+"') no-repeat left center"});
                    }else{
                        $(option.likeTarget).css({"background":"url('"+require("@/resources/img/icon_heart_on.png")+"') no-repeat left center"});
                    }
                }

                $( (option.likeTarget?option.likeTarget:".like") ).on("click", function(){
                    let $this = $(this);
                    let obj = $($this).data();

                    if( call_resp_obj.loginYn == 'Y' ){
                        let param = obj;

                        comm.request({url:"/board/like/modify",data:JSON.stringify(param)},function(like_resp){

                            $($this).data().likeYn = obj.likeYn = ( $($this).data().likeYn=='Y'?'N':'Y' );

                            if( obj.likeYn == 'N' ){
                                let likecnt = ($($this).data('likecnt')*1)-1

                                if( likecnt < 0 ){
                                    likecnt = 0;
                                }

                                $($this).text( '공감 ' + likecnt );
                                $($this).data('likecnt',likecnt);

                                delete $($this).data().likeId;

                                $(option.likeTarget).css({"background":"url('"+require("@/resources/img/zim_ico.png")+"') no-repeat left center"});
                            }else{
                                let likecnt = ($($this).data('likecnt')*1)+1
                                $($this).text( '공감 ' + likecnt );
                                $($this).data('likecnt',likecnt);

                                $($this).data().likeId = like_resp.like_id;

                                $($this).data().likeYn = "Y";

                                $(option.likeTarget).css({"background":"url('"+require("@/resources/img/icon_heart_on.png")+"') no-repeat left center"});
                            }
                        });
                    }else{
                        comm.message.confirm("해당 콘텐츠가 마음에 드시나요? 로그인 후 의견을 알려주세요.\n\n로그인 하시겠습니까?", function(Yn){
                            if( Yn ){
                                comm.loginObj.popup.open();
                            }
                        });
                    }
                })
                // 공감하기 세팅 e

                // 댓글 목록 세팅 s
                if( option && option.commentTarget ){
                    let _pageForm 		= $(option.commentTarget).parents('form');

                    comm.appendInput(_pageForm, "contentsType"  , param.contentsType    );
                    comm.appendInput(_pageForm, "contentsId"    , param.contentsId      );

                    //function(form,url,callback,pageNo,totalCnt,sPageNo,ePageNo,listNo,pagigRange){
                    comm.list(_pageForm, "/board/comment/select", function(comment_resp){
                        privateObj.comment.setting(
                            param.contentsType,
                            param.contentsId,
                            option.commentTarget,
                            comment_resp.comment.cnt,
                            comment_resp.comment.list,
                            call_resp_obj.loginYn
                        );
                    },1,10);
                }
                // 댓글 목록 세팅 e

                // 댓글 등록 세팅 s
                // if( option && option.commentInsertBtn ){
                //
                // }
                // 댓글 등록 세팅 e
                if( callback ){
                    callback(call_resp_obj);
                }
            })
        },

        tags_setting_val : function(tags){
            if( !tags ){
                return '';
            }

            let tags_arr = tags.split(",");

            let tagsHtml = '';
            for( let i=0;i<tags_arr.length;i++ ){
                tagsHtml += '<a href="javascript:;">#'+tags_arr[i]+'</a>';
            }

            return tagsHtml;
        },

        date : {
            getDayOfTheWeek : function(date){
                const d = date;
                const weekday = [];new Array(7);
                weekday[0] = "일";
                weekday[1] = "월";
                weekday[2] = "화";
                weekday[3] = "수";
                weekday[4] = "목";
                weekday[5] = "금";
                weekday[6] = "토";

                return weekday[d.getDay()];
            },

            getToDay : function(format){
                return this.date.getDate(new Date(),format);
            },

            getDate : function(date,format){
                let date_format = format || ''

                let year = date.getFullYear(); // 년도
                let month = date.getMonth() + 1;  // 월
                let dt = date.getDate();  // 날짜
                let day = date.getDay();  // eslint-disable-line no-unused-vars
                // 요일


                month = ( "00"+month )
                month = month.substring(month.length-2,month.length);

                dt = ( "00"+dt )
                dt = dt.substring(dt.length-2,dt.length);

                return year + date_format + month + date_format + dt;
            },
        },

        last_time_cal : function(last_date){
            let write_date = new Date(last_date) ;
            let now_date = new Date();

            if( this.date.getDate(now_date) != this.date.getDate(write_date)){
                write_date = new Date(this.date.getDate(write_date,'-')) ;
            }

            let last_time_result = now_date.getTime() - write_date.getTime();

            let floor = function(num){
                return Math.floor(num*1);
            }
            if( ( last_time_result/1000 ) < 60 ){

                if( last_time_result < 0 ){
                    return "방금";
                }

                return floor(( last_time_result/1000 ))+"초 전";
            }

            if( ( last_time_result/1000/60 ) < 60 ){
                return floor(( last_time_result/1000/60 ))+'분 전';
            }

            if( ( last_time_result/1000/60/60 ) < 60 ){
                return floor(( last_time_result/1000/60/60 ))+'시간 전';
            }

            if( ( last_time_result/1000/60/60/24 ) < 365 ){
                return floor(( last_time_result/1000/60/60/24 ))+'일 전';
            }

            return floor(( last_time_result/1000/60/60/24/365 ))+'년 전';
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
                loginProcessEventHtml += '    <a href="/'+window.memberId+'/myStory" id="myStory">내 스토리</a>';
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

            naverInit : function(naverObj){
                window.name = 'parentWindow';
                const naver_id_login = new naverObj(naverKey, window.location.origin + "/login/loginSuccess");
                let state = naver_id_login.getUniqState();
                naver_id_login.setButton("white", 2,40);
                naver_id_login.setDomain(window.location.origin);
                naver_id_login.setState(state);
                naver_id_login.setPopup();
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
                console.log(JSON.stringify(obj));

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
                    url: "/login/loginSuccess/callback",
                    data : JSON.stringify(param)
                },function(res){ // eslint-disable-line no-unused-vars
                    // 로그인 성공

                    //팝업 닫기
                    // comm.loginObj.popup.close();
                    //
                    // $(".member_set.logOut").show();
                    // $(".loginStart").hide();
                    sessionStorage.clear();
                    sessionStorage.setItem("loginId",res.loginId);
                    sessionStorage.setItem("loginType",res.loginType);
                    sessionStorage.setItem("memberId",res.memberId);
                    sessionStorage.setItem("memProfileImg",res.memProfileImg);
                    sessionStorage.setItem("sessionId",res.sessionId);
                    sessionStorage.setItem("apiToken",res.apiToken);


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

                        comm.request({url:"/login/logout",data:JSON.stringify(logOutParam)},function(res){
                            $(".logOut").hide();
                            $(".loginStart").show();

                            if( callback ){
                                callback(res);
                            }

                            sessionStorage.clear();

                            window.location.reload();
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

            let ajaxOpt = {
                url: window.apiHost + opt.url,
                type:opt.method || 'POST',
                data : opt.data || null,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", 'Bearer '+ window.apiToken);

                    if( opt.headers ){
                        $.map(opt.headers,function(val,key){
                            xhr.setRequestHeader(key,val);
                        })
                    }else{
                        if( opt['contentType'] != false ){
                            xhr.setRequestHeader("Content-type","application/json");
                        }
                    }
                },
                success : function(result){
                    if( result.code == '0000' ){
                        if( succCall ){
                            succCall(result);
                        }
                    }else{
                        if( errCall ){
                            errCall(result);
                        }else{
                            comm.message.alert(result.message);
                        }
                    }
                },
                error:function(result){
                    if( errCall ){
                        errCall(result);
                    }else{
                        if( result.responseJSON ){
                            let status = result.responseJSON.status; // eslint-disable-line no-unused-vars
                            let msg = result.responseJSON.message;

                            comm.message.alert(msg);

                        }else{
                            comm.message.alert("http server error");
                        }
                    }
                }
            }

            if( Object.hasOwnProperty.call(opt, "processData") ){
                ajaxOpt['processData'] = opt['processData'];
            }


            if( Object.hasOwnProperty.call(opt, "contentType") ){
                ajaxOpt['contentType'] = opt['contentType'];
            }

            if( Object.hasOwnProperty.call(opt, "async") ){
                ajaxOpt['async'] = opt['async'];
            }

            $.ajax(ajaxOpt)
        },

        message: {
            alert: function (msg,callback) {
                alert(msg);

                if( callback ){
                    callback();
                }

            },
            confirm : function(msg,callback){
                if( confirm(msg) ){
                    callback(true);
                }else{
                    callback(false);
                }

            }
        },

        list : function(formObj,url,callback,pageNo,listNo,pagigRange,sPageNo,ePageNo,totalCnt,scrollTopYn){

            var form = formObj;

            if( typeof formObj == 'object' ){

                if( $(formObj).attr("id") ){
                    form = "#" + $(formObj).attr("id");
                }else{
                    form = "#" + "commListForm" + $("form").index($(formObj));
                }

            }

            var _pageNo =1;			// 현재 페이지 번호
            var _listNo = 20;		// 한 페이지에 보여지는 목록 갯수
            var _pagigRange = 10;		// 한페이지에 보여지는 페이징처리 범위
            var _startPageNo;		// 시작 페이지
            var _endPageNo;			// 끝 페이지

            if( $(form).find("[name='viewType']").length == 0 ){
                $(form).append('<input type="hidden" name="viewType" id="viewType">');
            }
            $("[name='viewType']"	,form).val( "ajax" );


            if( $(form).find("[name='pageNo']").length == 0 ){
                $(form).append('<input type="hidden" name="pageNo">');
            }

            if( $(form).find("[name='listNo']").length == 0 ){
                $(form).append('<input type="hidden" name="listNo">');
            }

            if( $(form).find("[name='pagigRange']").length == 0 ){
                $(form).append('<input type="hidden" name="pagigRange">');
            }

            if( $(form).find("[name='startPageNo']").length == 0 ){
                $(form).append('<input type="hidden" name="startPageNo">');
            }


            if( $(form).find("[name='endPageNo']").length == 0 ){
                $(form).append('<input type="hidden" name="endPageNo">');
            }


            if( pageNo ){
                _pageNo = pageNo*1;
            }

            if( listNo ){
                _listNo = listNo*1;
            }

            if( pagigRange ){
                _pagigRange = pagigRange*1;
            }

            if( sPageNo &&  ePageNo){
                _startPageNo = sPageNo*1;
                _endPageNo = ePageNo*1;
            }


            $("[name='pageNo']"		,form).val( _pageNo	 	 );
            $("[name='listNo']"		,form).val( _listNo  	 );
            $("[name='pagigRange']"	,form).val( _pagigRange  );
            $("[name='startPageNo']",form).val( _startPageNo );
            $("[name='endPageNo']"	,form).val( _endPageNo 	 );

            comm.request({
                form:form
                , url:url
                , method : "GET"
                , headers : {"Content-type":"application/x-www-form-urlencoded"}
            },function(data){
                // result

                if( callback ){
                    if( $.type(callback) == 'function' ){
                        window[$(form).attr("id")+'commListCallback'] = callback;
                    }else{
                        window[$(form).attr("id")+'commListCallback'] = window[callback];
                    }
                    window[$(form).attr("id")+'commListCallback'](data);

                }

                var pageObj = data.vo;

                var firstPage = 1; // eslint-disable-line no-unused-vars
                var lastPage = Math.ceil((pageObj.totalCnt*1)/(pageObj.listNo*1));

                if( pageObj.pageNo == 1 ){
                    pageObj.startPageNo = pageObj.pageNo;
                }else if(pageObj.pageNo < pageObj.startPageNo){
                    pageObj.startPageNo = pageObj.startPageNo - pageObj.pagigRange;
                }else if( pageObj.pageNo > pageObj.endPageNo ){
                    pageObj.startPageNo = pageObj.pageNo;
                }


                pageObj.endPageNo = (pageObj.startPageNo + pageObj.pagigRange)-1;

                if(pageObj.endPageNo > lastPage) pageObj.endPageNo=(lastPage==0?1:lastPage);

                var listFunc = "comm.list('"+form+"','"+url+"','"+$(form).attr("id")+"commListCallback'"+
                    ",'[pageNo]','"+pageObj.listNo+"','"+pageObj.pagigRange+"','"+pageObj.startPageNo+"','"+pageObj.endPageNo+"','"+totalCnt+"','"+scrollTopYn+"')";


                if( comm.mobile.isYn() ){
                    // 모바일
                    var pagination_mobile = $(".pagging_wrap",form);

                    if( $(pagination_mobile).length == 0 ){
                        pagination_mobile = $(".pagging_wrap");
                    }

                    if( pageObj.pageNo >= lastPage ){
                        $(pagination_mobile).hide();
                    }else{
                        $(pagination_mobile).replaceWith('<a href="javascript:;" class="btn_story2" onclick="'+listFunc.replace("[pageNo]",((pageObj.pageNo*1)+1))+'">더보기</a>');
                        // $(pagination_mobile).html('<button type="button" class="more" onclick="'+listFunc.replace("[pageNo]",((pageObj.pageNo*1)+1))+'">+ 더보기</button>');
                    }

                }else{
                    // pc

                    var pageHtml = '';
                    if( pageObj.startPageNo <= 1 ){
                        pageHtml += '<a href="javascript:;">';
                        pageHtml += '<img src="'+require("@/resources/img/prev_arrow.png")+'">';
                        pageHtml += '</a>';
                    }else{
                        //pageHtml += '<a href="#none" class="first" title="처음" onclick="'+listFunc.replace("[pageNo]",1)+'"><span> << 처음</span></a>';
                        pageHtml += '<a href="javascript:;" onclick="'+listFunc.replace("[pageNo]",pageObj.startPageNo-1)+'">';
                        pageHtml += '<img src="'+require("@/resources/img/prev_arrow.png")+'">';
                        pageHtml += '</a>';
                    }

                    for(var i =pageObj.startPageNo;i<=pageObj.endPageNo;i++){
                        if( i == pageNo ){
                            pageHtml += '<a href="javascript:;" class="on">'+(i)+'</a>';
                        }else{
                            pageHtml += '<a href="javascript:;" onclick="'+listFunc.replace("[pageNo]",i)+'">'+i+'</a>';
                        }
                    }

                    if( pageObj.endPageNo >= lastPage ){
                        pageHtml += '<a href="javascript:;">';
                        pageHtml += '<img src="'+require("@/resources/img/next_arrow.png")+'">';
                        pageHtml += '</a>';
                    }else{
                        pageHtml += '<a href="javascript:;" onclick="'+listFunc.replace("[pageNo]",pageObj.endPageNo+1)+'">';
                        pageHtml += '<img src="'+require("@/resources/img/next_arrow.png")+'">';
                        pageHtml += '</a>';
                        //pageHtml += '<a href="#none" class="last" title="마지막" onclick="'+listFunc.replace("[pageNo]",lastPage)+'"><span>마지막 >> </span></a>';
                    }

                    var pagination_pc = $(".pagging_wrap",form);
                    if( $(pagination_pc).length == 0 ){
                        pagination_pc = $(".pagging_wrap");
                    }

                    $(pagination_pc).html(pageHtml);
                    if( !scrollTopYn || scrollTopYn == "Y" ){
                        $('html').scrollTop(0);
                    }

                }

            })

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
                        console.log('방문자 히스토리 저장성공');
                    }
                })
            }
        },

        token: {
            get: function () {
                const param = {
                    token: (sessionStorage.getItem("apiToken") || "")
                }

                const removeSession = function(){
                    sessionStorage.clear();
                    delete window.loginId;
                    delete window.loginYn;
                    delete window.loginType;
                    delete window.memProfileImg;
                    delete window.memberId;
                    delete window.nowStoryMemId;
                    delete window.apiToken;
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
                            removeSession();
                            window['requestDissabled'] = true;
                            comm.message.alert("세션유지 시간 초과");
                            window.location.reload();
                        }
                    }
                },function (){
                    removeSession();
                })
            },
        },
    };


    return publicObj
}()

window.comm = comm;
export default comm;
