<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { useRouter } from 'vue-router'

import { doctorLogin, loginAdmin, patientLogin, registerUser } from '../http'
import { setToken } from '../http/storage'
interface LofinForm {
  id: string
  password: string
}
interface RegisterForm {
  pId: number | null
  gender: string
  password: string
  username: string
  birthday: string
  phoneNum: string
  email: string
  card: string
}
type IType = 'phone' | 'card' | 'email'
const router = useRouter()
const loginRef = ref<FormInstance>()
const RegisterRef = ref<FormInstance>()
const role = ref<'patient' | 'medic' | 'administrator'>('patient')
const isRegister = ref(false)
const loginForm = ref<LofinForm>({
  id: '',
  password: '',
})
// 登录状态校验规则
const loginRules = reactive<FormRules<LofinForm>>({
  id: [
    {
      required: true,
      message: '用户名不能为空',
      trigger: 'blur',
    },
    { min: 3, max: 16, message: '用户名格式不正确', trigger: 'blur' },
  ],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
})

const validate = (type: IType) => (rule: any, value: any, callback: any) => {
  switch (type) {
    case 'card':
      if (
        /^[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|10|11|12)(?:0[1-9]|[1-2]\d|30|31)\d{3}[\dXx]$/.test(
          value
        )
      ) {
        callback()
      } else {
        callback(new Error('身份证号不合法'))
      }
      break
    case 'phone':
      if (value.trim() === '') {
        callback(new Error('手机号不能为空'))
      } else {
        if (/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(value.trim())) {
          callback()
        } else {
          callback(new Error('你输入的手机号格式不正确'))
        }
      }
      break
    case 'email':
      if (
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          value.trim()
        )
      ) {
        callback()
      } else {
        callback(new Error('你输入的邮箱不合法'))
      }
      break
  }
}

const registerForm = ref<RegisterForm>({
  pId: null,
  password: '',
  gender: '',
  username: '',
  birthday: '',
  phoneNum: '',
  email: '',
  card: '',
})

// 注册form表单规则
const registerRules = reactive<FormRules<RegisterForm>>({
  gender: [
    {
      required: true,
      message: '请选择性别',
      trigger: 'blur',
    },
  ],
  pId: [
    {
      required: true,
      message: '用户名不能为空',
      trigger: 'blur',
    },
    {
      type: 'number',
      message: '账号必须数字类型',
      trigger: 'blur',
    },
  ],
  username: [
    {
      required: true,
      message: '姓名不能为空',
      trigger: 'blur',
    },
  ],
  birthday: [
    {
      required: true,
      message: '请选择正确的生日',
      trigger: 'blur',
    },
  ],
  phoneNum: [
    {
      required: true,
      message: '手机号不能为空',
      trigger: 'blur',
    },
    {
      validator: validate('phone'),
      trigger: 'blur',
    },
  ],
  password: [
    {
      required: true,
      message: '密码不能为空',
      trigger: 'blur',
    },
  ],
  email: [
    {
      required: true,
      message: '邮箱不能为空',
      trigger: 'blur',
    },
    {
      validator: validate('email'),
      trigger: 'blur',
    },
  ],
  card: [
    {
      required: true,
      message: '身份证号不能为空',
      trigger: 'blur',
    },
    {
      validator: validate('card'),
      trigger: 'blur',
    },
  ],
})

// 登录
const submitLoginForm = (loginFormRef: FormInstance | undefined) => {
  if (!loginFormRef) return

  loginFormRef.validate(async (valid) => {
    if (!valid) return false
    // 点击病人登录按钮实现登录
    if (role.value === 'patient') {
      const patientParams = new URLSearchParams()
      patientParams.append('pId', loginForm.value.id)
      patientParams.append('pPassword', loginForm.value.password)

      const { data } = await patientLogin(patientParams)
      if (data.status != 200) {
        return ElMessage({
          message: '用户名密码错误',
          type: 'error',
        })
      }
      setToken(data.data!.token)
      router.push('/patientLayout')
    }
    if (role.value === 'medic') {
      const doctorParams = new URLSearchParams()
      doctorParams.append('dId', loginForm.value.id)
      doctorParams.append('dPassword', loginForm.value.password)

      const { data } = await doctorLogin(doctorParams)

      if (data.status !== 200)
        return ElMessage({
          type: 'error',
          message: '用户名密码错误',
        })
      setToken(data.data?.token as string)
      router.push('/doctorLayout')
    }

    if (role.value === 'administrator') {
      const params = new URLSearchParams()
      params.append('aId', loginForm.value.id)
      params.append('aPassword', loginForm.value.password)

      const { data } = await loginAdmin(params)
      if (data.status !== 200)
        return ElMessage({
          type: 'error',
          message: '用户密码错误',
        })
      setToken(data.data.token)
      router.push('/admin')
    }
  })
}

