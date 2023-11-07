<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import jwtDecode from 'jwt-decode'
import { getToken, getActivePath, setActivePath } from '@/http/storage'

const route = useRoute()
const router = useRouter()
console.log(route)
import AdminHeader from '@/components/AdminHeader.vue'
const userName = ref<string>('')
const activePath = ref<string>('')

const tokenDecode = (token: any): any => {
  if (token !== null) return jwtDecode(token)
}

const menuClick = (path: string) => {
  activePath.value = path
  setActivePath(path)
  if (route.path !== '/' + path) router.push(path)
}

activePath.value = getActivePath() as string
userName.value = tokenDecode(getToken()).pName
</script>

<template>
  <el-container class="patient-x">
    <!-- 头部展示 -->
    <AdminHeader :username="userName" />

    <el-container class="patient-x__main">
      <el-aside width="200px">
        <el-menu
          text-color="#909399"
          active-text-color="#0099cc"
          :default-active="activePath"
          style="font-size: 22px">
          <el-menu-item
            index="patientLayout"
            @click="menuClick('patientLayout')">
            <i class="iconfont icon-r-home" style="font-size: 22px"> 首页</i>
          </el-menu-item>
          <el-menu-item index="oderOperate" @click="menuClick('oderOperate')">
            <i class="iconfont icon-r-edit" style="font-size: 22px">
              预约挂号</i
            >
          </el-menu-item>
          <el-menu-item index="myOrder" @click="menuClick('myOrder')">
            <i class="iconfont icon-r-list" style="font-size: 22px">
              我的挂号</i
            >
          </el-menu-item>
          <el-menu-item index="myBed" @click="menuClick('myBed')">
            <i class="iconfont icon-r-home" style="font-size: 22px">
              我的住院信息</i
            >
          </el-menu-item>
          <el-menu-item index="patientCard" @click="menuClick('patientCard')">
            <i class="iconfont icon-r-user2" style="font-size: 22px">
              个人信息</i
            >
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <RouterView />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped lang="scss">
.el-container {
  height: 100%;
}

.patient-x {
  flex-direction: column;
}

.patient-x__main {
  height: calc(100vh - 60px);

  .el-aside {
    background-color: white;
    border-right: 1px solid lightgrey;
    color: white !important;
  }
}
</style>
