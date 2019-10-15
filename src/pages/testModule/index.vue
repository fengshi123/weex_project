<template>
  <div>
    <MiniBar title="功能测试"></MiniBar>
    <wxc-button text="新建用户" size="big" :btnStyle="btnStyle" class="net__btn" @wxcButtonClicked="handleNew"></wxc-button>
    <wxc-button text="获取token" size="big" :btnStyle="btnStyle" class="net__btn" @wxcButtonClicked="getToken"></wxc-button>
    <wxc-button text="原生手机通讯" size="big" :btnStyle="btnStyle" class="net__btn" @wxcButtonClicked="testCall"></wxc-button>
    <wxc-button text="获取文件/上传文件" size="big" :btnStyle="btnStyle" class="net__btn" @wxcButtonClicked="testUpload"></wxc-button>
    <wxc-button text="weex-ui幻灯片展示图片" size="big" :btnStyle="btnStyle" class="net__btn" @wxcButtonClicked="testShowImage(true)"></wxc-button>
    <wxc-button text="bindingx 拖动图片" size="big" :btnStyle="btnStyle" class="net__btn" @wxcButtonClicked="testBindingxDrag(true)"></wxc-button>
    <wxc-button text="weex 没有 bindingx 拖动图片" size="big" :btnStyle="btnStyle" class="net__btn" @wxcButtonClicked="testWeexDrag(true)"></wxc-button>
    <light-box
      v-if="lightBoxShow"
      :lightBoxShow="lightBoxShow"
      @testShowImage="testShowImage">
    </light-box>
    <bindingx-drag
      v-if="bingdingxShow"
      :bingdingxShow="bingdingxShow"
      @testBindingxDrag="testBindingxDrag">
    </bindingx-drag>
    <weex-drag
      v-if="weexShow"
      :weexShow="weexShow"
      @testWeexDrag="testWeexDrag">
    </weex-drag>

    <image class="net__image" :src="getSrc" v-if="imgPath"></image>
    <wxc-button text="websocket测试" size="big" :btnStyle="btnStyle" class="net__btn" @wxcButtonClicked="testSocket"></wxc-button>
    <wxc-dialog
      title="全部老师"
      :show="showAll"
      :single="true"
      :show-no-prompt="false"
      @wxcDialogConfirmBtnClicked="closeAll"
    >
      <div slot="content">
        <div v-for="(item,index) in teaList" :key="index" style="flex-direction: row;">
          <text>{{index}}、{{item.uid}} {{item.name}} {{item.sex}}</text>
          <wxc-icon name="close" @wxcIconClicked="handleDelete(item.uid,index)"></wxc-icon>
        </div>
      </div>
    </wxc-dialog>
    <wxc-dialog
      title="新建老师"
      :show="showNew"
      :single="false"
      @wxcDialogCancelBtnClicked="cancleNew"
      @wxcDialogConfirmBtnClicked="confirmNew"
    >
      <div slot="content">
        <input v-model="uid" class="net__input" type="text" placeholder="id">
        <input v-model="name" class="net__input" type="text" placeholder="name">
        <wxc-radio :list="sexList" @wxcRadioListChecked="radioListChecked"></wxc-radio>
      </div>
    </wxc-dialog>
  </div>
</template>

