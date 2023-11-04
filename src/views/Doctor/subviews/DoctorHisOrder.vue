<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { tokenDecode } from '@/utils'
import { getToken } from '@/http/storage'

import { requestOrders } from '@/http'

const uerId = ref<string>('')
const query = ref<string>('')
const size = ref<number>(8)
const pageNumber = ref<number>(1)

onMounted(async () => {
  const data = tokenDecode(getToken() as string) as any
  uerId.value = data.dId
  const { data: res } = await requestOrders(
    uerId.value,
    size.value,
    pageNumber.value,
    query.value
  )

  console.log(res)
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
  </el-card>
</template>

<style></style>
