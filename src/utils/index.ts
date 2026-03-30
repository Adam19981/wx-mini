import * as SDate from './date'
import { manager as requestManager } from '@/request/manager'

export async function hasAuthorization() {
  const token = await requestManager.token()

  if (!token) {
    uni.navigateTo({
      url: '/pages/index/login'
    })

    return Promise.reject()
  }
}

export { SDate }
