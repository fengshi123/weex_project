<template>
<div class="addQs__wrapper">
  <MiniBar title="添加试卷"
    operation="确认添加"
    @operationClick="addExam">
  </MiniBar>
  <scroller class="addQs__list">
    <div>
        <div class="addQs__name">
          <text class="addQs__text-bold">试卷名称：</text>
          <input v-model="examName" class="addQs__input--option" type="text" />
        </div>
        <div
          v-for="(item,index) in questionList"
          :key="index"
          :ref="item.questionId"
          class="addQs__question"
        >
          <div class="addQs__index">
            <text class="addQs__text-bold">{{index+1}}、第 {{index+1}} 题</text>
            <image
              :key="index"
              :src="getDeleteImage"
              class="addQs__delete"
              style="margin-left:480px;"
              @click="deleteQuestion(index)"
            />
          </div>
          <div>
            <text class="addQs__text">题干：</text>
            <textarea class="addQs__textarea" v-model="item.stem"></textarea>
            <div class="addQs__addImg">
              <image
                :src="item"
                v-for="item in item.stemImg"
                :key="item"
                class="addQs__realImg"
                style="margin:10px;"
              />
              <image
                :src="getAddImage"
                class="addQs__add"
                @click="addImage(index)"
                v-if="item.stemImg.length<3"
              />
            </div>
          </div>
          <div class="addQs__stem">
            <text class="addQs__text">类型：</text>
            <wxc-grid-select
              :single="true"
              :cols="5"
              :customStyles="customStyles"
              :list="typelist"
              @select="typeSelect(index,arguments)"
            ></wxc-grid-select>
          </div>
          <div>
            <text class="addQs__text">答案：</text>
          </div>
          <div v-if="item.type===0 || item.type===1 || item.type===2">
            <ResultOption
              v-for="(option,sub) in (item.type===2 ? judgeList : choiceList)"
              :key="sub"
              v-bind.sync="item"
              :option="option"
              :sub="sub"
              :index="index"
              @setResult="setResult"
            ></ResultOption>
          </div>
          <div v-else>
            <input v-model="item.result[0]" class="addQs__input--fill" type="text" />
          </div>
        </div>
      </div>
    </scroller>
    <div class="addQs__footer">
      <circle-btn :item="plusItem" @popupOverlayBottomClick="addquestion(true)"></circle-btn>
    </div>
    <wxc-popup
      popup-color="#fff"
      :show="showPopup"
      @wxcPopupOverlayClicked="showPopup = false"
      pos="bottom"
      height="200"
    >
      <div v-for="(item,op) in optionList" :key="item" @click="imageSelect(op)">
        <text class="addQs__popup" style="margin-left:40;">{{item}}</text>
      </div>
    </wxc-popup>
  </div>
</template>

