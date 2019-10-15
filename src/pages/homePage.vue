<template>
  <div>
    <MiniBar :showLeft="false" title="云课堂"></MiniBar>
    <image class="home__bg" :src="getHeadbgImg"></image>
    <div>
      <div v-for="(list,index) in itemList" :key="index" class="home__box">
        <div
          v-for="(item,index) in list"
          :key="index"
          class="home__box-item"
          @click="handleClick(item.path, item.title)"
        >
          <image
            :src="item.image"
            class="home__box-icon"
            @click="handleClick(item.path, item.title)"
          ></image>
          <text  class="home__box-text">{{item.title}}</text>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {getImgUrl} from '../utils/getPath';
import MiniBar from '../components/miniBar';
import { WxcMinibar, WxcButton } from 'weex-ui';
const modal = weex.requireModule('modal');
export default {
  name: 'HomePage',
  data () {
    return {
      itemList: [
        [
          {
            title: '我的网盘',
            image: getImgUrl('mydisk.png'),
            path: '/myDisk'
          },
          {
            title: '试题问答',
            image: getImgUrl('question.png'),
            path: '/examList?mark=1'
          },
          {
            title: '添加试卷',
            image: getImgUrl('study.png'),
            path: '/addQuestion'
          }
        ],
        [
          {
            title: '功能测试',
            image: getImgUrl('others.png'),
            path: '/testModule'
          },
          {
            title: '视听空间',
            image: getImgUrl('grade.png'),
            path: '/no'
          },
          {
            title: '建议反馈',
            image: getImgUrl('information.png'),
            path: '/no'
          }
        ]
      ],
      mark: ''
    };
  },
  components: { WxcMinibar, WxcButton, MiniBar },
  created () {},
  methods: {
    handleClick (path, title) {
      if (path === '/no') {
        modal.toast({
          message: '该功能暂不支持！',
          duration: 1
        });
        return;
      }
      this.$router.push(path);
    }
  },
  computed: {
    getHeadbgImg () {
      return getImgUrl('headbg.png');
    }
  }
};
</script>

<style lang="scss">
 @import '../assets/scss/pages/homePage.scss';
</style>
