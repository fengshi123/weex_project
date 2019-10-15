import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const files = require.context('./language', false, /\.json$/)
const messages = {}

files.keys().forEach((key) => {
  if (key === './index.js') return
  messages[key.replace(/(\.\/|\.json)/g, '')] = files(key)
})

Vue.use(VueI18n)

// console.log(`remote.app.getLocale() ${remote.app.getLocale()}`)

export default new VueI18n({
  locale: window.localStorage.getItem('locale'), // set locale
  fallbackLocale: 'zh-CN',
  messages // set locale messages
})
