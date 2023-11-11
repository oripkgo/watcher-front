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
import SIGN from "@/resources/task/js/common/utils/sign"
import MOBILE from "@/resources/task/js/common/utils/mobile"
import VISITOR from "@/resources/task/js/common/utils/visitor"

let comm = function () {
    const kakaoKey = '16039b88287b9f46f214f7449158dfde';
    const requiresLoginpageUrls = ['/management'];

    // const privateObj = {};

    const publicObj = {
        category: CATEGORY,
        date: DATE,
        message: MESSAGE,
        paging: PAGING,
        mobile: MOBILE,
        visitor: VISITOR,
        sign: SIGN,

        validation: function (target) {
            const result = AVAILABILITY.check(target);

            comm.message.alert(result.message);
            $(result.failTarget).focus();

            return result.checkVal;
        },

        /**
         * form 요소에 serializeArray를 json 파라미터 형태로 리턴해준다
         * */
        serializeJson: function (arr) {
            var obj = {};
            arr.forEach(function (data) {
                if (data.value) {
                    obj[data.name] = data.value;
                }

            })

            return obj;
        },

        getParamJson: function (queryStr) {
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

        appendInput: function (form, name, value, isHideId) {
            if ($("#" + name).length > 0) {
                $("#" + name).remove();
            }

            if (isHideId) {
                $(form).append('<input type="hidden" name="' + name + '">');
            } else {
                $(form).append('<input type="hidden" name="' + name + '" id="' + name + '">');
            }

            $(form).find("input[name='" + name + "']").val(value);
            return $(form).find("input[name='" + name + "']");
        },

        generateUUID: function () {
            const array = new Uint32Array(4);
            window.crypto.getRandomValues(array);
            let uuid = '';
            array.forEach(function (number, index) {
                if (index === 2) {
                    uuid += '4';
                } else if (index === 3) {
                    uuid += (number & 0x3 | 0x8).toString(16);
                } else {
                    uuid += number.toString(16);
                }
            });
            return uuid;
        },

        request: function (opt, succCall, errCall) {
            if (window['requestDissabled']) {
                return;
            }

            if (opt.form) {
                opt.data = comm.serializeJson($(opt.form).serializeArray());
            }

            if (!opt.headers) {
                opt.headers = {};
            }

            //opt.headers['Authorization'] = 'Bearer '+ window.apiToken;

            if (opt['contentType'] != false) {
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

        boardView: {
            init: function (id, type) {
                const notLoginCallback = function () {
                    comm.message.confirm("해당 콘텐츠가 마음에 드시나요? 로그인 후 의견을 알려주세요.\n\n로그인 하시겠습니까?", function (Yn) {
                        if (Yn) {
                            comm.loginObj.popup.open();
                        }
                    });
                }

                const confirmDeleteMsg = function (callback) {
                    comm.message.confirm("댓글을 삭제하시겠습니까?", callback);
                }

                this.loginYn = window.loginYn ? "Y" : "N";
                this.tagObj = BOARD_TAGS;
                this.likeObj = BOARD_LIKE;
                this.commentObj = BOARD_COMMENT;

                this.tagObj.init(id, type);
                this.likeObj.init(id, type, this.loginYn, notLoginCallback);
                this.commentObj.init(id, type, this.loginYn, notLoginCallback, confirmDeleteMsg);
            },
            renderTag: function (tagId) {
                this.tagObj.render(tagId);
            },
            renderLike: function (tagId) {
                this.likeObj.render(tagId);
            },
            renderComment: function (tagId) {
                this.commentObj.render(tagId, comm.paging.getList);
            },
        },

        loginObj: {
            init: function (type) {
                this.popup.init();

                this.loginProcessEvent(type);
                window['login_success_callback'] = this.login_success_callback;
            },

            getLoginProcessEventHtml: function () {
                let loginProcessEventHtml = '';

                loginProcessEventHtml += '<div class="member_app logOut" style="display: none;">';
                loginProcessEventHtml += '    <a href="/myStory/' + window.memberId + '" id="myStory">내 스토리</a>';
                loginProcessEventHtml += '    <a href="/management/main" id="management">관리</a>';
                loginProcessEventHtml += '    <a href="' + window.storyUrlWrite + '" id="writing">글쓰기</a>';
                loginProcessEventHtml += '    <a href="javascript:;" id="logout">로그아웃</a>';
                loginProcessEventHtml += '</div>';

                return loginProcessEventHtml;

            },

            kakaoInit: function (kakaoObj) {
                kakaoObj.init(kakaoKey);
                kakaoObj.isInitialized();

                $(document).on("ready", function () {
                    $("#kakao-login-btn").on("click", function () {
                        kakaoObj.Auth.login({
                            success: function (authObj) { // eslint-disable-line no-unused-vars
                                kakaoObj.API.request({
                                    url: '/v2/user/me',
                                    success: function (res) {
                                        window.login_success_callback(Object.assign(res, {"type": "kakao"}));
                                    },
                                    fail: function (error) {
                                        comm.message.alert(
                                            'login success, but failed to request user information: ' +
                                            JSON.stringify(error)
                                        )
                                    },
                                })
                            },
                            fail: function (err) {
                                comm.message.alert(JSON.stringify(err))
                            },
                        })
                    })
                })
            },

            naverInit: function (naverKey, naverObj) {
                window.name = 'parentWindow';
                const naver_id_login = new naverObj(naverKey, window.location.origin + "/index.html");
                let state = naver_id_login['getUniqState']();
                localStorage.setItem("naverLoginAuthData", state);
                naver_id_login['setButton']("white", 2, 40);
                naver_id_login['setDomain'](window.location.origin);
                naver_id_login['setState'](state);
                naver_id_login['oauthParams'].state = state;
                naver_id_login['setPopup']();
                naver_id_login.is_callback = true;
                naver_id_login.init_naver_id_login_callback = function () {
                    $("img", "#naver_id_login").attr("src", window.LOGIN_BTN_IMG_NAVER);
                    $("img", "#naver_id_login").css({
                        width: 'auto', height: 'auto'
                    })
                }
                naver_id_login.init_naver_id_login();
                // 네이버 로그인 e
            },

            login_success_callback: function (obj) {
                let param = {}

                if (obj.type == 'naver') {
                    param.type = obj.type;
                    param.id = obj.id;
                    param.email = obj.email;
                    param.nickname = obj.nickname;
                    param.name = obj.name;
                    param.profile = obj.profile_image;

                    if (obj.gender) {
                        if (obj.gender == 'M') {
                            param.gender = '1';
                        } else {
                            param.gender = '2';
                        }
                    }
                } else {
                    param.type = obj.type;
                    param.id = obj.id;

                    if (obj.properties) {
                        param.nickname = obj.properties.nickname;
                        param.profile = obj.properties.profile_image;
                    }

                    if (obj.kakao_account) {
                        param.email = obj.kakao_account.email;
                        //param.gender 	= obj.kakao_account.gender &&

                        if (obj.kakao_account.gender) {
                            if (obj.kakao_account.gender == "male") {
                                param.gender = '1';
                            } else {
                                param.gender = '2';
                            }
                        }
                    }
                }

                comm.request({
                    url: "/sign/in",
                    data: JSON.stringify(param)
                }, function (res) { // eslint-disable-line no-unused-vars
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

            loginProcessEvent: function (type) {
                const $this = this;
                $(document).on("ready", function () {

                    $('.member_set.logOut').after($this.getLoginProcessEventHtml())

                    $(".member_set").on("click", function () {
                        $(".member_app").slideToggle("fast");
                    })

                    $("#logout").on("click", function () {
                        comm.loginObj.logOut(type);
                    })
                })
            },

            popup: {
                init: function () {
                    let loginHtml = '';
                    loginHtml += '<div class="pop_wrap" id="loginHtmlObj">';
                    loginHtml += '	<a href="javascript:;" class="btn_close"></a>';
                    loginHtml += '	<div class="pop_tit">로그인</div>';
                    loginHtml += '	<div class="btn_pop">';
                    loginHtml += '		<a href="javascript:;" id="kakao-login-btn"><img src="' + window.LOGIN_BTN_IMG_KAKAO + '"/></a>';
                    loginHtml += '		<a href="javascript:;" id="naver_id_login"><img src="' + window.LOGIN_BTN_IMG_NAVER + '"/></a>';
                    loginHtml += '	</div>';
                    loginHtml += '</div>';

                    if ($("#loginHtmlObj").length > 0) {
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

                open: function () {
                    $("#backbg").fadeIn("slow");
                    $(".pop_wrap").show();
                },
                close: function () {
                    $("#backbg").fadeOut("slow");
                    $(".pop_wrap").hide();
                },
            },

            logOut: function (loginType, callback) {
                comm.message.confirm("로그아웃 하시겠습니까?", function (Yn) {
                    if (Yn) {
                        let logOutParam = {};

                        if (loginType == 'naver') {
                            logOutParam.type = 'naver';
                            logOutParam.access_token = localStorage.getItem("access_token");
                        } else {
                            logOutParam.type = 'kakao';
                        }

                        comm.request({url: "/sign/out", data: JSON.stringify(logOutParam)}, function (res) {
                            $(".logOut").hide();
                            $(".loginStart").show();

                            if (callback) {
                                callback(res);
                            }

                            comm.session.remove();

                            if (requiresLoginpageUrls.some(function (ele) {
                                return (window.location.pathname.indexOf(ele) > -1)
                            })) {
                                window.location.href = '/main';
                            } else {
                                window.location.reload();
                            }
                        })
                    }
                });
            },
        },

        session: {
            add: function (memData) {
                sessionStorage.clear();
                sessionStorage.setItem("sessionData", JSON.stringify({
                    loginId: memData.loginId,
                    loginYn: (memData["loginId"] ? true : false),
                    loginType: (memData["loginType"] == '00' ? "naver" : "kakao"),
                    memberId: memData.memberId,
                    memProfileImg: memData.memProfileImg,
                    sessionId: memData.sessionId,
                    commentPermStatus: memData.commentPermStatus,
                    storyRegPermStatus: memData.storyRegPermStatus,
                    storyCommentPublicStatus: memData.storyCommentPublicStatus,
                    storyTitle: memData.storyTitle,
                }));
                sessionStorage.setItem("apiToken", memData.apiToken);
            },

            remove: function () {
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
                init: function () {
                    const token = SIGN.getToken();

                    if (token) {
                        window.apiToken = token;
                        sessionStorage.setItem("apiToken", token);
                    }
                },
            },
        },
    };

    return publicObj
}()

window.comm = comm;
export default comm;
