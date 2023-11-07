import instance from './instance'
import type {
  OrderList,
  PatientInfo,
  ToDayOrderList,
  PageItem,
  DrugItem,
  CheckItem,
  DoctorHisItem,
  FormType,
} from '@/types'
interface axiosConfig<T> {
  data: {
    status: number
    msg: string
    data?: T
  }
}

interface dataItem {
  pCard: string
  pId: string
  pName: string
  token: string
}

interface DoctorItem {
  dId: string
  dName: string
  token: string
}

interface SectionDoc {
  doctors: string[]
}

interface SelectTime {
  eTOn: string
  fTOf: string
  fTOs: string
  nTOt: string
  sTOs: string
  tTOe: string
}

export interface OrderListConfig {
  total: number
  pages: number
  pageNumber: number
  orders: DoctorHisItem[]
}
//  病人登录接口
export const patientLogin = (data: any): Promise<axiosConfig<dataItem>> => {
  return instance.post('patient/login', data)
}
// 医生登录
export const doctorLogin = (data: any): Promise<axiosConfig<DoctorItem>> => {
  return instance.post('doctor/login', data)
}
// 注册病人接口
export const registerUser = (data: any): Promise<axiosConfig<null>> => {
  return instance.get('patient/addPatient', {
    params: {
      ...data,
    },
  })
}

// 获取所有今天预约挂号人数
export const requestPeople = (): Promise<axiosConfig<number>> => {
  return instance.get('order/orderPeople')
}

// 获取所有今天住院人数
export const requestBed = (): Promise<axiosConfig<number>> => {
  return instance.get('bed/bedPeople')
}

//  获取预约挂号医生信息
export const requestSection = (
  sectionOpt: string
): Promise<axiosConfig<SectionDoc>> => {
  return instance.get('patient/findDoctorBySection', {
    params: {
      dSection: sectionOpt,
    },
  })
}
// 获取具体时间挂号信息
export const acquireNowMedic = (
  arTime: string,
  dSection: string
): Promise<axiosConfig<any[]>> => {
  return instance.get('/arrange/findByTime', {
    params: {
      arTime,
      dSection,
    },
  })
}

// 获取医生剩余挂号票数
export const acquireTime = (
  id: number,
  orderData: string
): Promise<axiosConfig<SelectTime>> => {
  let idTime = id + orderData
  return instance.get('order/findOrderTime', {
    params: {
      arId: idTime,
    },
  })
}
// 确定挂号
export const orderSuccess = (res: any): Promise<axiosConfig<null>> => {
  return instance.get('patient/addOrder', {
    params: {
      pId: res.pId,
      dId: res.dId,
      oStart: res.orderDate + ' ' + res.oTime,
      arId: res.dId + res.orderDate,
    },
  })
}

// 获取所有订单信息
export const requestOrder = (id: string): Promise<axiosConfig<any>> => {
  return instance.get('patient/findOrderByPid', {
    params: {
      pId: id,
    },
  })
}

export const priceClick = (oId: string): Promise<axiosConfig<any>> => {
  return instance.get('order/updatePrice', {
    params: {
      oId,
    },
  })
}

export const requestBedOrder = (
  id: string
): Promise<axiosConfig<OrderList[]>> => {
  return instance.get('bed/findBedByPid', {
    params: {
      pId: id,
    },
  })
}

//  获取患者信息
export const requestPatient = (
  id: string
): Promise<axiosConfig<PatientInfo>> => {
  return instance.get('doctor/findPatientById', {
    params: {
      pId: id,
    },
  })
}

// 医生
export const requestNowPeople = (id: string): Promise<axiosConfig<number>> => {
  return instance.get('order/orderPeopleByDid', {
    params: {
      dId: id,
    },
  })
}

export const requestToDayOrder = (
  dId: string,
  oStart: string
): Promise<axiosConfig<ToDayOrderList[]>> => {
  return instance.get('doctor/findOrderByNull', {
    params: {
      dId,
      oStart,
    },
  })
}

export const requestDrug = (
  search: string,
  size: number,
  pageNumber: number
): Promise<axiosConfig<PageItem<DrugItem, null>>> => {
  return instance.get('drug/findAllDrugs', {
    params: {
      size: size,
      pageNumber,
      query: search,
    },
  })
}

export const addDrugBy = (drId: number): Promise<axiosConfig<DrugItem>> => {
  return instance.get('drug/findDrug', {
    params: {
      drId: drId,
    },
  })
}

export const requestAllCheck = (
  search: string,
  size: number,
  pageNumber: number
): Promise<axiosConfig<PageItem<null, CheckItem>>> => {
  return instance.get('check/findAllChecks', {
    params: {
      size: size,
      pageNumber,
      query: search,
    },
  })
}

export const addCheckBy = (id: number) => {
  return instance.get('check/findCheck', {
    params: {
      chId: id,
    },
  })
}

// 根据 id来减少药品的数量

export const reduceDrugNumber = (drId: number, usedNumber: number) => {
  return instance.get('drug/reduceDrugNumber', {
    params: {
      drId,
      usedNumber,
    },
  })
}

export const submitOrder = (data: any) => {
  return instance.post('order/updateOrder', data)
}

export const requestOrders = (
  id: string,
  size: number,
  pageNumber: number,
  query: string
): Promise<axiosConfig<OrderListConfig>> => {
  return instance.get('order/findOrderByDid', {
    params: {
      dId: id,
      size,
      pageNumber,
      query,
    },
  })
}

// admin
export const loginAdmin = (data: any) => instance.post('admin/login', data)

export const requestDoctors = (
  pageNumber: number,
  size: number,
  query: string
): Promise<axiosConfig<any>> =>
  instance.get('admin/findAllDoctors', {
    params: {
      pageNumber,
      size,
      query,
    },
  })

export const addDoctor = (data: any): Promise<axiosConfig<any>> =>
  instance.get('admin/addDoctor', {
    params: {
      ...data,
    },
  })

export const findDoctorById = (dId: number): Promise<axiosConfig<FormType>> =>
  instance.get('admin/findDoctor', {
    params: {
      dId,
    },
  })

export const updateDoctor = (data: any) =>
  instance.get('admin/modifyDoctor', {
    params: {
      ...data,
    },
  })

export const deleteDoctor = (dId: number) =>
  instance.get('admin/deleteDoctor', {
    params: {
      dId,
    },
  })
