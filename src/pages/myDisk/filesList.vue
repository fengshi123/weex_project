<template>
  <div class="files-list">
    <handle-popup
      v-if="isBottomShow"
      :isBottomShow="isBottomShow"
      :file="file"
      @refreshList="refreshList"
      @changeBottomShow="changeBottomShow"
      :fsItems="fsItems">
    </handle-popup>
    <file-mask
      :isMaskShow="isMaskShow"
      :file="file">
    </file-mask>
    <scroller class="files-list__main">
      <WxcSwipeAction @onNodeClick="nodeClick" :data="getFilesArr">
        <div slot-scope="val" class="files-list__content" :height="100">
         <image class="files-list__content--icon" :src="val.val.item.icon"></image>
          <text class="files-list__content--name">{{val.val.item.name}}</text>
        </div>
      </WxcSwipeAction>
    </scroller>
    <dialog-module
      v-if="isDlShow"
      :isDlShow="isDlShow"
      :title="fsItem.title"
      :type="fsItem.type"
      :file="file"
      @changeDlShow="changeDlShow"
      @updateDisk="updateDisk"
      :path="path"
      :filesArr="filesArr">
    </dialog-module>
    <file-detail
      :curImgPath="curImgPath"
      :detailShow="detailShow"
      v-if="detailShow"
      @changeDetailShow="changeDetailShow"
      :curIndex="curIndex">
    </file-detail>
  </div>
</template>

<script>
import { WxcLoading, WxcButton, WxcSwipeAction } from 'weex-ui';
// import { mapState } from 'vuex';
import HandlePopup from '../../components/handlePopup';
import DialogModule from '../../components/dialogModule';
import FileMask from './fileMask';
import FileDetail from './fileDetail';
import { CONSTANT } from '../../utils/constant';
import { encodeImageUrl } from '../../utils/encode';
export default {
  name: 'filesList',
  data () {
    const fsItems = [{
      title: '重命名',
      type: 'rename'
    }, {
      title: '删除',
      type: 'delete'
    }];
    return {
      fsItems,
      fsItem: {},
      isShowLoading: false,
      isBottomShow: false,
      file: {},
      isMaskShow: false,
      isDlShow: false,
      imagesList: [],
      detailShow: false,
      scrollerHeight: '',
      curIndex: 0,
      curImgPath: ''
    }
  },
  props: {
    filesArr: {
      type: Array,
      default: () => []
    },
    imagesPathList: {
      type: Array,
      default: () => []
    },
    path: {
      type: String
    }
  },
  components: {
    WxcLoading,
    WxcButton,
    WxcSwipeAction,
    HandlePopup,
    FileMask,
    DialogModule,
    FileDetail
  },
  computed: {
    filesList () {
      return this.$store.default.state.myDisk.filesList
    },
    getScrollerHeight () {
      let srollerheight = this.$getConfig().env.deviceHeight - 100;
      return `${srollerheight}px`;
    },
    // ...mapState({
    //   filesList: state => state.myDisk.filesList
    // }),
    getUploadStyle () {
      let uploadStyleObj = {
        'width': '50px',
        'height': '50px',
        'border-top-left-radius': '25px',
        'border-top-right-radius': '25px',
        'border-bottom-right-radius': '25px',
        'border-bottom-left-radius': '25px',
        'margin-right': 0
      }
      return uploadStyleObj;
    },
    getFilesArr () {
      let list = [];
      for (let file of this.filesArr) {
        list.push(Object.assign({
          right: [{
            text: '重命名',
            onPress: () => {
              this.rename(file);
            },
            style: {
              backgroundColor: '#3eb4ff',
              color: 'white'
            }
          },
          {
            text: '删除',
            onPress: () => {
              this.delete(file);
            },
            style: {
              backgroundColor: '#F4333C',
              color: 'white'
            }
          }],
          autoClose: true
        }, {
          name: file.name,
          icon: file.icon,
          type: file.type,
          path: file.path}));
      }
      return list;
    }

  },
  created () {
    this.scrollerHeight = this.$getConfig().env.deviceHeight - 100 + 'px';
  },
  methods: {
    rename (file) {
      this.changeDlShow(true);
      this.fsItem = {
        type: 'rename',
        title: '重命名'
      }
      this.file = file;
    },
    delete (file) {
      this.changeDlShow(true);
      this.fsItem = {
        type: 'delete',
        title: '删除'
      }
      this.file = file;
    },
    changeDlShow (isShow) {
      this.isDlShow = isShow;
    },
    wxcDialogClick () {

    },
    refreshList () {
      this.isBottomShow = false;
      this.$emit('requestAllFiles', this.path);
    },
    nodeClick (node, i) {
      let pathArr = node.path.split('/');
      let preStr = '';
      for (let pos = 0; pos < pathArr.length; pos++) {
        if (pos < 3 && pos > 0) {
          preStr += `/${pathArr[pos]}`;
        } else if (pos >= 3) {
          break;
        }
      }
      this.curImgPath = `${CONSTANT.SERVER_URL}${node.path}`;
      this.curImgPath = encodeURI(this.curImgPath);
      let encodeUrl = '';
      for (let char of this.curImgPath) {
        char = encodeImageUrl(char);
        encodeUrl += char;
      }
      this.curImgPath = encodeUrl;
      let realPath = node.path.substring(preStr.length);
      if (node.type === 'dir') {
        this.$emit('requestAllFiles', `${realPath}/`);
      } else if (node.type === 'img') {
        this.changeDetailShow(true);
      }
    },
    changeBottomShow (isShow) {
      this.isBottomShow = isShow;
      this.$emit('changePlusShow', !isShow);
    },
    filePreview (file) {
      if (file.type === 'img') {
        this.file = file;
        this.changeMaskShow(true);
      }
    },
    changeMaskShow (isShow) {
      this.isMaskShow = isShow;
    },
    updateDisk ({isShow, isRefresh}) {
      this.isDlShow = isShow;
      this.changeBottomShow(isShow);
      if (isRefresh) {
        this.$emit('requestAllFiles', this.path);
      }
    },
    changeDetailShow (isShow) {
      this.detailShow = isShow;
    }
  }
}
</script>
<style lang="scss">
  @import '../../assets/scss/pages/myDisk/filesList.scss';
</style>
