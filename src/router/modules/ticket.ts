// 最简代码，也就是这些字段必须有
export default {
  path: "/ticket",
  meta: {
    title: "票务模块",
    icon: "material-symbols:home"
  },
  children: [
    {
      path: "/ticket/ticketList",
      name: "ticketList",
      component: () => import("@/views/ticket/ticketList.vue"),
      meta: {
        title: "票类列表",
        showParent: true
      }
    }
  ]
};
