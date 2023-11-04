<script setup lang="ts">
import { RouterView, useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'
import AdminHeader from '@/components/AdminHeader.vue'
import { setActivePath } from '@/http/storage'

const activePath = ref<string>('doctorLayout')
const route = useRoute()
const router = useRouter()

const menuClick = (path: string) => {
  activePath.value = path
  setActivePath(path)
  if (route.path !== '/' + path) router.push(path)
}
</script>

<template>
  <div class="doctor-main-x">
    <AdminHeader username="ccxs" />

    <el-container>
      <el-aside width="200px">
        <!-- 导航菜单 -->
        <el-menu
          background-color="white"
          text-color="#909399"
          active-text-color="#0099cc"
          :default-active="activePath"
          style="font-size: 22px">
          <el-menu-item index="doctorLayout" @click="menuClick('doctorLayout')">
            <i class="iconfont icon-r-home" style="font-size: 22px"> 首页</i>
          </el-menu-item>
          <el-menu-item index="orderToday" @click="menuClick('orderToday')">
            <i class="iconfont icon-r-edit" style="font-size: 22px">
              今日挂号列表</i
            >
          </el-menu-item>
          <el-menu-item index="doctorOrder" @click="menuClick('doctorOrder')">
            <i class="iconfont icon-r-list" style="font-size: 22px">
              历史挂号列表</i
            >
          </el-menu-item>
          <el-menu-item index="inBed" @click="menuClick('inBed')">
            <i class="iconfont icon-r-home" style="font-size: 22px">
              住院申请管理</i
            >
          </el-menu-item>
          <el-menu-item index="doctorCard" @click="menuClick('doctorCard')">
            <i class="iconfont icon-r-user1" style="font-size: 22px">
              个人信息查询</i
            >
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<style></style>
