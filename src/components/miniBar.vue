<template>
   <wxc-minibar background-color="#3eb4ff" leftButton="">
      <wxc-icon :icon-style=iconStyle name="back" v-if="showLeft" slot="left" @wxcIconClicked="goBack"></wxc-icon>
      <text class="minibar__title" slot="middle">{{title}}</text>
      <text class="minibar__opera" slot="right" v-if="operation" @click="operationClick">{{operation}}</text>
    </wxc-minibar>
</template>

<script>
import { WxcMinibar, WxcIcon } from 'weex-ui';
export default {
  name: 'HeaderBar',
  data () {
    return {
      iconStyle: {
        'color': '#ffffff',
        'paddingLeft': '2px'
      }
    }
  },
  props: {
    title: {
      type: String
    },
    operation: {
      type: String,
      default: ''
    },
    showLeft: {
      type: Boolean,
      default: true
    }
  },
  components: {
    WxcMinibar,
    WxcIcon
  },
  methods: {
    goBack () {
      this.$router.go(-1);
    },
    operationClick () {
      this.$emit('operationClick');
    }
  }
}
</script>

<style lang='scss'>
  @import '../assets/scss/components/miniBar.scss';
</style>
