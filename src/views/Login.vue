<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
const logref = ref<FormInstance>()
const role = ref()
const loginForm = ref({
  id: '',
  password: '',
})

const loginRules = reactive({
  id: [
    {
      required: true,
      message: '用户名不能为空',
      trigger: 'blur',
    },
    {
      min: 3,
      max: 50,
      message: '长度在 3到 50 个字符',
      trigger: 'blur',
    },
  ],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
})
</script>

<template>
  <div class="login-x">
    <div class="login-header">
      <i
        style="
          top: 40px;
          font-size: 28px;
          left: 100px;
          position: absolute;
          color: black;
          font-style: normal;
          z-index: 999;
        "
        >医院登录管理系统</i
      >
      <div class="login-banner"></div>

      <div class="login-form-x">
        <div class="login-form-x__form">
          <h3>用户名密码登录</h3>
          <el-form ref="logref" class="loginForm" :rules="loginRules">
            <el-form-item prop="id">
              <!--必须绑定v-model输入框才能输入字符---->
              <el-input v-model="loginForm.id">
                <i
                  slot="prefix"
                  class="iconfont icon-r-user1"
                  style="font-size: 22px"></i>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input show-password v-model="loginForm.password">
                <i
                  slot="prefix"
                  class="iconfont icon-r-lock"
                  style="font-size: 22px"></i>
              </el-input>
            </el-form-item>

            <!-- 角色单选框 -->
            <el-form-item class="role">
              <el-radio-group v-model="role" size="small">
                <el-radio label="管理员"></el-radio>
                <el-radio label="医生"></el-radio>
                <el-radio label="患者"></el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item class="btns">
              <el-button type="primary" style="font-size: 18px">
                登录</el-button
              >
              <el-button type="info" style="font-size: 18px"> 注册</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.mid-index {
  opacity: 0.9;
  width: 450px;
  height: 390px;
  background: white;
  //绝对定位，相对于最左上角来说
  position: absolute;
  left: 70%;
  top: 50%;
}

.login-banner {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100vh;
  background: url(../assets/bac.jpeg);
  background-size: cover;
}

.login-form-x {
  width: 1200px;
  height: 100vh;
  position: relative;
  margin: 0 auto;
  h3 {
    margin-bottom: 20px;
  }
  &__form {
    width: 350px;
    box-sizing: border-box;
    position: absolute;
    top: 300px;
    right: 20px;
    background-color: rgba(255, 255, 255, 0.8);
    padding: 25px 25px 23px;
  }
}
.codeInput {
  width: 70%;
  margin-right: 10px;
}
.findPassword {
  margin-top: 0px;
}
</style>
