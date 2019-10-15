<template>
  <div class="file-detail">
    <wxc-mask
      :height="800"
      :width="750"
      border-radius="0"
      duration="200"
      mask-bg-color="#FFFFFF"
      :has-overlay="true"
      :show-close="false"
      :show="detailShow"
      @wxcMaskSetHidden="wxcLightboxOverlayClicked">
      <image
        class="file-detail__img"
        :src="curImgPath"
        :ref="'box'"
        resize="contain"
        @load="onImageLoad">
    </image>
     </wxc-mask>
  </div>
</template>

<script>
import { WxcLightbox, WxcDialog, WxcMask } from 'weex-ui';
import { sizeScale } from '../../utils/scaleImage';
export default {
  name: '',
  data () {
    return {
      topDis: 0,
      leftDis: 0,
      screenWidth: 1, // 要写一个非 0 默认值
      screenHeight: 1,
      gesToken: 0,
      imgWidth: 1, // android 情况下一定要写个默认值，写 0 无法渲染
      imgHeight: 1,
      startTime: 0,
      isClick: false,
      touchCount: 0,
      isMagnify: false
    }
  },
  props: {
    detailShow: {
      type: Boolean,
      default: false
    },
    curImgPath: {
      type: String,
      default: ''
    }
  },
  components: {
    WxcLightbox,
    WxcDialog,
    WxcMask
  },
  computed: {
    getImgWidth () {
      if (this.curScale < this.maxScale && this.isDblClick) {
        return 750 * this.curScale + 'px';
      } else {
        return '750px';
      }
    },
    getImgHeight () {
      if (this.curScale < this.maxScale && this.isDblClick) {
        return 800 * this.curScale + 'px';
      } else {
        return '800px';
      }
    }
  },
  watch: {

  },
  created () {
    this.screenWidth = 750;
    this.screenHeight = weex.config.env.deviceHeight - 800;
  },
  methods: {
    wxcLightboxOverlayClicked () {
      this.$emit('changeDetailShow', false);
    },
    onImageLoad (event) {
      let nw = event.size.naturalWidth;
      let ny = event.size.naturalHeight;

      let sizeObj = sizeScale(nw, ny, this.screenWidth, this.screenHeight);
      this.changeLeftTop(sizeObj);

      this.imgWidth = sizeObj.width;
      this.imgHeight = sizeObj.height;
      if (event.success) {
        // Do something to hanlde success
      }
    },
    changeLeftTop (posObj) {
      this.leftDis = posObj.left;
      this.topDis = posObj.top;
    }
  }
}
</script>
<style lang="sass">
  @import '../../assets/scss/pages/myDisk/fileDetail.scss'
</style>
