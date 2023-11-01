<script setup lang="ts">
import { requestOrder } from '@/http'
import { onMounted, ref } from 'vue'
import jwtDecode from 'jwt-decode'

import { getToken } from '@/http/storage'
import { ElMessage } from 'element-plus'

const orderList = ref<string[]>([])

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
          width="75px"></el-table-column>
        <el-table-column
          prop="pId"
          label="本人id"
          width="75px"></el-table-column>
        <el-table-column
          prop="pName"
          label="姓名"
          width="75px"></el-table-column>
        <el-table-column
          prop="dId"
          label="医生id"
          width="75px"></el-table-column>
        <el-table-column
          prop="dName"
          label="医生姓名"
          width="75px"></el-table-column>

        <el-table-column
          prop="oStart"
          label="挂号时间"
          width="195px"></el-table-column>
        <el-table-column
          prop="oEnd"
          label="结束时间"
          width="185px"></el-table-column>
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
              v-else-if="scope.row.oPriceState === 0 && scope.row.oState === 1">
              点击缴费</el-button
            >
            <div v-else>医生还没回复</div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style></style>
