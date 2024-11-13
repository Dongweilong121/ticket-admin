<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import TicketChart from '@/components/TicketCharts/index.vue';
import { getSailCount, getRefundCount, getNowCount, getExportSaleTop, getExportRefundTop, getExportNowTop } from '@/api/model';

defineOptions({
  name: 'ticketModel'
})
const cardData = ref([
  {
    name: '售票数量',
    num: 100,
    price: 4500,
    title: '售票金额',
    icon: 'ep:wallet',
    color: '#2368f2',
    date: 7
  },
  {
    name: '退票数量',
    num: 100,
    price: 1530,
    title: '退款金额',
    icon: 'ep:tickets',
    color: '#fe9325',
    date: 7
  },
  {
    name: '在馆人数',
    num: 100,
    price: 1340,
    title: '今日进馆人数',
    icon: 'ep:user',
    color: '#30c014',
    date: 7
  },
])
const loading = ref(false)
const options = [
  {
    value: 7,
    label: '7天'
  },
  {
    value: 15,
    label: '15天'
  }
]
const fetchData0 = async (date) => {
  const res = await getSailCount(date)
  if (res.code == 1) {
    cardData.value[0].num = res.data[0].pay_count
    cardData.value[0].price = res.data[0].pay_price
  }
}
const fetchData1 = async (date) => {
  const res = await getRefundCount(date)
  if (res.code == 1) {
    cardData.value[1].num = res.data[0].refund_count
    cardData.value[1].price = res.data[0].refund_price
  }
}
const fetchData2 = async (date) => {
  const res = await getNowCount(date)
  if (res.code == 1) {
    cardData.value[2].num = res.data.overall[0].attendance_count
    cardData.value[2].price = res.data.present[0].attendance_count
  }
}

const handleExport = async (res: any, fileName: string) => {
  const blob = new Blob([res], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(link.href);
}

const exportFn = (index: number, date: number) => {
  loading.value = true
  setTimeout(async () => {
    try {
      let res;
      let fileName;
      switch (index) {
        case 0:
          res = await getExportSaleTop(date);
          console.dir(res)
          fileName = '售票数量';
          break;
        case 1:
          res = await getExportRefundTop(date);
          fileName = '退票数量';
          break;
        case 2:
          res = await getExportNowTop(date);
          fileName = '在馆人数';
          break;
        default:
          return;
      }
      await handleExport(res, fileName);
    } finally {
      loading.value = false;
    }
  }, 800);
}
const changeTop = (index: number, date: number) => {
  switch (index) {
    case 0:
      fetchData0(date)
      break;
    case 1:
      fetchData1(date)
      break;
    case 2:
      fetchData2(date)
      break;
    default:
      break;
  }
}

onMounted(() => {
  setTimeout(() => {
    fetchData0(7)
    fetchData1(7)
    fetchData2(7)
  }, 100)
})
</script>

<template>
  <div>

    <div class="flex flex-row justify-between items-center " v-loading="loading" element-loading-text="导出中...">
      <el-card :style="`min-width: 30%;border-radius: 10px;background-color: ${item.color};`"
        v-for="(item, index) in cardData" shadow="always">
        <template #header>
          <div class="flex items-center justify-between">
            <div class="m-3 pl-3">
              <span class="text-white text-lg">{{ item.name }}</span>
            </div>
            <div class="m-3">
              <el-select v-model="item.date" placeholder="请选择导出时间" style="width: 140px"
                @change="changeTop(index, item.date)">
                <el-option v-for="item in options" :value="item.value" :label="item.label" />
              </el-select>
              <el-button style="margin-left: 10px;" @click="exportFn(index, item.date)">导出</el-button>
            </div>

          </div>
        </template>

        <template #default>
          <div class="flex flex-row items-center m-2 pl-3">
            <div class="w-14 h-14 flex items-center justify-center bg-[#ffffff] rounded-lg">
              <IconifyIconOnline :icon="item.icon" width="40px" height="40px" :color="item.color" />
            </div>
            <span class="text-white text-3xl ml-5 inline-block font-bold">{{ item.num }}</span>
          </div>
        </template>

        <template #footer>
          <div class="text-gray-500 text-base bg-white p-3 box-border pl-5">
            <span>{{ item.title }}</span>
            :
            <span>{{ item.price }}</span>
            <span>&nbsp;{{ item.name == '在馆人数' ? '人' : "元" }}</span>
          </div>
        </template>
      </el-card>
    </div>
    <el-card shadow="never" style="margin-top: 20px;padding: 10px; border-radius: 10px;">
      <TicketChart :title="'售票数量'" :case="0" style="margin: 0 auto;" />
    </el-card>
    <el-card shadow="never" style="margin-top: 20px;padding: 20px; border-radius: 10px;">
      <TicketChart :title="'退票数量'" :case="1" />
    </el-card>



  </div>
</template>

<style lang='scss' scoped></style>
