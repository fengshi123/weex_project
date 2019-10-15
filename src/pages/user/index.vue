<template>
  <div>
    <MiniBar :showLeft="false" title="我"></MiniBar>
    <div class="user__head">
      <image :src="getSrc" class="user__avatar"></image>
      <div class="user__info">
        <text class="user__name">{{name}}</text>
        <text class="user__sex">{{sex}}</text>
      </div>
    </div>
    <UserCell
      title="打客服电话"
      img="hot_dog"
      @switchClick="call">
    </UserCell>
    <UserCell
      title="websocket 通信"
      img="popsicle"
      @switchClick="sendSocket">
    </UserCell>
    <wxc-button
            :btnStyle="btnStyle"
            type="blue"
            text="退出"
            @wxcButtonClicked="logout"></wxc-button>
  </div>
</template>

<script>
import MiniBar from '../../components/miniBar';
import UserCell from '../../components/userCell';
import {WxcCell, WxcButton} from 'weex-ui';
import {global} from '../../utils/globalVar.js'
import {getImgUrl} from '../../utils/getPath';
import {CONSTANT} from '../../utils/constant.js'
const ws = weex.requireModule('webSocket');
const WXCall = weex.requireModule('wxcall');
const modal = weex.requireModule('modal');
export default {
  name: 'NetworkRequest',
  data () {
    return {
      showAll: false,
      name: global.name,
      sex: global.sex,
      imgPath: '',
      btnStyle: {
        'margin-top': '150px',
        'margin-left': '20px',
        'backgroundColor': '#3eb4ff'
      }
    }
  },
  components: {WxcCell, MiniBar, UserCell, WxcButton},
  computed: {
    getSrc () {
      return getImgUrl('user_avatar.png');
    },
    getHotdog () {
      return getImgUrl('hot_dog.png');
    }
  },
  created () {
    ws.WebSocket(CONSTANT.SOCKET_WS, '');
    if (weex.config.env.platform === 'Web') {
      ws.onmessage = this.socketMessage;
    } else {
      ws.onmessage(this.socketMessage);
    }
  },
  methods: {
    call (flag) {
      if (flag) {
        WXCall.call('tel:10086')
      }
    },
    sendSocket (flag) {
      if (flag) {
        ws.send('get');
      }
    },
    socketMessage (event) {
      modal.toast({
        message: event.data,
        duration: 1
      });
    },
    logout () {
      this.$router.push('/');
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/scss/pages/user/index.scss";
</style>
