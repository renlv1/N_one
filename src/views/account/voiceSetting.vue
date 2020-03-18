<template>
  <div class="c-page" style="overflow: hidden">
    <app-header>音效</app-header>
    <div class="main">
      <div class="menu">
        <div class="item">
          <span>全部音效</span>
          <cube-switch @click.native="submit(all, 2)" v-model="all"></cube-switch>
        </div>
        <div class="item">
          <span>发布任务成功</span>
          <cube-switch @click.native="submit(initMapAudioFlag, 3)" v-model="initMapAudioFlag"></cube-switch>
        </div>
        <div class="item">
          <span>任务卡开放提示</span>
          <cube-switch @click.native="submit(unlockMapAudioFlag, 4)" v-model="unlockMapAudioFlag"></cube-switch>
        </div>
        <div class="item">
          <span>任务卡完成提示</span>
          <cube-switch @click.native="submit(confrimMapAudioFlag, 5)" v-model="confrimMapAudioFlag"></cube-switch>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
  data () {
    return {
      all: false,
      initMapAudioFlag: false,
      unlockMapAudioFlag: false,
      confrimMapAudioFlag: false,
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo
    },
  },
  watch: {
    userInfo () {
      this.queryInfo()
    }
  },
  mounted () {
    this.queryInfo()
  },
  methods: {
    checkAll () {
      if (this.initMapAudioFlag && this.unlockMapAudioFlag && this.confrimMapAudioFlag) {
        this.all = true
      } else {
        this.all = false
      }
    },
    queryInfo () {
      let info = this.userInfo
      this.initMapAudioFlag = info.initMapAudioFlag === 1 ? true : false
      this.unlockMapAudioFlag = info.unlockMapAudioFlag === 1 ? true : false
      this.confrimMapAudioFlag = info.confrimMapAudioFlag === 1 ? true : false
      this.checkAll()
    },
    submit (audioFlag, flagSource) {
        audioFlag = !audioFlag
        this.$fetch.post('/user/userSetMapAudio', {
          audioFlag: audioFlag ? 1 : 2,
          flagSource,
          loading: true
        }).then(res => {
          if (res.success) {
            let userInfo = this.userInfo
            this.$store.commit('SET_USERINFO', {
              userName: this.userInfo.userName,
              initMapAudioFlag: res.data.initMapAudioFlag,
              unlockMapAudioFlag: res.data.unlockMapAudioFlag,
              confrimMapAudioFlag: res.data.confrimMapAudioFlag
            })
          } else {
            this.$toast(res.msg)
          }
        })
    }
  }
}
</script>

<style lang="less" scoped>
.main{
  padding: .3rem;
  padding-top: 0;
}
.intro{
  text-align: center;
  padding: 0.3rem 0;
  img{
    border-radius: 50%;
    width: 1.7rem;
    margin-bottom: 0.4rem;
  }
}
.menu{
  .item{
    .allCenter;
    border-bottom: 1px solid #f0f0f0;
    line-height: .96rem;
    font-size: 0.3rem;
    color: #333;
  }
}
</style>
<style lang="less">
body .cube-switch .cube-switch-input:checked + .cube-switch-ui{
  border-color: @blue;
  background-color: @blue;
}
</style>
