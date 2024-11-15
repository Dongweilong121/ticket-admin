<script setup lang='ts'>
import { getOrderList } from '@/api/order'
import { onMounted, ref } from 'vue';
import { ElMessageBox } from 'element-plus';
defineOptions({
  name: 'orderList'
})
const tableData = ref([])
const total = ref(0)
const pageSize = ref(10)
const currentPage = ref(1)
const bolMap = {
  Y: true,
  N: false
}

const getList = async () => {
  const req = {
    ticketListName: "",
    orderListState: "",
    pageNum: currentPage.value,
    pageSize: pageSize.value,
    sortField: "a.order_time",
    sortOrder: "desc"
  }
  const { code, data } = await getOrderList(req)
  if (code == 1) {
    tableData.value = data.list
    total.value = data.totalSize
  } else {
    ElMessageBox.alert('获取订单列表失败')
  }
}
onMounted(() => {
  getList()
})
const dialogVisible = ref(false)
</script>

<template>
  <div>
    <el-card shadow="never" style="margin-top: 20px;padding: 20px; border-radius:10px;">
      <el-table :data="tableData" style="width: 100%;margin-top: 20px;">
        <el-table-column fixed type="index" label="序号" width="80" align="center" />
        <el-table-column prop="order_number" label="订单号" align="center" />
        <el-table-column prop="ticket_list_name" label="票名" align="center"></el-table-column>
        <el-table-column prop="tourist_data_name" label="预定人姓名" align="center" />
        <el-table-column prop="tourist_data_phone" label="手机号" align="center" />
        <el-table-column prop="tourist_data_idno" label="身份证" align="center"></el-table-column>
        <el-table-column prop="order_time" label="下单时间" align="center"></el-table-column>
        <el-table-column prop="ticket_list_price" label="金额(元)" align="center" width="120"></el-table-column>
        <el-table-column prop="order_list_state_str" label="状态" align="center">
          <template #default="scope">
            <span :class="{
              'text-[#409EFF]': scope.row.order_list_state === 'waiting_used',
              'text-[#67C23A]': scope.row.order_list_state === 'have_used',
              'text-[#F56C6C]': scope.row.order_list_state === 'refunded',
              'text-[#E6A23C]': scope.row.order_list_state === 'obligation',
              'text-[#909399]': scope.row.order_list_state === 'canceled'
            }">
              {{ scope.row.order_list_state_str }}
            </span>
          </template>
        </el-table-column>
        <!-- <el-table-column fixed="right" label="操作" min-width="120" align="center">
          <template #default>
            <el-button link type="primary">
              查看详情
            </el-button>
          </template>
        </el-table-column> -->
      </el-table>


      <div class="mt-5 flex flex-row-reverse">
        <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
          layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="getList"
          @current-change="getList" />
      </div>

    </el-card>
  </div>
</template>

<style lang='scss' scoped></style>
