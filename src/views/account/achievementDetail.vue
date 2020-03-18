<template>
  <div class="c-page">
    <app-header>共识商业任务明细</app-header>
    <div class="main">
      <div class="allCenter">
        <div><span class="cblue">“{{$route.query.name}}”</span> 共识任务详情</div>
      </div>
      <div class="web-list">
        <load-more
          ref="loadWrap"
          :list="list"
          :noMore="noMore"
          @pulling-up="getData">
          <div class="item" v-for="(item, index) in list" :key="index">
            <div class="row">
              <span>{{item.totalDate | time('-', 4)}}</span>
              <div>
                <span class="cblue">{{item.nextAssignTotal | f4}}SIE</span> /
                <span class="cblue">{{item.expediteDay}}天</span>
              </div>
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
      noMore: false
    }
  },
  created () {
    this.$store.commit("SET_LIST_RECORD", {})
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
      this.$fetch.post('/map/queryAccumulateTotalOfChildDetailList', {
        childUserAddress: this.$route.query.address,
        pageSize: 10,
        pageIndex: this.pageIndex
      }).then(res => {
        const list = res.data.expediteMapTotalOfChildList
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

<style lang="less" scoped>
.allCenter{
  padding: 0.3rem;
  .label{
    margin: 0 !important;

  }
}
</style>