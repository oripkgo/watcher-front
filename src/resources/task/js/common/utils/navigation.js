import $ from "jquery";
import SIGN from "@/resources/task/js/common/utils/sign/sign";

const profileImgUrlEmpty = require("@/resources/img/member_ico_b.png");
let profileImgUrl = profileImgUrlEmpty;

const getNotLoginNavi = function () {
    let naviHtml = '<a v-else href="javascript:;" class="btn_start loginStart" onclick="navigation.addStartEvent()">시작하기</a>';

    return (new DOMParser().parseFromString(naviHtml, 'text/html').querySelector(".loginStart"));
}

const getLoginProfile = function () {
    let naviHtml = '';
    naviHtml += '<a href="javascript:;" class="member_set logout" onclick="navigation.addProfileEvent()">';
    naviHtml += '<img src="' + profileImgUrl + '">';
    naviHtml += '</a>';
    return (new DOMParser().parseFromString(naviHtml, 'text/html').querySelector(".member_set"));
}

const getLoginNavi = function (menuList) {
    let naviHtml = '';

    naviHtml += '<div class="member_app logout" style="display: none;">';

    if (menuList) {
        for (const menu of menuList) {
            const name = menu.name;
            const url = menu.url;
            naviHtml += '<a href="' + url + '">' + name + '</a>';
        }
    }

    naviHtml += '<a href="javascript:;" id="logout" onclick="navigation.addLogoutEvent()">로그아웃</a>';
    naviHtml += '</div>';

    return (new DOMParser().parseFromString(naviHtml, 'text/html').querySelector(".member_app"));
}

const emptyTarget = function (target) {
    while (target.firstChild) {
        target.removeChild(target.firstChild);
    }
}

const navigation = {
    init: function (targetArea, menuList) {
        const naviThis = this;
        window['navigation'] = navigation;

        emptyTarget(targetArea);

        SIGN.init();

        if (SIGN.isLogin()) {
            naviThis.setProfileUrl(SIGN.getSession().memProfileImg);
            targetArea.appendChild(getLoginProfile())
            targetArea.appendChild(getLoginNavi(menuList))
        } else {
            targetArea.appendChild(getNotLoginNavi())
        }
    },

    addStartEvent: function () {
        SIGN.in();
    },

    addLogoutEvent: function () {
        SIGN.out();
    },

    addProfileEvent: function () {
        $(".member_app").slideToggle("fast");
    },

    setProfileUrl: function (imgUrl) {
        profileImgUrl = imgUrl;
    },
}


export default navigation;