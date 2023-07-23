const globalObj = {
    LOGIN_BTN_IMG_NAVER: require("@/resources/img/login_naver.png"),
    LOGIN_BTN_IMG_KAKAO: require("@/resources/img/login_kakao.png"),
    apiHost : process.env.VUE_APP_API_HOST,
    refererUrl: document.referrer,
    origin: location.origin,
    storyUrlList: "/story/list",
    storyUrlView: "/story/view",
    storyUrlWrite: "/story/write",
    noticeUrlList: "/notice/list",
    noticeUrlView: "/notice/view",
    noticeUrlWrite: "/notice/write",
    noticeUrlUpdate: "/notice/update",
    managementMain: "/management/main",
    managementBoard: "/management/board",
    managementCategory: "/management/category",
    managementNotice: "/management/notice",
    managementComment: "/management/comment",
    managementSetting: "/management/setting",
    managementStatistics: "/management/statistics",
    loginId: sessionStorage.getItem("loginId"),
    loginYn: (sessionStorage.getItem("loginId") ? true : false),
    loginType: (sessionStorage.getItem("loginType") == '00' ? "naver" : "kakao"),
    memProfileImg: sessionStorage.getItem("memProfileImg"),
    memberId: sessionStorage.getItem("memberId"),
    nowStoryMemId: "",
    apiToken: sessionStorage.getItem("apiToken"),

    getNowStoryMemId : function(){
        let result;
        if( window.location.pathname.indexOf("/story/view") > -1 ){
            result = window.location.pathname.replace("/story/view","").substring(1);
        }
        return result;
    },

    getStoryListUrl: function (categoryId, keyword) {
        let listUrl = this.storyUrlList;

        if (categoryId) {
            listUrl += '?search_category_id=' + categoryId;
        }

        if (keyword) {
            listUrl += '&search_keyword=' + keyword;
        }

        return listUrl;
    },

    getStoryViewUrl: function (id, memId) {
        return '/' + memId + this.storyUrlView + '?id=' + id;
    },

    getStoryWriteUrl: function () {
        return this.storyUrlWrite;
    },

    getNoticeListUrl: function (memId) {
        return (memId ? "/" + memId : "") + this.noticeUrlList;
    },

    getNoticeViewUrl: function (id, memId) {
        return (memId ? "/" + memId : "") + this.noticeUrlView + '?id=' + id;
    },

    getNoticeWriteUrl: function () {
        return this.noticeUrlWrite;
    },
    getNoticeUpdateUrl: function (id) {
        return this.noticeUrlUpdate+"?id="+id;
    },
    getServerImg: function(path){
        return (path ? /*this.apiHost + */path : "");
    },
}

globalObj['nowStoryMemId'] = globalObj.getNowStoryMemId();
Object.assign(window, globalObj);
