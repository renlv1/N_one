import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      component: require('./views/home').default,
      meta: {
        keepAlive: true
      }
    },
    {
      path: '/account',
      component: require('./views/account/account').default
    },
    {
      path: '/search',
      component: require('./views/search').default
    },
    {
      path: '/account/transaction',
      component: require('./views/account/transaction').default
    },
    {
      path: '/account/achievement',
      component: require('./views/account/achievement').default
    },
    {
      path: '/account/achievementDetail',
      component: require('./views/account/achievementDetail').default
    },
    {
      path: '/account/transactionDetail',
      component: require('./views/account/transactionDetail').default
    },
    {
      path: '/account/voiceSetting',
      component: require('./views/account/voiceSetting').default
    },
    {
      path: '/account',
      component: require('./views/account/account').default
    },
    {
      path: '/create',
      component: require('./views/task/create').default
    },
    {
      path: '/mapList',
      component: require('./views/task/mapList').default
    },
    {
      path: '/mapDetail',
      component: require('./views/task/mapDetail').default
    },
    {
      path: '/taskList',
      component: require('./views/task/taskList').default
    },
    {
      path: '/taskDetail',
      component: require('./views/task/taskDetail').default
    },
    {
      path: '/chooseTask',
      component: require('./views/task/chooseTask').default
    },
    {
      path: '/chooseTaskDetail',
      component: require('./views/task/chooseTaskDetail').default
    },
    {
      path: '/taskTemp',
      component: require('./views/task/taskTemp').default
    },
    {
      path: '/taskTempEdit',
      component: require('./views/task/taskTempEdit').default
    },
    // {
    //   path: '/fund',
    //   component: require('./views/fund/fund').default
    // },
    // {
    //   path: '/fund/intro',
    //   component: require('./views/fund/intro').default
    // },
    // {
    //   path: '/fund/transaction',
    //   component: require('./views/fund/transaction').default
    // },
    // {
    //   path: '/fund/achievement',
    //   component: require('./views/fund/achievement').default
    // }
  ]
})

export default router
