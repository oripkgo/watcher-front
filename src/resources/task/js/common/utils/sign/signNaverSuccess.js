
const signNaverSuccess = {
    init : function(naverObj, token, callbackUrl){
        const naver_id_login = new naverObj(token, callbackUrl);
        naver_id_login.get_naver_userprofile("signNaverSuccess.callback()");

        // 접근 토큰 값 출력
        localStorage.setItem("access_token",naver_id_login.oauthParams.access_token);
    },

    callback : function(){
        if (!window.opener) {
            window.opener = window.open('', 'parentWindow');
        }

        if( window.opener.callbackLoginSuccess ){
            window.opener.callbackLoginSuccess( Object.assign(window['inner_profileParams'], {"type":"naver"}));
        }

        window.close();
    },
};


export default signNaverSuccess;