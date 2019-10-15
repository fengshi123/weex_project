<template>
  <div>
    <div class="new-file">
      <wxc-button
        text="上传/新建"
        size="big"
        :btnStyle="getBtnStyle"
        :textStyle="getTextStyle"
        @wxcButtonClicked="popupOverlayBottomClick">
      </wxc-button>
    </div>
  </div>
</template>

<script>
import { WxcButton } from 'weex-ui';
export default {
  name: 'newFile',
  data () {
    return {
    }
  },
  props: {
    isTopShow: {
      type: Boolean
    }
  },
  components: {
    WxcButton
  },
  computed: {
    getBtnStyle () {
      const btnStyleObj = {
        'background-color': '#F7C242',
        'height': '80px',
        'line-height': '60px'
      }
      return btnStyleObj;
    },
    getTextStyle () {
      const textStyleObj = {
        'color': '#fff',
        'font-size': '42px !important'
      }
      return textStyleObj;
    }
  },
  methods: {
    popupOverlayBottomClick () {
      this.$emit('popupOverlayBottomClick')
    }
  }
}
</script>
<style lang="scss" scoped>
  .new-file {
    width: 750px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
</style>
