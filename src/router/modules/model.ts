

// 最简代码，也就是这些字段必须有
export default {
  path: "/model",
  redirect: "/model/ticketModel",
  meta: {
    title: "数据看板",
    icon: "material-symbols:home",
    rank: 1
  },
  children: [
    {
      path: "/model/ticketModel",
      name: "ticketModel",
      component: () => import("@/views/model/ticketModel.vue"),
      meta: {
        title: "票务数据"
      }
    },
    {
      path: "/model/userModel",
      name: "userModel",
      component: () => import("@/views/model/userModel.vue"),
      meta: {
        title: "游客数据"
      }
    }
  ]
};
