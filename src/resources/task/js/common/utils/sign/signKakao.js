const kakaoKey = '16039b88287b9f46f214f7449158dfde';
const loginBtnImgKakao = require("@/resources/img/login_kakao.png");
const signKakao = {
    init: function () {
        const kakaoObj = window['Kakao'];
        kakaoObj.init(kakaoKey);
        kakaoObj.isInitialized();

        document.addEventListener("DOMContentLoaded", function () {
            var kakaoLoginBtn = document.getElementById("kakao-login-btn");
            if (kakaoLoginBtn) {
                kakaoLoginBtn.addEventListener("click", function () {
                    kakaoObj.Auth.login({
                        success: function (authObj) { // eslint-disable-line no-unused-vars
                            kakaoObj.API.request({
                                url: '/v2/user/me',
                                success: function (res) {
                                    window.callbackLoginSuccess(Object.assign(res, {"type": "kakao"}));
                                },
                                fail: function (error) {
                                    console.error('login success, but failed to request user information: ' +
                                        JSON.stringify(error))
                                },
                            })
                        },
                        fail: function (err) {
                            console.error(JSON.stringify(err))
                        },
                    })
                });
            }
        });
    },

    getButtonImgUrl: function () {
        return loginBtnImgKakao;
    },
};


export default signKakao;