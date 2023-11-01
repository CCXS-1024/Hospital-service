<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import jwtDecode from 'jwt-decode'

import { ElMessage } from 'element-plus'
import MyBreadcrumb from '../components/MyBreadcrumb.vue'
import {
  requestSection,
  acquireNowMedic,
  acquireTime,
  orderSuccess,
} from '@/http'
import { getToken } from '@/http/storage'

interface OrderFormType {
  dId: number
  dName: string
  orderDate: string
  pCard: string
  pId: string
  pName: string
  oTime: string
}

const route = useRoute()
const monthDays = ref<string[]>([])
const sectionData = ref()
const dialogVisible = ref(false)
const orderForm = ref<OrderFormType>({
  dId: 0,
  dName: '',
  pId: '',
  orderDate: '',
  pCard: '',
  pName: '',
  oTime: '',
})
const orderDate = ref('')
const isShow = ref<boolean>(false)
const times = ref<string[]>([])
// 获取当前时间后7天
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

const reqSection = async () => {
  const { data } = await requestSection(route.query.sectionOpt as string)

  if (data.status !== 200) {
    return false
  }
  sectionData.value = data.data?.doctors
}

const dateClick = async (date: any) => {
  const nowDate = new Date()
  let year = nowDate.getFullYear()
  orderForm.value.orderDate = year + '-' + date
  let dateYear = year + '-' + date
  orderDate.value = dateYear

  const { data } = await acquireNowMedic(
    dateYear,
    route.query.sectionOpt as string
  )
  if (data.status !== 200) {
    return false
  }
  sectionData.value = data.data?.map((item) => item.doctor)
  isShow.value = true
}

const isTimeAfterTarget = (timeString: string) => {
  // 判断时间是否超过timeString(入参格式如：09:30)
  const currentTime = new Date()

  // 解析传入的目标时间字符串，获取小时和分钟
  const [targetHour, targetMinute] = timeString.split(':')

  // 设置要比较的时间
  const targetTime = new Date()
  targetTime.setHours(Number(targetHour))

  targetTime.setMinutes(Number(targetMinute))
  targetTime.setSeconds(0)
  console.log(targetTime)

  // 比较当前时间是否超过了目标时间
  return currentTime > targetTime
}

const openClick = async (id: number, name: string) => {
  dialogVisible.value = !dialogVisible.value

  orderForm.value.dId = id
  orderForm.value.dName = name
  const { data: res } = await acquireTime(id, orderDate.value)

  const date = new Date(orderDate.value)
  const today = new Date()
  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  const array: string[] = []

  if (!isTimeAfterTarget('09:30') || !isToday) {
    array.push('08:30-09:30  ' + ' 余号 ' + res.data?.eTOn)
  }
  if (!isTimeAfterTarget('10:30') || !isToday) {
    array.push('09:30-10:30  ' + '   余号 ' + res.data?.nTOt)
  }
  if (!isTimeAfterTarget('11:30') || !isToday) {
    array.push('10:30-11:30  ' + '   余号 ' + res.data?.tTOe)
  }
  if (!isTimeAfterTarget('15:30') || !isToday) {
    array.push('14:30-15:30  ' + '   余号 ' + res.data?.fTOf)
  }
  if (!isTimeAfterTarget('16:30') || !isToday) {
    array.push('15:30-16:30  ' + '   余号 ' + res.data?.fTOs)
  }
  if (!isTimeAfterTarget('17:30') || !isToday) {
    array.push('16:30-17:30  ' + '   余号 ' + res.data?.sTOs)
  }

  times.value = array
}

const submitOrder = async () => {
  if (!orderForm.value.oTime)
    return ElMessage({
      message: '请选择预约的时间',
      type: 'error',
    })
  const { data } = await orderSuccess(orderForm.value)
  if (data.status !== 200) {
    return ElMessage({
      type: 'error',
      message: '这段时间没有号',
    })
  }
  dialogVisible.value = false
  ElMessage({
    message: '挂号成功',
    type: 'success',
  })
  orderForm.value.oTime = ''
}

onMounted(() => {
  for (var i = 0; i < 7; i++) {
    nowDay(i)
  }

  const token = getToken()
  if (token !== null) {
    const res: { pName: string; pCard: string; pId: string } = jwtDecode(token)
    orderForm.value.pName = res.pName
    orderForm.value.pId = res.pId
    orderForm.value.pCard = res.pCard
  }
})

onMounted(() => {
  reqSection()
})
</script>

<template>
  <div class="selection-x">
    <el-card>
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
              <el-button @click="dateClick(monthDay)">
                {{ monthDay }}</el-button
              >
            </li>
          </ul>
        </div>
      </div>

      <el-table stripe width="100%" :data="sectionData">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="dId" label="工号" width="80"> </el-table-column>

        <el-table-column prop="dName" label="姓名" width="80">
        </el-table-column>
        <el-table-column prop="dGender" label="性别" width="60">
        </el-table-column>
        <el-table-column prop="dPost" label="职位" width="100">
        </el-table-column>
        <el-table-column
          prop="dSection"
          label="科室"
          width="100"></el-table-column>
        <el-table-column prop="dIntroduction" label="简介"> </el-table-column>
        <el-table-column prop="dPrice" label="挂号费用/元" width="200">
        </el-table-column>
        <!-- <el-table-column
          prop="dAvgStar"
          label="评价/5分"
          width="100"
          v-if="isShow">
        </el-table-column> -->

        <el-table-column label="操作" width="100" v-if="isShow">
          <template #default="scope">
            <el-button
              @click="openClick(scope.row.dId, scope.row.dName)"
              type="success"
              >挂号</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog center title="选择挂号时间" v-model="dialogVisible">
      <el-select v-model="orderForm.oTime" placeholder="请选择">
        <el-option
          v-for="time in times"
          :key="time"
          :label="time"
          :value="time">
        </el-option>
      </el-select>

      <div class="order-btn">
        <el-button type="primary" @click="submitOrder">确定</el-button>
      </div>
    </el-dialog>
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
    li {
      margin-right: 10px;
    }
  }
}
.order-btn {
  margin-top: 20px;
}
</style>
