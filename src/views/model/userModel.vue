<script setup lang='ts'>
import { ref } from 'vue'
import TicketChart from '@/components/TicketCharts/index.vue';

defineOptions({
  name: 'userModel'
})
const ticketData = ref([
  { date: '2024-04-20', quantity: 600 },
  { date: '2024-04-19', quantity: 400 },
  { date: '2024-04-19', quantity: 400 },
  { date: '2024-04-19', quantity: 400 },
  { date: '2024-04-19', quantity: 400 },
  { date: '2024-04-19', quantity: 400 },
  { date: '2024-04-19', quantity: 400 },
  { date: '2024-04-19', quantity: 400 },
  { date: '2024-04-19', quantity: 400 },
  { date: '2024-04-19', quantity: 400 },
  { date: '2024-04-19', quantity: 400 },
  { date: '2024-04-19', quantity: 400 },
  { date: '2024-04-19', quantity: 400 },
  { date: '2024-04-19', quantity: 400 },
  { date: '2024-04-19', quantity: 400 },
  { date: '2024-04-19', quantity: 400 },
  { date: '2024-04-19', quantity: 400 },
  { date: '2024-04-19', quantity: 400 },
  { date: '2024-04-19', quantity: 400 },
  { date: '2024-04-19', quantity: 400 },
  { date: '2024-04-19', quantity: 400 },
  { date: '2024-04-19', quantity: 400 },
  { date: '2024-04-19', quantity: 400 },
  { date: '2024-04-19', quantity: 400 },
  // 添加更多数据
])
</script>

<template>
  <div>
    <div class="flex flex-row items-center justify-between ">
      <el-card shadow="never" style="margin-top: 20px;padding: 20px; border-radius:10px;width: 49%;">
        <TicketChart :data="ticketData" title="游客年龄" :case="2" />
      </el-card>
      <el-card shadow="never" style="margin-top: 20px;padding: 20px; border-radius:10px;width: 49%;">
        <TicketChart :data="ticketData" title="性别" :case="3" />
      </el-card>
    </div>
    <div>
      <el-card shadow="never" style="margin-top: 20px;padding: 20px; border-radius:10px;">
        <TicketChart :data="ticketData" title="地区统计" :case="4" />
      </el-card>
    </div>

  </div>
</template>

<style lang='scss' scoped></style>
