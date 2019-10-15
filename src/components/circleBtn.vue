<template>
  <div>
    <wxc-button
      class="circle-btn--plus iconfont"
      :text="getCircleText"
      size="medium"
      :btnStyle="getBtnStyle"
      :textStyle="getTextStyle"
      @wxcButtonClicked="plusClick">
    </wxc-button>
  </div>
</template>

<script>
import { WxcButton } from 'weex-ui';
// import { mapState } from 'vuex';
export default {
  name: 'circleBtn',
  data () {
    return {
      isShow: false
    }
  },
  props: {
    item: {
      type: Object
    }
  },
  components: {
    WxcButton
  },
  computed: {
    getCircleText () {
      return '\ue889';
    },
    getBtnStyle () {
      const btnStyleObj = {
        'width': '100px',
        'height': '100px',
        'border-radius': '50px',
        'background-color': this.item.bgColor,
        'line-height': '100px',
        'font-size': '42px'
      }
      return btnStyleObj;
    },
    getTextStyle () {
      const textStyleObj = {
        'font-size': '100px',
        'font-family': 'iconfontListenDisk'
      }
      return textStyleObj;
    }
  },
  methods: {
    plusClick () {
      this[this.item.type]();
    },
    popupOverlayBottomClick (isShow) {
      if (isShow === undefined) {
        isShow = true;
      }
      this.$emit('popupOverlayBottomClick', isShow);
    }

  }
}
</script>
<style lang="scss">
  @import '../assets/scss/components/circleBtn.scss';
</style>
