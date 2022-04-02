const routersConfig = {
  routes:[
    {
      path: "/login",
      name: "Login",
      component: () => import("pages/login/index.vue")
    },
    {
      path: "/403",
      name: "403",
      component: () => import("pages/exception/403.vue")
    },
    {
      path: "*",
      name: "404",
      component: () => import("pages/exception/404.vue")
    },
    {
      path: "/500",
      name: "500",
      component: () => import("pages/exception/500.vue")
    },
    {
      path: "/",
      name: "Home",
      redirect: "/dashboard",
      component: () => import("pages/HomePage.vue"),
      children: [
        {
          path: "dashboard",
          name: "Dashboard",
          mate: {
            icon: "plus",
            showMenu: true
          },
          component: () => import("pages/dashboard/Dashboard.vue")
        },
        {
          path: "about",
          name: "About",
          component: () => import("pages/exception/403")
        }
      ]
    },

  ]
}
export {routersConfig}