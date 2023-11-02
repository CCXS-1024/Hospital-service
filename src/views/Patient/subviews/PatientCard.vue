<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { requestPatient } from '@/http'
import { getToken } from '@/http/storage'
import { tokenDecode } from '@/utils'

import { PatientInfo } from '@/types'
import { ElMessage } from 'element-plus'

const info = ref<PatientInfo>()

const getInfo = async (id: string) => {
  const { data } = await requestPatient(id)
  if (data.status !== 200)
    return ElMessage({
      type: 'error',
      message: '获取个人信息失败ƒ',
    })
  info.value = data.data
}

onMounted(() => {
  const id = tokenDecode(getToken() as string)?.pId
  getInfo(id as string)
})
</script>

<template>
  <div class="patient-card-x">
    <el-card>
      <div class="info-x">
        <p>姓名: {{ info?.pName }}</p>
        <p>账号:{{ info?.pid }}</p>
        <p>性别:{{ info?.pGender }}</p>
        <p>手机号:{{ info?.pPhone }}</p>
        <p>身份证:{{ info?.pCard }}</p>
        <p>邮箱:{{ info?.pEmail }}</p>
        <p>出身日期:{{ info?.pBirthday }}</p>
        <p>年龄:{{ info?.pAge }}</p>
      </div>
    </el-card>
  </div>
</template>

<style>
.info-x p {
  margin-bottom: 20px;
}
</style>
