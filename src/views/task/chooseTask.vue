<template>
  <div class="c-page">
    <app-header>选择任务卡</app-header>
    <div class="main">
      <div class="web-list">
        <!-- <cube-slide> -->
        <load-more
          ref="scroll"
          :list="list"
          :noMore="noMore"
          @pulling-up="getData">
          <div class="item" v-if="item.id != $route.query.mergeId" @click="jump(item)" v-for="(item, index) in list" :key="index">
            <div class="row">
              <span>编号：{{item.id}}</span>
              <span class="cgray">{{item.createTime | time}}</span>
            </div>
            <div class="row">
              <span class="cblue">{{item.everytotal | f4}}SIE</span>
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
      this.source = this.$axios.CancelToken.source()
      this.$fetch.post2('/map/myOneMapList', {
        pageSize: 10,
        status: 2,
        pageIndex: this.pageIndex
      }, this.source.token).then(res => {
        const list = res.data.oneMapList
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
    },
    jump (item) {
      this.$router.push(`/chooseTaskDetail?id=${item.id}&lng=${item.longitude}&lat=${item.latitude}&mergeId=${this.$route.query.mergeId}`)
    }
  }
}
</script>

<style lang="less" scoped>
.search{
  background: #f2f4f7;
  display: flex;
  align-items: center;
  border-radius: 4px;
  margin:.3rem;
  padding: 0 .3rem;
  input{
    flex: 1;
    line-height: 1;
    font-size: 0.28rem;
    padding: 0.2rem 0;
    padding-left: 0.1rem;
  }
}
.arrow-down{
  display: inline-block;
  // background: url(~@img/arrow_down.png) no-repeat right center;
  padding-right: 0.3rem;
  background-size: .2rem;
}
.pop{
  position: absolute;
  background: #fff;
  border-radius: 4px;
  padding: 0 .3rem;
  left: 50%;
  transform: translate(-50%, 20%);
  box-shadow: 0 0 8px rgba(0,0,0,.15);
  line-height: 1;
  z-index: 3;
  visibility: hidden;
  opacity: 0;
  transition: .3s;
  &.active{
    visibility: visible;
    transform: translate(-50%, 0);
    opacity: 1;
  }
  .item{
    padding: .38rem .22rem;
    white-space: nowrap;
    &.active{
      color: @blue;
    }
    & + .item{
      border-top: 1px solid #888;
    }
  }
}
</style>
