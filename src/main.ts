import { createSSRApp } from 'vue'
// @ts-ignore
import uView from 'vk-uview-ui'
import App from './App.vue'
import './styles/index.scss'

export function createApp() {
  const app = createSSRApp(App)

  app.use(uView)
  return {
    app
  }
}
