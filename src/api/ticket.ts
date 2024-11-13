import { http } from "@/utils/http";


export type TicketResult<T> = {
  code: number;
  data: T;
  msg: string;
};
export type TicketList<U> = {
  pageNum: number;
  pageSize: number;
  sortField: string;
  sortOrder: string;
  totalPages: number;
  totalSize: number;
  list: U[]
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
  ticket_list_repertory?: number | string;
}

export type CreateTicket = {
  ticketListName: string;             // 票列表名称
  ticketLisType: string;              // 票类型，假设只有成人票
  saleableRangeStartDate: string;     // 可售范围开始日期
  saleableRangeEndDate: string;       // 可售范围结束日期
  isEnable: string;                // 是否启用
  ticketListDetails: string;          // 票列表详情
  ticketListModel: string;            // 使用方式
  ticketListRepertory: string;        // 库存
  ticketListPrice: string;            // 票价
}

export const getTicketList = (data?: object) => {
  return http.request<TicketResult<TicketList<Ticket>>>("post", "/api/pcPay/pcFindTicketList", { data });
}


export const getDict = (string?: string) => {
  return http.request<any>("get", "/api/dic/findDicByTab?tab=" + string);
}

// pcPay / saveOrUpdateTicketList
export const saveOrUpdateTicketList = (data?: object) => {
  return http.request<TicketResult<Ticket>>("post", "/api/pcPay/saveOrUpdateTicketList", { data }, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

// pcFindTicketListById ? id = ticket_list_id_fa2946d8600e490b8bc375a4b16d552d
export const getTicketByIdApi = (id?: string) => {
  return http.request<TicketResult<Ticket>>("get", "/api/pcPay/pcFindTicketListById?id=" + id);
}


// pcPay / updateIsEnableById
export const updateIsEnableById = (id: string, isEnable: string) => {
  return http.request<any>("get", "/api/pcPay/updateIsEnableById?id=" + id + "&isEnable=" + isEnable);
}


// 修改首页介绍
export const updateIndexInfo = (data?: object) => {
  return http.request<any>("post", "/api/pcPay/saveOrUpdateTextConfiguration", { data });
}

export const getIndexInfo = (id: any) => {
  return http.request<any>("get", "/api/pcPay/findTextConfigurationById?textConfigurationId=" + id);
}
