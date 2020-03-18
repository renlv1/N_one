<template>
  <div class="c-page" ref="wrap">
    <app-header :backFn="back">发布任务</app-header>
    <div class="taskDetail" v-if="!showTempList">
      <div class="row">
        <div class="label c000">商业任务金额</div>
        <div class="input-wrap" style="margin-top: -.18rem">
          <input type="number" class="bold" @input="vaInput" v-model="amount" placeholder="请输入任务金额">
          <div class="unit">SIE</div>
        </div>
      </div>
      <div class="row">
        <div class="title-line" style="margin-top:0"><span>任务设置</span></div>
        <div class="label label-arrow">任务地点</div>
        <div class="vCenter address" @click="chooseLocation">
          <p class="f1">{{location.address}}</p>
          <img src="@img/placeholder.png" height="16px" alt="">
        </div>
        <div class="label label-arrow">详细地址</div>
        <div class="input-wrap" style="margin-top: -.18rem">
          <input type="text" @input="vaAddress" v-model="taskRealAddress" placeholder="请输入详细地址">
        </div>
      </div>
      <div class="row">
        <div class="label label-arrow red">任务内容</div>
        <p>* 如不想设置任务则不需要填写任务内容</p>
        <div class="temp" @click="$router.replace(`/create?temp=${new Date().getTime()}`); showTempList = true">
          <p>从任务模板选择任务</p>
          <i class="cubeic-arrow"></i>
        </div>
        <div class="textarea-box">
          <textarea class="textarea" v-model="taskContent" @input="textareaVal"></textarea>
          <div class="warm-num" ><span class="text-count">{{addNum}}</span>/<span>200</span></div>
        </div>
        <div class="label label-arrow green">添加图片</div>
        <cube-upload
          ref="upload"
          v-model="taskImageList"
          :action="action"
          :multiple="false"
          @files-added="added"
          :process-file="processFile"
          :max="4" />
      </div>
      <button class="btn" :disabled="!amount" @click="submit">发布任务</button>
    </div>
    <task-temp v-else />
    <web-map ref="map" :center="location.point" :showMap="showMap" />
  </div>
</template>

<script>
  import Compressor  from 'compressorjs'
  export default {
    data() {
      return {
        addNum: '0', // 字数,
        amount: '',
        location: {},
        showMap: false,
        taskRealAddress: '',
        taskContent: '',
        taskImageList: [],
        action: {
          target: `${process.env.VUE_APP_BASE_PATH}/uploadfile/uploadimg`,
          withCredentials: true,
          headers: {
            'none-open-id': this.$openId,
            'session-id': this.$sessionId
          },
          data: {
            sourceType: 3
          }
        },
        showTempList: false
      }
    },
    mounted () {
      if (this.$route.query.temp) {
        this.showTempList = true
      }
    },
    components: {
      taskTemp: require('./taskTemp').default
    },
    methods: {
      chooseLocation () {
        this.center = this.location.point
        this.showMap = true
      },
      added (files) {
        const maxSize = 5 * 1024 * 1024
        let hasIgnore = false
        for (let k in files) {
          const file = files[k]
          if (file.size > maxSize) {
            file.ignore = true
            hasIgnore = true
          }
        }
        hasIgnore && this.$toast('图片大小不能超过5M')
      },
      processFile(file, next) {
        new Compressor(file, {
          quality: 0.5,
          success: (blob) => {
            let file = new File([blob], blob.name, {type: blob.type, lastModified: Date.now()})
            next(file)
          }
        })
      },
      // 输入文字控制
      textareaVal () {
        this.addNum = this.taskContent.length
        if (this.taskContent.length > 200) {
          this.addNum = 200
          this.taskContent = this.taskContent.substring(0, 200)
        }
      },
      submit () {
        let fileList = this.$refs.upload.files || []
        let taskImageList = []

        fileList.forEach(item => {
          if (item.loaded) {
            taskImageList.push(item.url)
          }
          if (item.response && item.response.data) {
            taskImageList.push(item.response.data[0].fileUrl)
          }
        })
        taskImageList = taskImageList.join(',')

        this.$fetch.post('/map/buyInitRecord', {
          longitude: this.location.point.lng,
          latitude: this.location.point.lat,
          amount: this.amount,
          taskAddres: this.location.address,
          taskRealAddress: this.taskRealAddress,
          taskContent: this.taskContent,
          taskImageList,
          loading: true
        }).then(res => {
          if (res.success) {
            this.$nativePay({
              amount: this.amount,
              payCurrency: res.data.payCurrency,
              tradeNo: res.data.tradeNo,
              cb: () => {
                if (this.$store.state.userInfo.initMapAudioFlag === 1) {
                  this.$playVoice()
                }
                this.$toast({
                  msg: '任务创建成功',
                  onTimeout: () => {
                    this.$router.back()
                  }
                })
              }
            })
            this.amount = ''
          }
        })
      },
      vaInput () {
        if (!/^\d+(\.\d{0,4})?$/.test(this.amount)) {
          this.amount = this.amount.substring(0, this.amount.length - 1)
        }
      },
      vaAddress () {
        if (this.taskRealAddress.length > 50) {
          this.taskRealAddress = this.taskRealAddress.substring(0, this.taskRealAddress.length - 1)
        }
      },
      back () {
        if (this.showTempList) {
          this.showTempList = false
        } else {
          this.$router.back()
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .taskDetail{
    padding: .3rem .3rem 1rem;
    font-size: 0.28rem;
    .row{
      padding: 0.3rem 0;
    }
    .label{
      margin-bottom: 0.2rem;
      color: @gray;
      font-size: 0.24rem;
    }
    .temp{
      background: #fafafa;
      height: .8rem;
      .allCenter;
      color: @blue;
      margin: 0.3rem 0;
      padding: 0 .3rem;

    }
    .address{
      .vCenter;
      margin-bottom: 0.4rem;
      line-height: 1.3;
      p{
        padding-right: 20px;
      }
    }
    .textarea-box {
      outline: none;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .textarea{
        line-height: 1.5;
        width: 100%;
        border: none;
        border-radius: .1rem;
        background-color: #fafafa;
        height: 2rem;
        font-size: .28rem;
        color: #333;
        padding: .2rem;
        margin-bottom: 0.4rem;
      }
      .warm-num{
        text-align: right;
        width: 100%;
        font-size: .28rem;
        color: #999;
        position: absolute;
        z-index: 30;
        right: .2rem;
        bottom: .5rem;
      }
    }
  }
</style>
<style lang="less">
  body {
    .cube-upload-btn-def, .cube-upload-file-def{
      width: 70px;
      height: 70px;
    }
    .cube-upload-file-status.cubeic-right{
      display: none;
    }
  }
</style>
