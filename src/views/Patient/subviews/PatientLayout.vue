<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { requestPeople, requestBed } from '@/http'

const orderPeople = ref<number>(0)
const bedPeople = ref<number>(0)

onMounted(async () => {
  const { data } = await requestPeople()
  if (data.status !== 200)
    return ElMessage({
      message: '数据请求错误',
      type: 'error',
    })
  orderPeople.value = data.data as number
})
onMounted(async () => {
  const { data } = await requestBed()
  if (data.status !== 200)
    return ElMessage({
      message: '数据请求错误',
      type: 'error',
    })
  bedPeople.value = data.data as number
})
</script>

<template>
  <div>
    <el-row>
      <div class="indexPeople">
        <div class="userImage">
          <i class="iconfont icon-r-user1" style="font-size: 132px"></i>
        </div>

        <div class="userFont">
          <div class="spanCure">
            <span>就诊概况</span>
          </div>
          <div class="spanPeople">
            <span>今天预约挂号总人数：{{ orderPeople }}</span>
          </div>
        </div>
      </div>
      <div class="indexPeople">
        <div class="userImage">
          <i class="iconfont icon-r-home" style="font-size: 132px"></i>
        </div>

        <div class="userFont">
          <div class="spanCure">
            <span>住院概况</span>
          </div>
          <div class="spanPeople">
            <span>今天住院总人数：{{ bedPeople }}</span>
          </div>
        </div>
      </div>
    </el-row>

    <el-row>
      <el-col :span="24">
        <img src="@/assets/bac.jpeg" style="width: 941px; margin-left: 25px" />
      </el-col>
    </el-row>
  </div>
</template>

<style lang="scss" scoped>
.userFont {
  height: 150px;
  width: 250px;
  float: right;
  color: white;
  color: black;
  .spanCure {
    font-size: 15px;
    margin-top: 60px;
    margin-bottom: 15px;
  }
  .spanPeople {
    font-size: 18px;
  }
}

.userImage {
  height: 150px;
  width: 150px;
  font-size: 130px;
  color: white;
  position: relative;
  left: 40px;
  top: 10px;
  float: left;
}
.indexPeople {
  height: 200px;
  width: 440px;
  float: left;
  margin: 30px;
}
</style>
