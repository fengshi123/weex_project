<template>
<div>
  <MiniBar title="我的作业" :operation=clickText :disabled="rightButton" @operationClick="minibarRightButtonClick"></MiniBar>
   </wxc-minibar>
   <scroller class="Qs__all" v-for="(item,index) in stemList" :key="index">
     <div class="Qs__property">
       <div class="Qs__label"></div>
       <text class="Qs__type">{{getType(item)}}</text>
       <text class="Qs__question_id">{{item.question_id}}</text>
       <text class="Qs__sum">{{item.sum}}</text>
     </div>
     <div class="Qs__content" :key="item.question_id">
       <text class="Qs__problem">  {{item.stem}}</text>
       <div v-for="(img,index) in item.stem_img" :key="index">
         <image v-if="item.stem_img[0] !== ''" class="Qs__img" :src="img"></image>
       </div>
       <wxc-radio v-if="item.type===0" :list="optionlist" @wxcRadioListChecked="wxcRadioListChecked"></wxc-radio>
       <wxc-checkbox-list v-else-if="item.type===1"
          :list="optionlist"
          @wxcCheckBoxListChecked="wxcCheckBoxListChecked">
          </wxc-checkbox-list>
       <input v-else-if="item.type===3"
              v-model="answer"
              class="Qs__input"
              type="text"
              :disabled="tkPlace"
              placeholder="请输入你的答案"></input>
       <wxc-radio v-else-if="item.type===2" :list="judgelist" @wxcRadioListChecked="judgeListChecked"></wxc-radio>
       <div v-if="tab===1" class="Qs__answer">
          <text class="Qs__text">答案：{{item.result}}</text>
          <wxc-icon v-if="isTrue === 0" class="Qs__wrongIcon" name="wrong"></wxc-icon>
          <wxc-icon v-if="isTrue === 1" class="Qs__rightIcon" name="success"></wxc-icon>
       </div>
     </div>
    </scroller>
</div>
</template>

