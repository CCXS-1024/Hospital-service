<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
  requestDoctors,
  addDoctor,
  findDoctorById,
  updateDoctor,
  deleteDoctor,
} from '@/http'

import type { FormType } from '@/types'

const updateFormRef = ref<FormInstance>()
const registerFormRef = ref<FormInstance>()
const size = ref<number>(8)
const pageNumber = ref<number>(1)
const searchValue = ref<string>('')
const dataDoctorList = ref({})
const isShowRegister = ref<boolean>(false)
const isShowUpdate = ref<boolean>(false)
const registerForm = ref<FormType>({
  dId: null,
  dPassword: '',
  dName: '',
  dGender: '',
  dPost: '',
  dSection: '',
  dCard: '',
  dPhone: '',
  dEmail: '',
  dPrice: '',
  dIntroduction: '',
})

const updateForm = ref<FormType>({
  dId: null,
  dPassword: '',
  dName: '',
  dGender: '',
  dPost: '',
  dSection: '',
  dCard: '',
  dPhone: '',
  dEmail: '',
  dPrice: '',
  dIntroduction: '',
})

const validateId = (rule: any, value: any, callback: any) => {
  if (typeof value !== 'number') {
    return callback(new Error('账号类型只能是数字'))
  }
  if (!/^\d{3,15}$/.test(value)) {
    return callback(new Error('账号只能是3-16位之间'))
  }
  callback()
}

const validateCard = (rule: any, value: any, callback: any) => {
  if (
    !/^\d{6}((((((19|20)\d{2})(0[13-9]|1[012])(0[1-9]|[12]\d|30))|(((19|20)\d{2})(0[13578]|1[02])31)|((19|20)\d{2})02(0[1-9]|1\d|2[0-8])|((((19|20)([13579][26]|[2468][048]|0[48]))|(2000))0229))\d{3})|((((\d{2})(0[13-9]|1[012])(0[1-9]|[12]\d|30))|((\d{2})(0[13578]|1[02])31)|((\d{2})02(0[1-9]|1\d|2[0-8]))|(([13579][26]|[2468][048]|0[048])0229))\d{2}))(\d|X|x)$/.test(
      value
    )
  ) {
    return callback(new Error('你输入的身份证不合法'))
  }

  callback()
}

const validatePhone = (rule: any, value: any, callback: any) => {
  if (!/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(value)) {
    callback(new Error('你输入的手机号格式不正确'))
  }

  callback()
}

const validateEmail = (rule: any, value: any, callback: any) => {
  if (
    !/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      value
    )
  ) {
    callback(new Error('你输入的邮箱格式不正确'))
  }
  callback()
}
const registerRules = reactive<FormRules<typeof registerForm>>({
  dPassword: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
  dId: [
    { required: true, message: '用户名不能为空', trigger: 'blur' },
    {
      validator: validateId,
      trigger: 'blur',
    },
  ],
  dName: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
  dGender: [{ required: true, message: '性别不能为空', trigger: 'blur' }],
  dPost: [{ required: true, message: '职位不能为空', trigger: 'blur' }],
  dSection: [{ required: true, message: '科室不能为空', trigger: 'blur' }],
  dCard: [
    { required: true, message: '身份证不能为空', trigger: 'blur' },
    {
      validator: validateCard,
      trigger: 'blur',
    },
  ],
  dPhone: [
    { required: true, message: '电话不能为空', trigger: 'blur' },
    { validator: validatePhone, trigger: 'blur' },
  ],
  dEmail: [
    { required: true, message: '邮箱不能为空', trigger: 'blur' },
    {
      validator: validateEmail,
      trigger: 'blur',
    },
  ],
  dPrice: [{ required: true, message: '挂号费不能为空', trigger: 'blur' }],
  dIntroduction: [{ required: true, message: '简介不能为空', trigger: 'blur' }],
})
const posts = ['主任医师', '副主任医师', '主治医生']
const sections = [
  '神经内科',
  '内分泌科',
  '呼吸与危重症医学科',
  '消化内科',
  '心血管内科',
  '发热门诊',
  '手足外科',
  '普通外科',
  '肛肠外科',
  '神经外科',
  '骨科',
  '烧伤整形外科',
  '妇科',
  '产科',
  '儿科',
  '耳鼻咽喉科',
  '眼科',
  '中医科',
  '急诊科',
  '皮肤病科',
  '口腔科',
]

