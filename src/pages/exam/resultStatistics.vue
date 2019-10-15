<template>
  <div>
    <wxc-minibar background-color="#3eb4ff"
               leftButton=''>
      <wxc-icon :icon-style=iconStyle name="back" slot="left" @wxcIconClicked="goBack"></wxc-icon>
      <text style="font-size: 36px; color: #fff" slot="middle">优秀率</text>
    </wxc-minibar>
    <web style="width: 750px;height: 1000px;" :src=getSrc></web>
    <text class="result__id">试卷名：{{name}}</text>
    <text class="result__id">当前作答人数：{{userSum}} 人</text>
  </div>
</template>

<script>
import {WxcMinibar, WxcIcon} from 'weex-ui';
import {CONSTANT} from '../../utils/constant.js';
import api from '../../api/common.js';
const modal = weex.requireModule('modal');
export default {
  data: function () {
    return {
      exam_id: this.$route.query.exam_id,
      name: this.$route.query.name,
      questionLength: 0,
      userSum: 0,
      iconStyle: {
        'color': '#ffffff',
        'paddingLeft': '2px'
      },
      textStyle: {
        'font-size': '36px',
        'color': '#fff'
      }
    };
  },
  components: {WxcMinibar, WxcIcon},
  methods: {
    getContent () {
      let options = {
        url: '/exam/queryQuestionById?exam_id=' + this.exam_id,
        method: 'GET'
      };
      let vm = this;
      api.fetch(options, function (ret) {
        if (ret.ok && ret.data.code === 0) {
          vm.questionLength = ret.data.data.length;
        } else {
          modal.toast({
            message: '获取试题数据失败！',
            duration: 1
          });
        }
      });
    },
    getUserSum () {
      let options = {
        url: '/exam/queryUserById?exam_id=' + this.exam_id,
        method: 'GET'
      };
      let vm = this;
      api.fetch(options, function (ret) {
        if (ret.ok && ret.data.code === 0) {
          vm.userSum = ret.data.data.length;
        } else {
          modal.toast({
            message: '获取user数据失败！',
            duration: 1
          });
        }
      });
    },
    goBack () {
      this.$router.push('/tabIndex');
    }
  },
  created () {
    this.getContent();
    this.getUserSum();
  },
  computed: {
    getSrc () {
      let query = this.$route.query;
      return CONSTANT.SERVER_URL + '/public/views/result.html?exam_id=' + query.exam_id + '&token=' + query.token + '&questionLength=' + this.questionLength + '&userSum=' + this.userSum;
    }
  }
}
</script>

<style lang="scss">
  @import '../../assets/scss/pages/exam/resultStatistics.scss';
</style>
