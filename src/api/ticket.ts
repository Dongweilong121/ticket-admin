import { http } from "@/utils/http";


export type TicketResult<T> = {
  code: number;
  data: T;
  msg: string;
};
export type TicketList = {
  pageNum: number;
  pageSize: number;
  sortField: string;
  sortOrder: string;
  totalPages: number;
  totalSize: number;
  list: Ticket[]
};
export type Ticket = {
  is_enable: string;
  saleable_range_end_date: string;
  saleable_range_start_date: string;
  ticket_list_id: string;
  ticket_list_model: string;
  ticket_list_name: string;
  ticket_list_details: string;
  ticket_list_type: string;
  storage_file_path: string;
  ticket_list_price: number;
}

export const getTicketList = (data?: object) => {
  return http.request<TicketResult<TicketList>>("post", "/api/wxPay/wxFindTicketList", { data });
}


export const getDict = (string?: string) => {
  return http.request<any>("get", "/api/dic/findDicByTab?tab=ticket_list_type?tab=" + string);
}
