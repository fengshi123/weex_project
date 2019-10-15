<template>
  <div>
    <wxc-mask
      height="800"
      width="702"
      border-radius="0"
      duration="200"
      mask-bg-color="#FFF"
      :has-animation="hasAnimation"
      :has-overlay="true"
      :show-close="false"
      :show="isMaskShow"
      @wxcMaskSetHidden="wxcMaskSetHidden">
      <image class="
        file-mask--img"
        :src="file.path">
      </image>
    </wxc-mask>
  </div>
</template>

<script>
import { WxcMask } from 'weex-ui';
export default {
  name: '',
  data () {
    return {
      overlayCanClose: true,
      isFalse: false,
      hasAnimation: true
    }
  },
  props: {
    isMaskShow: {
      type: Boolean,
      default: false
    },
    file: {
      type: Object,
      default: () => {

      }
    }
  },
  components: {
    WxcMask
  },
  filter: {

  },
  computed: {

  },
  watch: {

  },
  created () {

  },
  mounted () {

  },
  methods: {
    openMask (e) {
      this.$emit('changeMaskShow', true);
      this.hasAnimation = true;
    },
    wxcMaskSetHidden () {
      this.$emit('changeMaskShow', false);
    },
    openNoAnimationMask (e) {
      this.$emit('changeMaskShow', true);
      this.hasAnimation = false;
    }
  }
}
</script>

<style lang='scss'>
  @import '../../assets/scss/components/FileMask.scss';
</style>
