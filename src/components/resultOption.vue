<template>
  <div class="resultOp__options">
    <text class="resultOp__text">{{option}}：</text>
    <input v-model="resultOptions[sub]"
           class="resultOp__input--option"
           type="text">
    <image
      :src="result[sub]?getImg:getImg1"
      class="resultOp__check"
      @click="setResult(index,sub,option)"
    ></image>
  </div>
</template>

<script>
import { WxcMinibar, WxcIcon } from 'weex-ui';
import {getImgUrl} from '../utils/getPath';
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
    option: {
      type: String
    },
    index: {
      type: Number
    },
    sub: {
      type: Number
    },
    resultOptions: {
      type: Array
    },
    result: {
      type: Array
    }
  },
  components: {
    WxcMinibar,
    WxcIcon
  },
  computed: {
    getImg () {
      return getImgUrl('checked.png');
    },
    getImg1 () {
      return getImgUrl('nocheck.png');
    }
  },
  methods: {
    setResult (index, sub, option) {
      this.$emit('setResult', index, sub, option);
    }
  }
}
</script>

<style lang='scss'>
  @import '../assets/scss/components/resultOption.scss';
</style>
