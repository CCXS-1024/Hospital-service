import { dataType } from 'element-plus/es/components/table-v2/src/common';
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

import { tokenDecode } from '@/utils'
import { requestNowPeople } from '@/http'
import { getToken } from '@/http/storage'

const nowPeople = ref<number>(0)
onMounted(async () => {
  const id = (tokenDecode(getToken() as string) as any).dId

  console.log(id)
  const { data } = await requestNowPeople(id)
  if (data.status !== 200)
    return ElMessage({
      type: 'error',
      message: '服务器出错',
    })
  nowPeople.value = data.data as number
})
</script>

<template>
  <el-card>
    <div class="indexPeople">
      <div class="userImage">
        <i class="iconfont icon-r-user1" style="font-size: 132px"></i>
      </div>

      <div class="userFont">
        <div class="spanCure">
          <h2>就诊概况</h2>
        </div>
        <div class="spanPeople">
          <span>今天我的预约人数：{{ nowPeople }}</span>
        </div>
      </div>
    </div>

    <el-row>
      <el-col :span="24">
        <img src="@/assets/bac.jpeg" style="width: 941px; margin-left: 25px" />
      </el-col>
    </el-row>
  </el-card>
</template>

<style lang="scss" scoped>
.userFont {
  height: 150px;
  width: 250px;
  color: black;

  float: right;
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

  float: left;
  position: relative;
  left: 40px;
  top: 10px;
}
.indexPeople {
  height: 200px;
  width: 500px;
  margin-top: 50px;
  margin-left: 30px;
}
</style>
