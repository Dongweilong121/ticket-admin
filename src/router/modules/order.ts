// 最简代码，也就是这些字段必须有
export default {
  path: "/order",
  meta: {
    title: "订单模块",
    icon: "material-symbols:home",
    rank: 3
  },
  children: [
    {
      path: "/order/orderList",
      name: "orderList",
      component: () => import("@/views/order/orderList.vue"),
      meta: {
        title: "订单列表",
        showParent: true
      }
    }
  ]
};
