import Vue from 'vue'
import Router from 'vue-router'
import login from '../components/login/login'
import problem_description from '../components/problem_description/problem_description'
import problem from '../components/problem/problem'
import webEditor from '../components/webIDE/code_mirror'
import problem_edit from '../components/problem_edit/problem_edit'
Vue.use(Router)

export default new Router({
  routes: [{
      path: '/',
      name: 'login',
      component: login
    },

    {
      path: '/problem',
      name: 'problem',
      component: problem
    },


    {
      path: '/problem_description',
      name: 'problem_description',
      component: problem_description,
    },

    {
        path: '/editor',
        name: 'web_editor',
        component: webEditor,
    },

    {
        path: '/problem_edit',
        name: 'problem_edit',
        component: problem_edit,
    }
  ]
})
