<template>
  <div class="c-page">
    <app-header>任务信箱</app-header>
    <div class="main">
      <!-- <div class="go-search">
        <span class="cubeic-search"></span>
        输入订单编号
      </div> -->
      <div class="web-list">
        <load-more
          :list="list"
          :noMore="noMore"
          @pulling-up="getData">
          <router-link :to="`/taskDetail?id=${item.id}`" class="item" v-for="(item, index) in list" :key="index">
            <div class="row cgray">
              <span>编号：{{item.id}}</span>
              <span>{{item.createTime | time}}</span>
            </div>
            <div class="row">
              <span class="c000 ell">{{item.taskContent}}</span>
            </div>
          </router-link>
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
      queryType: 1,
      source: null,
      popShow: false
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
      this.$fetch.post('/map/confirmOneMapList', {
        status: 3,
        pageSize: 10,
        pageIndex: this.pageIndex
      }).then(res => {
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
