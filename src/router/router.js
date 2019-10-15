/* global Vue */
import Router from 'vue-router'
import LoginRouter from '@/router/login.router'
import TestModuleRouter from '@/router/testModule.router'
import MyDiskRouter from '@/router/myDisk.router'
import Question from '@/router/exam.router'
import TabIndex from '@/pages/tabIndex.vue'
Vue.use(Router)

export const router = new Router({
  routes: [
    {
      path: '/tabIndex',
      name: 'tabIndex',
      component: TabIndex
    },
    ...LoginRouter,
    ...TestModuleRouter,
    ...MyDiskRouter,
    ...Question
  ]
})
