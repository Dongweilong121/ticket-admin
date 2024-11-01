<template>
  <div>
    <div class="flex flex-row justify-between items-center m-[20px_20px_0_20px]">
      <div class="text-2xl font-bold">
        门票统计
      </div>
      <div class="">
        <!-- <button @click="fetchData(7)">近7日</button>
        <button @click="fetchData(15)">近15日</button> -->
        <el-radio-group>
          <el-radio-button value="fixed">fixed</el-radio-button>
          <el-radio-button value="auto">auto</el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div ref="chart" style="width: 100%; height: 400px;"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'TicketChart',
  props: {
    data: Array,
  },
  mounted() {
    this.chart = echarts.init(this.$refs.chart);
    this.fetchData(7); // 默认展示近7日数据
  },
  methods: {
    fetchData(days) {
      // 根据天数获取数据
      const filterData = this.getFilteredData(days);
      this.updateChart(filterData);
    },
    getFilteredData(days) {
      // 模拟数据过滤
      return this.data.slice(-days);
    },
    updateChart(data) {
      const option = {
        tooltip: {
          trigger: 'axis',
          formatter: (params) => {
            const { value, name } = params[0];
            return `售票数量: ${value}<br />日期: ${name}`;
          },
        },
        xAxis: {
          type: 'category',
          data: data.map((item) => item.date),
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: data.map((item) => item.quantity),
            type: 'bar',
            itemStyle: {
              color: '#4285F4',
            },
          },
        ],
      };
      this.chart.setOption(option);
    },
  },
};
</script>

<style scoped>
button {
  margin-right: 10px;
  padding: 5px 10px;
  background-color: #4285F4;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #2c6ff3;
}
</style>
