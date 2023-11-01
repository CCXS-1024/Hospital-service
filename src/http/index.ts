import instance from './instance'

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

//  病人登录接口
export const patientLogin = (data: any): Promise<axiosConfig<dataItem>> => {
  return instance.post('patient/login', data)
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
