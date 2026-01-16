import { manager as notificationManager } from './inotification'
import { manager as requestManager } from './manager'

const eneVersion = uni.getAccountInfoSync()

export function getUrlByEnv() {
  switch (eneVersion.miniProgram.envVersion) {
    case 'develop':
      return {
        action: 'https://www.libong.online/inner/libong/x/api/upload',
        baseUrl: 'https://www.libong.online/inner',
        socketUrl: 'wss://websocket.com/websocket'
      }
    case 'trial':
      return {
        action: 'https://www.libong.online/inner/libong/x/api/upload',
        baseUrl: 'https://www.libong.online/inner',
        socketUrl: 'wss://websocket.com/websocket'
      }
    case 'release':
      return {
        action: 'https://www.libong.online/inner/libong/x/api/upload',
        baseUrl: 'https://www.libong.online/inner',
        socketUrl: 'wss://websocket.com/websocket'
      }
  }
}

const { baseUrl } = getUrlByEnv()

export interface RequestOptions<D = any> {
  /**
   * 资源url
   */
  url: string
  /**
   * 请求的参数
   */
  data?: D
  /**
   * 请求的参数
   */
  params?: any
  /**
   * 设置请求的 header，header 中不能设置 Referer。
   */
  headers?: any

  /**
   * 默认为 GET
   * 可以是：OPTIONS，GET，HEAD，POST，PUT，DELETE，TRACE，CONNECT
   */
  method?:
    | 'OPTIONS'
    | 'GET'
    | 'HEAD'
    | 'POST'
    | 'PUT'
    | 'DELETE'
    | 'TRACE'
    | 'CONNECT'
}

export interface IError {
  code: number
  message: string
}

export interface GeneralResponse<T> {
  /**
   * 资源url
   */
  code: number
  /**
   * 资源url
   */
  error: string
  /**
   *
   *
   * 请求的参数
   */
  data?: T
}

export function request_before(
  options: RequestOptions,
  needBaseUrl = true
): Promise<RequestOptions> {
  return new Promise(async (resolve) => {
    const token = await requestManager.token()
    const role = await requestManager.role()
    const appId = await requestManager.appId()

    options.url = needBaseUrl ? baseUrl + options.url : options.url

    if (options.method === 'GET') {
      options.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    } else if (options.method === 'POST') {
      options.headers['Content-Type'] = 'application/json'
    }
    if (role) {
      options.headers['li-role'] = role
    }
    if (token) {
      options.headers['li-token'] = token
    }
    if (appId) options.headers['li-app-id'] = appId
    resolve(options)
  })
}

function errorHandler<T>(data: GeneralResponse<T>): IError | null {
  if (data.code === 200) {
    return null
  }
  return {
    code: data.code,
    message: data.error
  }
}

export function request<T>(options: RequestOptions): Promise<T> {
  return new Promise<T>(async (resolve, reject) => {
    const option = await request_before(options)

    uni.request({
      url: option.url,
      data: option.data,
      method: option.method,
      header: option.headers,
      success: async (res) => {
        const data = res.data as GeneralResponse<T>

        const err = errorHandler(data)
        if (err) {
          notificationManager.emit('@request/OnError', err)
          reject(err)
          return
        }
        resolve(data.data!)
        notificationManager.emit('@request/onReceived', data)
      },
      fail: async () => {
        console.log('fail')
        const err: IError = {
          code: -22,
          message: '网络错误'
        }
        reject(err)
        notificationManager.emit('@request/OnError', err)
      }
    })
  })
}
