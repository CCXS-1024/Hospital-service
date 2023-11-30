<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'

import { getAllAdminOrderList, deleteOrderList } from '@/http'
import { AdminOrder } from '@/types'
import { ElMessage, ElMessageBox } from 'element-plus'
const size = ref<number>(8)
const pageNumber = ref<number>(1)
const searchQuery = ref<string>('')
const orderList = ref<AdminOrder[]>()
const currentTotal = ref<number>(0)

const getAllList = async (size: number, num: number, query: string) => {
  const { data } = await getAllAdminOrderList(size, num, query)
  if (data.status !== 200)
    return ElMessage({
      type: 'error',
      message: '请求订单列表有问题',
    })
  orderList.value = data.data.orders
  pageNumber.value = data.data.pageNumber
  currentTotal.value = data.data.total
}

const deleteDialog = (id: number) => {
  console.log(id)
  ElMessageBox.confirm('确定删除这条信息')
    .then(async () => {
      const { data } = await deleteOrderList(id)
      if (data.status !== 200)
        return ElMessage({
          type: 'error',
          message: '删除失败',
        })
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
      getAllList(size.value, pageNumber.value, searchQuery.value)
    })
    .catch(() => {})
}

const handleClick = (value: any) => {
  pageNumber.value = value
  getAllList(size.value, pageNumber.value, searchQuery.value)
}
const search = () => {
  getAllList(size.value, pageNumber.value, searchQuery.value)
}
onMounted(() => {
  getAllList(size.value, pageNumber.value, searchQuery.value)
})
</script>

<template>
  <div>
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input
            @change.enter="search"
            v-model="searchQuery"
            placeholder="请输入患者id来查询">
            <template #append>
              <el-button
                @click="search"
                slot="append"
                :icon="Search"></el-button> </template
          ></el-input>
        </el-col>
      </el-row>

      <el-row>
        <el-table :data="orderList" stripe style="width: 100%" border>
          <el-table-column
            prop="oId"
            label="挂号单号"
            width="110px"></el-table-column>
          <el-table-column
            prop="pId"
            label="患者id"
            width="120px"></el-table-column>
          <el-table-column
            prop="oRecord"
            label="病因"
            width="400px"></el-table-column>
          <el-table-column
            prop="oDrug"
            label="药物"
            width="180px"></el-table-column>
          <el-table-column
            prop="oCheck"
            label="检查项目"
            width="180px"></el-table-column>
          <el-table-column
            prop="oTotalPrice"
            label="费用/元"
            width="80px"></el-table-column>
          <el-table-column
            prop="oStart"
            label="挂号时间"
            width="200px"></el-table-column>
          <el-table-column prop="oPriceState" label="缴费状态" width="100px">
            <template #default="scope">
              <el-tag type="success" v-if="scope.row.oPriceState === 1"
                >已缴费</el-tag
              >
              <el-tag
                type="danger"
                v-if="scope.row.oPriceState === 0 && scope.row.oState === 1"
                >没有缴费</el-tag
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
                v-if="scope.row.oState === 0 && scope.row.oState === 0"
                >未完成</el-tag
              >

              <div v-else></div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="140" fixed="right">
            <template #default="scope">
              <el-button
                style="font-size: 14px"
                type="danger"
                @click="deleteDialog(scope.row.oId)"
                >删除</el-button
              >
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
          :total="currentTotal" />
      </el-row>
    </el-card>
  </div>
</template>

<style></style>
