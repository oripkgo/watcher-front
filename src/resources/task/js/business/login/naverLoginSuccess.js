
const naverLoginSuccess = {
    init : function(naverObj, token, callbackUrl){
        const naver_id_login = new naverObj(token, callbackUrl);
        naver_id_login.get_naver_userprofile("naverLoginSuccess.callbackNaverLogin()");

        // 접근 토큰 값 출력
        localStorage.setItem("access_token",naver_id_login.oauthParams.access_token);
    },

    callbackNaverLogin : function(){
        if (!window.opener) {
            window.opener = window.open('', 'parentWindow');
        }

        if( window.opener.login_success_callback ){
            window.opener.login_success_callback( Object.assign(window['inner_profileParams'], {"type":"naver"}));
        }

        window.close();
    },
}

window.naverLoginSuccess = naverLoginSuccess;
export default naverLoginSuccess;