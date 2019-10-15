<template>
  <div>
    <wxc-popup
      popup-color="#fff"
      :show="isBottomShow"
      @wxcPopupOverlayClicked="popupOverlayBottomClick"
      pos="bottom"
      height="200">
      <div
        v-for="(item, index) in fsItems"
        :key="index"
        @click="handleClick(item)">
        <text class="handle-popup__main--item">&nbsp;&nbsp;{{item.title}}</text>
      </div>
    </wxc-popup>
    <dialog-module
      v-if="isDlShow"
      :title="fsItem.title"
      :type="fsItem.type"
      :isDlShow="isDlShow"
      @wxcDialogClick="wxcDialogClick"
      @updateDisk="updateDisk"
      :file="file"
      :path="path"
      :filesArr="filesArr">
    </dialog-module>
  </div>
</template>

<script>
import { WxcPopup } from 'weex-ui';
import DialogModule from '../components/dialogModule';
import { CONSTANT } from '../utils/constant';
import { global } from '../utils/globalVar';
import commonApi from '../api/common';
const modal = weex.requireModule('modal');
const WXAlbum = weex.requireModule('wxalbum')
export default {
  name: 'HandleBar',
  data () {
    return {
      height: 400,
      fsItem: {},
      isDlShow: false,
      filesName: []
    }
  },
  props: {
    isBottomShow: {
      type: Boolean,
      default: false
    },
    file: {
      type: Object,
      default: () => {}
    },
    fsItems: {
      type: Array
    },
    path: {
      type: String
    },
    filesArr: {
      type: Array,
      default: () => []
    }
  },
  components: {
    WxcPopup,
    DialogModule
  },
  methods: {
    getFilesListName () {
      let bodyJson = JSON.stringify({ path: this.path });
      let options = {
        url: '/files/queryAll',
        method: 'POST',
        body: bodyJson
      };
      commonApi.fetch(options, res => {
        if (res.ok && res.data.code === 0) {
          for (let item of res.data.data.stats) {
            this.filesName.push(item.path.split('/').pop());
          }
        }
      });
    },
    popupOverlayBottomClick () {
      this.$emit('changeBottomShow');
    },
    handleClick (item) {
      this.fsItem = item;
      this[item.type]();
    },
    upload () {
      const path = `user_disk/${global.uid}${this.path}`;
      const req = {
        type: 'image/jpeg',
        path: path,
        url: CONSTANT.SERVER_URL + '/users/upload',
        token: global.token
      };
      const reqJson = JSON.stringify(req);
      WXAlbum.choosePhoto(reqJson, res => {
        modal.toast({
          message: '上传成功~',
          duration: 1
        });
        this.$emit('requestAllFiles', this.path);
        this.$emit('changeBottomShow', false);
      })
    },
    newFolder () {
      this.isDlShow = true;
    },
    wxcDialogClick () {
      this.isDlShow = false;
      this.$emit('changeBottomShow', false);
    },
    updateDisk ({isShow, isRefresh}) {
      this.isDlShow = isShow;
      this.$emit('changeBottomShow', isShow);
      if (isRefresh) {
        this.$emit('requestAllFiles', this.path);
      }
    }
  }
}
</script>

<style lang='scss'>
  @import '../assets/scss/components/HandlePopup.scss';
</style>
