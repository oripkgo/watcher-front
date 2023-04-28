import { createWebHistory, createRouter } from "vue-router";
import Home from "@/components/views/main/Index"

// 약관
import Use from "@/components/views/terms/Use"
import Advertisement from "@/components/views/terms/Advertisement"
import Copyright from "@/components/views/terms/Copyright"
import Privacy from "@/components/views/terms/Privacy"

const router = createRouter({
    history : createWebHistory(),
    routes : [ // path별 component를 추가한다.
        { path : "/",                       name : "home",              component : Home },
        { path : "/main",                   name : "main",              component : Home },
        { path : "/terms/use",              name : "use",               component : Use },
        { path : "/terms/advertisement",    name : "advertisement",     component : Advertisement },
        { path : "/terms/copyright",        name : "copyright",         component : Copyright },
        { path : "/terms/privacy",          name : "privacy",           component : Privacy },


        /*{
            path : "/:pathMatch(.*)",
            name : "not-found",
            component : ErrorPage
        }*/
    ]
});

export default router;