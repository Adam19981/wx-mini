type CallbackHandler = (data: any, self: any) => void

class INotificationManager {
  static _instance: INotificationManager

  private listenersMap: Map<
    string,
    Array<{ target: any; callback: CallbackHandler }>
  > = new Map()

  static getInstance() {
    if (!INotificationManager._instance) {
      INotificationManager._instance = new INotificationManager()
    }
    return INotificationManager._instance
  }

  public subscribe(path: string, self: any, callback: CallbackHandler) {
    const tuple = { target: self, callback }
    if (!this.listenersMap.has(path)) {
      this.listenersMap.set(path, [])
    }
    this.listenersMap.get(path)?.push(tuple)
  }

  public unsubscribe(path: string, self: any) {
    if (!this.listenersMap.has(path)) {
      return
    }
    const newListenersMap = this.listenersMap.get(path)!.filter((listener) => {
      return listener.target !== self
    })
    this.listenersMap.set(path, newListenersMap)
  }

  public emit(path: string, data: any) {
    this.listenersMap.get(path)?.forEach((listener) => {
      listener.callback(data, listener.target)
    })
  }
}

export const manager = INotificationManager.getInstance()
