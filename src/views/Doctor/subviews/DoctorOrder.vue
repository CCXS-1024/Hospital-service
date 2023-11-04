<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

import { tokenDecode } from '@/utils'
import { requestToDayOrder } from '@/http'
import { getToken } from '@/http/storage'

import type { ToDayOrderList } from '@/types'
const router = useRouter()
const userName = ref<string>('')
const today = ref<string>('')
const userId = ref<string>('')
const orderData = ref<ToDayOrderList[]>([])


const nowDay = () => {
  const nowDate = new Date()
  let date = {
    year: nowDate.getFullYear(),
    month: nowDate.getMonth() + 1,
    date: nowDate.getDate(),
  }
  if (date.date < 10) {
    date.date = ('0' + date.date) as any
  }
  if (date.month < 10) {
    date.month = ('0' + date.month) as any
  }
  today.value = date.year + '-' + date.month + '-' + date.date
}

const getToDayOrder = async () => {
  const { data } = await requestToDayOrder(userId.value, today.value)
  if (data.status !== 200)
    return ElMessage({
      type: 'error',
      message: '服务器获取当前订单失效',
    })
  if (data.data) orderData.value = data.data
}

const dealClick = (oId: string, pId: string) => {
  router.push({
    path: '/dealOrder',
    query: {
      oId: oId,
      pId: pId,
    },
  })
}

onMounted(() => {
  const data = tokenDecode(getToken() as string) as any
  userName.value = data.dName
  userId.value = data.dId
  nowDay()

  getToDayOrder()
})
</script>

<template>
  <el-card>
    <el-table :data="orderData" stripe border>
      <el-table-column label="序号" type="index" width="100"> </el-table-column>
      <el-table-column label="挂号单号" prop="oId"></el-table-column>
      <el-table-column label="患者id" prop="pId"></el-table-column>
      <el-table-column label="患者姓名" prop="pName"></el-table-column>
      <el-table-column
        label="挂号时间"
        prop="oStart"
        width="200px"></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button
            type="warning"
            style="font-size: 18px"
            @click="dealClick(scope.row.oId, scope.row.pId)">
            <i class="iconfont icon-r-love" style="font-size: 18px"></i>
            处理
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<style></style>