<script>
import MiniBar from '../../components/miniBar';
import LightBox from './lightBox';
import BindingxDrag from './bindingxDrag';
import WeexDrag from './weexDrag';
import { WxcButton, WxcDialog, WxcRadio, WxcIcon, WxcMinibar, WxcSwipeAction } from 'weex-ui';
import {CONSTANT} from '../../utils/constant.js'
import api from '../../api/common.js';
const storage = weex.requireModule('storage')
const modal = weex.requireModule('modal');
const WXCall = weex.requireModule('wxcall');
const WXAlbum = weex.requireModule('wxalbum');
const ws = weex.requireModule('webSocket');
export default {
  name: 'NetworkRequest',
  data () {
    return {
      lightBoxShow: false,
      bingdingxShow: false,
      weexShow: false,
      showAll: false,
      showNew: false,
      teaList: [],
      uid: '',
      name: '',
      sex: '',
      sexList: [{ title: '男', value: '男' }, { title: '女', value: '女' }],
      btnStyle: {
        'backgroundColor': '#FFC900'
      },
      imgPath: '',
      swupeData: [
        {
          title: '标题1',
          right: [
            {
              text: '置顶',
              onPress: function () {
                modal.toast({
                  message: '置顶',
                  duration: 0.3
                });
              }
            },
            {
              text: '删除',
              onPress: () => {
                modal.toast({
                  message: '删除',
                  duration: 0.3
                });
              },
              style: { backgroundColor: '#F4333C', color: 'white' }
            }
          ]
        }
      ]
    };
  },
  components: {
    WxcButton,
    WxcDialog,
    WxcRadio,
    WxcIcon,
    WxcMinibar,
    MiniBar,
    WxcSwipeAction,
    LightBox,
    BindingxDrag,
    WeexDrag
  },
  computed: {
    getSrc () {
      return CONSTANT.SERVER_URL + this.imgPath;
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
    testShowImage (isShow) {
      this.lightBoxShow = isShow;
    },
    testBindingxDrag (isShow) {
      this.bingdingxShow = isShow;
    },
    testWeexDrag (isShow) {
      this.weexShow = isShow;
    },
    handleNew () {
      this.showNew = true;
    },
    radioListChecked (e) {
      this.sex = e.value;
    },
    confirmNew () {
      let param = {
        uid: this.uid,
        name: this.name,
        age: this.sex
      };
      let options = {
        url: '/users/addUser',
        method: 'POST',
        body: JSON.stringify(param)
      };
      let vm = this;
      api.fetch(options, function (ret) {
        vm.showNew = false;
        let message =
          ret.ok && ret.data.code === 0 ? '创建用户成功!' : '创建用户失败!';
        modal.toast({
          message: message,
          duration: 1
        });
      });
    },
    cancleNew () {
      this.showNew = false;
    },
    handleDelete (uid, index) {
      let param = {
        uid: uid
      };
      let options = {
        url: '/users/deleteUser',
        method: 'POST',
        body: JSON.stringify(param)
      };
      let vm = this;
      api.fetch(options, function (ret) {
        let message =
          ret.ok && ret.data.code === 0 ? '删除老师成功!' : '删除老师失败!';
        modal.toast({
          message: message,
          duration: 1
        });
        if (ret.ok && ret.data.code === 0) {
          vm.teaList.splice(index, 1);
        }
      });
    },
    getToken () {
      let param = {
        uid: '1',
        password: '111'
      };
      let options = {
        url: '/getToken',
        method: 'POST',
        body: JSON.stringify(param)
      };
      api.fetch(options, function (ret) {
        weex.token = 'Bearer ' + ret.data.data.token;
      });
    },
    goBack () {
      this.$router.go(-1);
    },
    testCall () {
      WXCall.call('tel:10086')
    },
    testUpload () {
      let path = 'public/upload/';
      let vm = this;
      storage.getItem('token', event => {
        let param = {
          type: 'image/jpeg', // 选择的数据类型
          path: path,
          url: CONSTANT.SERVER_URL + '/users/upload',
          token: event.data
        };
        WXAlbum.choosePhoto(JSON.stringify(param), ret => {
          let obj = JSON.parse(ret);
          vm.imgPath = '/' + path + obj.file[0].originalFilename;
          modal.alert({
            message: vm.imgPath,
            okTitle: '确认'
          }, function () {
            console.log('alert callback')
          })
        });
      })
    },
    testSocket () {
      ws.send('get');
    },
    socketMessage (event) {
      modal.toast({
        message: event.data,
        duration: 1
      });
    },
    test () {
      console.log(weex);
    }
  }
};
</script>

<style scoped lang="scss">
.net {
  &__btn {
    margin: 20px;
    &--small {
      width: 20px;
    }
  }

  &__input {
    width: 450px;
    height: 70px;
    border-width: 1px;
    border-style: solid;
    border-color: rgb(162, 217, 192);
    margin: 10px;
    padding-left: 20px;
    font-size: 28px;
  }

  &__image{
    margin-left:100px;
    width:100px;
    height:100px
  }

  &__minibar-mid {
    font-size: 40px;
    color: #fff;
  }

  &__swipe{
    justify-content: center;
    padding-left: 30px;
  }
}
</style>
