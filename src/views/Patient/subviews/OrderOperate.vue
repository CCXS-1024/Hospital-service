<script setup lang="ts">
import { useRouter } from 'vue-router'
import MyBreadcrumb from '../components/MyBreadcrumb.vue'
const inters = [
    '神经内科',
    '呼吸与危重症医学科',
    '内分泌科',
    '消化内科',
    '心血管内科',
    '肾内科',
    '发热门诊',
  ],
  outs = [
    '手足外科',
    '普通外科',
    '肛肠外科',
    '神经外科',
    '泌尿外科',
    '骨科',
    '烧伤整形外科',
  ],
  women = ['妇科', '产科'],
  kids = ['儿科', '儿童保健科'],
  fives = ['耳鼻咽喉科', '眼科', '口腔科'],
  chineses = ['中医科'],
  orthers = ['康复医学科', '急诊科', '皮肤性病科', '功能科']

const router = useRouter()
const sectionClick = (sectionOpt: string) => {
  router.push('/sectionMessage?sectionOpt=' + sectionOpt)
}
</script>

<template>
  <div class="orderoperate-x">
    <MyBreadcrumb />
    <el-divider></el-divider>
    <i class="iconfont icon-r-love" style="font-size: 22px"><b> 内科</b></i>
    <ul class="orderoperate-x-list">
      <li v-for="orther in inters" :key="orther">
        <el-button @click="sectionClick(orther)" type="primary">{{
          orther
        }}</el-button>
      </li>
    </ul>
    <el-divider></el-divider>
    <i class="iconfont icon-r-love" style="font-size: 22px"><b> 外科</b></i>
    <ul class="orderoperate-x-list">
      <li v-for="out in outs" :key="out">
        <el-button @click="sectionClick(out)" type="primary">{{
          out
        }}</el-button>
      </li>
    </ul>
    <el-divider></el-divider>
    <i class="iconfont icon-r-love" style="font-size: 22px"><b> 妇产科</b></i>
    <ul class="orderoperate-x-list">
      <li v-for="woman in women" :key="woman">
        <el-button @click="sectionClick(woman)" type="primary">{{
          woman
        }}</el-button>
      </li>
    </ul>
    <el-divider></el-divider>
    <i class="iconfont icon-r-love"><b> 儿科</b></i>
    <ul class="orderoperate-x-list">
      <li v-for="kid in kids" :key="kid">
        <el-button @click="sectionClick(kid)" type="primary">{{
          kid
        }}</el-button>
      </li>
    </ul>
    <el-divider></el-divider>
    <i class="iconfont icon-r-love" style="font-size: 22px"><b> 五官科</b></i>
    <ul class="orderoperate-x-list">
      <li v-for="five in fives" :key="five">
        <el-button @click="sectionClick(five)" type="primary">{{
          five
        }}</el-button>
      </li>
    </ul>
    <el-divider></el-divider>
    <i class="iconfont icon-r-love" style="font-size: 22px"><b> 中医科</b></i>
    <ul class="orderoperate-x-list">
      <li v-for="chinese in chineses" :key="chinese">
        <el-button @click="sectionClick(chinese)" type="primary">{{
          chinese
        }}</el-button>
      </li>
    </ul>
    <el-divider></el-divider>
    <i class="iconfont icon-r-love" style="font-size: 22px"><b> 其他</b></i>
    <ul class="orderoperate-x-list">
      <li v-for="orther in orthers" :key="orther">
        <el-button @click="sectionClick(orther)" type="primary">{{
          orther
        }}</el-button>
      </li>
    </ul>
    <el-divider></el-divider>
  </div>
</template>

<style lang="scss">
.orderoperate-x {
  &-list {
    display: flex;
    margin-top: 10px;
    li {
      margin-right: 20px;
    }
  }
}
</style>