// 注册
const submitRegisterForm = (registerFormRef: FormInstance | undefined) => {
  if (!registerFormRef) return

  registerFormRef.validate(async (valid) => {
    if (!valid) return

    const params = {
      pId: registerForm.value.pId,
      pName: registerForm.value.username,
      pPassword: registerForm.value.password,
      pGender: registerForm.value.gender,
      pEmail: registerForm.value.email,
      pPhone: registerForm.value.phoneNum,
      pCard: registerForm.value.card,
      pBirthday: registerForm.value.birthday,
    }
    const { data } = await registerUser(params)

    if (data.status !== 200) {
      return ElMessage({
        message: '账号或邮箱已被占用！',
        type: 'error',
      })
    }
    isRegister.value = false
    ElMessage({
      message: '注册成功',
      type: 'success',
    })
  })
}
const handleIsShow = () => {
  isRegister.value = !isRegister.value
}
</script>

<template>
  <div class="cc-main-x">
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
          <h3>登录</h3>
          <el-form
            :hide-required-asterisk="true"
            label-position="top"
            :model="loginForm"
            ref="loginRef"
            class="loginForm"
            :rules="loginRules">
            <el-form-item label="用户名:" prop="id">
              <!--必须绑定v-model输入框才能输入字符---->
              <el-input v-model="loginForm.id">
                <i
                  slot="prefix"
                  class="iconfont icon-r-user1"
                  style="font-size: 22px"></i>
              </el-input>
            </el-form-item>
            <el-form-item label="密码:" prop="password">
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
                <el-radio label="administrator">管理员</el-radio>
                <el-radio label="medic">医生</el-radio>
                <el-radio label="patient">患者</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item class="btns">
              <el-button
                type="primary"
                @click="submitLoginForm(loginRef)"
                style="font-size: 18px">
                登录</el-button
              >
              <el-button
                @click="handleIsShow"
                type="info"
                style="font-size: 18px">
                注册</el-button
              >
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <!-- 注册框 -->
    <div class="register-x">
      <el-dialog ru v-model="isRegister">
        <h3>患者用户注册</h3>
        <el-form
          :rules="registerRules"
          :model="registerForm"
          ref="RegisterRef"
          class="findPassword">
          <el-form-item label="账号" label-width="80px" prop="pId">
            <el-input v-model.number="registerForm.pId"></el-input>
          </el-form-item>
          <el-form-item label="性别" label-width="80px" prop="gender">
            <el-radio v-model="registerForm.gender" label="男">男</el-radio>
            <el-radio v-model="registerForm.gender" label="女">女</el-radio>
          </el-form-item>
          <el-form-item label="密码" label-width="80px" prop="password">
            <el-input v-model="registerForm.password"></el-input>
          </el-form-item>
          <el-form-item label="姓名" label-width="80px" prop="username">
            <el-input v-model="registerForm.username"></el-input>
          </el-form-item>
          <el-form-item label="出生日期" label-width="80px" prop="birthday">
            <el-date-picker
              v-model="registerForm.birthday"
              type="date"
              value-format="YYYY-MM-DD">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="手机号" label-width="80px" prop="phoneNum">
            <el-input v-model="registerForm.phoneNum"> </el-input>
          </el-form-item>
          <el-form-item label="邮箱" label-width="80px" prop="email">
            <el-input v-model="registerForm.email"></el-input>
          </el-form-item>
          <el-form-item label="身份证号" label-width="80px" prop="card">
            <el-input v-model="registerForm.card"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="submitRegisterForm(RegisterRef)" type="primary"
              >提交</el-button
            >
            <el-button @click="handleIsShow">取消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<style lang="scss">
.mid-index {
  opacity: 0.9;
  width: 450px;
  height: 390px;
  background: white;
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
    text-align: center;
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

  .el-radio-group {
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
  .el-form-item__content {
    justify-content: end;
  }

  .el-input__wrapper {
    height: 40px;
    font-size: 16px;
  }
}

.register-x {
  h3 {
    margin-bottom: 20px;
    text-align: center;
  }
  .el-input__wrapper {
    font-size: 16px;
  }
  .el-form-item {
    align-items: center;
    margin-bottom: 25px;
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
