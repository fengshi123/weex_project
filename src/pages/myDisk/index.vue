<template>
  <div class="net-disk">
    <files-list
      :filesArr="filesArr"
      :imagesPathList="imagesPathList"
      class="net-disk__main"
      @changeNewShow="changeNewShow"
      @requestAllFiles="requestAllFiles"
      @changePlusShow="changePlusShow"
      :path="path">
    </files-list>
    <header-bar
      :title="title"
      :path="path"
      @requestAllFiles="requestAllFiles"
      class="net-disk__header">
    </header-bar>
    <new-file
      v-if="isNewShow"
      @popupOverlayBottomClick="changeBottomShow(true)"
      :isTopShow="isTopShow">
    </new-file>
    <div class="net-disk__footer">
      <circle-btn
        v-if="!isNewShow && isPlusShow"
        :item="plusItem"
        @popupOverlayBottomClick="changeBottomShow(true)">
      </circle-btn>
    </div>
  <handle-popup
    v-if="isBottomShow"
    :isBottomShow="isBottomShow"
    :file="file"
    @changeBottomShow="changeBottomShow"
    @requestAllFiles="requestAllFiles"
    :fsItems="fsItems"
    :path="path"
    :filesArr="filesArr">
  </handle-popup>
  </div>
</template>
<script>
import filesList from './filesList';
import NewFile from './NewFile';
import CircleBtn from '../../components/circleBtn';
import HeaderBar from '../../components/headerBar';
import HandlePopup from '../../components/handlePopup';
import commonApi from '../../api/common';
import { getFileType } from '../../utils/file';
import { getImgUrl } from '../../utils/getPath';
import { CONSTANT } from '../../utils/constant';

const modal = weex.requireModule('modal');

export default {
  name: 'myDisk',
  data () {
    const fsItems = [{
      title: '上传文件',
      type: 'upload'
    }, {
      title: '新建文件夹',
      type: 'newFolder'
    }];
    return {
      x: 0,
      y: 0,
      flag: 0,
      info: 'hello world',
      fsItems,
      filesListNames: [],
      imgUrl: '',
      plusItem: {
        bgColor: '#3eb4ff',
        type: 'popupOverlayBottomClick'
      },
      isTopShow: false,
      isNewShow: false,
      isPlusShow: true,
      isBottomShow: false,
      file: {},
      filesArr: [],
      title: '我的网盘',
      path: '/', // '/' 代表在该用户网盘根目录
      imagesPathList: []
    }
  },
  props: {

  },
  components: {
    filesList,
    NewFile,
    CircleBtn,
    HeaderBar,
    HandlePopup
  },
  created () {
    this.requestAllFiles();
  },
  methods: {
    getIconSrc (type) {
      const WEB_IMAGE_URL = `filePng/${type}.png`;
      return getImgUrl(WEB_IMAGE_URL);
    },
    backHome () {
      this.$router.go(-1);
    },
    popupOverlayBottomClick (isShow) {
      this.isTopShow = isShow;
    },
    changeNewShow (isShow) {
      this.isNewShow = isShow;
    },
    changePlusShow (isShow) {
      this.isPlusShow = isShow;
    },
    changeBottomShow (isShow) {
      this.isBottomShow = isShow;
    },
    requestAllFiles (path) {
      // es6 写法 path = '' 有 bug
      if (path === undefined) {
        path = '/';
      }
      this.filesArr = [];
      let bodyJson = JSON.stringify({ path: path });
      let options = {
        url: '/files/queryAll',
        method: 'POST',
        body: bodyJson
      };
      commonApi.fetch(options, ret => {
        if (ret.ok && ret.data.code === 0) {
          let stats = ret.data.data.stats;
          if (stats.length > 0) {
            this.changeNewShow(false);
          }
          if (path === '/') {
            this.title = '我的网盘';
          } else {
            this.title = path.substring(0, path.length - 1).split('/').pop();
          }
          this.path = path;
          this.imagesPathList = [];
          for (let i = 0; i < stats.length; i++) {
            let iconType;
            let name = stats[i].path.split('/').pop();

            if (stats[i].mime_type === 'dir') {
              iconType = 'dir';
            } else {
              iconType = getFileType(name);
            }
            this.filesArr.push(Object.assign({
              name: name,
              type: iconType,
              icon: this.getIconSrc(iconType),
              path: stats[i].path
            }))

            if (iconType === 'img') {
              this.imagesPathList.push({
                src: `${CONSTANT.SERVER_URL}${stats[i].path}`,
                index: i
              })
            }
          }
          console.log('文件列表', this.filesArr)
          console.log('此时路径', this.path)
        } else {
          this.filesArr = [];
          modal.toast({
            message: '获取数据失败~',
            duration: 1
          });
        }
      })
    }
  }
}
</script>
<style lang="scss">
@import '../../assets/scss/pages/myDisk/index.scss';

</style>
