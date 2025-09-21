import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "404",
  },
  {
    path: "/guest-book",
    name: "GuestBook",
    component: () => import("@/views/GuestBook.vue"),
  },
  {
    path: "/guest-book/list",
    name: "GuestBookList",
    component: () => import("@/views/GuestBookList.vue"),
  },
  {
    path: "/:guestCode",
    name: "Home",
    component: () => import("@/views/Home.vue"),
    beforeEnter: (to: any) => {
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(to.params.guestCode as string)) {
        return { name: "NotFound" }; // atau redirect ke 404
      }
    },
  },
  {
    path: "/404",
    name: "NotFound",
    component: () => import("@/views/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
