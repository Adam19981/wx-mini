import { StorageEngine } from '@/request/manager'

export const storageEngine: StorageEngine = {
  async readString(key: string) {
    return new Promise((resolve, reject) => {
      uni.getStorage({
        key,
        success: (res) => {
          resolve(res.data)
        },
        fail: () => {
          resolve('')
        }
      })
    })
  },
  async writeString(key: string, value: string) {
    return new Promise((resolve, reject) => {
      uni.setStorage({
        key,
        data: value,
        success: () => {
          resolve()
        },
        fail: () => {
          reject()
        }
      })
    })
  },

  delete(keys: string[]) {
    return new Promise((resolve) => {
      keys.forEach((key) => {
        uni.removeStorageSync(key)
      })
      resolve()
    })
  }
}
