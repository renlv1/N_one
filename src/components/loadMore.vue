<template>
  <div class="scroll-wrap" :class="{noMore: noMore}" ref="scrollWrap">
    <div v-if="!list.length && !noMore" class="load-loading"></div>
    <cube-scroll
      ref="scroll"
      :data="list"
      :options="options"
      @pulling-down="emit(true)"
      @pulling-up="emit()">
      <slot></slot>
      <div v-if="!list.length && noMore" class="empty">
        <img src="@img/empty.png" alt>
        <p>{{$t('common.empty')}}</p>
      </div>
      <div v-show="noMore && list.length" class="no-more text-center">{{$t('common.noMore')}}</div>
      <template slot="pullup">
        <div class="pullup-loading text-center">
          <div v-if="!noMore">
            <div id="circleG">
              <div id="circleG_1" class="circleG"></div>
              <div id="circleG_2" class="circleG"></div>
              <div id="circleG_3" class="circleG"></div>
            </div>
          </div>
        </div>
      </template>
    </cube-scroll>
  </div>
</template>

<script>
export default {
  data () {
    return {
      path: this.$route.path,
      loading: false
    }
  },
  props: {
    list: Array,
    noMore: Boolean,
    options: {
      type: Object,
      default: function () {
        return {
          pullUpLoad: true,
          startY: this.$store.state.historyRecord.y || 0,
          pullDownRefresh: {
            threshold: 60,
            stop: 40,
            txt: '更新成功'
          }
        }
      }
    }
  },
  watch: {
    noMore: function () {
      this.$refs.scroll.refresh()
    },
    // list: function (val) {
    //   if (val.length <= 10) {
    //     this.$refs.scroll.scrollTo(0, 0)
    //   }
    // }
  },
  methods: {
    initHeight () {
      // 计算剩余高度
      const el = this.$refs.scrollWrap
      if (el) {
        el.style.height = window.innerHeight - el.offsetTop + "px"
      }
    },
    emit(isRefresh) {
      if (!this.noMore || isRefresh) {
        this.$emit('pulling-up', isRefresh)
      }
    },
    reset () {
      if (!this.list.length) {
        this.$refs.scroll.forceUpdate(true, false)
      }
    }
  },
  mounted() {
    this.initHeight()
    const historyPath = this.$store.state.historyRecord.path
    if (!historyPath || historyPath !== this.$route.path) {
      this.emit()
    }
  },
  beforeDestroy () {
    this.$store.commit('SET_LIST_RECORD', {
      path: this.path,
      y: this.$refs.scroll.scroll.y,
      list: this.list,
      pageIndex: this.$parent.pageIndex || 1,
      noMore: this.$parent.noMore || true
    })
  }
}
</script>

<style lang="less" scoped>
.scroll-wrap{
  min-height: 60vh;
  position: relative;
}
.text-center {
  text-align: center;
  line-height: .8rem;
  font-size: 0.24rem;
  color: #bbb;
}

#circleG{
	text-align: center;
}

.circleG{
	background-color:rgb(209,209,209);
	display: inline-block;
	height:8px;
	margin: 0 3px;
	width:8px;
	animation-name:bounce_circleG;
	animation-duration:0.6s;
	animation-iteration-count:infinite;
	animation-direction:normal;
	border-radius:20px;
}

#circleG_1{
	animation-delay:0.15s;
}

#circleG_2{
	animation-delay:0.3s;
}

#circleG_3{
	animation-delay:0.45s;
}

@keyframes bounce_circleG{
	0%{}

	50%{
		background-color:rgb(120,120,120);
	}

	100%{}
}
</style>
