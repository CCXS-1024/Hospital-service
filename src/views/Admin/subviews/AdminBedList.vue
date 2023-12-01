<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import { Search } from '@element-plus/icons-vue'
const size = ref<number>(8)
const pageNumber = ref<number>(1)
const searchQuery = ref<string>('')
const currentTotal = ref<number>(0)

const search = () => {}
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
        <el-button type="success">添加床位</el-button>
      </el-col>
    </el-row>
  </el-card>
</template>

<style></style>
