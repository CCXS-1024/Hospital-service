import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Login from '../views/Login.vue'
import { getToken } from '@/http/storage'
import Admin from '@/views/AdminMain.vue'
//
import Patient from '@/views/Patient/PatientMain.vue'
import PatientLayout from '@/views/Patient/subviews/PatientLayout.vue'
import OrderOperate from '@/views/Patient/subviews/OrderOperate.vue'
import SectionMessage from '@/views/Patient/subviews/SectionMessage.vue'
import MyOrder from '@/views/Patient/subviews/MyOrder.vue'
import MyBed from '@/views/Patient/subviews/MyBed.vue'
import PatientCard from '@/views/Patient/subviews/PatientCard.vue'

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
        meta: {
          requireAuth: true,
        },
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
