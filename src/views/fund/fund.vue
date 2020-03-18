<template>
  <div class="c-page" style="overflow: hidden">
    <app-header :hideReturn="true">N.ONE基金</app-header>
    <div class="main">
      <cube-scroll
        ref="scroll"
        style="height: 100vh"
        :options="options"
        @pulling-down="getData">
        <div class="intro">
          <p>我持有的基金</p>
          <h3>{{fund.userHaveTotal | f4}}SIE</h3>
          <span class="cgray">到期时间：{{fund.expiredFundDate}}</span>
        </div>
        <div class="title-line"><span>基金相关</span></div>
        <div class="menu">
          <router-link to="/fund/intro">了解N.ONE基金 <i class="cubeic-arrow"></i></router-link>
          <router-link to="/fund/transaction">基金交易记录<i class="cubeic-arrow"></i></router-link>
          <router-link to="/fund/achievement">推广业绩<i class="cubeic-arrow"></i></router-link>
        </div>
      </cube-scroll>
      <button class="btn fixed" @click="popShow = true">购买基金</button>
    </div>
    <transition name="slide">
      <div class="fixed-pop" v-if="popShow">
        <div class="mask" @click="popShow = false; amount = ''"></div>
        <div class="pop-content" :class="{active: typeIng}">
          <div class="label">购买N.ONE基金</div>
          <div class="input-wrap">
            <input type="number" v-model="amount" @focus="typeIng = true" @blur="typeIng = false" @input="vaInput" placeholder="请输入投资金额">
            <div class="unit">SIE</div>
          </div>
          <div class="tips">首次最低投资金额{{fund.buyMinAmount | f4}}SIE</div>
          <div class="amount">您的SIE余额：<span class="cblue">{{fund.userBalance | f4}}SIE</span></div>
          <div class="btn-multiple">
            <button class="btn" :disabled="!amount" @click="submit">确认购买</button>
            <button class="btn plain" @click="popShow = false;  amount = ''">关闭</button>
          </div>
        </div>
      </div>
    </transition>
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
</script>

<style lang="less" scoped>
.main{
  padding: .3rem;
}
.intro{
  font-size: 0.26rem;
  padding: 0.3rem 0;
  h3{
    font-size: 0.5rem;
    font-weight: bold;
    padding: 0.4rem 0;
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
