<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'

import { Search } from '@element-plus/icons-vue'

import { getAllCheckItem } from '@/http'
import { ElMessage } from 'element-plus'

import { CheckItem } from '@/types'

const size = ref<number>(8)
const pageNumber = ref<number>(1)
const searchQuery = ref<string>('')
const currentTotal = ref<number>(0)
const checkList = ref<CheckItem[]>()

const search = () => {}
const getAllList = async (size: number, num: number, query: string) => {
  const { data } = await getAllCheckItem(size, num, query)
  if (data.status !== 200)
    return ElMessage({
      type: 'error',
      message: '请求信息失败',
    })
  checkList.value = data.data.checks
  currentTotal.value = data.data.total
}

const modifyDialog = (id: number) => {}

const deleteDialog = (id: number) => {}

const handleClick = (value: number) => {
  pageNumber.value = value
  getAllList(size.value, pageNumber.value, searchQuery.value)
}
onMounted(() => {
  getAllList(size.value, pageNumber.value, searchQuery.value)
})
</script>

<template>
  <el-card>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input
          @change.enter="search"
          v-model="searchQuery"
          placeholder="请输入药品名称查询">
          <template #append>
            <el-button
              @click="search"
              slot="append"
              :icon="Search"></el-button> </template
        ></el-input>
      </el-col>
      <el-col :span="5">
        <el-button type="success">添加检查项目</el-button>
      </el-col>
    </el-row>

    <el-row>
      <el-table :data="checkList" stripe style="width: 100%">
        <el-table-column label="编号" prop="chId"></el-table-column>
        <el-table-column label="项目" prop="chName"></el-table-column>
        <el-table-column label="价格/元" prop="chPrice"></el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="primary" @click="modifyDialog(scope.row.drId)">
              修改
            </el-button>
            <el-button
              style="font-size: 14px"
              type="danger"
              @click="deleteDialog(scope.row.drId)">
              删除
            </el-button>
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
</template>

<style></style>
