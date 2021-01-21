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
    <div class="audio-box white">
      <mine-audio :url="detail.audio_url" v-if="detail.audio_url" color="#cf903a"></mine-audio>
      <div class="not-audio" v-else>暂无音频解说</div>
    </div>

    <!--文物属性-->
    <div class="attr white">
      <h3>{{detail.title}}</h3>
      <p><span>年代：</span>{{detail.dynasty}}</p>
      <p><span>类别：</span>{{detail.cate_name}}</p>
      <p><span>尺寸：</span>{{detail.size}}</p>
      <p><span>来源：</span>{{detail.origin}}</p>
    </div>

    <!--藏品简介-->
    <div class="intro white" v-if="detail.desc">
      <h3>藏品简介</h3>
      <p>{{detail.desc}}</p>
    </div>

    <!--相关展览-->
    <div class="about-exhibit white" v-if="detail.display">
      <h3>相关展览</h3>
      <div class="img" @click="collect_detail_to_jump(1,detail.display.id)"
           :style="'background-image: url('+detail.display.cover+')'"></div>
      <h4>{{detail.display.title}}</h4>
      <p>展览类型：{{detail.display.tag}}</p>
    </div>
    <!--相关文物-->
    <div class="about-collect white" v-if="detail.relation_list.length>0">
      <h3>相关文物</h3>
      <div class="collect-swiper-box">
        <swiper class='collect-swiper' :options="collectSwiper" v-if="detail.relation_list.length>1">

          <swiper-slide v-for="(item, index) in detail.relation_list" :key="index" class="collect-swiper-item">
            <div @click="collect_detail_to_jump(2,item.id)" class="collect-item">
              <div class="img" :style="'background-image: url('+item.pic+')'"></div>
              <p class="one-line-ellipsis">{{item.title}}</p>
            </div>
          </swiper-slide>

        </swiper>
      </div>
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

        detail: { pics: [],relation_list:[] },//当前藏品的详情信息
        detail_swiper: {
          autoplay: {
            delay: 4000,
            stopOnLastSlide: false,
            disableOnInteraction: false,
          },
          on: {
            slideChange() {
              _self.index = this.realIndex;
            }
          }
        },//藏品详情轮播图配置
        //相关文物轮播图配置
        collectSwiper: {
          autoHeight:true,
          slidesPerView: 2.4,
          spaceBetween: 7
        },
      };
    },
    beforeRouteUpdate(to, from, next) {
      this.id = parseInt(to.query.id);
      this.getDetail();
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
      next();
    },
    mounted() {
      _self = this;
      this.id = parseInt(this.$route.query.id);
      this.getDetail();
    },
    methods: {
      collect_detail_to_jump(type, id) {
        if (type === 1) {
          this.$router.push({ name: 'detail_exhibit', query: { id: id } });
        } else {
          this.$router.replace({ name: 'detail_collect', query: { id: id } });
        }
      },
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
          this.utils.aliyun_format(obj.display, 'cover');
          this.utils.aliyun_format(obj.relation_list, 'pic');
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
    /*轮播图*/
    .swiper-box {
      position: relative;
      overflow: hidden;
      /*margin: 24px;*/
      /*width: calc(100% - 48px);*/
      height: 500px;

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
      height: 140px;
      padding: 0 24px;
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
      margin-top: 14px;
      /*border-radius: 15px;*/
      padding: 40px 24px;
      box-sizing: border-box;

      h3 {
        font-size: 34px;
        margin-bottom: 60px;
        font-weight: 400;
      }

      p {
        font-size: 26px;
        color: #333333;
        margin-bottom: 25px;

        span {
          color: #666666;
        }
      }
    }

    /*藏品简介*/
    .intro {
      margin-top: 14px;
      padding: 29px 24px 67px;
      box-sizing: border-box;
      border-radius: 15px;

      h3 {
        font-size: 40px;
        color: #333333;
        font-weight: 400;
        margin-bottom: 48px;
      }

      p {
        white-space: pre-wrap;
        text-align: justify;
        font-size: 28px;
        line-height: 42px;
        color: #666666;
      }
    }

    /*相关展览*/
    .about-exhibit {
      margin-top: 14px;
      padding: 30px 24px;

      h3 {
        font-size: 40px;
        color: #333333;
        font-weight: 400;
        margin-bottom: 48px;
      }

      .img {
        margin-top: 51px;
        height: 468px;
        background-color: #000000;
        border-radius: 10px;
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
      }

      h4 {
        font-size: 28px;
        color: #333333;
        font-weight: normal;
        margin: 20px 0 17px;
      }

      p {
        font-size: 24px;
        color: #999999;
      }
    }

    /*相关文物*/
    .about-collect {
      margin-top: 14px;
      margin-bottom: 14px;
      padding: 30px 0;

      h3 {
        font-size: 40px;
        color: #333333;
        font-weight: 400;
        margin: 0 24px 48px;
      }

      .collect-swiper-box {
        margin: 0 0 30px 24px;

        .collect-swiper {
          width: 100%;

          .collect-swiper-item {
            &:last-child {
              .collect-item {
                margin-right: 24px;
              }
            }

            .collect-item {
              .img {
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
                height: 200px;
                border-radius: 10px;
              }

              p {
                margin-top: 16px;
                color: #333333;
                font-size: 28px;
              }
            }
          }
        }
      }
    }
  }
</style>
