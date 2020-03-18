<template>
  <div class="c-page">
    <div class="main">
      <app-header style="background: none; border: none;width: 1rem"></app-header>
      <web-map :center="center" :markerList="markerList" ref="map"></web-map>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      center: {
        lng: this.$route.query.lng,
        lat: this.$route.query.lat,
      },
      location: {},
      detail: {},
      showMore: false,
      showChange: false,
      showShop: false,
      markerList: []
    }
  },
  mounted () {
    this.getData()
  },
  methods: {
    getData () {
      this.$fetch.post('/map/oneMapDetail', {
        mapId: this.$route.query.id,
        loading: true
      }).then(res => {
        if (res.success) {
          this.showShop = true
          let detail = res.data.oneMapRecord
          detail.lng = detail.longitude
          detail.lat = detail.latitude
          this.markerList.push(detail)
          if (detail.taskImageList && typeof detail.taskImageList === 'string') {
            detail.taskImageList = detail.taskImageList.split(',')
          }
          this.$refs.map.detail = detail
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .active-shop{
    position: fixed;
    bottom: 4vh;
    left: .3rem;
    right: .3rem;
    background: #fff;
    border-radius: 4px;
    transform: translateY(30%);
    visibility: hidden;
    transition: .3s;
    opacity: 0;
    z-index: 3;
    &.active{
      transform: translateY(0);
      visibility: visible;
      opacity: 1;
    }
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
      .vCenter;
      border-radius: 2px;
      padding: .15rem .3rem;
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
</style>