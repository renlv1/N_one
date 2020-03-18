<template>
  <div class="c-page">
    <app-header>我的任务卡</app-header>
    <div class="main">
      <div class="go-search" @click="$router.push(`/search?queryType=${queryType}`)">
        <span class="cubeic-search"></span>
        输入订单编号
      </div>
      <tab :arr="['待使用','待确认','已确认']" @click="changeTab"></tab>

      <div class="web-list">
        <!-- <cube-slide> -->
        <load-more
          ref="scroll"
          :list="list"
          :noMore="noMore"
          @pulling-up="getData">
          <div v-if="$store.state.tabIndex === 0" style="padding: .3rem .3rem 0;font-size: .24rem">
            待开放任务卡
            <span class="cblue" v-if="detail.mapCountList && it.status === 1" v-for="(it, j) in detail.mapCountList" :key="j"> {{it.count}} </span>张，
          总金额 <span class="cblue">{{detail.mapTotalAmount | f4}}SIE</span></div>
          <div class="item" @click="jump(item)" v-for="(item, index) in list" :key="index">
            <div class="row">
              <span>编号：{{item.id}}</span>
              <span class="cgray">{{item.createTime | time}}</span>
            </div>
            <div class="row">
              <span class="cblue">{{item.everytotal | f4}}SIE</span>
              <span class="c000" v-if="item.status === 2">已开放</span>
              <span class="c000" v-if="item.status === 3">等待确认</span>
              <span style="color: #999" v-if="item.status === 1 && item.unlockTime">{{item.unlockTime | time}} 后开放</span>
              <span style="color: #999" v-if="item.status === 1 && !item.unlockTime">{{calcTime(index) | time}} 后开放</span>
            </div>
          </div>
        </load-more>
        <!-- </cube-slide> -->
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
      detail: {}
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
  computed: {
    queryType () {
      let index = this.$store.state.tabIndex
      let type = 1
      if (index === 1) {
        type = 3
      } else if (index === 2) {
        type = 4
      }
      return type
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
        status: this.queryType,
        pageIndex: this.pageIndex
      }, this.source.token).then(res => {
        // isRefresh && this.$refs.scroll.reset()
        this.detail = res.data
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
    resetScroll () {
      this.pageIndex = 1
      this.noMore = false
      this.list = []
      this.source && this.source.cancel()
      this.getData()
    },
    changeTab (index) {
      this.resetScroll()
    },
    jump (item) {
      if (item.status !== 1) {
        this.$router.push(`/mapDetail?id=${item.id}&lng=${item.longitude}&lat=${item.latitude}`)
      }
    },
    calcTime (index) {
      let list = this.list.slice(0, index).reverse()
      let count = 1
      let time = ''
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        if (item.status === 1) {
          if (item.unlockTime) {
            time = item.unlockTime + count * 7 * 86400 * 1000 // 在之前的基础上加7天
            break
          } else {
            count++
          }
        }
      }
      // list.reverse().forEach(item => {
      //   if (item.status === 1) {
      //     if (item.unlockTime) {
      //       time = item.unlockTime + count * 7 * 86400 * 1000 // 在之前的基础上加7天
      //     } else {
      //       count++
      //     }
      //   }
      // })

      return time
    }
  },
  components: {
    tab: require('@/components/tab').default
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
