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

export interface AdminOrder {
  oId: number
  pId: number
  oStart: string
  oEnd: string
  oRecord: string
  oDrug: string
  oCheck: string
  oTotalPrice: string
  oPriceState: number
  oState: number
}

export interface PageOrderList {
  data: {
    data: {
      pageNumber: number
      pages: number
      total: number
      orders: AdminOrder[]
    }
    status: number
  }
}

export interface pageDrugList {
  data: {
    data: {
      pageNumber: number
      pages: number
      total: number
      drugs: DrugItem[]
    }
    status: number
  }
}

export interface DrugForm {
  drId: number | null
  drName: string
  drNumber: number | null
  drUnit: string
  drPrice: string
  drPublisher: string
}
export interface CheckItem {
  chId: number
  chName: string
  chPrice: number
}

export interface PageCheckList {
  data: {
    data: {
      pageNumber: number
      pages: number
      total: number
      checks: CheckItem[]
    }
    status: number
  }
}
