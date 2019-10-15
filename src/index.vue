<template>
<div>
    <router-view></router-view>
</div>
</template>

<script>
import { initIconfont } from './utils/getPath';
import api from './api/common.js';
import {global} from './utils/globalVar.js'
const modal = weex.requireModule('modal');
const globalEvent = weex.requireModule('globalEvent');
export default {
  name: 'App',
  data () {
    return {
      exitFlag: false
    }
  },
  beforeCreate () {
    const ICONFONT_NAME = 'iconfont.ttf';
    const ICONFONT_URL = {
      Web: `/src/assets/font/${ICONFONT_NAME}`,
      android: `local:///${ICONFONT_NAME}`,
      iOS: `./font/${ICONFONT_NAME}`,
      others: `//at.alicdn.com/t/font_1274721_la2cu4arz7.ttf`
    }
    initIconfont(ICONFONT_URL);
  },
  created () {
    this.listenAndroidBack();
    // this.getToken();
  },
  methods: {
    getToken () {
      let param = {
        uid: '1',
        password: '111'
      };
      let options = {
        url: '/getToken',
        method: 'POST',
        body: JSON.stringify(param)
      };
      let vm = this;
      api.fetch(options, function (ret) {
        if (ret.ok && ret.data.code === 0) {
          global.token = 'Bearer ' + ret.data.data.token;
          global.name = ret.data.data.name;
          global.sex = ret.data.data.sex;
          vm.$router.push('/tabIndex');
        } else {
          modal.toast({
            message: '用户认证失败!',
            duration: 1
          });
        }
      });
    },
    listenAndroidBack () {
      let vm = this;
      globalEvent.addEventListener('androidback', function (e) {
        if (vm.$route.name === 'tabIndex' || vm.$route.name === 'loginPage') {
          if (vm.exitFlag) {
            weex.requireModule('wxclose').closeApp();
          } else {
            modal.toast({
              message: '再点一次退出',
              duration: 1
            });
            vm.exitFlag = true;
            vm.clearExitFlag();
          }
        } else {
          vm.$router.go(-1);
        }
      });
    },
    clearExitFlag () {
      let vm = this;
      setTimeout(function () {
        vm.exitFlag = false
      }, 3000)
    }
  }
}
</script>

<style scoped  lang="scss">
</style>
