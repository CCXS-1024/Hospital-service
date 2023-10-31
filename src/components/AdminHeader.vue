<script setup lang="ts">
const props = defineProps<{
  username: string
}>()
</script>

<template>
  <el-header>
    <div class="words">
      <span style="font-size: 22px">
        <i class="iconfont icon-r-love" style="font-size: 26px">
          医疗管理系统</i
        >
      </span>
    </div>
    <div class="words">
      <span>欢迎您{{ props.username }}<b></b>&nbsp;</span>
      <span><el-button type="danger" size="mini">退出登录</el-button></span>
    </div>
  </el-header>
</template>

<style scoped lang="scss">
.el-header {
  width: 100%;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid lightgrey;
  .words {
    text-align: center;
    span {
      color: #0099cc;
    }
  }
}
</style>
