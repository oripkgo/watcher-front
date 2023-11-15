const signPopup = {
    loginBtnImgNaver : require("@/resources/img/login_naver.png"),
    loginBtnImgKakao : require("@/resources/img/login_kakao.png"),

    init: function () {
        const signPopupThis = this;
        let loginHtml = '';
        loginHtml += '<div class="pop_wrap" id="loginHtmlObj">';
        loginHtml += '	<a href="javascript:;" class="btn_close"></a>';
        loginHtml += '	<div class="pop_tit">로그인</div>';
        loginHtml += '	<div class="btn_pop">';
        loginHtml += '		<a href="javascript:;" id="kakao-login-btn"><img src="' + this.loginBtnImgKakao + '"/></a>';
        loginHtml += '		<a href="javascript:;" id="naver_id_login"><img src="' + this.loginBtnImgNaver + '"/></a>';
        loginHtml += '	</div>';
        loginHtml += '</div>';

        let existingLoginHtmlObj = document.getElementById("loginHtmlObj");
        if (existingLoginHtmlObj) {
            existingLoginHtmlObj.remove();
        }

        let body = document.body || document.getElementsByTagName('body')[0];
        body.insertAdjacentHTML('beforeend', loginHtml);

        document.querySelector(".btn_start").addEventListener("click", function () {
            signPopupThis.open();
        });

        document.querySelector(".btn_close").addEventListener("click", function () {
            signPopupThis.close();
        });
    },

    open: function () {
        document.getElementById("backbg").style.display = "block";
        document.querySelector(".pop_wrap").style.display = "block";
    },
    close: function () {
        document.getElementById("backbg").style.display = "none";
        document.querySelector(".pop_wrap").style.display = "none";
    },
}


export default signPopup;