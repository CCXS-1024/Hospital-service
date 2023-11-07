<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminHeader from '@/components/AdminHeader.vue'

import { doctorUserStore } from '@/stores/doctorUser'
import { setActivePath } from '@/http/storage'

const store = doctorUserStore()
const route = useRoute()
const router = useRouter()
const activePath = ref<string>('')
const menuClick = (path: string) => {
  activePath.value = path
  setActivePath(path)
  if (route.path !== '/' + path) router.push(path)
}
onMounted(() => {
  store.iniState()
})
</script>

<template>
  <div class="admin-x">
    <AdminHeader :username="store.userName" type="管理员" />
    <el-container>
      <el-aside width="200px">
        <!-- 导航菜单 -->
        <el-menu
          background-color="white"
          text-color="#909399"
          active-text-color="#0099cc">
          <el-menu-item index="adminIndex" @click="menuClick('adminIndex')">
            <i class="iconfont icon-r-home" style="font-size: 22px"> 首页</i>
          </el-menu-item>
          <el-menu-item index="doctorList" @click="menuClick('doctorList')">
            <i class="iconfont icon-r-user1" style="font-size: 22px">
              医生信息管理</i
            >
          </el-menu-item>
          <el-menu-item index="patientList" @click="menuClick('patientList')">
            <i class="iconfont icon-r-user2" style="font-size: 22px">
              患者信息管理</i
            >
          </el-menu-item>
          <el-menu-item index="orderList" @click="menuClick('orderList')">
            <i class="iconfont icon-r-paper" style="font-size: 22px">
              挂号信息管理</i
            >
          </el-menu-item>
          <el-menu-item index="drugList" @click="menuClick('drugList')">
            <i class="iconfont icon-r-love" style="font-size: 22px">
              药物信息管理</i
            >
          </el-menu-item>
          <el-menu-item index="checkList" @click="menuClick('checkList')">
            <i class="iconfont icon-r-edit" style="font-size: 22px">
              检查项目管理</i
            >
          </el-menu-item>
          <el-menu-item index="bedList" @click="menuClick('bedList')">
            <i class="iconfont icon-r-list" style="font-size: 22px">
              病床信息管理</i
            >
          </el-menu-item>
          <el-menu-item index="arrangeIndex" @click="menuClick('arrangeIndex')">
            <i class="iconfont icon-r-shield" style="font-size: 22px">
              排班信息管理</i
            >
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <RouterView />
      </el-main>
    </el-container>
  </div>
</template>

<style></style>
