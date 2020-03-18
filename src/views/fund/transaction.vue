<template>
  <div class="c-page">
    <app-header>基金交易记录</app-header>
    <div class="main">
      <div class="web-list">
        <load-more
          :list="list"
          :noMore="noMore"
          @pulling-up="getData">
          <div class="item" v-for="(item, index) in list" :key="index">
            <div class="row">
              <span>编号：{{item.id}}</span>
              <span class="cgray">{{item.createAt | time}}</span>
            </div>
            <div class="row c000">
              <span v-if="item.fundType === 1">购买基金</span>
              <span v-else-if="item.fundType === 2">推广奖励</span>
              <span v-else-if="item.fundType === 3">赎回基金</span>
              <span class="cblue">{{item.fundAmount | f4}}SIE</span>
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
      this.$fetch.post('/nonefund/queryOneFundRecordList', {
        pageSize: 10,
        pageIndex: this.pageIndex
      }).then(res => {
        const list = res.data.oneFundRecordList
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
