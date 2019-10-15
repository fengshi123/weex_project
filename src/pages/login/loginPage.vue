<template>
<div class="login">
  <image class="login__bg" :src="getBgImg"></image>
  <wxc-minibar title="云课堂"
               text-color="#fff"
               background-color="#3eb4ff"
               :show="true">
    <image :src="getLogoImg"
         slot="left"
         class="login__logo"></image>
  </wxc-minibar>
  <div>
    <slider class="login__slider" auto-play="true" interval="2000">
      <div class="login__frame" v-for="(image, index) in imageList" :key="index">
        <image class="login__frame--image" :src="image.src"></image>
      </div>
      <indicator class="login__slider--indicator"></indicator>
    </slider>
  </div>
  <div class="login__username">
    <input v-model="uid" class="login__input" type="text" placeholder="请输入用户名"/>
    <image class="login__input--img" :src = "getUsernameImg"/>
  </div>
  <div class="login__password">
    <input v-model="password" class="login__input" type="password" placeholder="请输入密码"/>
    <image class="login__input--img" :src = "getPasswordImg"/>
  </div>
  <wxc-button class="login__button"
              type="blue"
              text="登录"
              @wxcButtonClicked="login"></wxc-button>
  <div class="login__row">
      <text class="login__row-forgetPsd">忘记密码？</text>
      <text class="login__row-register" @click="toRegister">免费注册</text>
  </div>
</div>
</template>

<script>
import {getImgUrl} from '../../utils/getPath';
import {WxcButton, WxcMinibar} from 'weex-ui'
import api from '../../api/common.js';
import {global} from '../../utils/globalVar.js'
const modal = weex.requireModule('modal');
export default {
  name: 'loginPage',
  data () {
    return {
      uid: '',
      password: '',
      imageList: [
        {src: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3014056807,3083549770&fm=26&gp=0.jpg'},
        {src: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2361226575,2664795887&fm=26&gp=0.jpg'},
        {src: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2227132417,785831804&fm=26&gp=0.jpg'},
        {src: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2027453295,666706767&fm=26&gp=0.jpg'},
        {src: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2486849056,2716786903&fm=26&gp=0.jpg'}
      ]
    };
  },
  computed: {
    getBg () {
      return getImgUrl('test.jpg');
    },
    getBgImg () {
      return getImgUrl('bg.png');
    },
    getLogoImg () {
      return getImgUrl('logo.png');
    },
    getUsernameImg () {
      return getImgUrl('username_icon.png');
    },
    getPasswordImg () {
      return getImgUrl('password_icon.png');
    }
  },
  components: {WxcButton, WxcMinibar},
  methods: {
    login () {
      if (!this.uid || !this.password) {
        // 不输入密码依旧以用户：1 的身份进入
        this.uid = '1';
        this.password = '111';
      }
      let param = {
        uid: this.uid,
        password: this.password
      };
      let options = {
        url: '/getToken',
        method: 'POST',
        body: JSON.stringify(param)
      };
      let vm = this;
      api.fetch(options, function (ret) {
        if (ret.ok && ret.data.code === 0) {
          let data = ret.data.data;
          global.token = 'Bearer ' + data.token;
          global.name = data.name;
          global.sex = data.sex;
          vm.$router.push('/tabIndex');
        } else {
          modal.toast({
            message: '用户认证失败!',
            duration: 1
          });
        }
      });
    }
  }
}
</script>

<style lang="scss">
  @import '../../assets/scss/pages/login/login.scss';
</style>
