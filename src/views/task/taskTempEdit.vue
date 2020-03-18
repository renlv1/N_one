<template>
  <div class="c-page">
    <app-header>新建任务模板</app-header>
    <div class="taskDetail">
      <div class="row">
        <div class="label label-arrow green">任务内容</div>
        <div class="textarea-box">
          <textarea class="textarea" v-model="taskContent" @input="textareaVal"></textarea>
          <div class="warm-num" ><span class="text-count">{{addNum}}</span>/<span>200</span></div>
        </div>
        <div class="label label-arrow green">附加图片</div>
        <cube-upload
          ref="upload"
          v-model="taskImageList"
          :action="action"
          :multiple="false"
          @files-added="added"
          :process-file="processFile"
          :max="4" />
      </div>

      <button class="btn fixed" :disabled="!taskContent" @click="submit">保存</button>
    </div>
  </div>
</template>

<script>
  import Compressor  from 'compressorjs'
  export default {
    data() {
      return {
        addNum: 0, // 字数,
        taskContent: '',
        taskImageList: [],
        taskData: null,
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
      }
    },
    created () {
      let taskData = this.$route.query.data
      if (taskData) {
        this.taskData = taskData = JSON.parse(taskData)
        this.taskContent = taskData.content
        this.addNum = taskData.content.length
        if (taskData.imgList) {
          taskData.imgList.forEach(item => {
            this.taskImageList.push({
              url: item,
              loaded: true
            })
          })
        }
      }
    },
    methods: {
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

        let url
        let params = {
          taskContent: this.taskContent,
          taskImageList,
          loading: true
        }
        if (this.taskData) {
          url = '/map/editTaskGuide' // 编辑
          params.taskGuideId = this.taskData.id
        } else {
          url = '/map/addTaskGuide' // 新建
        }
        this.$fetch.post(url, params).then(res => {
          if (res.success) {
            this.$toast('操作成功', () => {
              this.$router.back()
            })
          }
        })
      },
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
  }
</style>
