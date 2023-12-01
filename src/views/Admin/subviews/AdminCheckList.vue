<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'

import { Search } from '@element-plus/icons-vue'

import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

import {
  getAllCheckItem,
  addCheckList,
  getCheckItem,
  updateCheckItem,
  deleCheckItem,
} from '@/http'
import { CheckItem } from '@/types'

const size = ref<number>(8)
const pageNumber = ref<number>(1)
const searchQuery = ref<string>('')
const currentTotal = ref<number>(0)
const checkList = ref<CheckItem[]>()
const isShowAdd = ref<boolean>(false)
const isShowUpdate = ref<boolean>(false)

//add
const ruleFormAdd = reactive<CheckItem>({
  chId: null as any,
  chName: '',
  chPrice: null as any,
})
const formAddRef = ref<FormInstance>()
// update
let ruleFormUpdate = reactive<CheckItem>({
  chId: null as any,
  chName: '',
  chPrice: null as any,
})
const formUpdateRef = ref<FormInstance>()

const search = () => {
  getAllList(size.value, pageNumber.value, searchQuery.value)
}

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

const openAdd = () => {
  isShowAdd.value = !isShowAdd.value
}

const modifyDialog = async (id: number) => {
  isShowUpdate.value = !isShowAdd.value
  const { data } = await getCheckItem(id)
  if (data.status !== 200)
    return ElMessage({
      type: 'error',
      message: '获取当前检查项目信息失败',
    })
  ruleFormUpdate = Object.assign(ruleFormUpdate, data.data)
}

const deleteDialog = (id: number) => {
  ElMessageBox.confirm('确定删除这个项目信息', '提示', {
    type: 'warning',
  })
    .then(async () => {
      const { data } = await deleCheckItem(id)
      if (data.status !== 200)
        return ElMessage({
          type: 'error',
          message: '删除项目信息失败',
        })
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
      getAllList(size.value, pageNumber.value, searchQuery.value)
    })
    .catch(() => {})
}

const handleClick = (value: number) => {
  pageNumber.value = value
  getAllList(size.value, pageNumber.value, searchQuery.value)
}
const submitAdd = (formEl: FormInstance | undefined) => {
  if (!formEl) return

  formEl.validate(async (valid, fields) => {
    if (!valid) return
    const { chId, chName, chPrice } = ruleFormAdd
    const { data } = await addCheckList(chId, chName, chPrice)
    if (data.status !== 200)
      return ElMessage({
        type: 'error',
        message: '编号不合法或已被占用！',
      })
    ElMessage({
      type: 'success',
      message: '添加检查项目信息成功',
    })
    getAllList(size.value, pageNumber.value, searchQuery.value)
    isShowAdd.value = !isShowAdd.value
    formEl.resetFields()
  })
}

const submitUpdate = (formEl: FormInstance | undefined) => {
  if (!formEl) return

  formEl.validate(async (valid, fields) => {
    if (!valid) return

    const { chId, chName, chPrice } = ruleFormUpdate
    const { data } = await updateCheckItem(chId, chName, chPrice)
    if (data.status !== 200)
      return ElMessage({
        type: 'error',
        message: '修改检查项目信息失败',
      })
    ElMessage({
      type: 'success',
      message: '修改检查项目信息成功',
    })
    getAllList(size.value, pageNumber.value, searchQuery.value)
    isShowUpdate.value = !isShowUpdate.value
  })
}
onMounted(() => {
  getAllList(size.value, pageNumber.value, searchQuery.value)
})

const rules = reactive<FormRules<typeof ruleFormAdd>>({
  chId: [
    { required: true, message: '编号不能为空', trigger: 'blur' },
    { type: 'number', message: '你输入的编号不合法', trigger: 'blur' },
  ],
  chName: [{ required: true, message: '项目名称不能为空', trigger: 'blur' }],
  chPrice: [{ required: true, message: '价格不能为空', trigger: 'blur' }],
})
</script>

<template>
  <el-card>
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input
          @change.enter="search"
          v-model="searchQuery"
          placeholder="请输入项目名称查询">
          <template #append>
            <el-button
              @click="search"
              slot="append"
              :icon="Search"></el-button> </template
        ></el-input>
      </el-col>
      <el-col :span="5">
        <el-button type="success" @click="openAdd">添加检查项目</el-button>
      </el-col>
    </el-row>

    <el-row>
      <el-table :data="checkList" stripe style="width: 100%">
        <el-table-column label="编号" prop="chId"></el-table-column>
        <el-table-column label="项目" prop="chName"></el-table-column>
        <el-table-column label="价格/元" prop="chPrice"></el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button type="primary" @click="modifyDialog(scope.row.chId)">
              修改
            </el-button>
            <el-button
              style="font-size: 14px"
              type="danger"
              @click="deleteDialog(scope.row.chId)">
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
  <!-- checkListAdd -->
  <el-dialog v-model="isShowAdd" title="添加检查项目">
    <el-form :model="ruleFormAdd" :rules="rules" ref="formAddRef">
      <el-form-item label="编号" prop="chId" label-width="80px">
        <el-input v-model.number="ruleFormAdd.chId"></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="chName" label-width="80px">
        <el-input v-model="ruleFormAdd.chName"></el-input>
      </el-form-item>
      <el-form-item label="价格" prop="chPrice" label-width="80px">
        <el-input v-model="ruleFormAdd.chPrice"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="isShowAdd = !isShowAdd">取消</el-button>
        <el-button type="primary" @click="submitAdd(formAddRef)"
          >确定</el-button
        >
      </span>
    </template></el-dialog
  >
  <!-- updateCheck -->
  <el-dialog v-model="isShowUpdate" title="修改检查项目">
    <el-form :model="ruleFormUpdate" :rules="rules" ref="formUpdateRef">
      <el-form-item label="名称" prop="chName" label-width="80px">
        <el-input v-model="ruleFormUpdate.chName"></el-input>
      </el-form-item>
      <el-form-item label="价格" prop="chPrice" label-width="80px">
        <el-input v-model="ruleFormUpdate.chPrice"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="isShowUpdate = !isShowUpdate">取消</el-button>
        <el-button type="primary" @click="submitUpdate(formUpdateRef)"
          >确定</el-button
        >
      </span>
    </template></el-dialog
  >
</template>

<style></style>
