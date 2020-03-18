<template>
  <div class="c-page" :class="{diff: showMap !== undefined, show: showMap === true}">
    <app-header style="background: none; border: none;width: 1rem" v-if="showMap !== undefined" :backFn="back"></app-header>
    <div class="main">
      <baidu-map class="bm-view" @ready="handler" :center="cloneCenter" :zoom="zoom" :scroll-wheel-zoom="true">
        <!-- <bm-geolocation :locationIcon="locationIcon" @locationSuccess="locationSuccess" @locationError="locationError" anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :autoLocation="false"></bm-geolocation> -->
        <bm-local-search :auto-viewport="true" ></bm-local-search>

        <!--  任务卡标注   -->
        <bm-marker
          v-for="(item, index) in markerList"
          :key="index"
          :position="item"
          @click="showTaskDetail(index)"
          :icon="{url: `${require('@img/task.png')}`, size: {width: 60, height: 60}}">
        </bm-marker>
        <bm-marker v-if="selfPoint.lat" :position="selfPoint" :icon="{url: `${require('@img/location.png')}`, size: {width: 50, height: 50}}"></bm-marker>
        <img v-if="showMap" src="@img/task2.png" height="30px" class="task" alt="">
        <slot></slot>
      </baidu-map>

      <!--  任务卡详情   -->
      <transition name="shop">
        <div class="active-shop" v-if="detail" :class="{active: detail}">
          <div class="close" @click="shop = {}"></div>
          <div class="head">
            <div class="text">
              任务卡编号：{{detail.id}}
              <div v-if="detail.status === 2 && !mergeId" @click="showChange = !showChange">
                <img src="@img/menu.png" height="16px" alt="">
                <div class="pop" v-if="showChange">
                  <div v-if="detail.taskId" @click="changeTask"><img src="@img/change_task.png" alt="">更换任务</div>
                  <div @click="$router.push(`/chooseTask?mergeId=${detail.id}`); detail = null"><img src="@img/merge_task.png" alt="">合并任务卡</div>
                </div>
              </div>
            </div>
          </div>
          <div class="intro">
            <div class="section s1">
              <b>{{detail.everytotal | f4}}SIE</b>
              <span v-if="detail.status === 2">待使用</span>
              <span v-else-if="detail.status === 3">待确认</span>
              <span v-else-if="detail.status === 4">已完成</span>
            </div>
            <div class="section s2 hCenter">
              <span>{{detail.taskAddress}} {{detail.taskRealAddress}}</span>
              <img src="@img/placeholder.png" @click="setCenter({lng: detail.lng, lat: detail.lat})" height="16px" alt="">
            </div>
            <div class="section s3">
              <p>{{detail.taskContent}}</p>
              <div class="img-wrap" v-if="showMore && detail.taskImageList">
                <div class="item" @click="showPreview(index)" v-for="(item, index) in detail.taskImageList" :key="index"><img :src="item" alt=""></div>
              </div>
            </div>
            <div class="section s4" v-if="showMore">
              <div class="contact">
                <img src="@img/default_head.png" alt="">
                <p>任务发布人：{{detail.taskUserName}}</p>
              </div>
              <!-- <div class="tel">
                <span class="cblue">联系他</span>
                <img src="@img/contact.png" height="16px" alt="">
              </div> -->
            </div>
            <div class="more" @click="showMore = !showMore" :class="{active: showMore}">
              <span v-if="showMore">收起任务卡</span>
              <span v-else>查看完整任务卡</span>
              <img src="@img/arrow.png" height="10px" alt="">
            </div>
            <template v-if="mergeId">
              <div class="btn" @click="confirmMerge" style="margin:0">合并此藏宝图</div>
            </template>
            <template v-else>
              <div class="btn-multiple" v-if="$route.path.includes('home')">
                <div class="btn" v-if="detail.status === 2 && detail.confirmStatus === 0 && detail.taskId" @click="confirm" style="margin:0">确认完成</div>
                <div class="btn plain" @click="closePop">关闭</div>
              </div>
              <div v-else>
                <div class="btn" v-if="detail.status === 2 && detail.confirmStatus === 0 && detail.taskId" @click="confirm" style="margin:0">确认完成</div>
              </div>
            </template>
          </div>
        </div>
      </transition>

      <!--  地图搜索   -->
      <div class="foot-bar" v-if="showMap">
        <div v-if="showSearch">
          <form action="#" @submit.prevent="local.search(keyword)">
            <input type="search" v-model="keyword" placeholder="请输入地址">
            <div class="close" @click="showSearch = false">取消</div>
          </form>
          <div class="scroll-wrap">
            <div class="address-item" v-for="(item, index) in localData" :key="index" @click="choose(item)">
              <img src="@img/i1.png" height="15px" alt="">  {{item.address}}
            </div>
            <div v-if="!localData.length" class="empty-text">暂无搜索结果</div>
          </div>
        </div>
        <div v-else>
          <div class="label"><img src="@img/i1.png" height="15px" alt="">  请移动地图或点击下方地址选择商业任务地点</div>
          <div class="address" @click="showSearch = true; keyword = ''">
            {{currentAddress.address}}
          </div>
          <button class="btn" @click="useAddress">使用此位置</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
