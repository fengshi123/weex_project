// 统一封装 stream.fetch

import {CONSTANT} from '../utils/constant.js'
import {global} from '../utils/globalVar.js'
const stream = weex.requireModule('stream')
const initOptions = {
  method: 'POST',
  type: 'json',
  headers: {
    'Content-Type': 'application/json'
  }
}
export default{
  fetch (options, callback, progressCallback) {
    if (options && options.url) {
      options.url = CONSTANT.SERVER_URL + options.url
    }
    initOptions.headers['Authorization'] = global.token;
    const finalOptions = Object.assign({}, initOptions, options)
    stream.fetch(
      finalOptions,
      callback,
      progressCallback
    )
  }
}
