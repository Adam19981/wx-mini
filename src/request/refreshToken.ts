import { request_before } from './index'
import { refreshToken } from '@/modules/login/api/loginInterface'
import { manager as requestManager } from './manager/index'

function apiRequest(option: any): Promise<any> {
  return new Promise((resolve, reject) => {
    uni.request({
      url: option.url,
      data: option.data,
      method: option.method,
      header: option.headers,
      success: (res) => {
        resolve(res.data)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

class Manager {
  MAX_ERROR_COUNT = 5

  currentCount = 0

  errStack: Set<() => any> = new Set()

  isRefresh = false

  static _instance: Manager

  static getInstance() {
    if (!this._instance) {
      this._instance = new Manager()
    }
    return this._instance
  }

  private refreshSuccess() {
    this.currentCount = 0
    this.isRefresh = false
    this.errStack.clear()
  }

  private async clearAuth(errorData: any) {
    this.refreshSuccess()
    await requestManager.clear()
    uni.reLaunch({
      url: '/pages/index/index'
    })
    return Promise.reject(errorData)
  }

  async refreshToken(options: any, errorData: any) {
    if (
      ![10001, 10002].includes(errorData.code) ||
      options.url ===
        'https://hf-railway-mini.idethink.com/x/api/login/auth/refresh_token'
    ) {
      return Promise.reject(errorData)
    }
    const token = await requestManager.token()

    if (!token) {
      return await this.clearAuth(errorData)
    }
    // 判断当前是否为刷新状态中（防止多个请求导致多次调refresh接口）
    if (this.isRefresh) {
      return new Promise((resolve) => {
        // 缓存网络请求，等token刷新后直接执行
        this.errStack.add(async () => {
          const axiosOption = await request_before(options, false)
          const data = await apiRequest(axiosOption)
          resolve(data)
        })
      })
    }
    // 设置当前状态为刷新中
    this.isRefresh = true
    // // 如果重发次数超过，直接退出登录
    if (this.currentCount > this.MAX_ERROR_COUNT) {
      return await this.clearAuth(errorData)
    }
    // 增加重试次数
    this.currentCount += 1

    try {
      const tokenResp = await refreshToken({
        refreshToken: token!.refreshToken
      })

      await requestManager.setToken(tokenResp)

      // 遍历队列，重新发起请求
      this.errStack.forEach((cb) => cb())

      this.refreshSuccess()
      // 返回请求数据
      const axiosOption = await request_before(options, false)
      return await apiRequest(axiosOption)
    } catch (error: any) {
      this.isRefresh = false
      await this.refreshToken(options, error)
    }
  }
}
export const manager = Manager.getInstance()
