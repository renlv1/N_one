import Vue from 'vue'
import App from './App.vue'
import 'babel-polyfill' // 兼容旧浏览器
import router from './router'
import store from './store'
import fetch from './api/api'
import { i18n } from './i18n/config'
// import enUSMessages from '@/assets/js/en-US' // cube-ui 内置
import BaiduMap from 'vue-baidu-map'
import axios from 'axios'
import globalMixin from './mixin'
import loadMore from '@/components/loadMore'
// import { Locale } from 'cube-ui'
import appHeader from '@/components/appHeader'
import map from '@/components/map'
import { Style, Switch, Toast, Dialog, ActionSheet, DatePicker, Scroll, Upload, ImagePreview, Slide} from 'cube-ui'

// Vue.use(Locale)
// if (localStorage.getItem('lang') === 'EN') {
//   Locale.use('en-US', enUSMessages)
// }
Vue.use(Switch)
Vue.use(Toast)
Vue.use(Dialog)
Vue.use(ActionSheet)
Vue.use(Scroll)
Vue.use(Upload)
Vue.use(Slide)
Vue.use(ImagePreview)
Vue.use(DatePicker)
Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */ E4805d16520de693a3fe707cdc962045
  ak: 'NqYwtHbrPbvKFAorAUdrYcvIwg3f1qAt'
})

Vue.prototype.$fetch = fetch
Vue.prototype.$axios = axios
Vue.mixin(globalMixin)

Vue.config.productionTip = false

Vue.component('app-header', appHeader)
Vue.component('web-map', map)
Vue.component('load-more', loadMore)

Vue.filter('f4', function (value) { // 保留4位小数点,不四舍五入
  if (!isNaN(value) && value !== null) {
    let f = Math.floor(value * 10000) / 10000
    let s = f.toString()
    let rs = s.indexOf('.')
    if (rs < 0) {
      rs = s.length
      s += '.'
    }
    while (s.length <= rs + 4) {
      s += '0'
    }
    return s
  } else {
    return '0.0000'
  }
})

// 时间戳转换
Vue.filter('time', function (time, str = '/', type = 1) {
  function ifTime(value) { // 判断时间是否是个位数
    if (value < 10) {
      return '0' + value
    }
    return value
  }

  if (time) {
    let newTime = new Date(time)
    let day = newTime.getDate()
    let month = newTime.getMonth() + 1
    let year = newTime.getFullYear()
    let hours = newTime.getHours()
    let min = newTime.getMinutes()
    let sec = newTime.getSeconds()
    switch (type) {
      case 1:
        return year + str + ifTime(month) + str + ifTime(day) + ' ' + ifTime(hours) + ':' + ifTime(min)
      case 2:
        return year + str + ifTime(month) + str + ifTime(day) + ' 00:00:00'
      case 3:
        return year + str + ifTime(month) + str + ifTime(day) + ' 23:59:59'
      case 4:
        return year + str + ifTime(month) + str + ifTime(day)
      case 5:
        return year + str + ifTime(month) + str + ifTime(day)
      case 6:
        return ifTime(hours) + ':' + ifTime(min)
      case 7:
        return ifTime(hours) + ':' + ifTime(min) + ':' + ifTime(sec)
    }
  }
})

Vue.prototype.$getPosition = function () {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        let latitude = position.coords.latitude
        let longitude = position.coords.longitude
        let data = {
          latitude: latitude,
          longitude: longitude
        }
        resolve(data)
      }, function () {
        reject(arguments)
      })
    } else {
      reject('你的浏览器不支持当前地理位置信息获取')
    }
  })
}

sc.init(data => {
  axios.defaults.headers = {
    'none-open-id': data.openId,
    'session-id': data.sessionId
  }
  Vue.prototype.$openId = data.openId
  Vue.prototype.$sessionId = data.sessionId
  new Vue({
    i18n,
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
})

router.afterEach(() => {
  document.body.scrollTop = 0
})
