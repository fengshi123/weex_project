<template>
  <div class="file-detail">
    <wxc-lightbox
      class="file-detail__img"
      style="background-size: contain"
      ref="img"
      :height="800"
      :show="lightBoxShow"
      :image-list="imagesPathList"
      :index="0"
      @wxcLightboxOverlayClicked="wxcLightboxOverlayClicked">
    </wxc-lightbox>
  </div>
</template>

<script>
import { WxcLightbox } from 'weex-ui';
import { CONSTANT } from '../../utils/constant';

const TEST_PATH = `${CONSTANT.LOCAL_URL}/src/assets/images/testModule/`

export default {
  name: '',
  data () {
    return {
      imagesPathList: [{
        src: `${TEST_PATH}qsz.jpg`
      },
      {
        src: `${TEST_PATH}bird.png`
      },
      {
        src: `${TEST_PATH}msg.png`
      }]
    }
  },
  props: {
    lightBoxShow: {
      type: Boolean,
      default: false
    }
  },
  components: {
    WxcLightbox
  },
  methods: {
    wxcLightboxOverlayClicked () {
      this.$emit('testShowImage', false);
    }
  }
}
</script>
