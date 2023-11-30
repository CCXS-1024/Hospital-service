<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { Search } from '@element-plus/icons-vue'

import { findAllList, addDrugItem, getDrugItem, updateDrugItem } from '@/http'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'

import { DrugItem, DrugForm } from '@/types'

const size = ref<number>(8)
const pageNumber = ref<number>(1)
const searchQuery = ref<string>('')
const drugList = ref<DrugItem[]>([])
const currentTotal = ref<number>(0)

// add
const isShowAdd = ref<boolean>(false)
const ruleFormAddRef = ref<FormInstance>()
const ruleFormAdd = reactive<DrugForm>({
  drId: null,
  drName: '',
  drNumber: null,
  drUnit: '',
  drPrice: '',
  drPublisher: '',
})
//  update
const isShowUpdate = ref<boolean>(false)
let ruleFormUpdate = reactive<DrugForm>({
  drId: null,
  drName: '',
  drNumber: null,
  drUnit: '',
  drPrice: '',
  drPublisher: '',
})
const ruleFormUpdateRef = ref<FormInstance>()

const getAllDrugList = async (size: number, num: number, query: string) => {
  const { data } = await findAllList(size, num, query)
  if (data.status !== 200)
    return ElMessage({
      type: 'error',
      message: '服务器获取列表信息失败',
    })
  drugList.value = data.data.drugs
  currentTotal.value = data.data.total
}

const handleClick = (value: number) => {
  pageNumber.value = value
  getAllDrugList(size.value, pageNumber.value, searchQuery.value)
}

const modifyDialog = async (id: number) => {
  isShowUpdate.value = !isShowUpdate.value
  const { data } = await getDrugItem(id)
  if (data.status !== 200)
    return ElMessage({
      type: 'error',
      message: '获取当前药品信息失败',
    })
  if (data.data) {
    ruleFormUpdate = Object.assign(ruleFormUpdate, data.data)
  }
}

const deleteDialog = (id: number) => {}

const submitAdd = async (formEl: FormInstance | undefined) => {
  if (!formEl) return

  formEl.validate(async (valid, fields) => {
    if (!valid) return

    const { drId, drName, drNumber, drPrice, drPublisher, drUnit } = ruleFormAdd
    const { data } = await addDrugItem(
      drId as number,
      drName,
      drNumber as number,
      drUnit,
      drPrice,
      drPublisher
    )
    if (data.status !== 200)
      return ElMessage({ type: 'error', message: '编号已经被占用' })

    ElMessage({ type: 'success', message: '添加成功' })
    isShowAdd.value = !isShowAdd.value
    getAllDrugList(size.value, pageNumber.value, searchQuery.value)
    formEl.resetFields()
  })
}

const submitUpdatae = async (formEl: FormInstance | undefined) => {
  if (!formEl) return

  formEl.validate(async (valid, fields) => {
    if (!valid) return
    const { drId, drName, drNumber, drPrice, drPublisher, drUnit } =
      ruleFormUpdate
    const { data } = await updateDrugItem(
      drId as number,
      drName,
      drNumber as number,
      drUnit,
      drPrice,
      drPublisher
    )
    if (data.status !== 200)
      return ElMessage({ type: 'error', message: '药品信息修改失败' })
    ElMessage({
      type: 'success',
      message: '修改成功',
    })
    isShowUpdate.value = !isShowUpdate.value
    getAllDrugList(size.value, pageNumber.value, searchQuery.value)
  })
}

const search = () => {
  getAllDrugList(size.value, pageNumber.value, searchQuery.value)
}
onMounted(() => {
  getAllDrugList(size.value, pageNumber.value, searchQuery.value)
})

