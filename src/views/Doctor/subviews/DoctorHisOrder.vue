<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { tokenDecode } from '@/utils'
import { getToken } from '@/http/storage'

import { requestOrders, OrderListConfig } from '@/http'
import { ElMessage } from 'element-plus'

const uerId = ref<string>('')
const query = ref<string>('')
const size = ref<number>(8)
const pageNumber = ref<number>(1)
const orderDataList = ref<OrderListConfig>()

const handleClick = (value: number) => {
  console.log(value)
  pageNumber.value = value
  handleReqList()
}

const handleReqList = async () => {
  const { data: res } = await requestOrders(
    uerId.value,
    size.value,
    pageNumber.value,
    query.value
  )
  if (res.status !== 200)
    return ElMessage({
      type: 'error',
      message: '获取历史挂号列表出错',
    })
  if (res.data) orderDataList.value = res.data
}

onMounted(() => {
  const data = tokenDecode(getToken() as string) as any
  uerId.value = data.dId

  handleReqList()
})
</script>

<template>
  <el-card>
    <el-row>
      <el-col :span="6">
        <el-input placeholder="请输入名称查询" class="drugInput">
          <template #append>
            <el-button slot="append" :icon="Search"></el-button>
          </template>
        </el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-table :data="orderDataList?.orders" stripe style="width: 100%" border>
        <el-table-column
          prop="oId"
          label="挂号单号"
          width="120"></el-table-column>
        <el-table-column prop="pId" label="患者id" width="120">
        </el-table-column>
        <el-table-column
          prop="oRecord"
          label="病因"
          width="300px"></el-table-column>
        <el-table-column prop="oDrug" label="药物"></el-table-column>
        <el-table-column
          prop="oCheck"
          label="检查项目"
          width="180px"></el-table-column>
        <el-table-column
          prop="oTotalPrice"
          label="需交费用/元"
          width="80px"></el-table-column>
        <el-table-column
          prop="oStart"
          label="挂号时间"
          width="190px"></el-table-column>
        <el-table-column prop="oEnd" label="医生回复时间" width="180px">
          <template #default="scope">
            <div v-if="scope.row.oEnd">{{ scope.row.oEnd }}</div>
            <el-tag type="error" v-else>请先处理挂号</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="oPriceState" label="缴费状态" width="100px">
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.oPriceState === 1"
              >已缴费</el-tag
            >
            <el-tag
              type="danger"
              v-else-if="scope.row.oPriceState === 0 && scope.row.oState === 1"
              >未缴费</el-tag
            >
            <el-tag type="error" v-else>未完成</el-tag>
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
            <el-tag v-else type="success">已完成</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row>
      <el-pagination
        v-model:current-page="pageNumber"
        :page-size="size"
        layout="total,prev, pager, next"
        @current-change="handleClick"
        :total="orderDataList?.total" />
    </el-row>
  </el-card>
</template>

<style></style>
