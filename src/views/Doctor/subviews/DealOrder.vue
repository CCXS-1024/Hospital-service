<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { tokenDecode } from '@/utils'
import {
  requestPatient,
  requestDrug,
  addDrugBy,
  requestAllCheck,
  addCheckBy,
  reduceDrugNumber,
  submitOrder,
} from '@/http'
import { getToken } from '@/http/storage'

import { PatientInfo, DrugItem, PageItem, CheckItem } from '@/types'

const route = useRoute()
const dName = ref<string>('')
const dId = ref<string>('')
const oId = ref<string>('')
const pId = ref<string>('')
const Patient = ref<PatientInfo>()
const router = useRouter()
// 药品
const searchDrug = ref<string>('')
const sizeDrug = ref<number>(5)
const pageDrugNumber = ref<number>(1)
const drugList = ref<PageItem<DrugItem[], null>>()
const drugBuyData = ref<DrugItem[]>([])
const totalDrugPrice = ref<number>(0)
// 项目
const searchCheck = ref<string>('')
const sizeCheck = ref<number>(5)
const pageCheckNumber = ref<number>(1)
const checkList = ref<PageItem<null, CheckItem>>()
const checkBuyData = ref<any>([])
const totalcheckPrice = ref<number>(0)

const etiology = ref<string>('')
//
const isShow = ref<boolean>(false)

const dataPackage = computed(() => {
  let oDrug: string = ''
  let oCheck: string = ''
  let drugTotalPrice: number = 0
  let checkPrice: number = 0
  const drugIdList: any = new Map()
  const drugDetail: any = {}
  const checkList: any = {}

  let totalPrice: number = 0

  drugBuyData.value.forEach((item) => {
    if (!drugIdList.has(item.drName)) {
      drugDetail[item.drName + 'detail'] = item
      drugIdList.set(item.drName, 1)
    } else {
      let num = drugIdList.get(item.drName)
      drugIdList.set(item.drName, ++num)
    }
  })
  for (const [key, value] of drugIdList) {
    drugTotalPrice += drugDetail[key + 'detail'].drPrice * value
    oDrug += `${key}${value}${drugDetail[key + 'detail'].drUnit}共${
      drugDetail[key + 'detail'].drPrice * value
    }元   `
  }

  checkBuyData.value.forEach((item: any) => {
    if (!Object.keys(checkList).includes(item.chName)) {
      checkList[item.chName] = item
    }
  })
  oDrug = oDrug + '药品总价：' + drugTotalPrice

  for (const [key, value] of Object.entries(checkList)) {
    checkPrice += value.chPrice
    oCheck += `${key}${value.chPrice}元 `
  }

  oCheck += '检查项目总价:' + checkPrice
  totalPrice = drugTotalPrice + checkPrice

  console.log(oDrug, oCheck, totalPrice)
  return { oDrug, oCheck, totalPrice }
})

const getPatient = async (pId: string) => {
  const { data } = await requestPatient(pId)
  if (data.status !== 200)
    return ElMessage({
      type: 'error',
      message: '获取的信息有问题',
    })
  Patient.value = data.data
}

const getAllDrug = async (search: string, size: number, pageNumber: number) => {
  const { data } = await requestDrug(search, size, pageNumber)

  if (data.status !== 200)
    return ElMessage({
      type: 'error',
      message: '获取药品信息有问题',
    })
  if (data.data) drugList.value = data.data as any
}

const getCheckList = async (
  search: string,
  size: number,
  pageNumber: number
) => {
  const { data } = await requestAllCheck(search, size, pageNumber)

  if (data.status !== 200)
    return ElMessage({
      type: 'error',
      message: '获取检查项目失败',
    })
  if (data.data) checkList.value = data.data

  console.log(checkList.value)
}

const addDrug = async (id: number) => {
  const { data } = await addDrugBy(id)
  if (data.status !== 200)
    return ElMessage({
      type: 'error',
      message: '添加药品失败',
    })
  if (data.data) drugBuyData.value = [...drugBuyData.value, data.data]

  let price = 0
  drugBuyData.value.forEach((item) => {
    price += item.drPrice
  })
  totalDrugPrice.value = price
}

const addCheck = async (id: number) => {
  const { data } = await addCheckBy(id)

  checkBuyData.value = [...checkBuyData.value, data.data]

  let total = 0
  checkBuyData.value.forEach((item: { chPrice: number }) => {
    total += item.chPrice
  })
  totalcheckPrice.value = total
}

const handleClick = async (value: number) => {
  pageDrugNumber.value = value
  await getAllDrug(searchDrug.value, sizeDrug.value, pageDrugNumber.value)
}

const handleClickCheck = async (value: number) => {
  pageCheckNumber.value = value
  await getCheckList(searchCheck.value, sizeCheck.value, pageCheckNumber.value)
}
const indexMethod = (index: number) => {
  return index
}

const handleIsShow = () => {
  isShow.value = !isShow.value
}

const saveShow = () => {
  ElMessage({
    type: 'success',
    message: '填写成功',
  })
  isShow.value = !isShow.value
}

