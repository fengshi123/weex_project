var mysql = require('mysql');
var conf = require('../conf/db');
var sql = require('./examSqlMapping');
var logger = require('../common/logger');
// 使用连接池，提升性能
var pool = mysql.createPool(conf.mysql);
var common = require('./common');

module.exports = {
  addExam: function (req, res, next) {
    var vm = this;
    pool.getConnection(function (err, connection) {
      if (err) {
        logger.error(err);
        return;
      }
      vm.createExam(req, res, connection).then(function (exam) {
        var questionList = req.body.questionList;
        var sqlParamsEntity = questionList.map(question => {
          var resultOptions = question.resultOptions.join('|');
          var stemImg = question.stemImg.join('|');
          var result = question.result.filter(item => {
            return !!item;
          })
          result = result.join('|');
          let arr = [
            question.questionId,
            exam.insertId,
            question.type,
            question.stem,
            stemImg,
            resultOptions,
            result
          ];
          return arr;
        });
        common.execTrans(sql.insertQuestion, sqlParamsEntity, function (err, info) {
          var result;
          if (err) {
            logger.error(err);
          } else {
            result = {
              code: 0,
              msg: '增加试卷成功'
            };
          }
          common.jsonWrite(res, result);
        })
      }).catch(function (err) {
        common.jsonWrite(res);
        logger.error(err);
      })
    });
  },
  // 创建一张试卷
  createExam: function (req, res, connection) {
    return new Promise(function (resolve, reject) {
      var date = new Date();
      var month = date.getMonth() + 1;
      var createTime = date.getFullYear() + '-' +
      month + '-' + date.getDate() + ' ' +
      date.getHours() + ':' +
      date.getMinutes() + ':' +
      date.getSeconds();
      connection.query(sql.createExam, [req.user.uid, req.body.examName, createTime], function (err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result)
        }
      });
    })
  },
  delete: function (req, res, next) {
    // delete by Id
    pool.getConnection(function (err, connection) {
      if (err) {
        logger.error(err);
      }
      var examId = req.body.exam_id;
      connection.query(sql.delete, examId, function (err, result) {
        if (err) {
          logger.error(err);
        } else {
          result = {
            code: 0,
            msg: '删除成功'
          };
        }
        common.jsonWrite(res, result);
        connection.release();
      });
    });
  },
  queryAll: function (req, res, next) {
    pool.getConnection(function (err, connection) {
      if (err) {
        logger.error(err);
      }
      connection.query(sql.queryAll, function (err, result) {
        var ret;
        if (err) {
          logger.error(err);
        } else {
          ret = {
            code: 0,
            data: result
          };
        }
        common.jsonWrite(res, ret);
        connection.release();
      });
    });
  },
  queryQuestionById: function (req, res, next) {
    var examId = req.query.exam_id;
    pool.getConnection(function (err, connection) {
      if (err) {
        logger.error(err);
      }
      connection.query(sql.queryQuestionById, [req.user.uid, examId], function (err, result) {
        var ret;
        if (err) {
          logger.error(err);
        } else {
          ret = {
            code: 0,
            data: result
          };
        }
        common.jsonWrite(res, ret);
        connection.release();
      });
    });
  },
  addAnswer: function (req, res, next) {
    pool.getConnection(function (err, connection) {
      if (err) {
        logger.error(err);
        return;
      }
      var answerList = req.body.answerList;
      var sqlParamsEntity = answerList.map(answer => {
        let arr = [
          req.user.uid,
          answer.questionid,
          answer.examid,
          answer.answerOption
        ];
        return arr;
      });
      common.execTrans(sql.insertAnswer, sqlParamsEntity, function (err, info) {
        var result;
        if (err) {
          logger.error(err);
        } else {
          result = {
            code: 0,
            msg: '保存答案成功'
          };
        }
        common.jsonWrite(res, result);
      })
    });
  },
  // 查询已作答当前试卷的用户
  queryUserById: function (req, res, next) {
    var examId = req.query.exam_id;
    pool.getConnection(function (err, connection) {
      if (err) {
        logger.error(err);
      }
      connection.query(sql.queryUserById, examId, function (err, result) {
        var ret;
        if (err) {
          logger.error(err);
        } else {
          ret = {
            code: 0,
            data: result
          };
        }
        common.jsonWrite(res, ret);
        connection.release();
      });
    });
  },
  queryScoreById: function (req, res, next) {
    var examId = req.query.exam_id;
    var questionLength = req.query.questionLength;
    var userSum = req.query.userSum;
    pool.getConnection(function (err, connection) {
      if (err) {
        logger.error(err);
      }
      connection.query(sql.queryScoreById, examId, function (err, result) {
        var ret;
        if (err) {
          logger.error(err);
        } else {
          ret = {
            code: 0,
            data: result,
            questionLength: questionLength,
            userSum: userSum
          };
        }
        common.jsonWrite(res, ret);
        connection.release();
      });
    });
  },
  queryExamId: function (req, res, next) {
    pool.getConnection(function (err, connection) {
      if (err) {
        logger.error(err);
      }
      connection.query(sql.queryExamId, req.user.uid, function (err, result) {
        var ret;
        if (err) {
          logger.error(err);
        } else {
          ret = {
            code: 0,
            data: result
          };
        }
        common.jsonWrite(res, ret);
        connection.release();
      });
    });
  }
};
