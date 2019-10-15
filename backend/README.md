## 介绍

本项目为Web前端跨平台开发语言课题的后台服务 — express 项目

**node.js 版本为：8.2.1**

**npm 版本为：5.3.0**

## 启动

``` bash
1、进入到目录底下，安装插件，例如 backend 目录底下
$ npm install
2、初始化 sql 脚本，需要进入目录 /backend/bin/db/,执行以下脚本语句
$ setup.sh
3、启动项目
$ npm start
```

## 注意事项

#### 1、获取 token 中的 uid

可通过 `req.user.data`  获取得到用户的`uid`。

#### 2、记得将错误记录到日志中，便于定位问题

可查阅`userDao.js`文件，查看如何将错误写入到日志中。