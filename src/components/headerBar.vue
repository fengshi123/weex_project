<template>
  <div class="header-bar">
    <text
      class="iconfont header-bar--back"
      style="font-family:iconfontListenDisk"
      @click="backHome">&#xe8b5;
    </text>
    <text class="header-bar--name">{{ title }}</text>
    <text></text>
  </div>
</template>

<script>
import { WxcMinibar } from 'weex-ui';
export default {
  name: 'HeaderBar',
  props: {
    title: {
      type: String
    },
    path: {
      type: String
    }
  },
  components: {
    WxcMinibar
  },
  methods: {
    backHome () {
      if (this.path === '/') {
        this.$router.go(-1);
      } else {
        let subLength = this.path.length - this.title.length;
        let path = this.path.substr(0, subLength - 1);
        this.$emit('requestAllFiles', `${path}`);
      }
    }
  }
}
</script>

<style lang='scss'>
  @import '../assets/scss/components/HeaderBar.scss';
</style>
