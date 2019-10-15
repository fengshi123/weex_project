var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
// var expressWs = require('express-ws');
/* eslint-disable */
var domain = require('domain');
/* eslint-enable */
var expressJWT = require('express-jwt');

const CONSTANT = require('./common/constant');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var tokenRouter = require('./routes/token');
var filesRouter = require('./routes/files');
var examRouter = require('./routes/exam');

var app = express();

require('express-ws')(app);
app.ws('/', function (ws, req) {
  console.log('ws connect...');
  ws.on('message', function (msg) {
    ws.send('服务端返回的消息...');
  })
});

// 设置允许跨域访问该服务！
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});

app.post('*', bodyParser.urlencoded({ extended: true }),
  function (req, res, next) {
    next();
  });

// view engine setup
// app.set('view engine', 'html');
app.use('/public/views', function (req, res, next) {
  res.type('html');
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/user_disk', express.static(path.join(__dirname, 'user_disk')));

// 输出日志到目录
var fs = require('fs');
var accessLogStream = fs.createWriteStream(path.join(__dirname, '/log/request.log'), { flags: 'a', encoding: 'utf8' }); // 记得要先把目录建好，不然会报错
app.use(logger('combined', { stream: accessLogStream }));

// 处理没有捕获的异常，导致 node
app.use(function (req, res, next) {
  var reqDomain = domain.create();
  reqDomain.on('error', function (err) {
    res.status(err.status || 500);
    res.render('error');
  });
  reqDomain.run(next);
});

// token 设置
app.use(expressJWT({
  secret: CONSTANT.SECRET_KEY
}).unless({
  // 除了这个地址，其他的URL都需要验证
  path: ['/getToken', /^\/public\/.*/, /^\/user_disk\/.*/]
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/getToken', tokenRouter);
app.use('/files', filesRouter);
app.use('/exam', examRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // 校验 token 失败时的处理
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('invalid token...');
  }

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000, () => console.log('Successfully! express app listening on port 3000...'));
// module.exports = app;
