<template>
  <div class="c-page">
    <app-header>推广业绩</app-header>
    <div class="main">
      <div class="label label-arrow" style="margin: .3rem; margin-bottom: 0">统计时间 {{new Date().getTime() | time}}</div>
      <div class="web-list">
        <load-more
          :list="list"
          :noMore="noMore"
          @pulling-up="getData">
          <div class="item" v-for="(item, index) in list" :key="index">
            <div class="row">
              <span>{{item.userName}}</span>
              <span class="cblue">{{item.refAccumulateTotal | f4}}SIE</span>
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
      this.$fetch.post('/nonefund/queryFundTotalOfChildList', {
        pageSize: 10,
        pageIndex: this.pageIndex
      }).then(res => {
        const list = res.data.childFundTotalList
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
