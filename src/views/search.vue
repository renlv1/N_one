<template>
  <div class="c-page">
    <div class="app-header">
      <div class="search-wrap row">
        <form action="#" class="search" @submit.prevent="getData">
          <input type="search" v-model="id" ref="input" placeholder="请输入订单编号">
        </form>
        <span @click="$router.back()" class="cancel">取消</span>
      </div>
    </div>
    <div class="main">
      <div class="web-list">
        <div class="item" @click="jump(item)" v-for="(item, index) in list" :key="index">
          <div class="row">
            <span>编号：{{item.id}}</span>
            <span>{{item.createTime | time}}</span>
          </div>
          <div class="row">
            <span class="cblue">{{item.everytotal | f4}}SIE</span>
            <!-- <span class="c000" v-if="item.status === 2">已解锁</span>
            <span class="c000" v-if="item.status === 3">等待确认</span>
            <span class="cgray" v-if="item.status === 1 && item.unlockTime">{{item.unlockTime | time}} 后解锁</span>
            <span class="cgray" v-if="item.status === 1 && !item.unlockTime">{{calcTime(index) | time}} 后解锁</span> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
  data () {
    return {
      list: [],
      id: ''
    }
  },
  mounted () {
    this.$refs.input.focus()
  },
  methods: {
    getData () {
      if (!this.id || !/^[0-9]*$/.test(this.id)) {
        this.$toast('请输入正确的订单编号')
        return
      }
      this.$refs.input.blur()
      this.$fetch.post('/map/myOneMapList', {
        status: this.$route.query.queryType,
        mapId: this.id,
        loading: true
      }).then(res => {
        let list = res.data.oneMapList
        if (list.length) {
          this.list = res.data.oneMapList
        } else {
          this.$toast('找不到相应的订单')
        }
      })
    },
    jump (item) {
      if (item.status !== 1) {
        this.$router.replace(`/mapDetail?id=${item.id}&lng=${item.longitude}&lat=${item.latitude}`)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.app-header{
  border: none;
  padding-top: 20px;
  .ios &{
    padding-top: 40px;
  }
  .iosx &{
    padding-top: 60px;
  }
}
.main-container{
  padding-top: 84px;
  .ios &{
    padding-top: 104px;
  }
  .iosx &{
    padding-top: 124px;
  }
}
.order-list{
  .item{
    box-shadow: 0 4px 6px rgba(0,0,0,.05);
  }
}
.search-wrap{
  font-size: 0.3rem;
  margin: 0 .3rem;
  .vCenter;
  .search{
    display: flex;
    flex: 1;
    background: #f2f4f7;
    border-radius: 2px;
    padding: 0 .2rem;
    margin-right: 0.3rem;
  }
  input{
    flex: 1;
    line-height: 1;
    font-size: 0.28rem;
    padding: 0.2rem 0;
    padding-left: 0.1rem;
  }
  .cancel{
    color: @blue;
    font-size: 0.26rem;
  }
}
</style>