<script>
import { WxcMinibar, WxcButton, WxcGridSelect, WxcPopup } from 'weex-ui';
import MiniBar from '../../components/miniBar';
import ResultOption from '../../components/resultOption';
import CircleBtn from '../../components/CircleBtn';
import api from '../../api/common.js';
import { getImgUrl } from '../../utils/getPath';
import { CONSTANT } from '../../utils/constant.js';
import { global } from '../../utils/globalVar.js';
const WXAlbum = weex.requireModule('wxalbum');
const modal = weex.requireModule('modal');
const dom = weex.requireModule('dom');
export default {
  name: 'HomePage',
  data () {
    return {
      examName: '',
      questionList: [
        {
          questionId: 1,
          type: 0,
          stem: '',
          stemImg: [
            // 'http://172.21.6.196:3000/public/exam/1560947463701.jpg',
            // 'http://172.21.6.196:3000/public/exam/1564151004535.jpg'
          ],
          resultOptions: [],
          result: []
        }
      ],
      choiceList: ['A', 'B', 'C', 'D'],
      judgeList: ['Y', 'N'],
      typelist: [
        {
          title: '单选',
          checked: true
        },
        {
          title: '多选'
        },
        {
          title: '判断'
        },
        {
          title: '填空'
        }
      ],
      customStyles: {
        width: '120px',
        height: '60px',
        icon: '',
        color: '#333333',
        checkedColor: '#ffffff',
        disabledColor: '#eeeeee',
        borderColor: '#666666',
        checkedBorderColor: '#3eb4ff',
        backgroundColor: '#ffffff',
        checkedBackgroundColor: '#3eb4ff',
        justifyContent: 'flex-start',
        marginTop: '20px'
      },
      plusItem: {
        bgColor: '#3eb4ff',
        type: 'popupOverlayBottomClick'
      },
      showPopup: false,
      optionList: ['本地图片', '拍照'],
      indexFlag: 0 // 记录第几题，选择图片
    };
  },
  components: {
    WxcMinibar,
    WxcButton,
    WxcGridSelect,
    MiniBar,
    CircleBtn,
    ResultOption,
    WxcPopup,
    WXAlbum
  },
  computed: {
    getAddImage () {
      return getImgUrl('add_image.png');
    },
    getDeleteImage () {
      return getImgUrl('delete.png');
    }
  },
  created () {},
  methods: {
    typeSelect (index, arg) {
      if (arg && arg[0]) {
        let obj = arg[0];
        if (obj.checked) {
          this.questionList[index].type = obj.selectIndex;
        } else {
          this.questionList[index].type = 5;
        }
      }
    },
    setResult (index, sub, answer) {
      if (this.questionList[index]) {
        let type = this.questionList[index].type;
        let result = this.questionList[index].result;
        let flag = result[sub];
        if (type === 0 || type === 2) {
          // 单选题 & 判断题
          result.splice(0, result.length);
          if (!flag) {
            this.$set(result, sub, answer);
          }
        } else if (type === 1) {
          // 多选题
          if (!flag) {
            this.$set(result, sub, answer);
          } else {
            this.$set(result, sub, '');
          }
        }
      }
    },
    addImage (index) {
      this.indexFlag = index;
      this.showPopup = true;
    },
    imageSelect (op, index) {
      if (op === 1) {
        modal.toast({
          message: '该功能暂不支持！',
          duration: 1
        });
      } else if (op === 0) {
        let path = 'public/exam/';
        let stemImg = this.questionList[this.indexFlag].stemImg;
        let vm = this;
        let param = {
          type: 'image/jpeg', // 选择的数据类型
          path: path,
          url: CONSTANT.SERVER_URL + '/users/upload',
          token: global.token
        };
        WXAlbum.choosePhoto(JSON.stringify(param), ret => {
          let obj = JSON.parse(ret);
          let imgPath =
            CONSTANT.SERVER_URL + '/' + path + obj.file[0].originalFilename;
          vm.$set(stemImg, stemImg.length, imgPath);
        });
      }
    },
    deleteQuestion (index) {
      this.questionList.splice(index, 1);
    },
    addquestion () {
      let length = this.questionList.length;
      let item = {
        questionId: length + 1,
        examId: '4',
        type: 0,
        stem: '',
        stemImg: [],
        resultOptions: [],
        result: []
      };
      this.questionList.push(item);
      this.$nextTick(function () {
        var el = this.$refs[length + 1][0];
        dom.scrollToElement(el, {});
      });
    },
    addExam () {
      let message = '';
      if (!this.examName) {
        message = '试卷名称为空！';
      }
      if (this.questionList.length === 0) {
        message = '没有试题！';
      }
      if (message) {
        modal.toast({
          message: message,
          duration: 2
        });
        return;
      }
      let flag = this.questionList.every((item, index) => {
        index++;
        if (!item.stem) {
          message = '第' + index + '道题目为空!';
        }
        let resultOptions = item.resultOptions.join('');
        let result = item.result.join('');
        if (resultOptions.length === 0 && item.type !== 3) {
          message = '第' + index + '道答案选项为空!';
        }
        if (result.length === 0) {
          message = '第' + index + '道答案为空!';
        }
        if (message) {
          modal.toast({
            message: message,
            duration: 2
          });
          // 滚动条滚动到对应位置
          var el = this.$refs[index][0];
          dom.scrollToElement(el, {});
          return false;
        }
        return true;
      });
      if (flag) {
        let param = {
          examName: this.examName,
          questionList: this.questionList
        };
        let options = {
          url: '/exam/addexam',
          method: 'POST',
          body: JSON.stringify(param)
        };
        let vm = this;
        api.fetch(options, function (ret) {
          vm.showNew = false;
          let message =
            ret.ok && ret.data.code === 0 ? '创建试卷成功!' : '创建试卷失败!';
          modal.toast({
            message: message,
            duration: 1
          });
          vm.$router.go(-1);
        });
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import "../../assets/scss/pages/exam/addExam.scss";
</style>
