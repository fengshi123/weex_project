<template>
    <wxc-tab-bar
      :tab-titles="tabTitles"
      :tab-styles="tabStyles"
      title-type="icon"
      ref="wxc-tab-bar"
      @wxcTabBarCurrentTabSelected="wxcTabBarCurrentTabSelected"
    >
      <HomePage></HomePage>
      <easy-moment :curentTab="curentTab"></easy-moment>
      <ExamList></ExamList>
      <User></User>
    </wxc-tab-bar>
</template>

<script>
import {global} from '../utils/globalVar.js'
import {getImgUrl} from '../utils/getPath';
import HomePage from './homePage';
import User from './user/index';
import EasyMoment from './game/index';
import ExamList from './exam/examList.vue'
import { WxcMinibar, WxcTabBar } from 'weex-ui';
export default {
  name: 'tabIndex',
  data () {
    return {
      logo: 'https://gw.alicdn.com/tfs/TB1yopEdgoQMeJjy1XaXXcSsFXa-640-302.png',
      aText: '点击',
      lists: ['A', 'B', 'C', 'D', 'E'],
      tabTitles: [
        {
          title: '首页',
          icon:
            getImgUrl('icon_home.png'),
          activeIcon:
            getImgUrl('activeicon_home.png')
        },
        {
          title: '游戏',
          icon:
            getImgUrl('icon_recommend.png'),
          activeIcon:
            getImgUrl('activeicon_recommend.png')
        },
        {
          title: '成绩',
          icon:
            getImgUrl('icon_message.png'),
          activeIcon:
            getImgUrl('activeicon_message.png')
        },
        {
          title: '我的',
          icon:
            getImgUrl('icon_me.png'),
          activeIcon:
            getImgUrl('activeicon_me.png')
        }
      ],
      tabStyles: {
        bgColor: '#FFFFFF',
        titleColor: '#666666',
        activeTitleColor: '#3D3D3D',
        activeBgColor: '#FFFFFF',
        isActiveTitleBold: true,
        iconWidth: 100,
        iconHeight: 80,
        width: 160,
        height: 120,
        fontSize: 24,
        textPaddingLeft: 10,
        textPaddingRight: 10
      },
      contentStyle: {

      },
      curentTab: 0
    };
  },
  components: {
    WxcMinibar,
    WxcTabBar,
    HomePage,
    User,
    EasyMoment,
    ExamList
  },
  created () {
    console.log('哇哈哈哈');
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (from.name !== 'loginPage') {
        if (vm.$refs['wxc-tab-bar']) {
          vm.$refs['wxc-tab-bar'].setPage(global.tab);
        }
      }
    })
  },
  methods: {
    wxcTabBarCurrentTabSelected (curentTab) {
      this.curentTab = curentTab.page;
      global.tab = curentTab.page;
    }
  }
};
</script>
