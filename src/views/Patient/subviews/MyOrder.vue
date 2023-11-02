<script setup lang="ts">
import { requestOrder, priceClick } from '@/http'
import { onMounted, ref } from 'vue'
import jwtDecode from 'jwt-decode'

import { getToken } from '@/http/storage'
import { ElMessage } from 'element-plus'

const orderList = ref<string[]>([])

const isShow = ref<boolean>(false)

const getAllOrder = async () => {
  const token = getToken()
  let userid: any
  if (token !== null) userid = (jwtDecode(token) as any).pId

  const { data } = await requestOrder(userid)
  if (data.status !== 200)
    return ElMessage({
      message: '获取数据失败',
      type: 'error',
    })
  orderList.value = data.data
}

const handleClickPrice = async (oId: string) => {
  const { data } = await priceClick(oId)
  if (data.status !== 200)
    return ElMessage({
      type: 'error',
      message: '获取数据失败',
    })
  ElMessage({
    type: 'success',
    message: '缴费成功',
  })
  isShow.value = !isShow.value
}

const seeReport = (id: string) => {
  window.location.href = 'http://localhost:9281/patient/pdf?oId=' + id
}

onMounted(() => {
  getAllOrder()
})
</script>

<template>
  <div class="my-order">
    <el-card>
      <el-table :data="orderList" style="width: 100%">
        <el-table-column
          prop="oId"
          label="挂号单号"
          width="120px"></el-table-column>

        <el-table-column
          prop="pName"
          label="姓名"
          width="75px"></el-table-column>

        <el-table-column
          prop="dName"
          label="医生姓名"
          width="100px"></el-table-column>

        <el-table-column
          prop="oStart"
          label="挂号时间"
          width="195px"></el-table-column>
        <el-table-column
          prop="oEnd"
          label="医生回复时间"
          width="195px"></el-table-column>
        <el-table-column
          prop="oTotalPrice"
          label="需交费用/元"
          width="80px"></el-table-column>

        <el-table-column prop="oPriceState" label="缴费状态" width="150">
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.oPriceState === 1"
              >已缴费</el-tag
            >
            <el-button
              type="success"
              v-else-if="scope.row.oPriceState === 0 && scope.row.oState === 1"
              @click="handleClickPrice(scope.row.oId)">
              点击缴费</el-button
            >
            <div v-else></div>
          </template>
        </el-table-column>

        <el-table-column prop="oState" label="挂号状态" width="100px">
          <template #default="scope">
            <el-tag
              type="success"
              v-if="scope.row.oState === 1 && scope.row.oPriceState === 1"
              >已完成</el-tag
            >
            <el-tag
              type="danger"
              v-else-if="scope.row.oState === 0 && scope.row.oState === 0"
              >未完成</el-tag
            >
            <el-tag type="info" v-else>医生还没回复</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="报告单">
          <template #default="scope">
            <el-button
              type="success"
              v-if="scope.row.oState === 1 && scope.row.oPriceState === 1"
              @click="seeReport(scope.row.oId)">
              查看</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style></style>
