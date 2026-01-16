import { manager as notificationManager } from '../inotification'
import type { IError, GeneralResponse } from '../index'

export function subscribeOnReceived(
  self: any,
  callback: (data: any | null, err: IError | null) => void
) {
  notificationManager.subscribe(
    '@request/onReceived',
    self,
    (res: GeneralResponse<any>) => {
      if (res.code !== 0) {
        callback(null, { code: res.code, message: res.message })
        return
      }
      callback(res.data, null)
    }
  )
}

export function unsubscribeOnReceived(self: any) {
  notificationManager.unsubscribe('@request/OnError', self)
}

export function subscribeOnError(
  self: any,
  callback: (err: IError | null) => void
) {
  notificationManager.subscribe(
    '@request/OnError',
    self,
    (res: IError | null) => {
      if (res === null || res === undefined) {
        return
      }
      callback(res)
    }
  )
}

export function unsubscribeOnError(self: any) {
  notificationManager.unsubscribe('@request/OnError', self)
}
