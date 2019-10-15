<template>
  <div>
    <wxc-dialog
      :title="title"
      :show="isDlShow"
      :is-checked="isChecked"
      @wxcDialogCancelBtnClicked="wxcDialogCancelBtnClicked"
      @wxcDialogConfirmBtnClicked="wxcDialogConfirmBtnClicked"
      @wxcDialogNoPromptClicked="wxcDialogNoPromptClicked">
      <div slot="content" v-if="type !== 'delete'">
        <input
          class="dialog-module__content--input"
          slot="content"
          autofocus
          placeholder="请输入名称"
          :value="getFileName"
          @input="fileName=$event.value"/>
      </div>
    </wxc-dialog>
  </div>
</template>

<script>
import { WxcDialog } from 'weex-ui';
import commonApi from '../api/common';
import { getUniqueName } from '../utils/file';

const modal = weex.requireModule('modal');

export default {
  name: 'dialogModule',
  data () {
    return {
      isChecked: false,
      fileName: '',
      isFile: false,
      filesName: []
    }
  },
  props: {
    isDlShow: false,
    title: {
      type: String,
      default: '标题'
    },
    file: {
      type: Object,
      default: () => {}
    },
    path: {
      type: String
    },
    filesArr: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    }
  },
  computed: {
    getFileName () {
      return this.fileName;
    }
  },
  components: {
    WxcDialog
  },
  created () {
    this.getFilesListName();
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
          if (this.type === 'rename') {
            this.fileName = this.file.name;
          } else if (this.type === 'newFolder') {
            this.fileName = getUniqueName('新建文件夹', this.filesName);
          }
        }
      });
    },
    wxcDialogCancelBtnClicked () {
      this.$emit('wxcDialogClick');
      this.$emit('changeDlShow', false);
    },
    wxcDialogConfirmBtnClicked () {
      this[this.type]();
    },
    wxcDialogNoPromptClicked () {

    },
    rename () {
      if (this.file.name === this.fileName) {
        modal.toast({
          message: '原文件（夹）名与重命名相同',
          duration: 1
        });
        return;
      }
      if (this.namedJudge()) {
        return;
      }
      let reqUrl = '/files/renameFile';
      let body = {
        old_name: this.file.name,
        new_name: this.fileName
      };
      this.commonRequest(reqUrl, body);
    },
    delete () {
      let reqUrl;
      if (this.file.type !== 'dir') {
        reqUrl = '/files/deleteFile';
      } else {
        reqUrl = '/files/deleteDir'
      }
      let body = {
        name: this.file.name
      };
      this.commonRequest(reqUrl, body);
    },
    newFile () {
      let reqUrl = '/files/newFile';
      let body = {
        name: this.fileName
      };
      this.commonRequest(reqUrl, body);
    },
    namedJudge () {
      let isInvalid = false;
      for (let item of this.filesArr) {
        if (this.fileName === item.name) {
          modal.toast({
            message: '操作失败，已有同名文件夹',
            duration: 1
          });
          isInvalid = true;
          return isInvalid;
        }
      }
    },
    newFolder () {
      if (this.namedJudge()) {
        return;
      }

      let reqUrl = '/files/newDir';
      let body = {
        name: this.fileName
      };
      this.commonRequest(reqUrl, body);
    },
    uploadPhotos () {

    },
    uploadVideos () {

    },
    takePhotos () {

    },
    shootVideo () {

    },
    commonRequest (reqUrl, body) {
      body.path = this.path;
      const bodyJson = JSON.stringify(body);
      let options = {
        url: reqUrl,
        method: 'POST',
        body: bodyJson
      };
      commonApi.fetch(options, ret => {
        if (ret.ok && ret.data.code === 0) {
          let updateParam = {
            isShow: false,
            isRefresh: true
          };
          if (ret.ok && ret.data.code === 0) {
            modal.toast({
              message: '操作成功~',
              duration: 1
            })
            this.$emit('updateDisk', updateParam);
          } else {
            updateParam.isRefresh = false;
            modal.toast({
              message: '操作失败~',
              duration: 1
            });
            this.$emit('updateDisk', updateParam);
          }
        }
      });
    }
  }
}
</script>
<style lang="scss">
  @import '../assets/scss/components/DialogModule.scss';
</style>
