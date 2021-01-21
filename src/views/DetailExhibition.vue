<template>
  <div class="detail-exhibit page">
    <div class="banner"><img :src="detail.cover"/></div>
    <div class="attr white">
      <h3>{{detail.title}}</h3>
      <p><span>展览类型：</span>{{detail.tag}}</p>
      <p><span>展览开始时间：</span>{{detail.start_time}}</p>
      <p><span>展览地点：</span>{{detail.address}}</p>
    </div>
    <div class="brief white">
      <h1>展览详情</h1>
      <p>{{detail.desc}}</p>
    </div>
    <div class="exhibits white">
      <h1>精彩展品</h1>
      <div class="exhibition-swiper-box">
        <swiper class='exhibition-swiper' :options="exhibitionSwiper" v-if="detail.collect_list.length>1">

          <swiper-slide v-for="(item, index) in detail.collect_list" :key="index" class="exhibition-swiper-item">
            <div @click="to_detail(item.id)" class="exhibition-item">
              <div class="img" :style="'background-image: url('+item.pic+')'"></div>
              <p class="one-line-ellipsis">{{item.title}}</p>
            </div>
          </swiper-slide>

        </swiper>
      </div>
    </div>

    <div class="exhibit-hall white" v-if="detail.pics.length>0">
      <h1>展厅内景</h1>
      <ul>
        <li v-for="(item,index) in detail.pics" :key="'hall'+index"
            :style="'background-image: url('+item+')'" @click="look_big_pic(index)"></li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
  import 'swiper/css/swiper.css'
  import { ImagePreview } from 'vant'

  export default {
    components: {
      'swiper': Swiper,
      'swiper-slide': SwiperSlide
    },
    data() {
      return {
        id: 0,
        detail: { pics: [], collect_list: [] },//展览简介};
        //精彩展品轮播图配置
        exhibitionSwiper: {
          autoHeight: true,
          slidesPerView: 1.8,
          spaceBetween: 7
        },
      }
    },
    mounted() {
      this.id = parseInt(this.$route.query.id);
      if (this.id === 2 || this.id === 3)
        this.id = 1;
      this.getDetail();
    },
    // 跳转本页时参数变化后重新调取新闻公告详情数据
    // beforeRouteUpdate(to, from, next) {
    //   this.id = parseInt(to.query.id);
    //   if (this.id === 2 || this.id === 3)
    //     this.id = 1;
    //   this.getDetail();
    //   window.scrollTo({
    //     top: 0,
    //     behavior: "instant"
    //   });
    //   next()
    // },
    methods: {
      // 点击查看大图
      look_big_pic(index) {
        ImagePreview({
          images: this.detail.pics,
          startPosition: index,
          onClose() {
            // do something
          }
        })
      },
      to_detail(id) {
        this.$router.push({ name: 'detail_collect', query: { id: id } });
      },
      getDetail() {
        this.utils.ajax(this, 'api/displayDetail', { display_id: this.id }).then(res => {
          this.utils.aliyun_format(res, 'cover');
          this.utils.aliyun_format(res.pics,);
          this.utils.aliyun_format(res.collect_list, 'pic');
          res.start_time = this.utils.date_format(res.start_time, 'yyyy.MM.dd');
          this.detail = res;
          console.log(res);
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .detail-exhibit {
    h1 {
      font-size: 40px;
      color: #333333;
      margin: 29px 24px 40px;
    }

    .attr {
      padding: 40px 24px;
      overflow: hidden;

      h3 {
        font-size: 34px;
        color: #333333;
        font-weight: normal;
        opacity: 0.9;
        margin-bottom: 60px;
      }

      p {
        font-size: 26px;
        color: #333333;
        opacity: 0.9;
        margin-bottom: 20px;

        span {
          color: #666666;
        }
      }
    }

    .brief {
      overflow: hidden;
      margin-top: 14px;

      p {
        margin: 47px 24px 67px;
        text-align: justify;
        white-space: pre-line;
        font-size: 28px;
        color: #666666;
      }
    }

    .exhibits {
      margin-top: 14px;
      overflow: hidden;

      .exhibition-swiper-box {
        margin: 0 0 30px 24px;

        .exhibition-swiper {
          width: 100%;

          .exhibition-swiper-item {
            &:last-child {
              .exhibition-item {
                margin-right: 24px;
              }
            }

            .exhibition-item {
              .img {
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
                height: 267px;
                border-radius: 10px;
                display: flex;
                align-items: flex-end;
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

    .exhibit-hall {
      margin-top: 14px;
      margin-bottom: 14px;
      overflow: hidden;

      ul {
        margin: 49px 24px 54px;
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;

        li {
          width: 339px;
          height: 226px;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          margin-bottom: 24px;
          border-radius: 10px;
          border: 2px solid #efefef;
          box-sizing: border-box;
        }
      }
    }
  }
</style>