const getAllDoctorList = async (
  pageNumber: number,
  size: number,
  query: string
) => {
  console.log(pageNumber, size, query)
  const { data } = await requestDoctors(pageNumber, size, query)
  if (data.status !== 200)
    return ElMessage({
      type: 'error',
      message: '获取信息有问题',
    })
  dataDoctorList.value = data.data
}

const handleClick = (value: any) => {
  pageNumber.value = value
  getAllDoctorList(pageNumber.value, size.value, searchValue.value)
}

const handleIsUpdateShow = () => {
  isShowUpdate.value = false
}

const openRegister = () => {
  isShowRegister.value = !isShowRegister.value
}
const deleteDialog = (id: number) => {
  console.log(id)
  ElMessageBox.confirm('确定删除用户', 'Warning', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    const { data } = await deleteDoctor(id)
    if (data.status == 200) {
      ElMessage({
        type: 'success',
        message: '用户删除成功',
      })
      getAllDoctorList(pageNumber.value, size.value, searchValue.value)
      handleIsUpdateShow()
    }
  })
}

const searchDoctor = () => {
  getAllDoctorList(pageNumber.value, size.value, searchValue.value)
}
const modifyDialog = async (id: number) => {
  isShowUpdate.value = !isShowUpdate.value
  const { data } = await findDoctorById(id)
  if (data.status !== 200)
    return ElMessage({
      type: 'error',
      message: '获取医生信息失败',
    })
  if (data.data) updateForm.value = data.data
}

const submitRegister = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (!valid) return
    const { data } = await addDoctor(registerForm.value)
    if (data.status !== 200)
      return ElMessage({
        type: 'error',
        message: '添加医生有错',
      })
    getAllDoctorList(pageNumber.value, size.value, searchValue.value)
    isShowRegister.value = !isShowRegister.value
    formEl.resetFields()
  })
}

const submitUpdate = (formEl: FormInstance | undefined) => {
  if (!formEl) return

  formEl.validate(async (valid) => {
    if (!valid) return

    const { data } = await updateDoctor(updateForm.value)

    getAllDoctorList(pageNumber.value, size.value, searchValue.value)
    handleIsUpdateShow()
  })
}

onMounted(() => {
  getAllDoctorList(pageNumber.value, size.value, searchValue.value)
})
</script>

