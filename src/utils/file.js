export function getUniqueName (name, files) {
  for (let num = 0; ; num++) {
    let newName = name;
    if (num !== 0) {
      newName = newName + '(' + num + ')';
    }
    let i = 0
    for (; i < files.length; i++) {
      if (newName === files[i]) {
        break;
      }
    }
    if (i === files.length && files[i] !== newName) {
      return newName;
    }
  }
}
export function getFileType (name) {
  if (name.charAt('.') < 0) {
    return 'unknown';
  } else {
    name = name.split('.').pop();
    name = name.toLowerCase();
    const fileType = {
      'img': ['bmp', 'gif', 'jpg', 'png', 'jpeg', 'psd'],
      'doc': ['docx', 'doc'],
      'txt': ['txt'],
      'ppt': ['pptx', 'ppt'],
      'zip': ['rar', 'zip', 'tar', 'gz', '7z', 'bz2', 'arj', 'z'],
      'pdf': ['pdf'],
      'video': ['flv', 'swf', 'mkv', 'avi', 'rm', 'rmvb', 'mpeg', 'mpg', 'ogv', 'mov', 'wmv', 'mp4', 'webm', 'swf'],
      'audio': ['mp3', 'wav', 'ogg', 'aif', 'au', 'ram', 'wma', 'mmf', 'amr', 'aac', 'flac']
    };

    for (let key in fileType) {
      for (let type of fileType[key]) {
        if (name === type) {
          return key;
        }
      }
    }
    return 'unknown';
  }
}
