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
        :show="bingdingxShow"
        @wxcMaskSetHidden="wxcLightboxOverlayClicked">
        <image
          style="position: absolute"
          :style="{width: imgWidth + 'px', height: imgHeight + 'px', top: topDis + 'px', left: leftDis + 'px'}"
          :src="curImgPath"
          :ref="'box'" class="box"
          @touchstart="ontouchstart"
          @touchend="ontouchend"
          @load="onImageLoad"
          @appear="bind">
      </image>
     </wxc-mask>
  </div>
</template>

<script>
import { WxcLightbox, WxcDialog, WxcMask } from 'weex-ui';
import BindingX from 'weex-bindingx';
import { sizeScale } from '../../utils/scaleImage';
import { CONSTANT } from '../../utils/constant';
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
      curImgPath: `${CONSTANT.LOCAL_URL}/src/assets/images/testModule/qsz.jpg`,
      startTime: 0,
      isClick: false,
      touchCount: 0,
      isMagnify: false
    }
  },
  props: {
    bingdingxShow: {
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
    wxcLightboxOverlayClicked () {
      this.$emit('testBindingxDrag', false);
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
    },
    ontouchstart (event) {
      if (!this.isClick) {
        this.startTime = (new Date()).valueOf();
      }
      this.bind();
    },
    ontouchend (event) {
      let timestamp = (new Date()).valueOf();
      if (timestamp - this.startTime < 300 && !this.isClick) {
        this.isClick = true;
      } else if (this.isClick && timestamp - this.startTime < 1000) {
        console.log('双击了')
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
    bind () {
      var box = this.$refs.box.ref;
      BindingX.bind({
        anchor: box,
        eventType: 'pan',
        props: [
          {
            element: box,
            property: 'transform.translateX',
            expression: `x+0`
          },
          {
            element: box,
            property: 'transform.translateY',
            expression: `y+0`
          }
        ]
      });
    }
  }
}
</script>
