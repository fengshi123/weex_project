import commonApi from '../../api/common';
import { SET_FILES_LIST } from '@/store/mutation-types';
const modal = weex.requireModule('modal');
const state = {
  filesList: [] // 当前目录下，文件列表
};
const getters = {
};

const actions = {
  requestAllFiles ({state, commit}) {
    let options = {
      url: '/files/queryAll',
      method: 'GET'
    };
    commonApi.fetch(options, res => {
      if (res.ok && res.data.code === 0) {
        commit('setFilesList', res.data.data);
        modal.toast({
          message: '获取数据成功~',
          duration: 1
        })
      } else {
        modal.toast({
          message: '获取数据失败~',
          duration: 1
        });
      }
    });
  }
};

const mutations = {
  [SET_FILES_LIST] (state, list) {
    state.filesList = list;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
