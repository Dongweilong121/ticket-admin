// 最简代码，也就是这些字段必须有
export default {
  path: "/info",
  meta: {
    title: "信息管理",
    icon: "material-symbols:home",
    rank: 4
  },
  children: [
    {
      path: "/info/infoList",
      name: "infoList",
      component: () => import("@/views/info/infoList.vue"),
      meta: {
        title: "信息列表",
        showParent: true
      }
    }
  ]
};
