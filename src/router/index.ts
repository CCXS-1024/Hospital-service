import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Login from '../views/Login.vue'
import { getToken } from '@/http/storage'
import Admin from '@/views/Admin/AdminMain.vue'
//病人模块组件
import Patient from '@/views/Patient/PatientMain.vue'
import PatientLayout from '@/views/Patient/subviews/PatientLayout.vue'
import OrderOperate from '@/views/Patient/subviews/OrderOperate.vue'
import SectionMessage from '@/views/Patient/subviews/SectionMessage.vue'
import MyOrder from '@/views/Patient/subviews/MyOrder.vue'
import MyBed from '@/views/Patient/subviews/MyBed.vue'
import PatientCard from '@/views/Patient/subviews/PatientCard.vue'
// 医生
import DoctorMain from '@/views/Doctor/DoctorMain.vue'
import DoctorLayout from '@/views/Doctor/subviews/DoctorLayout.vue'
import DoctorOrder from '@/views/Doctor/subviews/DoctorOrder.vue'
import DealOrder from '@/views/Doctor/subviews/DealOrder.vue'
import DoctorHisOrder from '@/views/Doctor/subviews/DoctorHisOrder.vue'

// admin
import AdminLayOut from '@/views/Admin/subviews/AdminLayOut.vue'
import DoctorList from '@/views/Admin/subviews/DoctorList.vue'
import PatientList from '@/views/Admin/subviews/PatientList.vue'
import AdminOrderList from '@/views/Admin/subviews/AminOrderList.vue'
import AdmindrugList from '@/views/Admin/subviews/AdmindrugList.vue'
import AdminCheckList from '@/views/Admin/subviews/AdminCheckList.vue'
import AdminBedList from '@/views/Admin/subviews/AdminBedList.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/admin',
    component: Admin,
    meta: {
      reqireAuth: true,
    },
    children: [
      {
        path: '/admin',
        redirect: '/adminIndex',
      },
      {
        path: '/adminIndex',
        component: AdminLayOut,
      },
      {
        path: '/doctorList',
        component: DoctorList,
      },
      {
        path: '/patientlist',
        component: PatientList,
      },
      {
        path: '/orderList',
        component: AdminOrderList,
      },
      {
        path: '/drugList',
        component: AdmindrugList,
      },
      {
        path: '/checkList',
        component: AdminCheckList,
      },
      {
        path: '/bedList',
        component: AdminBedList,
      },
    ],
  },
  {
    path: '/patient',
    component: Patient,
    meta: {
      reqireAuth: true,
    },
    children: [
      {
        path: '/patient',
        redirect: '/patientLayout',
      },
      {
        path: '/patientLayout',
        component: PatientLayout,
      },
      {
        path: '/oderOperate',
        component: OrderOperate,
      },
      {
        path: '/sectionMessage',
        component: SectionMessage,
      },
      {
        path: '/myOrder',
        component: MyOrder,
      },
      {
        path: '/myBed',
        component: MyBed,
      },
      {
        path: '/patientCard',
        component: PatientCard,
      },
    ],
  },
  {
    path: '/doctor',
    component: DoctorMain,
    meta: {
      reqireAuth: true,
    },
    children: [
      {
        path: '/doctorLayout',
        component: DoctorLayout,
      },
      {
        path: '/orderToday',
        component: DoctorOrder,
      },
      {
        path: '/dealOrder',
        component: DealOrder,
      },
      {
        path: '/doctorOrder',
        component: DoctorHisOrder,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

router.beforeEach((to, form, next) => {
  if (to.meta.reqireAuth) {
    const token = getToken()
    if (token !== null) {
      next()
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

export default router
