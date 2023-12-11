import $ from "jquery";

const globalObj = {
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
    nowStoryMemId: "",
    animateQueue :new Array(),
    ready :true,

    triggerJqueryFadeIn : function(){
        $('.ani-in').each(function () {
            var object_top = $(this).offset().top;
            var window_bottom = $(window).scrollTop() + $(window).height() - 200;

            if (window_bottom > object_top) {
                $(this).addClass('action');
            }
        });
        window.triggerJqueryFadeInQueue();
    },

    triggerJqueryFadeInQueue : function(){
        if (window.animateQueue.length != 0 && window.ready) {
            window.ready = false;
            // $this = animateQueue.shift();
            // $($this).addClass('action');
        }
    },

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
        return this.storyUrlView + '/' + memId + '?id=' + id;
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
    mergeSessionStorageData : function(){
        Object.assign(globalObj, JSON.parse( ( localStorage.getItem("sessionData") || '{}' ) ));
    },
}

globalObj['nowStoryMemId'] = globalObj.getNowStoryMemId();
globalObj.mergeSessionStorageData();
Object.assign(window, globalObj);
