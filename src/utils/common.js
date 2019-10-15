export default{
  toParams (obj) {
    var param = ''
    for (const name in obj) {
      if (typeof obj[name] !== 'function') {
        param += '&' + name + '=' + encodeURI(obj[name])
      }
    }
    return param.substring(1)
  }
}