const submitForm = async () => {
  for (const item of drugBuyData.value) {
    const { data } = await reduceDrugNumber(item.drId, 1)
    if (data.status !== 200)
      return ElMessage({
        type: 'error',
        message: '药品的数量为空',
      })
  }
  const data = {
    oId: oId.value,
    pId: pId.value,
    dId: dId.value,
    oRecord: etiology.value,
    oDrug: dataPackage.value.oDrug,
    oCheck: dataPackage.value.oCheck,
    oTotalPrice: dataPackage.value.totalPrice,
  }
  const { data: res } = await submitOrder(data)
  if (res.status !== 200)
    return ElMessage({
      type: 'error',
      message: '请求信息错误',
    })
  ElMessage({
    type: 'success',
    message: '提交成功！请通知患者登录系统自助缴费！',
  })
  router.push('/orderToday')
}

onMounted(() => {
  const data = tokenDecode(getToken() as string) as any
  dName.value = data.dName
  dId.value = data.dId
  oId.value = route.query.oId as string
  pId.value = route.query.pId as string

  getPatient(pId.value)
})
onMounted(() => {
  getAllDrug(searchDrug.value, sizeDrug.value, pageDrugNumber.value)
  getCheckList(searchCheck.value, sizeCheck.value, pageCheckNumber.value)
})
</script>

<template>
  <el-card>
    <div class="deal-order-top">
      <el-button type="success" @click="handleIsShow">填写病因</el-button>
      <el-button type="success" @click="submitForm">提交</el-button>
    </div>
    <div class="restoratives-x">
      <h2>药品信息</h2>
      <el-input
        v-model="searchDrug"
        maxlength="300px"
        placeholder="请输入名称查询"
        class="drugInput">
        <template #append>
          <el-button slot="append" :icon="Search"></el-button>
        </template>
      </el-input>
      <el-row :gutter="10" class="restoratives-x-table">
        <el-col :span="12" class="restoratives-x-table__left">
          <el-table stripe border :data="drugList?.drugs">
            <el-table-column
              label="编号"
              prop="drId"
              width="75"></el-table-column>
            <el-table-column label="名称" prop="drName"></el-table-column>
            <el-table-column label="剩余数量" prop="drNumber"></el-table-column>
            <el-table-column label="单位" prop="drUnit"></el-table-column>
            <el-table-column label="单价" prop="drPrice"></el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="scope">
                <el-button type="success" @click="addDrug(scope.row.drId)"
                  >添加</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-model:current-page="pageDrugNumber"
            :page-size="sizeDrug"
            layout="total,prev, pager, next"
            @current-change="handleClick"
            :total="drugList?.total" />
        </el-col>
        <el-col :span="12" class="restoratives-x-table__right">
          <el-table stripe border :data="drugBuyData" max-height="285">
            <el-table-column
              type="index"
              label="编号"
              width="100"
              :index="indexMethod" />
            <el-table-column label="名称" prop="drName"></el-table-column>
            <el-table-column prop="drUnit" label="单位"></el-table-column>
            <el-table-column label="单价" prop="drPrice"></el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button>删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-tag>总价:{{ totalDrugPrice }}</el-tag>
        </el-col>
      </el-row>
    </div>

    <div class="check-information-x">
      <h3>检查项目信息</h3>
      <el-input
        v-model="searchCheck"
        maxlength="300px"
        placeholder="请输入名称查询"
        class="drugInput">
        <template #append>
          <el-button slot="append" :icon="Search"></el-button>
        </template>
      </el-input>
      <el-row :gutter="10" class="check-information-table">
        <el-col :span="12">
          <el-table stripe border :data="checkList?.checks">
            <el-table-column label="编号" prop="chId"></el-table-column>
            <el-table-column label="项目" prop="chName"></el-table-column>
            <el-table-column label="价格" prop="chPrice"></el-table-column>
            <el-table-column label="操作" widtth="100px">
              <template #default="scope">
                <el-button @click="addCheck(scope.row.chId)" type="success"
                  >增加</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            v-model:current-page="pageCheckNumber"
            :page-size="sizeCheck"
            layout="total,prev, pager, next"
            @current-change="handleClickCheck"
            :total="checkList?.total" />
        </el-col>
        <el-col :span="12" class="right">
          <el-table stripe border :data="checkBuyData" max-height="285">
            <el-table-column label="编号" prop="chId"></el-table-column>
            <el-table-column label="项目" prop="chName"></el-table-column>
            <el-table-column label="价格" prop="chPrice"></el-table-column>
          </el-table>
          <el-tag>总价:{{ totalcheckPrice }}</el-tag>
        </el-col>
      </el-row>
    </div>
  </el-card>
  <el-dialog v-model="isShow" title="填写病因">
    <el-input
      v-model="etiology"
      type="textarea"
      :rows="8"
      placeholder="请输入内容 "
      resize="none">
    </el-input>
    <el-row>
      <el-button @click="handleIsShow">取消</el-button>
      <el-button @click="saveShow">保存</el-button>
    </el-row>
  </el-dialog>
</template>

<style scoped lang="scss">
.drugInput {
  margin-top: 8px;
  margin-bottom: 8px;
}

.restoratives-x {
  margin-top: 20px;
  .el-input-group {
    width: 400px;
  }
}

.restoratives-x-table {
  &__left {
    .el-table {
      min-height: 285px;
    }
  }
  &__right {
    .el-table {
      min-height: 285px;
    }
  }
}

.check-information-x {
  margin-top: 20px;
  .el-input-group {
    width: 400px;
  }

  .right {
    .el-table {
      min-height: 285px;
    }
  }
}
</style>
