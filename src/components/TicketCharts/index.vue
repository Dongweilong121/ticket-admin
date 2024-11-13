<template>
  <div>
    <div class="flex flex-row justify-between items-center m-[20px_20px_0_20px]">
      <div class="text-2xl font-bold">
        {{ title }}
      </div>
      <div v-if="showBtn">
        <el-radio-group v-model="days">
          <el-radio-button value="fixed" @click="fetchData(7)">近7日</el-radio-button>
          <el-radio-button value="auto" @click="fetchData(15)">近15日</el-radio-button>
        </el-radio-group>
      </div>
    </div>
    <div ref="chart" style="width: 100%; height: 400px;"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import { getSailChartCount, getRefundChartCount, getAgeCount, getSexCount, getAreaCount } from '@/api/model';

export default {
  name: 'TicketChart',
  props: {
    data: Array,
    title: {
      type: String,
      default: '数据统计',
    },
    case: {
      type: Number,
      default: 0,
    }
  },
  data() {
    return {
      days: 'fixed',
      chart: null
    };
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$refs.chart) {
        this.chart = echarts.init(this.$refs.chart);
        this.fetchData(7);

        // 添加 ResizeObserver
        const resizeObserver = new ResizeObserver(() => {
          this.chart && this.chart.resize();
        });
        resizeObserver.observe(this.$refs.chart);
      }
    });
  },
  methods: {
    async fetchData(days) {
      try {
        let filterData = [];
        if (this.showBtn) {
          filterData = await this.getData(days, this.case);
        } else {
          filterData = await this.getData2(this.case);
        }

        // 数据格式检查
        if (filterData && Array.isArray(filterData)) {
          console.log('Data to be rendered:', filterData);
          this.updateChart(filterData);
        }
      } catch (error) {
        console.error('Error in fetchData:', error);
      }
    },
    async getData(days, type) {
      switch (type) {
        case 0:
          const res = await getSailChartCount(days);
          if (res.code == 1) {
            const data = this.mergeArrays(res.data.days, res.data.counts);
            return data;
          } else {
            console.log(res.msg);
          }
          break;
        case 1:
          const res2 = await getRefundChartCount(days);
          if (res2.code == 1) {
            const data = this.mergeArrays(res2.data.days, res2.data.counts);
            return data;
          } else {
            console.log(res2.msg);
          }
          break;
        default:
          break;
      }
    },
    async getData2(type) {
      switch (type) {
        case 2:
          const res = await getAgeCount();
          if (res.code == 1) {
            const data = this.mergeArrays(res.data.ageArr, res.data.peopleCountArr);
            return data;
          } else {
            console.log(res.msg);
          }
          break;
        case 3:
          const res2 = await getSexCount(7);
          if (res2.code == 1) {
            const data = this.mergeArrays(res2.data.genderArr, res2.data.peopleCountArr);
            return data;
          } else {
            console.log(res2.msg);
          }
          break;
        case 4:
          const res3 = await getAreaCount();
          if (res3.code == 1) {
            const data = this.mergeArrays(res3.data.regionArr, res3.data.ticketsCountArr);
            return data;
          } else {
            console.log(res3.msg);
          }
          break;
        default:
          break;
      }
    },
    mergeArrays(arr1, arr2) {
      if (arr1.length !== arr2.length) {
        return [];
      }
      const result = [];
      for (let i = 0; i < arr1.length; i++) {
        result.push({ date: arr1[i], quantity: arr2[i] });
      }
      return result;
    },
    updateChart(data) {
      const option = {
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        tooltip: {
          trigger: 'item'
        },
        xAxis: {
          type: 'category',
          data: data.map(item => item.date),
          axisLabel: {
            interval: 0,
            rotate: 30,
            fontSize: 12
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            type: 'bar',
            data: data.map(item => item.quantity),
            itemStyle: {
              color: '#4285F4'
            }
          }
        ]
      };

      this.chart.setOption(option);
    }
  },
  computed: {
    showBtn: function () {
      if (this.case == 0 || this.case == 1) {
        return true
      }
    }
  },
  beforeDestroy() {
    // 清理事件监听和图表实例
    if (this._resizeHandler) {
      window.removeEventListener('resize', this._resizeHandler);
    }
    if (this.chart) {
      this.chart.dispose();
      this.chart = null;
    }
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
