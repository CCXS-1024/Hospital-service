import { defineStore } from 'pinia'
import { getToken } from '@/http/storage'
import { tokenDecode } from '@/utils'
export const doctorUserStore = defineStore('doctorUser', {
  state: () => ({
    id: 0,
    userName: '',
    exp: 0,
  }),
  actions: {
    iniState() {
      const data = tokenDecode(getToken() as string)
      this.id = data.aId
      this.userName = data.aName
      this.exp = data?.exp
    },
  },
})
