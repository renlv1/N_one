<template>
  <div class="c-page has-fixed">
    <app-header :backFn="() => $parent.showTempList = false">任务模板</app-header>
    <div class="main">
      <div class="pop-content">
        <div class="btn plain" @click="$router.push('/taskTempEdit')" v-if="editMode || !list.length">新建任务模板</div>
        <div class="empty-data" v-if="!list.length">暂无可用模板</div>
        <div class="item" @click="select(item)" v-for="(item, index) in list" :key="index">
          <div>{{item.content}}</div>
          <div class="img-wrap" v-if="item.imgList && item.imgList.length">
            <div class="img" @click.stop="showPreview(item, index)" v-for="(imgItem, j) in item.imgList" :key="j"><img :src="imgItem" alt=""></div>
          </div>
          <div class="action" v-if="editMode && item.userAddress" @click.stop>
            <span class="cblue" @click="$router.push(`/taskTempEdit?data=${JSON.stringify(item)}`)"><i class="cubeic-edit"></i>编辑模板</span>
            <span class="warn" @click="deleteTemp(item)"><i class="cubeic-delete"></i>删除模板</span>
          </div>
        </div>
      </div>
      <div class="btn fixed" @click="editMode = !editMode">
        {{editMode ? '完成' : '管理模板'}}
      </div>
      <div class="load-loading" v-if="loading"></div>
    </div>
  </div>
</template>

<script>
  export default {
  data () {
    return {
      list: [],
      editMode: false,
      loading: true
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      this.$fetch.post('/map/queryTaskGuideList').then(res => {
        this.loading = false
        if (res.success) {
          let list = res.data.taskGuideList
          list.forEach(item => {
            if (item.imgList && typeof item.imgList === 'string') {
              item.imgList = item.imgList.split(',')
            }
          })
          this.list = list
        }
      })
    },
    showPreview (item, index) {
      this.$createImagePreview({
        imgs: item.imgList,
        initialIndex: index
      }).show()
    },
    select (item) {
      this.$parent.taskContent = item.content
      this.$parent.addNum = item.content.length
      this.$parent.taskImageList = []
      this.$parent.showTempList = false
      if (item.imgList) {
        item.imgList.forEach(item => {
          this.$parent.taskImageList.push({
            url: item,
            loaded: true
          })
        })
      }
      this.$nextTick(() => {
        let wrap = this.$parent.$refs.wrap
        if (wrap) {
          wrap.scrollTop = wrap.scrollHeight
        }
      })
    },
    deleteTemp (item) {
      this.$dialog({
        msg: '确认删除此任务模板吗？',
        type: 'confirm',
        okFn: () => {
          this.$fetch.post('/map/deleteTaskGuide', {
            taskGuideId: item.id,
            loading: true
          }).then(res => {
            if (res.success) {
              this.$toast('删除成功')
              this.getData()
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.pop-content{
  padding: 0.3rem;
  .item {
    background: #fafafa;
    border-left: 5px solid #dbecff;
    border-radius: 4px;
    padding: .4rem 0.3rem;
    margin-top: 0.3rem;
    word-break: break-all;
    line-height: 1.4;
  }
}
.img-wrap{
  display: flex;
  padding-top: 10px;
  .img{
    margin-right: .3rem;
  }
  img{
    width: 1rem;
    height: 1rem;
    border-radius: 4px;
    background: #fafafa;
    border: 1px solid #ddd;
  }
}
.btn.plain{
  border: 1px dotted @blue;
  color: @blue;
  margin: 0;
  background: none;
}
.action{
  margin-top: 0.3rem;
  margin-bottom: -0.2rem;
  span{
    margin-right: 0.5rem;
    font-size: 0.26rem;
  }
  i{
    margin-right: 0.05rem;
  }
}
</style>
