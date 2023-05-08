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

const router = createRouter({
    history : createWebHistory(),
    routes : [ // path별 component를 추가한다.
        { path : "/",                       name : "home",              component : Home },
        { path : "/main",                   name : "main",              component : Home },
        { path : "/terms/use",              name : "use",               component : Use },
        { path : "/terms/advertisement",    name : "advertisement",     component : Advertisement },
        { path : "/terms/copyright",        name : "copyright",         component : Copyright },
        { path : "/terms/privacy",          name : "privacy",           component : Privacy },
        { path : "/login/loginSuccess",     name : "naverLoginSuccess", component : NaverLoginSuccess },
        { path : "/story/list",             name : "storyList",         component : StoryList },
        { path : "/story/write",            name : "storyWrite",        component : StoryWrite },
        { path : "/story/update",           name : "storyUpdate",       component : StoryWrite },
        { path : "/:memId/story/view",      name : "storyView",         component : StoryView },
        { path : "/notice/list",            name : "noticeList",        component : NoticeList },


        /*{
            path : "/:pathMatch(.*)",
            name : "not-found",
            component : ErrorPage
        }*/
    ]
});

export default router;