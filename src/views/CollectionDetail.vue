<template>
  <div class="detail page">
    <!--轮播图-->
    <div class="swiper-box">
      <swiper class='swiper' :options="detail_swiper" v-if="detail.pics.length>1">
        <swiper-slide v-for="(item, index) in detail.pics" :key="index" class="swiper-item"
                      :style="'background-image: url('+item+')'"></swiper-slide>
      </swiper>
      <div class="img" v-else :style="'background-image: url('+detail.pics[0]+')'"></div>
      <h3><p class="two-line-ellipsis">{{detail.title}}</p>
        <div class="icon" @click="look_big_pic"><img src="../assets/icon-enlarge.png"/></div>
      </h3>
    </div>

    <!--音频播放-->
    <div class="audio-box bg-color">
      <mine-audio :url="detail.audio_url" v-if="detail.audio_url"></mine-audio>
      <div class="not-audio" v-else>暂无音频解说</div>
    </div>

    <!--文物属性-->
    <div class="attr bg-color">
      <div class="attr-item">
        <p class="label">文物名称</p>
        <p>{{detail.title}}</p>
      </div>
      <div class="attr-item">
        <p class="label">所属年代</p>
        <p>{{detail.dynasty}}</p>
      </div>
      <div class="attr-item">
        <p class="label">文物类别</p>
        <p>{{detail.cate_name}}</p>
      </div>
      <div class="attr-item">
        <p class="label">文物尺寸</p>
        <p>{{detail.size}}</p>
      </div>
      <div class="attr-item">
        <p class="label">文物来源</p>
        <p>{{detail.origin}}</p>
      </div>
    </div>

    <!--藏品简介-->
    <div class="intro bg-color">
      <h3>藏品简介</h3>
      <p>{{detail.desc}}</p>
    </div>
  </div>
</template>

<script>
  import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
  import 'swiper/css/swiper.css'
  import { ImagePreview } from 'vant'
  import Audio from '../components/Audio'

  var _self;

  export default {
    components: {
      'mine-audio': Audio,
      'swiper': Swiper,
      'swiper-slide': SwiperSlide
    },
    data() {
      return {
        id: 0,//当前藏品详情的id

        index: 0,//轮播图当前显示的图片索引值

        detail: { pics: [] },//当前藏品的详情信息
        detail_swiper: {
          autoplay: {
            delay: 2000,
            stopOnLastSlide: false,
            disableOnInteraction: false,
          },
          on: {
            slideChange() {
              _self.index = this.realIndex;
            }
          }
        },//藏品详情轮播图配置
      };
    },
    mounted() {
      _self = this;
      this.id = parseInt(this.$route.query.id);
      // console.log(this.id);
      this.getDetail();
    },
    methods: {
      // 点击查看大图
      look_big_pic() {
        ImagePreview({
          images: this.detail.pics,
          startPosition: this.index,
          onClose() {
            // do something
          }
        })
      },
      // 获取详情信息
      getDetail() {
        this.utils.ajax(this, 'api/collectDetail', { collect_id: this.id }).then(obj => {
          this.utils.aliyun_format(obj.pics);
          this.utils.aliyun_format(obj, 'audio_url');
          // console.log(obj);
          this.detail = obj;
        })
      }
    }
  };
</script>

<style lang="scss" scoped>
  .detail {
    overflow: hidden;

    .bg-color {
      background-color: #ffffff;
      /*background-color: rgb(241, 243, 244);*/
    }

    /*轮播图*/
    .swiper-box {
      position: relative;
      border-radius: 15px;
      overflow: hidden;
      margin: 24px;
      width: calc(100% - 48px);
      height: 600px;

      .swiper {
        width: 100%;
        height: 100%;

        .swiper-item {
          width: 100%;
          height: 100%;
          background-repeat: no-repeat;
          background-position: center;
          background-size: cover;
        }
      }

      .img {
        width: 100%;
        height: 100%;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
      }

      h3 {
        position: absolute;
        height: 100px;
        bottom: 0;
        left: 0;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.4);
        display: flex;
        align-items: center;
        color: #ffffff;
        font-size: 34px;
        z-index: 2;
        font-weight: normal;

        p {
          padding: 0 26px;
          box-sizing: border-box;
          flex-grow: 1;
          position: relative;

          &:before {
            position: absolute;
            right: 1px;
            top: 50%;
            transform: translateY(-50%);
            content: '';
            height: 80%;
            width: 2px;
            background-color: #ffffff;
          }
        }

        .icon {
          width: 100px;
          height: 100px;
          flex-shrink: 0;
          display: flex;
          justify-content: center;
          align-items: center;

          img {
            width: 40px;
            height: 36px;
          }
        }
      }
    }

    /*音频播放*/
    .audio-box {
      height: 100px;
      margin: 24px;
      border-radius: 50px;
      overflow: hidden;

      .not-audio {
        font-size: 30px;
        display: flex;
        align-items: center;
        height: 100%;
        margin: 0 30px;
        color: #666666;
      }
    }

    /*藏品属性*/
    .attr {
      margin: 24px;
      border-radius: 15px;
      padding: 31px 23px;
      box-sizing: border-box;

      .attr-item {
        border-bottom: 2px solid rgb(254, 249, 244);
        display: flex;
        height: 80px;
        align-items: center;

        &:last-child {
          border-bottom: none;
        }

        p {
          font-size: 26px;
          flex-grow: 1;
          color: #333333;

          &.label {
            flex-shrink: 0;
            flex-grow: unset;
            width: 150px;
          }
        }
      }
    }

    /*藏品简介*/
    .intro {
      margin: 24px;
      padding: 23px;
      box-sizing: border-box;
      border-radius: 15px;

      h3 {
        font-size: 34px;
        color: #333333;
        margin: 20px 0;
      }

      p {
        white-space: pre-wrap;
        text-align: justify;
        font-size: 26px;
        line-height: 70px;
        color: #333333;
      }
    }
  }
</style>