<script>
import { WxcMinibar, WxcRadio, WxcCheckboxList, WxcIcon } from 'weex-ui'
import MiniBar from '../../components/miniBar';
import api from '../../api/common.js';
const modal = weex.requireModule('modal');
export default {
  name: 'Question',
  components: { WxcMinibar, WxcRadio, WxcCheckboxList, MiniBar, WxcIcon },
  data: () => ({
    optionlist: [
      { title: '', value: 'A', disabled: false, checked: false },
      { title: '', value: 'B', disabled: false, checked: false },
      { title: '', value: 'C', disabled: false, checked: false },
      { title: '', value: 'D', disabled: false, checked: false }
    ],
    judgelist: [
      { title: '', value: 'Y', disabled: false, checked: false },
      { title: '', value: 'N', disabled: false, checked: false }
    ],
    typelist: ['单选题', '多选题', '判断题', '填空题'],
    clickText: '',
    stemList: [],
    questionId: 0,
    answer: '',
    radioAnswer: [],
    boxAnswer: [],
    judgeAnswer: [],
    questionlist: [],
    answerList: [],
    isTrue: '',
    tkPlace: false,
    rightButton: false,
    tab: ''
  }),
  created () {
    let query = this.$route.query;
    this.questionlist = query.questionList;
    this.tab = parseInt(query.tab);
    if (this.questionlist.length !== undefined) {
      this.queryQuestion();
    }
  },
  methods: {
    minibarRightButtonClick () {
      // 答题时，储存答案，最后一次性提交，加上答案阅览模式
      if (this.tab === 0) {
        let stemItem = this.stemList[0];
        if (stemItem.type === 0) {
          this.answer = this.radioAnswer;
          this.radioAnswer = [];
        } else if (stemItem.type === 1) {
          this.answer = this.boxAnswer.sort().join('|');
          this.boxAnswer = [];
        } else if (stemItem.type === 2) {
          this.answer = this.judgeAnswer;
          this.judgeAnswer = [];
        }
        // 如果未选答案，则设置右键不可点击,并提示
        if (this.answer.length === 0 || this.answer === null) {
          this.rightButton = true;
          modal.toast({
            message: '此题答案为空，无法进入下一题！',
            duration: 1
          });
        } else {
          // 将answer存入answerList[]
          let item = {
            questionid: stemItem.question_id,
            examid: stemItem.exam_id,
            answerOption: this.answer
          }
          this.answerList.push(item);
          if (this.clickText === '提交') {
            // 点击提交，将answerList[]数据全部存入数据库
            this.addAnswer();
          }
          this.queryQuestion();
        }
        this.answer = '';
      } else {
        if (this.clickText === '返回列表') {
          // 答案阅览模式，点击返回列表，返回列表页面
          this.$router.go(-1);
        }
        this.queryQuestion();
      }
    },
    queryQuestion () {
      // 获取题目
      if (this.questionId < this.questionlist.length) {
        let qlk = this.questionlist[this.questionId];
        let type = parseInt(qlk.type);
        this.clickText = '下一题';
        let stemItem = {
          type: type,
          question_id: qlk.question_id,
          sum: '/' + this.questionlist.length,
          exam_id: qlk.exam_id,
          stem: qlk.stem,
          stem_img: qlk.stem_img.split('|'),
          result_options: qlk.result_options.split('|'),
          result: qlk.result.split('|').toString()
        }
        this.stemList = [stemItem];
        for (var i = 0; i < stemItem.result_options.length; i++) {
          if (type === 0 || type === 1) {
            this.optionlist[i].title = this.optionlist[i].value + '、 ' + stemItem.result_options[i];
            this.optionlist[i].checked = false;
            if (this.tab === 1) {
              this.optionlist[i].disabled = true;
            }
          } else if (type === 2) {
            this.judgelist[i].title = stemItem.result_options[i];
            this.judgelist[i].checked = false;
            if (this.tab === 1) {
              this.judgelist[i].disabled = true;
            }
          }
        }
        // 阅览模式，根据isTrue判断正误,并设置填空题填空框不可填，及显示用户答案
        if (this.tab === 1) {
          let userAnswer = qlk.answer.split('|').toString();
          this.isTrue =
            userAnswer === stemItem.result ? 1 : 0;
          let answerArr = qlk.answer.split('|');
          for (var j = 0; j < stemItem.result_options.length; j++) {
            if ((type === 0 || type === 1) && answerArr.indexOf(this.optionlist[j].value) > -1) {
              this.optionlist[j].checked = true;
            }
            if (type === 2 && userAnswer === this.judgelist[j].value) {
              this.judgelist[j].checked = true;
            }
          }
          if (type === 3) {
            this.tkPlace = true;
            this.answer = userAnswer;
          }
          console.log('用户的答案', userAnswer);
          console.log('正确的答案', stemItem.result);
        }
        this.questionId++;
        if (this.questionId === this.questionlist.length) {
          this.clickText =
            this.tab === 1 ? '返回列表' : '提交';
        }
      }
    },
    addAnswer () {
      let param = {
        answerList: this.answerList
      };
      let options = {
        url: '/exam/addAnswer',
        method: 'POST',
        body: JSON.stringify(param)
      };
      api.fetch(options, function (ret) {
        let message =
          ret.ok && ret.data.code === 0 ? '提交答案成功!' : '提交答案失败!';
        modal.toast({
          message: message,
          duration: 1
        });
      });
      this.$router.go(-1);
    },
    wxcRadioListChecked (e) {
      this.radioAnswer = e.value;
    },
    wxcCheckBoxListChecked (e) {
      this.boxAnswer = e.checkedList;
    },
    judgeListChecked (e) {
      this.judgeAnswer = e.value;
    },
    getType (e) {
      return this.typelist[e.type];
    }
  }
}
</script>

<style lang="scss">
  @import '../../assets/scss/pages/exam/answerQuestion.scss';
</style>
