<template>
<div>
  <MiniBar v-if="mark==1" title="题库"></MiniBar>
  <MiniBar v-else :showLeft="false" title="试卷列表"></MiniBar>
  <list class="exam__list" @handleGetall="handleGetall">
      <cell v-for="(item,index) in examlist" :key="index" @click="comeInquestion(item.exam_id,index,item.name)">
        <div class="exam__item">
          <image v-if="isFinish(item)" :src="getIconImg" class="exam__iconf"></image>
          <image v-else :src="getIconImg" class="exam__icon"></image>
          <div class="exam__itemf">
            <text v-if="isFinish(item)" class="exam__namef">{{item.name}}</text>
            <text v-else class="exam__name">{{item.name}}</text>
            <text v-if="isFinish(item)" class="exam__finished">已完成</text>
          </div>
          <text class="exam__time">{{item.create_time}}</text>
        </div>
      </cell>
    </list>
</div>
</template>

<script>
import {getImgUrl} from '../../utils/getPath';
import {global} from '../../utils/globalVar.js'
import { WxcMinibar, WxcIcon } from 'weex-ui';
import MiniBar from '../../components/miniBar';
import api from '../../api/common.js';
const modal = weex.requireModule('modal');
export default {
  name: 'Exam',
  data () {
    return {
      examlist: [],
      name: '',
      create_time: '',
      questionList: [],
      flag: '',
      contentList: [],
      examIdlist: [],
      mark: parseInt(this.$route.query.mark)
    }
  },
  components: {WxcMinibar, WxcIcon, MiniBar},
  created () {
    this.handleGetall();
  },
  computed: {
    getIconImg () {
      return getImgUrl('exam_icon.png');
    }
  },
  methods: {
    handleGetall () {
      let options = {
        url: '/exam/queryExamId',
        method: 'GET'
      };
      let vm = this;
      let exam = [];
      api.fetch(options, function (ret) {
        if (ret.ok && ret.data.code === 0) {
          vm.examIdlist = ret.data.data;
          if (vm.mark === 1) {
            vm.examlist = vm.examIdlist;
          } else {
            for (var i = 0; i < vm.examIdlist.length; i++) {
              if (vm.examIdlist[i].is_finish === 1) {
                exam.push(vm.examIdlist[i]);
              }
            }
            vm.examlist = exam;
          }
        } else {
          modal.toast({
            message: '获取已完成试卷id数据失败!',
            duration: 1
          });
        }
      });
    },
    comeInquestion (examId, index, name) {
      if (this.mark === 1) {
        let options = {
          url: '/exam/queryQuestionById?exam_id=' + examId,
          method: 'GET'
        };
        let vm = this;
        api.fetch(options, function (ret) {
          if (ret.ok && ret.data.code === 0) {
            vm.questionList = ret.data.data;
            if (vm.questionList.length === 0) {
              modal.toast({
                message: '此试卷暂无题目！',
                duration: 1
              });
            } else {
              let tab;
              if (vm.examIdlist[vm.examIdlist.length - examId].is_finish === 1) {
                // 试卷已完成，执行批改阅览
                tab = 1;
              } else {
                // 试卷未完成，执行答题
                tab = 0;
              }
              vm.$router.push({
                path: '/answerQuestion',
                query: {questionList: vm.questionList, tab: tab}
              });
            }
          } else {
            modal.toast({
              message: '获取试题数据失败！',
              duration: 1
            });
          }
        });
      } else {
        this.$router.push({
          path: '/resultStatistics',
          query: {exam_id: examId, name: name, token: global.token}
        });
      }
    },
    isFinish (e) {
      return e.is_finish === 1 && this.mark === 1;
    }
  }
}
</script>

<style lang="scss">
  @import '../../assets/scss/pages/exam/examList.scss';
</style>
