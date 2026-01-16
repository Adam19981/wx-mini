import { createSSRApp } from 'vue'
import uView from 'vk-uview-ui'
import { manager as requestManager } from '@/request/manager'
import { storageEngine } from '@/store'
// @ts-ignore
import App from './App.vue'
import './styles/index.scss'
import { subscribeOnError } from '@/request/subscribe'

subscribeOnError(null, async (err) => {
  if (err?.message) {
    uni.showToast({
      icon: 'none',
      title: err.message
    })
  }
  if (err?.code === 401) {
    await requestManager.clear()
    uni.reLaunch({
      url: '/pages/index/login'
    })
  }
})

requestManager.setup({
  storageEngine
})

requestManager.setAppId('shoe-manager')

export function createApp() {
  const app = createSSRApp(App)

  app.use(uView)
  return {
    app
  }
}
