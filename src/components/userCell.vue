<template>
    <wxc-cell :style="cellStyle">
      <image class="userCell__image"
          slot="label"
          :src="getSrc"></image>
        <text class="userCell__title"
            style="margin:20px;"
            slot="title">{{title}}
        </text>
        <switch slot="value" @click=handleClick></switch>
    </wxc-cell>
</template>

<script>
import { WxcCell } from 'weex-ui';
import {getImgUrl} from '../utils/getPath';
export default {
  name: 'HeaderBar',
  data () {
    return {
      flag: false,
      iconStyle: {
        'color': '#ffffff',
        'paddingLeft': '2px'
      },
      cellStyle: {
        'width': '750px',
        'padding-top': '0px',
        'padding-bottom': '0px'
      }
    }
  },
  props: {
    title: {
      type: String
    },
    img: {
      type: String,
      default: ''
    }
  },
  computed: {
    getSrc () {
      return getImgUrl(this.img);
    }
  },
  components: {
    WxcCell
  },
  methods: {
    handleClick (arg) {
      this.flag = !this.flag;
      this.$emit('switchClick', this.flag);
      console.log(arg);
    }
  }
}
</script>

<style lang='scss'>
  @import '../assets/scss/components/userCell.scss';
</style>
