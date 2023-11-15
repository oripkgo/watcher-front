import $ from "jquery";
import SIGN_POPUP from "@/resources/task/js/common/utils/sign/signPopup";
import comm from "@/resources/task/js/common/comm";


// const loginApiUrl = "";
// const logoutApiUrl = "";
const kakaoKey = '16039b88287b9f46f214f7449158dfde';
const requiresLoginpageUrls = ['/management'];

const sign = {
    init: function (type, myStoryUrl, managementUrl, writeUrl) {
        // this.popup.init();
        this.myStoryUrl = myStoryUrl;
        this.managementUrl = managementUrl;
        this.writeUrl = writeUrl;
        SIGN_POPUP.init();

        this.addEventLoginProcess(type);
        window['callbackLoginSuccess'] = this.callbackLoginSuccess;
    },

    getLoginProcessEventHtml: function () {
        let loginProcessEventHtml = '';

        loginProcessEventHtml += '<div class="member_app logout" style="display: none;">';
        loginProcessEventHtml += '    <a href="/myStory/' + window.memberId + '" id="myStory">내 스토리</a>';
        loginProcessEventHtml += '    <a href="/management/main" id="management">관리</a>';
        loginProcessEventHtml += '    <a href="' + window.storyUrlWrite + '" id="writing">글쓰기</a>';
        loginProcessEventHtml += '    <a href="javascript:;" id="logout">로그아웃</a>';
        loginProcessEventHtml += '</div>';

        return loginProcessEventHtml;

    },

    initKakao: function (kakaoObj) {
        kakaoObj.init(kakaoKey);
        kakaoObj.isInitialized();

        $(document).on("ready", function () {
            $("#kakao-login-btn").on("click", function () {
                kakaoObj.Auth.login({
                    success: function (authObj) { // eslint-disable-line no-unused-vars
                        kakaoObj.API.request({
                            url: '/v2/user/me',
                            success: function (res) {
                                window.callbackLoginSuccess(Object.assign(res, {"type": "kakao"}));
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

    initNaver: function (naverKey, naverObj) {
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
            $("img", "#naver_id_login").attr("src", SIGN_POPUP.loginBtnImgNaver);
            $("img", "#naver_id_login").css({
                width: 'auto', height: 'auto'
            })
        }
        naver_id_login.init_naver_id_login();
        // 네이버 로그인 e
    },

    callbackLoginSuccess: function (obj) {
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
            // comm.sign.popup.close();
            //
            // $(".member_set.logout").show();
            // $(".loginStart").hide();

            comm.session.add(res);
            window.location.reload();
        })
    },

    addEventLoginProcess: function (type) {
        const $this = this;
        $(document).on("ready", function () {

            $('.member_set.logout').after($this.getLoginProcessEventHtml())

            $(".member_set").on("click", function () {
                $(".member_app").slideToggle("fast");
            })

            $("#logout").on("click", function () {
                comm.sign.logout(type);
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

    logout: function (loginType, callback) {
        comm.message.confirm("로그아웃 하시겠습니까?", function (Yn) {
            if (Yn) {
                let logoutParam = {};

                if (loginType == 'naver') {
                    logoutParam.type = 'naver';
                    logoutParam.access_token = localStorage.getItem("access_token");
                } else {
                    logoutParam.type = 'kakao';
                }

                comm.request({url: "/sign/out", data: JSON.stringify(logoutParam)}, function (res) {
                    $(".logout").hide();
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
};

// const sign = {
//     apiUrl: {
//         in: "",
//         out: "",
//     },
//
//     in: function () {
//
//     },
//     out: function () {
//
//     },
//     isLogin: function () {
//
//     },
// }


export default sign;