<template>
  <el-card>
    <!-- input  -->
    <el-row :gutter="20">
      <el-col :span="8">
        <el-input v-model="searchValue" placeholder="请输入医生姓名"  >
          <template #append>
            <el-button
              slot="append"
              :icon="Search"
              @click="searchDoctor"></el-button>
          </template>
        </el-input>
      </el-col>
      <el-col :span="10">
        <el-button type="success" @click="openRegister">添加医生</el-button>
      </el-col>
    </el-row>
    <!-- table -->
    <el-row class="table-x">
      <el-table :data="dataDoctorList.doctors">
        <el-table-column prop="dId" label="账号" width="130"> </el-table-column>
        <el-table-column prop="dName" label="姓名" width="80">
        </el-table-column>
        <el-table-column prop="dGender" label="性别" width="60">
        </el-table-column>
        <el-table-column prop="dPost" label="职位" width="100">
        </el-table-column>
        <el-table-column prop="dSection" label="科室" width="100">
        </el-table-column>

        <el-table-column prop="dPhone" label="手机号" width="150">
        </el-table-column>
        <el-table-column prop="dEmail" label="邮箱" width="170">
        </el-table-column>
        <el-table-column prop="dPrice" label="挂号费/元" width="100">
        </el-table-column>
        <el-table-column prop="dIntroduction" label="描述"></el-table-column>
        <el-table-column prop="dState" label="是否在职" width="80">
          <template #default="scope">
            <el-tag type="success" v-if="scope.row.dState === 1">在职</el-tag>
            <el-tag type="danger" v-else>离职</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template #default="scope">
            <el-button
              style="font-size: 14px"
              type="success"
              @click="modifyDialog(scope.row.dId)"
              ><i class="iconfont icon-r-edit" style="font-size: 22px"></i
            ></el-button>
            <el-button
              style="font-size: 14px"
              type="danger"
              @click="deleteDialog(scope.row.dId)"
              ><i class="iconfont icon-r-delete" style="font-size: 22px"></i
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="pageNumber"
        :page-size="size"
        layout="total,prev, pager, next"
        @current-change="handleClick"
        :total="dataDoctorList?.total" />
    </el-row>
  </el-card>
  <!-- 添加医生 -->
  <el-dialog title="添加医生" v-model="isShowRegister">
    <el-form :rules="registerRules" ref="registerFormRef" :model="registerForm">
      <el-form-item label="账号" label-width="80px" prop="dId">
        <el-input v-model.number="registerForm.dId"></el-input>
      </el-form-item>
      <el-form-item label="密码" label-width="80px" prop="dPassword">
        <el-input v-model="registerForm.dPassword"></el-input>
      </el-form-item>
      <el-form-item label="姓名" label-width="80px" prop="dName">
        <el-input v-model="registerForm.dName"></el-input>
      </el-form-item>
      <el-form-item label="性别" label-width="80px" prop="dGender">
        <el-radio v-model="registerForm.dGender" label="男">男</el-radio>
        <el-radio v-model="registerForm.dGender" label="女">女</el-radio>
      </el-form-item>
      <el-form-item label="职位" label-width="80px" prop="dPost">
        <el-select v-model="registerForm.dPost" placeholder="请选择职称">
          <el-option
            v-for="post in posts"
            :key="post"
            :label="post"
            :value="post">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="科室" label-width="80px" prop="dSection">
        <el-select
          v-model="registerForm.dSection"
          filterable
          placeholder="请选择科室">
          <el-option
            v-for="section in sections"
            :key="section"
            :label="section"
            :value="section">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="身份证号" label-width="80px" prop="dCard">
        <el-input v-model="registerForm.dCard" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="手机号" label-width="80px" prop="dPhone">
        <el-input v-model="registerForm.dPhone" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" label-width="80px" prop="dEmail">
        <el-input v-model="registerForm.dEmail" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="挂号费" label-width="80px" prop="dPrice">
        <el-input v-model="registerForm.dPrice" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="简介" label-width="80px" prop="dIntroduction">
        <el-input
          type="textarea"
          :rows="5"
          placeholder="请输入内容"
          v-model="registerForm.dIntroduction">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="openRegister">取消</el-button>
        <el-button @click="submitRegister(registerFormRef)" type="primary"
          >确定</el-button
        >
      </el-form-item>
    </el-form>
  </el-dialog>

  <!-- 修改医生 -->
  <el-dialog title="修改医生" v-model="isShowUpdate">
    <el-form :rules="registerRules" ref="updateFormRef" :model="updateForm">
      <el-form-item label="姓名" label-width="80px" prop="dName">
        <el-input v-model="updateForm.dName"></el-input>
      </el-form-item>
      <el-form-item label="密码" label-width="80px" prop="dPassword">
        <el-input v-model="updateForm.dPassword"></el-input>
      </el-form-item>
      <el-form-item label="性别" label-width="80px" prop="dGender">
        <el-radio v-model="updateForm.dGender" label="男">男</el-radio>
        <el-radio v-model="updateForm.dGender" label="女">女</el-radio>
      </el-form-item>
      <el-form-item label="职位" label-width="80px" prop="dPost">
        <el-select v-model="updateForm.dPost" placeholder="请选择职称">
          <el-option
            v-for="post in posts"
            :key="post"
            :label="post"
            :value="post">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="科室" label-width="80px" prop="dSection">
        <el-select
          v-model="updateForm.dSection"
          filterable
          placeholder="请选择科室">
          <el-option
            v-for="section in sections"
            :key="section"
            :label="section"
            :value="section">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="身份证号" label-width="80px" prop="dCard">
        <el-input v-model="updateForm.dCard" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="手机号" label-width="80px" prop="dPhone">
        <el-input v-model="updateForm.dPhone" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" label-width="80px" prop="dEmail">
        <el-input v-model="updateForm.dEmail" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="挂号费" label-width="80px" prop="dPrice">
        <el-input v-model="updateForm.dPrice" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="简介" label-width="80px" prop="dIntroduction">
        <el-input
          type="textarea"
          :rows="5"
          placeholder="请输入内容"
          v-model="updateForm.dIntroduction">
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleIsUpdateShow">取消</el-button>
        <el-button @click="submitUpdate(updateFormRef)" type="primary"
          >确定</el-button
        >
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style>

</style>
