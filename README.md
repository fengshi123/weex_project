## 介绍

本项目为Web前端跨平台开发语言课题的 — weex 项目

**node.js 版本为：8.2.1**

**npm 版本为：5.3.0**

## 启动

``` bash
1、安装 week 工具
$ npm install -g weex-toolkit
2、进入到目录底下，安装插件，例如 weex_project 目录底下
$ npm install
3、启动项目
$ npm start
```

## 注意事项

### 1、按模块区分

1.1、路由按模块进行区分，例如：网络请求模块，单独起一个路由文件：`network.router.js`，然后在router.js中引入，这样做的好处是减少代码冲突的可能性，且项目维护比较直观；

1.2、`pages`底下的文件按模块划分，例如：网络请求模块，单独起一个`network`的文件夹，该模块的`.vue`文件都放在该文件夹底下。

### 2、登录`token`

2.1、即使你用户名/密码没输入，点击登录也会进行页面跳转（即使报认证失败），是为了解决 `preview`底下，输入框无法填的问题，但是此时你无法成功访问任何借口，可通过 网络请求>获取`token` ，来解决。
## 项目路径说明

![1.png](https://github.com/fengshi123/blog/blob/master/assets/weex/124.png?raw=true) 