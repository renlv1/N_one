<template>
  <div class="c-page" style="overflow: hidden">
    <app-header>任务信箱详情</app-header>
    <div class="main">
      <div class="intro">
        <div class="label label-arrow red">任务内容</div>
        <div class="task">
          <div class="text">{{item.taskContent}}</div>
          <div class="img-wrap" v-if="item.taskImageList">
            <div class="item" @click="showPreview(index)" v-for="(it, index) in item.taskImageList" :key="index"><img :src="it" alt=""></div>
          </div>
        </div>
      </div>
      <div class="title-line"><span>交易信息</span></div>
      <div class="menu">
        <div class="item">
          <span class="cgray">用户昵称</span>
          <span>{{item.userNickName}}</span>
        </div>
        <div class="item">
          <span class="cgray">完成时间</span>
          <span>{{item.confirmTime | time}}</span>
        </div>
      </div>
      <div class="btn fixed" v-if="item.confirmStatus === 1" @click="submit" >确认完成</div>
    </div>
    <div class="load-loading" v-if="!item.id"></div>
  </div>
</template>

<script>
  export default {
  data () {
    return {
      item: {}
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      this.$fetch.post('/map/oneMapDetail', {
        mapId: this.$route.query.id
      }).then(res => {
        if (res.success) {
          let detail = res.data.oneMapRecord
          if (detail.taskImageList) {
            detail.taskImageList = detail.taskImageList.split(',')
          }
          this.item = detail
        }
      })
    },
    showPreview (index) {
      this.$createImagePreview({
        imgs: this.item.taskImageList,
        initialIndex: index
      }).show()
    },
    submit () {
      this.$dialog({
        showClose: true,
        msg: '您确认该用户已完成任务？',
        okFn: () => {
          this.$fetch.post('/map/confrimMap', {
            mapId: this.item.id,
            confirmType: 2,
            longitude: this.item.longitude,
            latitude: this.item.latitude,
            loading: true
          }).then(res => {
            if (res.success) {
              this.$toast('确认成功')
              this.getData()
              this.$store.commit('SET_LIST_RECORD', {})
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.main{
  padding: .3rem;
}
.intro{
  font-size: 0.28rem;
  padding: 0.3rem 0;
  color: #bbb;
  .task{
    padding: 0.3rem 0;
    color: #333;
  }
  .img-wrap{
    display: flex;
    padding-top: 16px;
    .item{
      margin-right: .3rem;
    }
    img{
      width: 1rem;
      height: 1rem;
      border-radius: 4px;
      background: #fafafa;
    }
  }
}
.menu{
  .item{
    .allCenter;
    border-bottom: 1px solid #f0f0f0;
    line-height: .86rem;
    font-size: 0.3rem;
    color: #333;
    .btn{
      display: inline-block;
      margin: 0;
      line-height: .5rem;
      height: .5rem;
      padding: 0 .2rem;
      margin-left: 0.2rem;
      font-size: 0.26rem;
    }
  }
}
</style>
