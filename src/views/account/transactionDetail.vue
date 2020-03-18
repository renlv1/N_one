<template>
  <div class="c-page" style="overflow: hidden">
    <app-header>交易记录详情</app-header>
    <div class="main">
      <div class="intro">
        <p>交易金额</p>
        <h3>
          <span v-if="item.paymentType === 1 || item.paymentType === 4">-</span>
          <span v-if="item.paymentType === 2 || item.paymentType === 3">+</span>
          {{item.payAmount | f4}}SIE</h3>
      </div>
      <div class="title-line"><span>交易信息</span></div>
      <div class="menu">
        <div class="item">
          <span class="cgray">订单编号</span>
          <span>{{item.id}}</span>
        </div>
        <div class="item">
          <span class="cgray">交易时间</span>
          <span>{{item.updateDate | time}}</span>
        </div>
        <div class="item">
          <span class="cgray">交易类型</span>
          <span v-if="item.paymentType === 1">发布商业任务</span>
          <span v-else-if="item.paymentType === 2">任务卡奖励</span>
          <span v-else-if="item.paymentType === 3">任务完成奖励</span>
          <span v-else-if="item.paymentType === 4">更换任务</span>
        </div>
        <div class="item" v-if="item.paymentType !== 1 && item.sourceOrderId">
          <span class="cgray">任务卡编号</span>
          <span class="vCenter">{{item.sourceOrderId}} <div class="btn" @click="$router.push(`/mapDetail?id=${item.sourceOrderId}`)">查看</div></span>
        </div>
      </div>
    </div>
    <div class="load-loading" v-if="!item.id"></div>
  </div>
</template>

<script>
  export default {
  data () {
    return {
      item: {}
    }
  },
  mounted () {
    this.getData()
  },
  computed: {
    fund () {
      return this.$store.state.fundData
    }
  },
  methods: {
    getData () {
      this.$fetch.post('/onepay/onePayRecordDetail', {
        payId: this.$route.query.id
      }).then(res => {
        if (res.success) {
          this.item = res.data.onePayRecord
        }
      })
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
  font-size: 0.26rem;
  padding: 0.3rem 0;
  h3{
    font-size: 0.4rem;
    padding: 0.4rem 0;
  }
}
.menu{
  .item{
    .allCenter;
    border-bottom: 1px solid #f0f0f0;
    line-height: .86rem;
    font-size: 0.3rem;
    color: #333;
    .btn{
      display: inline-block;
      margin: 0;
      line-height: .5rem;
      height: .5rem;
      padding: 0 .2rem;
      margin-left: 0.2rem;
      font-size: 0.26rem;
    }
  }
}
</style>
