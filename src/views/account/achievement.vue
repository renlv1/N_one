<template>
  <div class="c-page">
    <app-header>共识商业任务明细</app-header>
    <div class="main">
      <div class="allCenter">
        <div class="label label-arrow" style="margin: .3rem; margin-bottom: 0">查看日期 {{parseInt(date) | time('-', 4)}}</div>
        <div class="cblue" @click="showDatePicker">按日期查询</div>
      </div>
      <div class="web-list">
        <load-more
          ref="loadWrap"
          :list="list"
          :noMore="noMore"
          @pulling-up="getData">
          <div class="item" v-for="(item, index) in list" :key="index">
            <div class="row" @click="$router.push(`/account/achievementDetail?name=${item.childUserName}&address=${item.childUserAddress}`)">
              <span>{{item.childUserName}}</span>
              <div>
                <span class="cblue">{{item.accumulateTotal | f4}}SIE</span> /
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
      noMore: false,
      date: this.$route.query.date ? parseInt(this.$route.query.date) : new Date().getTime()
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
      this.$fetch.post('/map/queryAccumulateTotalOfChildListNew', {
        totalDate: this.$options.filters.time(this.date, '-', 4),
        pageSize: 10,
        pageIndex: this.pageIndex
      }).then(res => {
        const list = res.data.childList
        const len = list.length
        this.noMore = true
        if (len) {
          if (this.pageIndex === 1) {
            this.list = list
          } else {
            this.list.push(...list)
          }
          this.pageIndex++
        } else {
          if (this.pageIndex === 1) {
            this.list = []
          }
        }
      }).catch(() => {

      })
    },
    showDatePicker() {
      if (!this.datePicker) {
        this.datePicker = this.$createDatePicker({
          title: '选择日期',
          min: new Date(2019, 1, 1),
          max: new Date(2022, 12, 31),
          value: new Date(),
          format: {
            year: 'YYYY年',
            month: 'MM月',
            date: 'D日'
          },
          onSelect: this.selectHandle
        })
      }
      this.datePicker.show()
    },
    selectHandle(date, selectedVal, selectedText) {
      this.$router.replace(`/account/achievement?date=${new Date(date).getTime()}`)
      this.date = new Date(date).getTime()
      this.getData(true)
    }
  }
}
</script>

<style lang="less" scoped>
.allCenter{
  padding: 0.3rem;
  padding-bottom: 0;
  .label{
    margin: 0 !important;

  }
}
</style>