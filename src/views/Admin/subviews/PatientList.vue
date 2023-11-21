<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'

import { requestAllPatientList, delePatient } from '@/http'
import { ElMessage, ElMessageBox } from 'element-plus'

const size = ref<number>(8)
const pageNumber = ref<number>(1)
const searchQuery = ref<string>('')
const patientList = ref<any>({
  patients: [],
})
const getAllPatientList = async (
  size: number,
  pageNumber: number,
  query: string
) => {
  const { data } = await requestAllPatientList(size, pageNumber, query)
  if (data.status !== 200)
    return ElMessage({
      type: 'error',
      message: '服务器获取患者信息有问题',
    })

  patientList.value = data.data
}

const deleteDialog = (id: number) => {
  ElMessageBox.confirm('确定删除用户信息').then(async () => {
    console.log('删除成功')
    const { data } = await delePatient(id)
    if (data.status !== 200)
      return ElMessage({
        type: 'error',
        message: '删除失败',
      })

    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    getAllPatientList(size.value, pageNumber.value, searchQuery.value)
  })
}

onMounted(() => {
  getAllPatientList(size.value, pageNumber.value, searchQuery.value)
})

const handleClick = (value: any) => {
  pageNumber.value = value
  getAllPatientList(pageNumber.value, size.value, searchQuery.value)
}

const search = () => {
  getAllPatientList(size.value, pageNumber.value, searchQuery.value)
}
</script>

<template>
  <el-card>
    <el-row>
      <el-col :span="8">
        <el-input
          v-model="searchQuery"
          placeholder="请输入姓名查询"
          @change.enter="search">
          <template #append>
            <el-button
              slot="append"
              :icon="Search"
              @click="search"></el-button> </template
        ></el-input>
      </el-col>
    </el-row>
    <el-row>
      <el-table :data="patientList.patients" border>
        <el-table-column prop="pId" label="账号" width="120"> </el-table-column>
        <el-table-column prop="pName" label="姓名" width="80">
        </el-table-column>
        <el-table-column prop="pGender" label="性别" width="60">
        </el-table-column>
        <el-table-column prop="pAge" label="年龄/岁" width="80">
        </el-table-column>

        <el-table-column prop="pPhone" label="手机号"> </el-table-column>
        <el-table-column prop="pEmail" label="邮箱"> </el-table-column>
        <el-table-column prop="pState" label="状态" width="100">
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.pState === 1">正常</el-tag>
            <el-tag type="danger" v-else>已删除</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="danger" @click="deleteDialog(scope.row.pId as any)"
              ><i class="iconfont icon-r-delete" style="font-size: 22px"></i>
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="pageNumber"
        :page-size="size"
        layout="total,prev, pager, next"
        @current-change="handleClick"
        :total="patientList?.total" />
    </el-row>
  </el-card>
</template>

<style></style>
