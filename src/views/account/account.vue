<template>
  <div class="c-page" style="overflow: hidden">
    <app-header>我的</app-header>
    <div class="main">
      <div class="intro">
        <img src="@img/default_head.png" alt="">
        <p>{{$store.state.userInfo.userName}}</p>
      </div>
      <!-- <div class="title-line"><span>资金记录</span></div> -->
      <div class="menu">
        <router-link to="/account/transaction">商业任务明细<i class="cubeic-arrow"></i></router-link>
        <router-link to="/account/achievement">共识商业任务明细<i class="cubeic-arrow"></i></router-link>
        <router-link to="/account/voiceSetting">音效设置<i class="cubeic-arrow"></i></router-link>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
  data () {
    return {
      popShow: false,
      amount: '',
      typeIng: false,
      options: {
        pullDownRefresh: {
          threshold: 60,
          stop: 40,
          txt: '更新成功'
        }
      },
    }
  },
  mounted () {
    this.getData()
    this.$store.commit("SET_LIST_RECORD", {})
    this.$store.commit("SET_TAB_INDEX", 0)
  },
  computed: {
    fund () {
      return this.$store.state.fundData
    }
  },
  methods: {
    getData () {
      this.$fetch.post('/nonefund/oneFundIndex').then(res => {
        this.$refs.scroll && this.$refs.scroll.forceUpdate()
        if (res.success) {
          this.$store.commit('SET_FUND_DATA', res.data)
        }
      })
    },
    vaInput () {
      if (!/^\d+(\.\d{0,4})?$/.test(this.amount)) {
        this.amount = this.amount.substring(0, this.amount.length - 1)
      }
      if (this.amount > this.fund.userBalance) {
        this.amount = this.fund.userBalance
      }
    },
    submit () {
      if (this.amount < this.fund.buyMinAmount) {
        this.$dialog({
          msg: `最低投资金额为${this.fund.buyMinAmount}SIE`
        })
      } else {
        this.$fetch.post('/nonefund/buyOneFundRecord', {
          amount: this.amount,
          loading: true
        }).then(res => {
          if (res.success) {
            this.$nativePay({
              amount: this.amount,
              payCurrency: res.data.payCurrency,
              tradeNo: res.data.tradeNo,
              cb: () => {
                this.$toast('购买成功')
                this.popShow = false
                this.getData()
              }
            })
            this.amount = ''
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.main{
  padding: .3rem;
}
.intro{
  text-align: center;
  padding: 0.3rem 0;
  img{
    border-radius: 50%;
    width: 1.7rem;
    margin-bottom: 0.4rem;
  }
}
.menu{
  a{
    .allCenter;
    border-bottom: 1px solid #f0f0f0;
    line-height: .96rem;
    font-size: 0.3rem;
    color: #333;
  }
}
</style>
