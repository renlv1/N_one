<template>
  <div class="c-page">
    <app-header>交易记录</app-header>
    <div class="main">
      <div class="web-list">
        <load-more
          :list="list"
          :noMore="noMore"
          @pulling-up="getData">
          <div class="item" v-for="(item, index) in list" :key="index" @click="$router.push(`/account/transactionDetail?id=${item.id}`)">
            <div class="row">
              <span>编号：{{item.id}}</span>
              <span class="cgray">{{item.createDate | time}}</span>
            </div>
            <div class="row c000">
              <span v-if="item.paymentType === 1">发布商业任务</span>
              <span v-else-if="item.paymentType === 2">任务卡奖励</span>
              <span v-else-if="item.paymentType === 3">任务完成奖励</span>
              <span v-else-if="item.paymentType === 4">更换任务</span>
              <span class="cblue">
                <span v-if="item.paymentType === 1 || item.paymentType === 4">-</span>
                <span v-if="item.paymentType === 2 || item.paymentType === 3">+</span>
                <span></span>
                {{item.payAmount | f4}}SIE</span>
            </div>
          </div>
        </load-more>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
  data () {
    return {
      list: [],
      pageIndex: 1,
      noMore: false,
    }
  },
  created () {
    const history = this.$store.state.historyRecord
    if (history.list && history.path === this.$route.path) {
      this.list = history.list
      this.pageIndex = history.pageIndex
      this.noMore = history.noMore
    }
  },
  methods: {
    getData (isRefresh) {
      if (isRefresh) {
        this.pageIndex = 1
      }
      this.$fetch.post('/onepay/queryOnePayRecordList', {
        pageSize: 10,
        pageIndex: this.pageIndex
      }).then(res => {
        const list = res.data.onePayRecordList
        const len = list.length
        if (len) {
          if (this.pageIndex === 1) {
            if (len < 10) {
              this.noMore = true
            }
            this.list = list
          } else {
            this.list.push(...list)
          }
          this.pageIndex++
        } else {
          if (this.pageIndex === 1) {
            this.list = []
          }
          this.noMore = true
        }
      }).catch(() => {

      })
    }
  }
}
</script>
