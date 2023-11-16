const naverKey = process.env.VUE_APP_LOGIN_TOKEN_NAVER;
const naverBtnImgUrl = require("@/resources/img/login_naver.png");

const signNaver = {
    init: function () {
        window.name = 'parentWindow';
        const naverObj = new window['naver_id_login'](naverKey, window.location.origin + "/index.html");

        let state = naverObj['getUniqState']();
        localStorage.setItem("naverLoginAuthData", state);
        naverObj['setButton']("white", 2, 40);
        naverObj['setDomain'](window.location.origin);
        naverObj['setState'](state);
        naverObj['oauthParams'].state = state;
        naverObj['setPopup']();
        naverObj.is_callback = true;
        naverObj.init_naver_id_login_callback = function () {
            const naverIdLoginImg = document.querySelector("#naver_id_login img");
            naverIdLoginImg.src = naverBtnImgUrl;
            naverIdLoginImg.style.width = 'auto';
            naverIdLoginImg.style.height = 'auto';
        }

        naverObj.init_naver_id_login();
        // 네이버 로그인 e
    },

    getButtonImgUrl: function () {
        return naverBtnImgUrl;
    },
};


export default signNaver;