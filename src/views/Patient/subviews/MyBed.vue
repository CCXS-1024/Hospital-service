<script setup lang="ts">
import { onMounted, ref } from 'vue'

import { ElMessage } from 'element-plus'

import { requestBedOrder } from '@/http'
import { getToken } from '@/http/storage'
import { tokenDecode } from '@/utils'
import type { OrderList } from '@/types'

let bedOrderList = ref<OrderList[]>([])

const getAllBedOrder = async (id: string) => {
  const { data } = await requestBedOrder(id)

  if (data.status !== 200) {
    return ElMessage({
      type: 'error',
      message: '获取信息失败',
    })
  }
  bedOrderList.value = data.data as OrderList[]
}

onMounted(() => {
  const id = tokenDecode(getToken() as string)?.pId

  getAllBedOrder(id!)
})
</script>

<template>
  <div>
    <el-card>
      <el-table border :data="bedOrderList" style="width: 100%">
        <el-table-column label="床号" prop="bId"></el-table-column>
        <el-table-column label="住院原因" prop="bReason"></el-table-column>
        <el-table-column label="住院开始时间" prop="bstart"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<style lang="scss"></style>
