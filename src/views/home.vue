<template>
  <div class="c-page">
    <div class="main">
      <web-map ref="map" :markerList="markerList">
      </web-map>
      <div class="user-info">
        <div class="flex" @click="$router.push('/account')">
          <img src="@img/default_head.png" alt="">
          <div class="text">
            <h3>{{$store.state.userInfo.userName}}</h3>
            <p>查看详情</p>
          </div>
        </div>
      </div>

      <div class="menu-bar">
        <div class="justify">
          <router-link to="/create" class="item first">
            <img src="@img/i4.png" alt="">
            <p>发布任务</p>
          </router-link>
          <router-link to="/mapList" class="item">
            <img src="@img/i2.png" alt="">
            <p>任务卡</p>
          </router-link>
          <router-link to="/taskList" class="item">
            <img src="@img/i3.png" alt="">
            <p>任务信箱</p>
            <div class="badge" v-if="confirmCount">{{confirmCount}}</div>
          </router-link>
        </div>
        <div class="right">
          <div class="item" @click="goLocation">
            <img src="@img/geolocation.png" alt="">
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
      // center: {lng: 114.120314, lat: 22.545764},
      zoom: 15,
      localData: [],
      currentAddress: '',
      location: {},
      confirmCount: 0,
      markerList: []
    }
  },
  activated () {
    this.getData()
    this.$store.commit("SET_LIST_RECORD", {})
    this.$store.commit("SET_TAB_INDEX", 0)
  },
  methods: {
    goLocation () {
      this.$refs.map.setCenter()
    },
    getData () {
      this.$fetch.post('/map/oneMapIndex').then(res => {
        if (res.success) {
          this.$store.commit('SET_USERINFO', {
            userName: res.data.userName,
            unlockMapAudioFlag: res.data.unlockMapAudioFlag,
            confrimMapAudioFlag: res.data.confrimMapAudioFlag,
            initMapAudioFlag: res.data.initMapAudioFlag,
          })
          this.confirmCount = res.data.confirmCount
          if (res.data.canLocation) {
            this.$dialog({
              showClose: true,
              msg: '您有新的任务卡已解锁，是否根据当前位置立即分配任务？',
              okFn: () => {
                this.$fetch.post('/map/confirmLocation', {
                  longitude: this.location.point.lng,
                  latitude: this.location.point.lat,
                  address: this.location.address,
                  loading: true
                }).then(res => {
                  if (res.success) {
                    if (this.$store.state.userInfo.unlockMapAudioFlag === 1) {
                      this.$playVoice()
                    }
                    this.$toast('分配任务成功')
                  }
                })
              }
            })
          }
          if (res.data.oneMapList) {
            this.markerList = JSON.parse(JSON.stringify(res.data.oneMapList).replace(/longitude/g, 'lng').replace(/latitude/g, 'lat'))
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .menu-bar{
    .hCenter;
    position: absolute;
    bottom: 4vh;
    left: 0;
    right: 0.3rem;
    .item{
      padding:10px;
      background: #fff;
      border-radius: 4px;
      text-align: center;
      margin-left: 0.35rem;
      font-size: 0.24rem;
      line-height: 1;
      position: relative;
      &.first{
        padding-left: 15px;
        padding-right: 15px;
        color: #fff;
        background: @blue;
      }
      .badge{
        position: absolute;
        right: -6px;
        top: -6px;
        background: red;
        border-radius: 50%;
        // padding: 6px;
        color: #fff;
        width: 20px;
        line-height: 20px;
      }
    }
    .right{
      .item{
        .vCenter;
        height: 100%;
        padding: 0 .4rem;
      }
    }
    img{
      height: .5rem;
    }
    p{
      margin-top: 10px;
    }
  }
  .user-info{
    position: absolute;
    left: 0.35rem;
    top: 1.2rem;
    background: #fff;
    box-shadow: 0 0 10px rgba(0,0,0,.15);
    border-radius: 4px;
    .flex{
      .vCenter;
      padding: .2rem .3rem;
      font-size: 0.24rem;
      img{
        margin-right: .15rem;
        width: .8rem;
        height: .8rem;
        border-radius: 50%;
      }
      h3{
        font-size: 0.3rem;
        margin-bottom: 0.14rem;
      }
      p{
        color: #aaa;
      }
    }
  }
</style>
