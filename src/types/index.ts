export interface OrderList {
  version: null | string
  bstate: number
  bstart: string
  breason: string
  bid: number
  bId: number
  pId: number
  dId: number
  bState: number
  bStart: string
  bReason: string
}

export interface PatientInfo {
  pAge: number
  pBirthday: string
  pCard: string
  pEmail: string
  pGender: string
  pName: string
  pPhone: string
  pid: string
}

export interface ToDayOrderList {
  oid: number
  pid: number
  pName: string
  oStart: string
}

export interface PageItem<T, Z> {
  total: number
  pageNumber: number
  size: number
  drugs: T[]
  checks: Z[]
}

export interface DrugItem {
  drId: number
  drName: string
  drPrice: number
  drNumber: number
  drUnit: string
  drPublisher: string
  priceNum?: number
}

export interface CheckItem {
  chId: number
  chName: string
  chPrice: number
}

export interface DoctorHisItem {
  oId: number
  dId: number
  pId: number
  oStart: string
  oEnd: string
  oRecord: string
  ODrug: string
  oCheck: string
  oTotalPrice: string
  oPriceState: string
  oState: number
}

export interface FormType {
  dId: number | null
  dPassword: string
  dName: string
  dGender: string
  dPost: string
  dSection: string
  dCard: string
  dPhone: string
  dEmail: string
  dPrice: string
  dIntroduction: string
}