let styleJson = require(`../../public/custom_map_config.json`)
import coordtransform from 'coordtransform'
export default {
  props: {
    center: {
      type: Object,
      default: function () {
        return {lng: 116.404, lat: 39.915}
      }
    },
    showMap: {
      type: Boolean,
      default: undefined
    },
    mergeId: String,
    markerList: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  data () {
    return {
      zoom: 16,
      pointList: [],
      locationIcon: {
        url: require('@img/location.png'),
        size: {
          width: 0,
          height: 0,
        }
      },
      map: null,
      BMap: null,
      keyword: '',
      local: null,
      localData: [],
      currentAddress: {},
      myGeo: null,
      cloneCenter: this.center,
      showSearch: false,
      setFlag: false,
      detail: null,
      showMore: false,
      showChange: false,
      selfPoint: {},
      timer: null
    }
  },
  activated () {
    this.pollLocation()
  },
  deactivated () {
    clearInterval(this.timer)
  },
  methods: {
    handler ({BMap, map}) {
      map.setMapStyle({
        styleJson
      })
      this.map = map
      this.BMap = BMap
      this.myGeo = new BMap.Geocoder()
      this.geolocation = new BMap.Geolocation({
        maximumAge: 10
      })
      this.local = new BMap.LocalSearch(map, {
        onSearchComplete: (r) => {
          if (r.Ar) {
            r.Ar.forEach(item => {
              item.address = `${item.province !== item.city ? item.province : ''}${item.city}${item.title}`
            })
            this.localData = r.Ar
          } else {
            this.localData = []
          }
        }
      })

      this.getCurrentPosition(point => {
        if (!this.$route.path.includes('mapDetail')) {
          map.panTo(point)
          this.selfPoint = point
        }
        this.getAddress(point)
      })
      if (this.showMap !== undefined) {
        this.map.addEventListener('dragend', this.dragendHandler)
      }
    },
    dragendHandler () {
      this.getAddress(this.map.getCenter())
    },
    // 获取当前位置
    getCurrentPosition (cb) {
      // 手动获取定位
      let iframe = document.createElement('iframe')
      let origin = 'https://web.nonefund.com'
      iframe.setAttribute('width', 0)
      iframe.setAttribute('height', 0)
      iframe.setAttribute('src', `${origin}/location.html`)
      iframe.setAttribute('allow', 'geolocation')
      document.body.appendChild(iframe)
      window.onmessage = e => {
        if (e.origin === origin) {
          var r = JSON.parse(e.data)
          if (r.coords) {
            // 将GPS坐标手动转为百度坐标系
            let point = [r.coords.longitude, r.coords.latitude]
            // 如果在国内就转换，反之不转换
            if (!this.out_of_china(...point)) {
              let gcj = coordtransform.wgs84togcj02(...point)
              point = coordtransform.gcj02tobd09(...gcj)
            }
            cb(new this.BMap.Point(...point))
            // let points = [new this.BMap.Point(r.coords.longitude, r.coords.latitude)]
            // new this.BMap.Convertor().translate(points, 1, 5, data => {
            //   let point = data.points[0]
            //   cb(new this.BMap.Point(point.lng, point.lat))
            // })
          } else {
            this.$store.commit('SET_LOADING', false)
            this.$toast('定位失败, 请检查您的GPS设置')

            // 失败了之后再使用百度地图自带定位补救一哈
            this.geolocation.getCurrentPosition(r => {
              if(this.geolocation.getStatus() === 0){
                cb && cb(r.point)
              }
            })
          }
        }
      }
    },
    out_of_china (lng, lat) {
      var lat = +lat;
      var lng = +lng;
      // 纬度3.86~53.55,经度73.66~135.05
      return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55)
    },
    // 轮询自己的位置
    pollLocation () {
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        this.getCurrentPosition(point => {
          this.selfPoint = point
        })
      }, 10000)
    },
    locationSuccess (y) {
      let point = y.point
      this.selfPoint = point
      this.$dialog({
        msg: JSON.stringify(point)
      })
    },
    locationError () {
      this.$toast('定位失败，请检查您的GPS设置')
    },
    goLocation () {
      let el = document.querySelector('.BMap_geolocationIcon')
      if (el) {
        el.click()
      } else {
        setTimeout(() => {
          this.goLocation()
        }, 200)
      }
    },
    setCenter (point) {
      if (point) {
        this.map.setCenter(new this.BMap.Point(point.lng, point.lat))
      } else {
        this.getCurrentPosition(p => {
          this.map.setCenter(p)
        })
      }
    },
    getAddress (point) {
      // 根据坐标得到地址描述
      this.myGeo.getLocation(new this.BMap.Point(point.lng, point.lat), result => {
        if (result){
          this.currentAddress = result
          if (!this.setFlag) {
            this.setFlag = true
            this.$parent.location = result
          }
        }
      })
    },
    choose (item) {
      this.currentAddress = item
      this.showSearch = false
      this.cloneCenter = item.point
    },
    back () {
      this.$parent.showMap = false
    },
    useAddress () {
      this.$parent.location = this.currentAddress
      this.$parent.showMap = false
    },
    closePop () {
      this.detail = null
      this.showMore = false
      this.showChange = false
    },
    showTaskDetail (index) {
      let detail = this.markerList[index]
      if (detail.taskImageList && typeof detail.taskImageList === 'string') {
        detail.taskImageList = detail.taskImageList.split(',')
      }
      this.detail = detail
    },
    changeTask () {
      this.$store.commit('SET_LOADING', true)
      this.getCurrentPosition(point => {
        this.$store.commit('SET_LOADING', false)
        let fee = this.$options.filters.f4(Math.pow(2, this.detail.changeTaskCount || 0))
        this.$dialog({
          showClose: true,
          msg: `更换任务将会根据当前位置重新分配任务，本次更换任务需要支付<i class="cblue">${fee}SIE</i>，是否进行更换？`,
          okFn: () => {
            this.$fetch.post('/map/changeMapTask', {
              mapId: this.detail.id,
              longitude: point.lng,
              latitude: point.lat,
              address: this.currentAddress.address,
              loading: true
            }).then(res => {
              if (res.success) {
                this.$nativePay({
                  amount: res.data.payAmount,
                  payCurrency: res.data.payCurrency,
                  tradeNo: res.data.tradeNo,
                  cb: () => {
                    this.$toast({
                      msg: '更换任务成功',
                      onTimeout: () => {
                        if (this.$route.path.includes('mapDetail')) {
                          this.$router.back()
                        } else {
                          this.closePop()
                          setTimeout(() => {
                            this.$parent.getData()
                          }, 10000)
                        }
                      }
                    })
                  }
                })
              }
            })
          }
        })
      })
    },
    confirmMerge () {
      this.$dialog({
        showClose: true,
        msg: '确认合并后，第二次选择的任务卡金额将会合并到第一张任务卡中，第二张任务卡同时会被销毁。',
        okFn: () => {
          this.$fetch.post('/map/mergeOneMap', {
            mapId: this.detail.id,
            chooseMapId: this.mergeId,
            loading: true
          }).then(res => {
            if (res.success) {
              this.$store.commit('SET_LIST_RECORD', {})
              this.$toast({
                msg: '合并任务卡成功',
                onTimeout: () => {
                  this.$router.go(-2)
                }
              })
            }
          })
        }
      })
    },
    confirm () {
      this.$store.commit('SET_LOADING', true)
      this.getCurrentPosition(point => {
        this.$store.commit('SET_LOADING', false)
        this.$dialog({
          showClose: true,
          msg: '确认完成任务后可以获得95%的奖励金额，请联系任务发布人确认任务完成，发布人确认后可以获得剩余5%的奖励金额。',
          okFn: () => {
            this.$fetch.post('/map/confrimMap', {
              mapId: this.detail.id,
              confirmType: 1,
              longitude: point.lng,
              latitude: point.lat,
              loading: true
            }).then(res => {
              if (res.success) {
                if (this.$store.state.userInfo.confrimMapAudioFlag === 1) {
                  this.$playVoice()
                }
                this.$store.commit('SET_LIST_RECORD', {})
                this.$toast({
                  msg: '确认成功',
                  onTimeout: () => {
                    if (this.$route.path.includes('mapDetail')) {
                      this.$router.back()
                    } else {
                      this.$parent.getData()
                      this.closePop()
                    }
                  }
                })
              }
            })
          }
        })
      })
    },
    showPreview (index) {
      this.$createImagePreview({
        imgs: this.detail.taskImageList,
        initialIndex: index
      }).show()
    }
  },
  beforeDestroy () {
    this.map.removeEventListener('dragend', this.dragendHandler)
  }
}
</script>

