import Vue from "vue"
import VueRouter from "vue-router"


Vue.use(VueRouter)

const routes = [
    {
        path: "/home",
        component: () => import("../components/Home"),
        children: [
            {
                path: "/welcome",
                component: () => import("../components/Welcome"),
            },
            {
                path: "/works/list",
                component: () => import("../components/works/List")
            },
            {
                path: "/works/record",
                component: () => import("../components/works/Record")
            },
            {
                path: "/user/list",
                component: () => import("../components/user/Users")
            },
            {
                path: "/setting/banner",
                component: () => import("../components/config/Banner")
            },
            {
                path: "/setting/recommend",
                component: () => import("../components/config/Recommend")
            },
            {
                path: "/setting/bank",
                component: () => import("../components/config/Bank")
            },
            {
                path: "/setting/payment",
                component: () => import("../components/config/Payment")
            },
            {
                path: "/finance/withdraw",
                component: () => import("../components/finance/Withdraw")
            },
            {
                path: "/airdrop/list",
                component: () => import("../components/works/AirDrop")
            },
            {
                path: "/airdrop/record",
                component: () => import("../components/works/AirDropRecord"),
                name: "airdrop-record"
            }
        ],
        // redirect: "/welcome"
    },{
        path: "/login",
        name:'Login',
        component: () => import("../components/Login"),
    },{
        path: "/*",
        redirect: "/login"
    }

]

const router = new VueRouter({
    routes
})

router.beforeEach((to, form, next) => {
    // if (to.path === "/login") {
    //   return next()
    // }
    // const token = window.sessionStorage.getItem("token")
    // if (!token) {
    //   return next("/login")
    // }
    next()
})

export default router
