<template>
  <div
    class="easy-moment"
    :style="contentStyle">
    <wxc-lottery-rain
      v-if="isRainShow"
      :config="config"
      :pic-list="getPicList"
      ref="wxc-lottery-rain"
      :wrap-style="wrapStyle"
      @wxcLotteryRainCaught="wxcLotteryRainCaught">
    </wxc-lottery-rain>
    <wxc-overlay
      :show="isOverlayShow"
      @wxcOverlayBodyClicked="wxcOverlayBodyClicked">
    </wxc-overlay>
    <div v-if="isOverlayShow" class="easy-moment__redBag">
      <text class="easy-moment__text">{{getCredits}}</text>
    </div>
    <wxc-dialog
      :content="getCreditsContent"
      :show="isEndShow"
      :single="false"
      :is-checked="false"
      confirm-text="是"
      cancel-text="否"
      :left="750"
      @wxcDialogCancelBtnClicked="wxcDialogCancelBtnClicked"
      @wxcDialogConfirmBtnClicked="wxcDialogConfirmBtnClicked">
    </wxc-dialog>
    <div v-if="isEndTipShow" class="easy-moment__end">
      <text class="easy-moment__text">游戏结束，您当次游戏获取总分为{{sumCredits}}</text>
      <text class="easy-moment__text easy-moment__refresh iconfont" style="font-family:iconfontListenDisk" @click="initGame">&#xe600;</text>
    </div>
    <div v-if="noGame" class="easy-moment__begin">
      <text class="easy-moment__text">点击开始，进入获取积分小游戏哦~</text>
      <text class="easy-moment__text easy-moment__play iconfont" style="font-family:iconfontListenDisk" @click="initGame">&#xe87c;</text>
    </div>
  </div>
</template>

<script>
import { WxcLotteryRain, WxcMask, WxcOverlay, WxcDialog, Utils } from 'weex-ui';
import { getImgUrl } from '../../utils/getPath';
import DialogModule from '../../components/dialogModule';
export default {
  components: {
    WxcLotteryRain,
    WxcMask,
    DialogModule,
    WxcOverlay,
    WxcDialog
  },
  data () {
    const content = '放松一下，点击确定，进入赚取积分小游戏哦~';
    return {
      content,
      config: {
        intervalTime: 450,
        hideAniTime: 300,
        showAniTime: 300,
        showTime: 450,
        randomTime: 300,
        width: 241,
        height: 206
      },
      credits: 0,
      wrapStyle: {
        backgroundColor: '#850B0B',
        opacity: 0.7
      },
      contentStyle: {},
      title: '进入游戏',
      type: 'intoGame',
      countClick: 0,
      sumCredits: 0,
      isEnd: false,
      isKnown: false,
      noGame: true,
      isDlShow: false,
      isRainShow: false,
      isEndTipShow: false,
      isEndShow: false,
      isOverlayShow: false
    }
  },
  props: {
    curentTab: 0
  },
  computed: {
    getPicList () {
      const WEB_IMAGE_URL = `easyMoment/`;
      return [
        getImgUrl(`${WEB_IMAGE_URL}poking_me.png`),
        getImgUrl(`${WEB_IMAGE_URL}waiting_for_you.png`),
        getImgUrl(`${WEB_IMAGE_URL}i_am_here.png`),
        getImgUrl(`${WEB_IMAGE_URL}clicking_me.png`)
      ]
    },
    getCredits () {
      if (this.credits === 0) {
        return `很遗憾~\n0 分`;
      } else {
        return `恭喜你！\n${this.credits}分`
      }
    },
    getCreditsContent () {
      return `已达到当日最高次数限制（5次），当前获取总分为${this.sumCredits}，继续游戏总分不再进行累计，是否继续？`;
    }
  },
  watch: {
    curentTab (newVal) {
      this.isEndTipShow = false;
      if (newVal === 1) {
        this.noGame = true;
        this.isDlShow = true;
      } else {
        this.isDlShow = false;
        this.isRainShow = false;
        this.isOverlayShow = false;
      }
    }
  },
  created () {
    const tabPageHeight = Utils.env.getPageHeight();
    const navHeight = Utils.env.isWeb() ? 0 : (Utils.env.isIPhoneX() ? 176 : 132);
    this.contentStyle = { height: (tabPageHeight - 120 + navHeight) + 'px' };
  },
  methods: {
    wxcDialogCancelClick () {
      this.isDlShow = false;
      this.noGame = true;
    },
    wxcLotteryRainCaught (e) {
      this.credits = Math.round(Math.random() * 3);
      this.countClick++;
      this.sumCredits += this.credits;
      const MAX_CLICK_LIMIT = 5;
      if (this.countClick >= MAX_CLICK_LIMIT && !this.isKnown) {
        this.isEnd = true;
        this.isEndShow = true;
      }
      this.isOverlayShow = true;
    },
    wxcDialogClick () {
      this.isDlShow = false;
      this.isRainShow = true;
    },
    wxcOverlayBodyClicked () {
      this.isOverlayShow = false;
    },
    wxcDialogCancelBtnClicked () {
      this.isEndShow = false;
      this.isRainShow = false;
      this.isEndTipShow = true;
      this.isOverlayShow = false;
    },
    wxcDialogConfirmBtnClicked () {
      this.isEndShow = false;
      this.isKnown = true;
    },
    initGame () {
      this.isEndShow = false;
      this.isEndTipShow = false;
      this.isRainShow = true;
      this.noGame = false;
    }
  }
}
</script>
<style lang="sass">
  @import '../../assets/scss/pages/game/index.scss'
</style>
