const signElement = {
    getNavigationBar : function(myStoryUrl, managementUrl, writeUrl){
        let loginProcessEventHtml = '';

        loginProcessEventHtml += '<div class="member_app logout" style="display: none;">';
        loginProcessEventHtml += '    <a href="' + myStoryUrl + '" id="myStory">내 스토리</a>';
        loginProcessEventHtml += '    <a href="'+managementUrl+'" id="management">관리</a>';
        loginProcessEventHtml += '    <a href="' + writeUrl + '" id="writing">글쓰기</a>';
        loginProcessEventHtml += '    <a href="javascript:;" id="logout">로그아웃</a>';
        loginProcessEventHtml += '</div>';

        return (new DOMParser().parseFromString(loginProcessEventHtml, 'text/html').querySelector(".logout"));
    },

    getPupup : function(imgUrlKakao, imgUrlNaver){
        let loginHtml = '';
        loginHtml += '<div class="pop_wrap" id="loginHtmlObj">';
        loginHtml += '	<a href="javascript:;" class="btn_close"></a>';
        loginHtml += '	<div class="pop_tit">로그인</div>';
        loginHtml += '	<div class="btn_pop">';
        loginHtml += '		<a href="javascript:;" id="kakao-login-btn"><img src="' + imgUrlKakao + '"/></a>';
        loginHtml += '		<a href="javascript:;" id="naver_id_login"><img src="' + imgUrlNaver + '"/></a>';
        loginHtml += '	</div>';
        loginHtml += '</div>';

        return (new DOMParser().parseFromString(loginHtml, 'text/html').querySelector("#loginHtmlObj"));
    },
}


export default signElement;