import Vue from 'vue';
import Vuex from 'vuex';

import common from '@/store/modules/common';
import myDisk from '@/store/modules/myDisk';
const state = {
  list: ['----']
};

Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    test: '22222222222'
  },
  getters: {
    getTest: state => state.test
  },
  mutations: {
    testMutations () {

    }
  },
  actions: {
    testActions () {

    }
  },
  strict: process.env.NODE_ENV !== 'production'
});
// console.log(store, '=============')
export default store;
