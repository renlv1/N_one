import Vue from 'vue'
import Vuex from 'vuex'
import router from './router'
import api from '@/api/api'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {},
    balance: {},
    allUserInfo: {},
    tabIndex: 0,
    historyRecord: {},
    showLoading: false,
    slideMode: 1,
    userInfo: '',
    bossFlag: '',
    isLock: false,
    fundData: {},
  },
  mutations: {
    SET_ACCOUNT (state, data) {
      state.user = data.user
      state.balance = data.account
      state.allUserInfo = data
    },
    SET_USERINFO (state, data) {
      state.userInfo = data
    },
    SET_TAB_INDEX (state, data) {
      state.tabIndex = data
    },
    SET_LIST_RECORD (state, data) {
      state.historyRecord = data
    },
    SET_LOADING (state, data) {
      state.showLoading = data
    },
    SET_ORDER_TYPE (state, data) {
      state.orderType = data
    },
    SET_FUND_DATA (state, data) {
      state.fundData = data
    }
  },
  actions: {
    getBalance ({commit}) {
      api.get('/user/balance').then(res => {
        if (res.success) {
          commit('SET_ACCOUNT', res.data)
          commit('SET_BOSS_FLAG', res.data.user.bossFlag)
          commit('SET_LOGIN_TERMINAL', true)
          commit('USER_NAME', this.username)
          router.push('/home')
        } else if(res.resultCode === 'COOKIE_NOT_UNLOCK') {
          commit('SET_LOCK', true)
        } else if(res.resultCode === 'NOT_LOGGEDIN') {
          router.push('/login')
        }
      })
    }
  }
})
