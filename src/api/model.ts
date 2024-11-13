import { http } from "@/utils/http";

// export const getAgelist = () => {
//   return http.request<any>("get", "/api/pcPay/touristAgeChart");
// }

// pcPay / saleTicketsTop ? top = 5
// 顶部销售排行
export const getSailCount = (date: any) => {
  return http.request<any>("get", "/api/pcPay/saleTicketsTop?top=" + date);
}



export const getRefundCount = (date: any) => {
  return http.request<any>("get", "/api/pcPay/refundTicketsTop?top=" + date);
}

export const getNowCount = (date: any) => {
  return http.request<any>("get", "/api/pcPay/attendanceTop?top=" + date);
}


export const getSailChartCount = (date: any) => {
  return http.request<any>("get", "/api/pcPay/saleTicketsChart?top=" + date);
}


export const getRefundChartCount = (date: any) => {
  return http.request<any>("get", "/api/pcPay/refundTicketsChart?top=" + date);
}

// 年龄
export const getAgeCount = () => {
  return http.request<any>("get", "/api/pcPay/touristAgeChart");
}

// 性别
export const getSexCount = () => {
  return http.request<any>("get", "/api/pcPay/touristSexChart");
}


// 地区
export const getAreaCount = () => {
  return http.request<any>("get", "/api/pcPay/touristRegionChart");
}


// 顶部导出售票数量
export const getExportSaleTop = (date: any) => {
  return http.request<any>("get", "/api/pcPay/exportSaleTicketsTop", { params: { top: date }, responseType: 'blob', });
}

// 导出顶部退票数量
export const getExportRefundTop = (date: any) => {
  return http.request<any>("get", "/api/pcPay/exportRefundTicketsTop", { params: { top: date }, responseType: 'blob', });
}


// 导出顶部在管人数
export const getExportNowTop = (date: any) => {
  return http.request<any>("get", "/api/pcPay/exportAttendanceTop", { params: { top: date }, responseType: 'blob', });
}
