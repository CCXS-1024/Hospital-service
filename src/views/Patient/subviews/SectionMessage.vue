<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import MyBreadcrumb from '../components/MyBreadcrumb.vue'

const route = useRoute()
const monthDays = ref<string[]>([])
const nowDay = (num: number) => {
  const nowDate = new Date()
  const currentHour = nowDate.getHours()
  const currentMinute = nowDate.getMinutes()
  if (currentHour > 17 || (currentHour === 17 && currentMinute > 30)) {
    num++ // 次日
  }
  nowDate.setDate(nowDate.getDate() + num)
  let month: number | string = nowDate.getMonth() + 1
  let date: number | string = nowDate.getDate()
  if (date < 10) {
    date = '0' + date
  }
  if (month < 10) {
    month = '0' + month
  }
  let time = month + '-' + date
  monthDays.value.push(time)
}

onMounted(() => {
  // 计算出距离当前七天的值
  for (var i = 0; i < 7; i++) {
    nowDay(i)
  }
})
</script>

<template>
  <div class="selection-x">
    <MyBreadcrumb />

    <div class="selection-x--header">
      <div>
        <i class="iconfont icon-r-user1" style="margin: 5px; font-size: 26px">
          {{ route.query.sectionOpt }}医生列表</i
        >
      </div>

      <div>
        <i class="iconfont icon-r-paper" style="font-size: 22px">
          请选择你要挂号的日期：</i
        >
        <ul class="dateUl">
          <li v-for="monthDay in monthDays" :key="monthDay">
            <el-button> {{ monthDay }}</el-button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.selection-x--header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  .dateUl {
    display: flex;
    margin-top: 10px;
    li{
      margin-right: 10px;
    }
  }
}
</style>
