var fs = require('fs');
var common = require('../dao/common');
var logger = require('../common/logger');

// 默认网盘目录，存在则不创建，不存在则创建
const USER_DISK_NAME = 'user_disk';

module.exports = {
  add: function (req, res, next) {
    let reqBody = req.body
    fs.mkdir('./' + USER_DISK_NAME + '/' + req.user.uid + '/' + reqBody.path + reqBody.name, function (err) {
      var result;
      if (err) {
        logger.error(err);
      } else {
        result = {
          code: 0,
          message: '新建文件夹成功'
        };
      }
      common.jsonWrite(res, result);
    })
  },
  delDir: function (req, res, next) {
    var param = req.body;
    var pathReq = './' + USER_DISK_NAME + '/' + req.user.uid + param.path;

    var deleteFolder = function (path) {
      var arr = fs.readdirSync(path);
      for (var i in arr) {
        var stats = fs.statSync(path + '/' + arr[i]);
        if (stats.isFile()) {
          fs.unlinkSync((path + '/' + arr[i]));
        } else {
          deleteFolder((path + '/' + arr[i]));
        }
      }
      fs.rmdirSync(path);
      var result = {
        code: 0,
        message: '删除成功'
      }
      common.jsonWrite(res, result);
    }
    deleteFolder(pathReq + param.name);
  },
  delFile: function (req, res, next) {
    var param = req.body;
    fs.unlink('./' + USER_DISK_NAME + '/' + req.user.uid + '/' + param.path + param.name, function (err) {
      var result;
      if (err) {
        logger.error(err);
      } else {
        result = {
          code: 0,
          message: '删除成功'
        };
        common.jsonWrite(res, result);
      }
    })
  },
  update: function (req, res, next) {
    var param = req.body;
    const curPath = './' + USER_DISK_NAME + '/' + req.user.uid + '/' + param.path;
    fs.rename(curPath + param.old_name, curPath + param.new_name, function (err) {
      var result;
      if (err) {
        logger.error(err);
      } else {
        result = {
          code: 0,
          message: '重命名成功'
        };
      }
      common.jsonWrite(res, result);
    })
  },
  queryAll: function (req, res, next) {
    var fsReadDir = function (path) {
      return new Promise(function (resolve, reject) {
        fs.readdir(path, function (err, files) {
          if (err) reject(err);
          resolve(files)
        })
      })
    }

    var fsStat = function (path) {
      return new Promise(function (resolve, reject) {
        var preDirLen = ('./' + USER_DISK_NAME + '/' + req.user.uid).length;
        fs.stat(path, function (err, stat) {
          if (err) reject(err)
          var type = stat.isFile() ? 'file' : 'dir';
          resolve(Object.assign({
            path: '/' + USER_DISK_NAME + '/' + req.user.uid + path.substring(preDirLen),
            mime_type: type
          }, stat))
        })
      })
    }

    var fsMkDir = function (path) {
      return new Promise(function (resolve, reject) {
        fs.mkdir(path, function (err) {
          if (err) {
            logger.error(err);
            reject(err);
            var result = {
              code: 1,
              message: '网盘访问失败'
            }
            common.jsonWrite(res, result);
          }
          resolve();
        })
      })
    }

    function readFilesList (path) {
      return fsReadDir(path)
        .then(function (files) {
          let promises = files.map(function (file) {
            return fsStat(path + file);
          });
          return Promise.all(promises).then(function (stats) {
            return { stats }
          }).then(function (data) {
            var result;
            result = {
              code: 0,
              message: '获取文件成功',
              data: data
            };
            common.jsonWrite(res, result);
            return data;
          })
        })
    };

    function mkUidDir () {
      return fsReadDir('./' + USER_DISK_NAME)
        .then(function (files) {
          var isExitUid = false;
          if (files.length > 0) {
            for (var i = 0; i < files.length; i++) {
              if (files[i] === req.user.uid) {
                isExitUid = true;
                break;
              }
            }
          }
          if (!isExitUid) {
            fsMkDir('./' + USER_DISK_NAME + '/' + req.user.uid).then(function () {
              readFilesList('./' + USER_DISK_NAME + '/' + req.user.uid + req.body.path);
            })
          } else {
            readFilesList('./' + USER_DISK_NAME + '/' + req.user.uid + req.body.path);
          }
        })
    }

    function getFilesList () {
      return fsReadDir('./')
        .then(function (files) {
          var isExitDisk = false;
          for (var i = 0; i < files.length; i++) {
            if (files[i] === USER_DISK_NAME) {
              isExitDisk = true;
              break;
            }
          }
          if (!isExitDisk) {
            fsMkDir('./' + USER_DISK_NAME).then(function () {
              mkUidDir();
            })
          } else {
            mkUidDir();
          }
        })
    };
    getFilesList();
  }
}
