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

export const patientLogin = (data: any): Promise<axiosConfig<dataItem>> => {
  return instance.post('patient/login', data)
}

export const registerUser = (data: any): Promise<axiosConfig<null>> => {
  return instance.get('patient/addPatient', {
    params: {
      ...data,
    },
  })
}

export const requestPeople = (): Promise<axiosConfig<number>> => {
  return instance.get('order/orderPeople')
}

export const requestBed = (): Promise<axiosConfig<number>> => {
  return instance.get('bed/bedPeople')
}
