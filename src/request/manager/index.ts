export interface StorageEngine {
  readString(key: string): Promise<string | undefined>

  writeString(key: string, data: string): Promise<void>

  delete(keys: string[]): Promise<void>

  clear(): Promise<void>
}

export interface ManagerOptions {
  storageEngine: StorageEngine
  customKeys?: string[]
}

class Manager {
  private static instance: Manager

  public host!: string

  private storageEngine!: StorageEngine

  customKeys: string[] = []

  public static getInstance(): Manager {
    if (!this.instance) {
      this.instance = new Manager()
    }
    return this.instance
  }

  public setup(options: ManagerOptions) {
    this.storageEngine = options.storageEngine
    this.customKeys = options.customKeys || []
  }

  public static setup(options: ManagerOptions) {
    Manager.getInstance().setup(options)
  }

  private getStorageEngine(): StorageEngine {
    if (!this.storageEngine) {
      console.log('request 存储引擎未初始化')
    }
    return this.storageEngine
  }

  public role(): Promise<string | undefined> {
    return this.getStorageEngine().readString('role')
  }

  public setRole(role: string): Promise<void> {
    return this.getStorageEngine().writeString('role', role)
  }

  public setAppId(projectId: string): Promise<void> {
    return this.getStorageEngine().writeString('appId', projectId)
  }

  public token(): Promise<string | undefined> {
    return this.getStorageEngine().readString('token')
  }

  public appId(): Promise<string | undefined> {
    return this.getStorageEngine().readString('appId')
  }

  public setToken(token: string): Promise<void> {
    return this.getStorageEngine().writeString('token', token)
  }

  public customHeader(key: string): Promise<string | undefined> {
    return this.getStorageEngine().readString(key)
  }

  public setHeader(key: string, value: string): Promise<void> {
    return this.getStorageEngine().writeString(key, value)
  }

  public clear(): Promise<void> {
    return this.getStorageEngine().delete(['role', 'token', 'user'])
  }
}

export const manager = new Manager()
