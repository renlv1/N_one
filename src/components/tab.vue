<template>
  <div class="tab">
    <div v-for="(item, index) in arr" class="tab-item" @click="emit(index)" :key="index" :class="{'active': $store.state.tabIndex === index}">
      <div>{{item}}</div>
    </div>
    <div class="bar" :style="`width:${100 / arr.length}%; transform: translateX(${$store.state.tabIndex * 100}%);`"></div>
  </div>
</template>

<script>
export default {
  props: {
    arr: Array
  },
  computed: {
    tabIndex () {
      return this.$store.state.tabIndex
    }
  },
  methods: {
    emit (index) {
      this.$store.commit('SET_TAB_INDEX', index)
      this.$emit('click', index)
    }
  }
};
</script>

<style lang="less" scoped>
  .tab{
    display: flex;
    background: #fff;
    font-size: 0.3rem;
    position: relative;
    z-index: 99;
    border-bottom: 1px solid #f4f4f4;
    &-item{
      flex: 1;
      line-height: 44px;
      text-align: center;
      div{
        border-bottom: 2px solid transparent;
        display: inline-block;
        padding: 0 15px;
        color: #666;
        line-height: 1.2;
      }
      &.active{
        div{
          color: @blue;
          // border-color: @blue;
        }
      }
    }
    .bar{
      position: absolute;
      bottom: -1px;
      left: 0;
      transition: .3s;
      &:before{
        content: '';
        width: 50%;
        margin: 0 auto;
        height: 2px;
        display: block;
        background: @blue;
      }
    }
  }
</style>


