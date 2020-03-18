<template>
  <div id="app">
    <div class="ajax-loading" v-show="$store.state.showLoading">
      <div class="loading-content">
        <img src="@img/loading.gif" alt />
        <p>正在请求中...</p>
      </div>
    </div>
    <transition name="router-fade">
      <keep-alive>
        <router-view class="main-container" v-if="$route.meta.keepAlive" />
      </keep-alive>
    </transition>
    <transition name="router-fade">
      <router-view class="main-container" v-if="!$route.meta.keepAlive" />
    </transition>

   <!-- <audio src="./audio.mp3" id="audio" preload></audio>-->
  </div>
</template>
<script>
export default {
  mounted() {
    if (!sc.isSecret) {
      this.getUser();
    }
  },
  methods: {
    getUser() {
      // this.$fetch.post("/user/userlogin", {
      //   username: "zero1616",
      //   password: "123123qQ"
      // });
    }
  }
};
</script>

<style lang="less">
@import "assets/css/reset.css";
@import "assets/css/common.less";
#app {
  font-size: 0.25rem;
  color: #060f26;
  line-height: 1.1;
}
.global-loading {
  position: fixed;
  background: rgba(0, 0, 0, 0.6);
  padding: 0 20px;
  line-height: 40px;
  border-radius: 4px;
  z-index: 9999;
  left: 50%;
  top: 50%;
  color: #ffffff;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  font-size: 13px;
  img {
    margin-right: 6px;
  }
  &.init {
    background: #fff;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    color: #666;
  }
}

.router-fade-enter-to {
  transition: opacity 0.3s;
}

.router-fade-enter {
  opacity: 0.4;
}
audio{
  visibility: hidden;
  position: absolute;
}
.ajax-loading {
  position: fixed;
  z-index: 999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  font-size: 0.22rem;
  .loading-content {
    position: absolute;
    width: 2rem;
    height: 2rem;
    background: rgba(0, 0, 0, 0.8);
    text-align: center;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .vCenter;
    flex-direction: column;
    justify-content: center;
    color: #fff;
    border-radius: 10px;
    padding-bottom: 0.2rem;
  }
  img {
    width: 0.7rem;
    text-align: left;
    margin: 0.26rem 0;
  }
}
</style>
<style>
.cube-dialog-content-def > p {
  word-break: break-word;
}
.cube-dialog-content-def img {
  max-width: 100%;
}
</style>


