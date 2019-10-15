import AnswerQuestion from '@/pages/exam/answerQuestion.vue'
import ExamList from '@/pages/exam/examList.vue'
import AddExam from '@/pages/exam/addExam.vue'
import ResultStatistics from '@/pages/exam/resultStatistics.vue'
export default [
  {
    path: '/answerQuestion',
    name: 'answerQuestion',
    component: AnswerQuestion
  },
  {
    path: '/examList',
    name: 'examList',
    component: ExamList
  },
  {
    path: '/addQuestion',
    name: 'addQuestion',
    component: AddExam
  },
  {
    path: '/resultStatistics',
    name: 'resultStatistics',
    component: ResultStatistics
  }
]
