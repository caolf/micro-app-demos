import '@/styles/index.less'
import Vue from 'vue'
import App from '@/App.vue'
import router from '@/router'
import { baseRouter } from '@/router'
import { PiniaVuePlugin, createPinia } from 'pinia'
import { type User, useUserStore } from './stores/user'
import VueRouter from 'vue-router'

Vue.config.productionTip = false
Vue.use(PiniaVuePlugin)

function handleUserInfo(user1: User) {
  console.log('vue2-child, user from main app: ', JSON.stringify(user1))

  const { setUser, user } = useUserStore()
  console.log('vue2-child, user from self app: ', JSON.stringify(user))

  setUser(user1)
}

function addRouter(mainRouter: VueRouter, basename: string) {
  // let subRouter = mainRouter
  // const subRouters = mainRouter.getRoutes().filter(item => item.path.startsWith(basename))

  mainRouter.addRoute('2', {
    path: basename + '/tab-view',
    name: basename + '/tab-view',
  })
  debugger
}

export const provider = () => {
  let app: Vue | null = null
  let routerInstance: VueRouter | null = null
  return {
    render({ basename, dom, props }: any) {
      const mainRouter = (window.Garfish.getGlobalObject() as any).__MAIN_ROUTER__
      addRouter(mainRouter, basename)
      // 如果存在props.path，启用abstract路由
      routerInstance = baseRouter(basename, props.path ? 'abstract' : 'history')
      app = new Vue({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        router: routerInstance,
        pinia: createPinia(),
        render: (h) => h(App),
      }).$mount()

      if (props.path) {
        routerInstance.push(props.path)
      }
      dom.appendChild(app.$el)
      window?.Garfish.channel.on('userInfo', handleUserInfo)
    },
    destroy({ dom }: any) {
      window?.Garfish.channel.removeListener('userInfo', handleUserInfo)
      if (app) {
        app.$destroy()
        app.$el.innerHTML = ''
        app = null
      }
      dom.innerHTML = ''
      routerInstance = null
    },
  }
}

if (!window.__GARFISH__) {
  new Vue({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    router,
    pinia: createPinia(),
    render: (h) => h(App),
  }).$mount('#app')
}
