<template>
  <div class="file-detail">
     <wxc-mask
        :height="screenHeight"
        :width="screenWidth"
        border-radius="0"
        duration="200"
        mask-bg-color="#FFFFFF"
        :has-overlay="true"
        :show-close="false"
        :show="weexShow"
        @wxcMaskSetHidden="wxcLightboxOverlayClicked">

                <!-- @touchstart="handleStart"
        @touchend="handleEnd"
        @touchmove="handleMove"
        @load="onImageLoad" -->
        <!-- @click="clickImage" -->
      <image
        style="position: absolute"
        :style="{width: imgWidth + 'px', height: imgHeight + 'px', top: topDis + 'px', left: leftDis + 'px'}"
        :src="curImgPath"
        ref="box" class="box"
        @touchstart="handleStart"
        @touchend="handleEnd"
        @touchmove="handleMove"
        @load="onImageLoad">
      </image>
    </wxc-mask>
  </div>
</template>

<script>
import { WxcLightbox, WxcDialog, WxcMask } from 'weex-ui';
import { CONSTANT } from '../../utils/constant';
import { sizeScale } from '../../utils/scaleImage';

const DEFAULT_WIDTH = 750;
const DEFAULT_HEIGHT = 800;
export default {
  name: '',
  data () {
    return {
      topDis: 0,
      leftDis: 0,
      screenWidth: 1, // 要写一个非 0 默认值
      screenHeight: 1,
      x: 0,
      y: 0,
      flag: 0,
      info: '',
      gesToken: 0,
      isDblClick: false,
      curTime: 0,
      curScale: 1,
      maxScale: 4,
      imgWidth: DEFAULT_WIDTH, // android 情况下一定要写个默认值，写 0 无法渲染
      imgHeight: DEFAULT_HEIGHT,
      handleEl: null,
      startX: 0,
      startY: 0,
      curImgPath: `${CONSTANT.LOCAL_URL}/src/assets/images/testModule/qsz.jpg`,
      firstClick: false,
      firstTouchStartTime: 0,
      firstTocuhEndTime: 0,
      secondTouchStartTime: 0,
      secondTouchEndTime: 0,
      touchStartTime: 0,
      touchCount: 0,
      isClick: false,
      isMagnify: false
    }
  },
  props: {
    curImage: {
      type: Object,
      default: () => {}
    },
    weexShow: {
      type: Boolean,
      default: false
    }
  },
  components: {
    WxcLightbox,
    WxcDialog,
    WxcMask
  },
  filter: {

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
    handleStart (e) {
      let timestamp = (new Date()).valueOf();
      this.curTime = timestamp;
      if (!this.isClick) {
        this.touchStartTime = timestamp;
      }
      this.startX = e.changedTouches[0].pageX;
      this.startY = e.changedTouches[0].pageY;
    },
    handleEnd (e) {
      let timestamp = (new Date()).valueOf();
      if (timestamp - this.touchStartTime < 300 && !this.isClick) {
        this.isClick = true;
      } else if (this.isClick && timestamp - this.touchStartTime < 1000) {
        if (!this.isMagnify) {
          this.imgWidth = this.imgWidth * 2;
          this.imgHeight = this.imgHeight * 2;
          this.isMagnify = true;
        } else {
          this.imgWidth = this.imgWidth / 2;
          this.imgHeight = this.imgHeight / 2;
          this.isMagnify = false;
        }

        this.isClick = false;
      } else {
        this.isClick = false;
      }
    },
    handleMove (e) {
      let timestamp = (new Date()).valueOf();
      if ((timestamp - this.curTime) > 300) {
        let posObj = {
          left: e.changedTouches[0].pageX - this.startX,
          top: e.changedTouches[0].pageY - this.startY
        };
        this.changeLeftTop(posObj);
        this.curTime = timestamp;
      }
    },
    changeLeftTop (posObj) {
      this.leftDis = posObj.left;
      this.topDis = posObj.top;
    },
    clickImage (target, timestamp) {
      if (this.curTime !== 0) {
        if (target.timestamp - this.curTime <= 1000) {
          let tempScale = this.curScale;
          this.curScale = tempScale * 2;
          let tempWidth = this.imgWidth;
          let tempHeight = this.imgHeight;
          this.imgWidth = tempWidth + tempWidth;
          this.imgHeight = tempHeight + tempHeight;
        }
      }
      this.curTime = target.timestamp;
    },
    wxcLightboxOverlayClicked () {
      this.$emit('testWeexDrag', false);
    }
  }
}
</script>

<style lang='scss'>
  @import '../../assets/scss/pages/myDisk/fileDetail.scss';
</style>
