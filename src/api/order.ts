import { TicketResult, TicketList } from "@/api/ticket";
import { http } from "@/utils/http";

export type OrderType = {
  saleable_range_end_date: string; //可售范围结束时间
  residue_pay_time: string; //剩余支付时间
  is_enable: string; //是否启用
  ticket_list_name: string; //票类名称
  tourist_data_idno: string; //游客证件号
  order_number: string; //订单号
  ticket_list_type: string; //票类类型
  tourist_data_phone: string; //游客手机号
  saleable_range_start_date: string; //可售范围开始时间
  pay_off_time: string; //最晚支付时间
  play_time: string; //游玩时间
  order_list_state_str: string; //订单状态
  order_list_state: string; //订单状态
  order_list_id: string; //订单表ID
  ticket_list_price: number; //价格
  tourist_data_name: string; //游客名称
}


export const getOrderList = (data?: object) => {
  return http.request<TicketResult<TicketList<OrderType>>>("post", "/api/pcPay/pcFindOrderList", { data });
}
