export default {
  methods: {
    $toast (params, cb) {
      if (typeof params === 'string') {
        params = {
          msg: params
        }
      }
      this.$createToast({
        type: 'txt',
        txt: params.msg,
        time: params.onTimeout ? 1000 : 2000,
        onTimeout: () => {
          params.onTimeout && params.onTimeout()
          cb && cb()
        }
      }).show()
    },
    $dialog (params) {
      const {type, icon, title, msg = params} = params
      this.$createDialog({
        type,
        icon,
        title,
        showClose: !!params.showClose,
        content: msg,
        onConfirm: (e, promptValue) => {
          params.okFn && params.okFn(e, promptValue)
        },
        onCancel: () => {
          params.cancelFn && params.cancelFn()
        }
      }).show()
    },
    $copySuccess () {
      this.$toast(this.$t('account.text15'))
    },
    $openChat (name) {
      window.webkit.messageHandlers.contact.postMessage(name)
    },
    $playVoice () {
      let el = document.querySelector('#audio')
      el && el.play()
    },
    // 调用原生支付， params 里需要有币种，tradeNo， 金额 和成功回调函数
    $nativePay (params) {
      const payParams = {
        coin: params.payCurrency, // 取接口的币种
        trade_no: params.tradeNo,  // 取接口的tradeNo
        amount: String(params.amount), // 金额
        remark: '',
        merchant_id: 'none',
        app_id: process.env.VUE_APP_app_id,
        merchant_uuid: process.env.VUE_APP_merchant_uuid
      }
      this.$store.commit('SET_LOADING', true)
      sc.payment(payParams, res => {
        if (res.code === 200) {
          this.$fetch.post('/onepay/onePayStatus', {
            tradeNo: params.tradeNo
          }).then(() => {
            this.$store.commit('SET_LOADING', false)
            params.cb && params.cb()
          })
        } else {
          this.$store.commit('SET_LOADING', false)
          let tips = ''
          const code = res.sc_code || res.secretErrorCode || '0000'
          switch (code) {
            case -1000:
              tips = this.$t('common.error.t1000')
              break
            case -1001:
              tips = this.$t('common.error.t1001')
              break
            case -1002:
              tips = this.$t('common.error.t1002')
              break
            case -1003:
              tips = this.$t('common.error.t1003')
              break
            case -1004:
              tips = this.$t('common.error.t1004')
              break
            case -1006:
              tips = this.$t('common.error.t1006')
              break
            case -1007:
              tips = this.$t('common.error.t1007')
              break
            default:
              tips = this.$t('common.error.default')
          }
          this.$dialog({
            msg: `${tips} [${this.$t('common.error.code')}${code}]`
          })
        }
      })
    }
  }
}