const rules = reactive<FormRules<typeof ruleFormAdd>>({
  drId: [
    { required: true, message: '编号不能为空', trigger: 'blur' },
    { type: 'number', message: '你输入的编号不合法', trigger: 'blur' },
  ],
  drName: [
    {
      required: true,
      message: '你输入的药品名不能为空',
      trigger: 'blur',
    },
  ],
  drNumber: [
    {
      required: true,
      message: '不能为空',
      trigger: 'blur',
    },
  ],
  drUnit: [
    {
      required: true,
      message: '不能为空',
      trigger: 'blur',
    },
  ],
  drPrice: [
    {
      required: true,
      message: '不能为空',
      trigger: 'blur',
    },
  ],
  drPublisher: [
    {
      required: true,
      message: '不能为空',
      trigger: 'blur',
    },
  ],
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
        <el-button @click="isShowAdd = !isShowAdd" type="success"
          >添加药品</el-button
        >
      </el-col>
    </el-row>
    <el-row class="table-x">
      <el-table :data="drugList">
        <el-table-column label="编号" prop="drId"></el-table-column>
        <el-table-column label="名称" prop="drName"></el-table-column>
        <el-table-column label="剩余数量" prop="drNumber"></el-table-column>
        <el-table-column label="单位" prop="drUnit"></el-table-column>
        <el-table-column label="单价" prop="drPrice"></el-table-column>
        <el-table-column label="出版商" prop="drPublisher"></el-table-column>
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

  <el-dialog v-model="isShowAdd" title="添加药品">
    <el-form :model="ruleFormAdd" :rules="rules" ref="ruleFormAddRef">
      <el-form-item label="编号" prop="drId" label-width="80px">
        <el-input v-model.number="ruleFormAdd.drId"></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="drName" label-width="80px">
        <el-input v-model="ruleFormAdd.drName"></el-input>
      </el-form-item>
      <el-form-item label="数量" prop="drNumber" label-width="80px">
        <el-input-number
          v-model="ruleFormAdd.drNumber"
          :min="0"
          :max="1000"></el-input-number>
      </el-form-item>
      <el-form-item label="单位" prop="drUnit" label-width="80px">
        <el-radio v-model="ruleFormAdd.drUnit" label="盒">盒</el-radio>
        <el-radio v-model="ruleFormAdd.drUnit" label="袋">袋</el-radio>
        <el-radio v-model="ruleFormAdd.drUnit" label="剂">剂</el-radio>
      </el-form-item>
      <el-form-item label="单价" prop="drPrice" label-width="80px">
        <el-input v-model="ruleFormAdd.drPrice"></el-input>
      </el-form-item>
      <el-form-item label="出版商" prop="drPublisher" label-width="80px">
        <el-input v-model="ruleFormAdd.drPublisher"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="isShowAdd = !isShowAdd">取消</el-button>
        <el-button @click="submitAdd(ruleFormAddRef)" type="primary"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="isShowUpdate" title="修改药品">
    <el-form :model="ruleFormUpdate" :rules="rules" ref="ruleFormUpdateRef">
      <el-form-item label="名称" prop="drName" label-width="80px">
        <el-input v-model="ruleFormUpdate.drName"></el-input>
      </el-form-item>
      <el-form-item label="数量" prop="drNumber" label-width="80px">
        <el-input-number
          v-model="ruleFormUpdate.drNumber"
          :min="0"
          :max="1000"></el-input-number>
      </el-form-item>
      <el-form-item label="单位" prop="drUnit" label-width="80px">
        <el-radio v-model="ruleFormUpdate.drUnit" label="盒">盒</el-radio>
        <el-radio v-model="ruleFormUpdate.drUnit" label="袋">袋</el-radio>
        <el-radio v-model="ruleFormUpdate.drUnit" label="剂">剂</el-radio>
      </el-form-item>
      <el-form-item label="单价" prop="drPrice" label-width="80px">
        <el-input v-model="ruleFormUpdate.drPrice"></el-input>
      </el-form-item>
      <el-form-item label="出版商" prop="drPublisher" label-width="80px">
        <el-input v-model="ruleFormUpdate.drPublisher"></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="isShowUpdate = !isShowUpdate">取消</el-button>
        <el-button type="primary" @click="submitUpdatae(ruleFormUpdateRef)"
          >确定</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<style></style>
