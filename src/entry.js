/* global Vue */
// import i18n from '@/i18n'
/* weex initialized here, please do not move this line */
const store = require('@/store/index');
const { router } = require('./router/router.js')

const App = require('@/index.vue')
/* eslint-disable no-new */
new Vue(Vue.util.extend({el: '#root', router, store}, App))
router.push('/')
