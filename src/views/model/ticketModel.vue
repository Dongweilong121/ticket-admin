<script setup lang='ts'>
import { ref } from 'vue'
import TicketChart from '@/components/TicketCharts/index.vue';
defineOptions({
  name: 'ticketModel'
})
const cardData = ref([
  {
    name: '售票数量',
    num: 100,
    price: 4500,
    title: '售票金额',
    icon: 'ep:bell',
    color: '#2368f2'
  },
  {
    name: '退票数量',
    num: 100,
    price: 1530,
    title: '退款金额',
    icon: 'ep:bell',
    color: '#fe9325'
  },
  {
    name: '当前在馆人数',
    num: 100,
    price: 1340,
    title: '今日进馆人数',
    icon: 'ep:bell',
    color: '#30c014'
  },
])
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

    <div class="flex flex-row justify-between items-center ">
      <el-card :style="`min-width: 30%;border-radius: 10px;background-color: ${item.color};`" v-for="item in cardData"
        shadow="always">
        <template #header>
          <div class="m-3">
            <span class="text-white text-lg">{{ item.name }}</span>
          </div>
        </template>

        <template #default>
          <div class="flex flex-row items-center m-2">
            <IconifyIconOnline icon="openmoji:beaming-face-with-smiling-eyes" width="60px" height="60px" />
            <span class="text-white text-3xl ml-2 inline-block font-bold">{{ item.num }}</span>
          </div>
        </template>

        <template #footer>
          <div class="text-gray-500 text-base bg-white p-3 box-border">
            <span>{{ item.title }}</span>
            :
            <span>{{ item.price }}</span>
          </div>
        </template>
      </el-card>
    </div>
    <el-card shadow="never" style="margin-top: 20px;padding: 20px; border-radius:  10px;">
      <TicketChart :data="ticketData" />
    </el-card>
    <el-card shadow="never" style="margin-top: 20px;padding: 20px; border-radius:  10px;">
      <TicketChart :data="ticketData" />
    </el-card>

  </div>
</template>

<style lang='scss' scoped></style>