<style lang="less" scoped>
  .task{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .c-page.diff{
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 999;
    visibility: hidden;
    &.show{
      visibility: visible;
    }
  }

  .active-shop{
    position: fixed;
    bottom: 4vh;
    left: .3rem;
    right: .3rem;
    background: #fff;
    border-radius: 4px;
    z-index: 3;
    .head{
      position: relative;
      .text{
        .allCenter;
        background: url(~@img/bg1.png);
        background-size: cover;
        height: 1rem;
        padding: 0 .3rem;
        color: #fff;
        font-size: .3rem;
      }
    }
    .intro{
      padding: 0 .3rem .3rem;
      position: relative;
      .section{
        padding: 0.3rem 0 .36rem;
        line-height: 1.4;
        background: url(~@img/line.png) no-repeat center bottom;
        background-size: 100%;
      }
      .s1{
        font-size: 0.32rem;
        line-height: 1;
        padding-top: .4rem;
        b{
          font-weight: bold;
        }
        span{
          padding-left: 10px;
          margin-left: 10px;
          border-left: 1px solid;
        }
      }
      .s2{
        .vCenter;
        span{
          padding-right: 20px;
        }
      }
      .s4{
        .hCenter;
        .contact{
          .vCenter;
          img{
            width: 0.5rem;
            height: 0.5rem;
            border-radius: 50%;
            margin-right: 0.1rem;
          }
        }
        .tel{
          .vCenter;
          img{
            margin-left: 0.1rem;
          }
        }
      }
    }
    .img-wrap{
      display: flex;
      padding-top: 10px;
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
    .more{
      text-align: center;
      color: @blue;
      line-height: 50px;
      .vCenter;
      justify-content: center;
      img{
        margin-left: 0.2rem;
        margin-top: -2px;

      }
      &.active img{
        transform: rotate(180deg);
      }
    }
    .pop{
      background:rgba(0,0,0,.6);
      position: absolute;
      right: 0;
      bottom: 1.3rem;
      color: #fff;
      border-radius: 2px;
      div{
        padding: .15rem .3rem;
        .vCenter;
        & + div{
          border-top: 1px solid #999;
        }
      }
      &:after{
        content: '';
        position: absolute;
        bottom: -12px;
        border: 6px solid transparent;
        border-top-color: rgba(0,0,0,.6);
        right: .3rem;
      }
      img{
        width: .5rem;
        margin-right: 0.2rem;
      }
    }
  }
  .shop-enter,.shop-leave-to{
    transform: translateY(100%);
    opacity: 0;
  }
  .shop-enter-active,.shop-leave-active{
    transition: .3s;
  }
  .foot-bar{
    position: fixed;
    bottom: 4vh;
    left: .3rem;
    right: .3rem;
    background: #fff;
    border-radius: 4px;
    padding: .4rem;
    form{
      position: relative;
      margin: .1rem 0;
      .close{
        position: absolute;
        right: 0;
        top: 0;
        line-height: 0.7rem;
        font-size: 0.22rem;
        color: @blue;
        width: 1rem;
        background: #eee;
        text-align: center;
      }
    }
    .empty-text{
      text-align: center;
      color: #bbb;
      padding: 1rem 0;
    }
    input{
      height: 0.7rem;
      background: #eee;
      padding: 0 .3rem;
      width: 100%;
      border-radius: 4px;
    }
    .scroll-wrap{
      min-height: 3rem;
      max-height: 6rem;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }
    .address-item{
      .vCenter;
      padding: 0.4rem 0;
      img{
        margin-right: 5px;
      }
      border-bottom: 1px solid #eee;
      font-size: 0.28rem;
    }
    .label{
      .vCenter;
      padding: 0.2rem 0;
      color: #bbb;;
      img{
        margin-right: 5px;
      }
    }
    .address{
      padding: 0.3rem 0 .36rem;
      line-height: 1.4;
      background: url(~@img/line.png) no-repeat center bottom;
      background-size: 100%;
      font-size: 0.26rem;
    }
  }
</style>
<style lang="less">
  .bm-view{
    width: 100%;
    height: 100%;
    padding-top: 0;
    position: fixed;
    left: 0;
    top: 0;
    img{
      max-width: inherit;
    }
    // .anchorBL{
    //   display: none;
    // }
    .anchorBR{
      opacity: 0;
    }
  }
</style>

