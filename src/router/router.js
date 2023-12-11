import { createWebHistory, createRouter } from "vue-router";
import Home from "@/components/views/main/Index"

// 약관
import Use from "@/components/views/terms/Use"
import Advertisement from "@/components/views/terms/Advertisement"
import Copyright from "@/components/views/terms/Copyright"
import Privacy from "@/components/views/terms/Privacy"
import NaverLoginSuccess from "@/components/views/login/NaverLoginSuccess"
import StoryView from "@/components/views/story/StoryView";
import StoryList from "@/components/views/story/StoryList";
import StoryWrite from "@/components/views/story/StoryWrite";
import NoticeList from "@/components/views/notice/NoticeList";
import NoticeListMyStory from "@/components/views/notice/NoticeListMyStory";
import NoticeView from "@/components/views/notice/NoticeView";
import NoticeWrite from "@/components/views/notice/NoticeWrite";
import MyStoryMain from "@/components/views/myStory/Main";
import ManagementMain from "@/components/views/management/Main";
import ManagementBoard from "@/components/views/management/Board";
import ManagementCategory from "@/components/views/management/Category";
import ManagementNotice from "@/components/views/management/Notice";
import ManagementSetting from "@/components/views/management/Setting";
import ManagementStatistics from "@/components/views/management/Statistics";

const router = createRouter({
    scrollBehavior() {
        return {top: 0};
    },
    history : createWebHistory(),
    routes : [ // path별 component를 추가한다.
        { path : "/",                               name : "home",                  component : Home },
        { path : "/main",                           name : "main",                  component : Home },
        { path : "/terms/use",                      name : "use",                   component : Use },
        { path : "/terms/advertisement",            name : "advertisement",         component : Advertisement },
        { path : "/terms/copyright",                name : "copyright",             component : Copyright },
        { path : "/terms/privacy",                  name : "privacy",               component : Privacy },
        { path : "/login/loginSuccess",             name : "naverLoginSuccess",     component : NaverLoginSuccess },
        { path : "/story/list",                     name : "storyList",             component : StoryList },
        { path : "/story/write",                    name : "storyWrite",            component : StoryWrite },
        { path : "/story/update",                   name : "storyUpdate",           component : StoryWrite },
        { path : "/story/view/:memId",              name : "storyView",             component : StoryView },
        { path : "/notice/list",                    name : "noticeList",            component : NoticeList },
        { path : "/notice/view",                    name : "noticeView",            component : NoticeView },
        { path : "/notice/write",                   name : "noticeWrite",           component : NoticeWrite },
        { path : "/notice/update",                  name : "noticeUpdate",          component : NoticeWrite },
        { path : "/:memId/notice/list",             name : "noticeListMember",      component : NoticeListMyStory },
        { path : "/:memId/notice/view",             name : "noticeViewMember",      component : NoticeView },
        { path : "/myStory/:memId",                 name : "myStoryMain",           component : MyStoryMain },
        { path : "/myStory/:memId/:categoryId",     name : "myStoryMainCategory",   component : MyStoryMain },
        { path : "/management/main",                name : "managementMain",        component : ManagementMain },
        { path : "/management/board",               name : "managementBoard",       component : ManagementBoard },
        { path : "/management/category",            name : "managementCategory",    component : ManagementCategory },
        { path : "/management/notice",              name : "managementNotice",      component : ManagementNotice },
        { path : "/management/setting",             name : "managementSetting",     component : ManagementSetting },
        { path : "/management/statistics",          name : "managementStatistics",  component : ManagementStatistics },

        /*{
            path : "/:pathMatch(.*)",
            name : "not-found",
            component : ErrorPage
        }*/
    ]
});

// http://watcher-bucket.s3-website.ap-northeast-2.amazonaws.com or
// http://watcher.kr or
// https://watcher.kr 접속시 https://www.watcher.kr 리다이렉트 처리 코드
router.beforeEach((to, from, next) => {
    const redirectDomains = ['watcher-bucket.s3-website.ap-northeast-2.amazonaws.com', 'watcher.kr'];
    const targetDomain = 'https://www.watcher.kr';

    // Check if the current domain is in the redirectDomains array
    const currentDomain = window.location.hostname;

    console.log(currentDomain);
    console.log(`if : ${(redirectDomains.includes(currentDomain) ||
        (targetDomain.includes(currentDomain) && currentDomain.indexOf('www.') !== 0))}`);
    console.log(`${targetDomain}${to.fullPath}`);

    if (redirectDomains.includes(currentDomain)) {
        // Redirect to the target domain
        window.location.href = `${targetDomain}${to.fullPath}`;
    } else {
        next();
    }
})

export default router;