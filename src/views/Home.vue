<template>
  <div class="home page">
    <!--<div class="title">唐山博物馆</div>-->

    <!--轮播图-->
    <div class="swiper-box">
      <swiper class='swiper' :options="banner" v-if="swiper.length>1">

        <swiper-slide v-for="(item, index) in swiper" :key="index" class="swiper-item"
                      :style="'background-image: url('+item.pic+')'"></swiper-slide>
        <!--:style="'background-color: '+item.bg"></swiper-slide>-->
        <div class="swiper-pagination my-swiper-pagination" v-for="(item,index) in swiper" :key="index"
             slot="pagination"></div>
      </swiper>
    </div>

    <!--门票预约-->
    <div class="ticket-booking white">
      <div class="home-title"><span>门票预约</span>
        <router-link to="/ticket" class="btn">立即预约</router-link>
      </div>
      <p>【开放时间】<br> 周一全天 闭馆<br> 周二 - 周日9:00开馆-16:30停止检票-17:00闭馆<span>* 周一逢国家法定节假日全天开放，除夕、大年初一闭馆</span></p>
    </div>

    <!--精品馆藏-->
    <div class="collection white">
      <div class="home-title"><span>精品馆藏</span>
        <router-link to="/collection" class="btn home-more">查看更多<img src="../assets/icon-right.png"></router-link>
      </div>
      <div class="collect-swiper-box">
        <swiper class='collect-swiper' :options="collectSwiper" v-if="collection.length>1">

          <swiper-slide v-for="(item, index) in collection" :key="index" class="collect-swiper-item">
            <router-link :to="{path:'/detail_collect',query:{id:item.id}}" tag="div" class="collect-item">
              <div class="img" :style="'background-image: url('+item.cover+')'"></div>
              <p class="one-line-ellipsis">{{item.title}}</p>
            </router-link>
          </swiper-slide>

        </swiper>
      </div>
    </div>

    <!--活动预约-->
    <div class="activity white" v-if="activity.have_data">
      <div class="home-title"><span>活动预约</span>
        <router-link to="/activity" class="btn home-more">查看更多<img src="../assets/icon-right.png"></router-link>
      </div>

      <router-link tag="div" :to="{path:'/detail_activity',query:{id:activity.id}}" class="activity-cont">
        <div class="img" :style="'background-image: url('+activity.pic+')'">
          <div class="tip">{{activity.state}}</div>
        </div>
        <h2>
          <p class="one-line-ellipsis">{{activity.title}}</p>
          <span>活动时间：{{activity.start_time}} - {{activity.end_time}}</span>
        </h2>
      </router-link>

    </div>

    <!--精选展览-->
    <div class="exhibition white" v-if="exhibition.length>0">
      <div class="home-title"><span>精选展览</span>
        <router-link to="/exhibition" class="btn home-more">查看更多<img src="../assets/icon-right.png"></router-link>
      </div>
      <div class="exhibition-swiper-box">
        <swiper class='exhibition-swiper' :options="exhibitionSwiper" v-if="exhibition.length>1">

          <swiper-slide v-for="(item, index) in exhibition" :key="index" class="exhibition-swiper-item">
            <router-link :to="{path:'/detail_exhibit',query:{id:item.id}}" tag="div" class="exhibition-item">
              <div class="img" :style="'background-image: url('+item.cover+')'">
                <div class="exhibition-time">{{item.start_time}} - {{item.end_time}}</div>
              </div>
              <p class="one-line-ellipsis">{{item.title}}</p>
              <span>{{item.tag}}</span>
            </router-link>
          </swiper-slide>

        </swiper>
      </div>
    </div>

    <!--新闻资讯-->
    <div class="news-box white">
      <div class="home-title"><span>新闻资讯</span>
        <router-link to="/news" class="btn home-more">查看更多<img src="../assets/icon-right.png"></router-link>
      </div>
      <ul>
        <router-link :to="{path:'/detail_news',query:{id:item.id}}" tag="li" v-for="(item,index) in news" :key="index">
          <div class="cont">
            <h3 :class="index===0?'one-line-ellipsis':'two-line-ellipsis'">
              {{item.title}}</h3>
            <p><span>{{item.author}}</span><span>{{item.create_time}}</span></p>
          </div>
          <div class="img" :style="'background-image: url('+item.pic+')'"></div>
        </router-link>
      </ul>
    </div>

    <!--唐博简介-->
    <div class="brief-box white">
      <div class="home-title"><span>唐博简介</span>
        <router-link to="/about" class="btn home-more">查看更多<img src="../assets/icon-right.png"></router-link>
      </div>
      <div class="brief-img"><img :src="about.brief_img" alt=""></div>
      <p>{{about.intro_desc}}</p>
    </div>
  </div>
</template>

<script>
  import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
  import 'swiper/css/swiper.css'

  var _self;
  export default {
    name: 'Home',
    components: {
      'swiper': Swiper,
      'swiper-slide': SwiperSlide
    },
    data() {
      return {
        swiper: [],
        //首页顶部轮播图
        banner: {
          autoplay: {
            delay: 2000,
            stopOnLastSlide: false,
            disableOnInteraction: false,
          },
          speed: 800,
          direction: 'horizontal',
          //分页器设置
          pagination: {
            el: ".swiper-pagination",
            clickable: true,
            type: "bullets"
          },
          on: {
            click() {
              let url = _self.swiper[this.realIndex].url;
              _self.utils.jump(_self, url);
            }
          }
        },

        activity: { have_data: false },//活动预约

        collection: [],//精品馆藏
        //首页馆藏轮播图配置
        collectSwiper: {
          autoHeight: true,
          slidesPerView: 2.4,
          spaceBetween: 7
        },

        exhibition: [],//精选展览
        //首页精选展览轮播图配置
        exhibitionSwiper: {
          autoHeight: true,
          slidesPerView: 1.8,
          spaceBetween: 7
        },

        news: [],//新闻资讯列表
        about: {},//关于我们的数据
      }
    },
    mounted() {
      _self = this;
      this.getSlides();
      this.getCollectList();
      this.getActivityList();
      this.getDisplayDetail();
      this.getArticleList();
      this.getAboutUs();
    },
    methods: {
      //获取轮播图列表
      getSlides() {
        this.utils.ajax(this, 'api/slideList').then(arr => {
          this.utils.aliyun_format(arr, 'pic');
          this.swiper = arr;
        })
      },
      //获取精品馆藏列表
      getCollectList() {
        this.utils.ajax(this, 'api/collectList').then(obj => {
          this.utils.aliyun_format(obj.list, 'cover');
          this.collection = obj.list;
        });
      },
      //获取活动预约数据
      getActivityList() {
        this.utils.ajax(this, 'activity/activityList').then(obj => {
          this.utils.aliyun_format(obj.list, 'pic');
          obj.list[0].have_data = true;
          obj.list[0].start_time = this.utils.date_format(obj.list[0].start_time, 'yyyy.MM.dd');
          obj.list[0].end_time = this.utils.date_format(obj.list[0].end_time, 'yyyy.MM.dd');
          this.activity = obj.list[0];
          // console.log(obj.count);
          // console.log(obj.list);
        });
      },

      //获取精品展览列表
      getDisplayDetail() {
        this.utils.ajax(this, 'api/displayList').then(obj => {
          this.utils.aliyun_format(obj.list, 'cover');
          for (let i = 0; i < obj.list.length; i++) {
            obj.list[i].start_time = this.utils.date_format(obj.list[i].start_time, 'yyyy.MM.dd');
            if (obj.list[i].end_time === 0) {
              obj.list[i].end_time = '∞'
            } else {
              obj.list[i].end_time = this.utils.date_format(obj.list[i].end_time, 'yyyy.MM.dd');
            }
          }
          this.exhibition = obj.list;
        });
      },
      //获取新闻资讯列表
      getArticleList() {
        this.utils.ajax(this, 'api/articleList', { page: 1, perpage: 4 }).then(obj => {
          this.utils.aliyun_format(obj.list, 'pic');
          for (let i = 0; i < obj.list.length; i++) {
            obj.list[i].create_time = this.utils.date_format(new Date(obj.list[i].create_time).getTime(), 'yyyy-MM-dd');
          }
          this.news = obj.list;
          // console.log(obj.list);
        });
      },
      // 获取关于我们的后台数据
      getAboutUs() {
        this.utils.ajax(this, 'api/aboutUs').then(obj => {
          this.utils.aliyun_format(obj, 'logo');
          obj.brief_img = this.config.aliyun + 'ts-static/wap/img-brief-home.jpg';
          this.about = obj;
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .home {
    .home-title {
      font-size: 40px;
      color: #333333;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 29px 24px;
      font-weight: bold;

      .btn {
        font-weight: normal;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 150px;
        height: 60px;
        background-color: #d0a34d;
        border-radius: 10px;
        font-size: 26px;
        color: #ffffff;

        &.home-more {
          background-color: #ffffff;
          color: #d0a34d;
          width: auto;

          img {
            width: auto;
            height: 55%;
            margin-left: 10px;
          }
        }
      }
    }

    /*轮播图*/
    .swiper-box {
      height: 450px;

      .swiper {
        height: 100%;

        .swiper-item {
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
        }

        /deep/ .my-swiper-pagination {
          .swiper-pagination-bullet {
            width: 24px;
            height: 4px;
            border-radius: unset;
            background-color: rgba(0, 0, 0, 0.4);

            &.swiper-pagination-bullet-active {
              background-color: rgba(0, 0, 0, 1);
            }
          }
        }
      }
    }

    /*门票预约*/
    .ticket-booking {
      margin-top: 14px;
      background-image: url("../assets/bg-ticket-index.png");
      background-position: 95% 80%;
      background-repeat: no-repeat;
      background-size: 151px 142px;
      overflow: hidden;


      p {
        font-size: 26px;
        margin: 61px 24px 29px;
        line-height: 40px;

        span {
          display: block;
          color: #5cc66d;
        }
      }
    }

    /*精品馆藏*/
    .collection {
      overflow: hidden;
      margin-top: 14px;

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
              height: 100%;

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

    /*活动预约*/
    .activity {
      overflow: hidden;
      margin-top: 14px;

      .activity-cont {
        margin: 50px 24px 30px;

        .img {
          height: 468px;
          background-position: center;
          background-size: cover;
          background-repeat: no-repeat;
          border-radius: 10px;
          overflow: hidden;
          position: relative;

          .tip {
            position: absolute;
            right: 12px;
            top: 14px;
            padding: 9px 14px;
            font-size: 20px;
            color: #ffffff;
            border-radius: 5px;
            background: rgba(0, 0, 0, 0.4);
          }
        }

        h2 {
          font-weight: normal;
          font-size: 28px;
          color: #333333;
          margin-top: 20px;

          p {
            margin-bottom: 16px;
          }

          span {
            font-size: 24px;
            color: #999999;
          }
        }
      }
    }

    /*精选展览*/
    .exhibition {
      overflow: hidden;
      margin-top: 14px;

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
              /*height: 100%;*/

              .img {
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
                height: 267px;
                border-radius: 10px;
                display: flex;
                align-items: flex-end;

                .exhibition-time {
                  font-size: 20px;
                  color: #ffffff;
                  margin: 0 14px 14px 14px;
                  padding-left: 21px;
                  background-image: url("../assets/icons/icon-time.png");
                  background-size: 16px 16px;
                  background-repeat: no-repeat;
                  background-position: left;
                }
              }

              p {
                margin-top: 16px;
                color: #333333;
                font-size: 28px;
              }

              span {
                display: block;
                margin-top: 10px;
                font-size: 24px;
                color: #999999;
              }
            }
          }
        }
      }
    }

    /*新闻资讯*/
    .news-box {
      overflow: hidden;
      margin-top: 14px;

      ul {
        margin: 51px 24px 26px;

        li {
          display: flex;
          justify-content: space-between;
          height: 120px;
          margin-bottom: 24px;

          .cont {
            flex-grow: 1;
            height: 100%;
            display: flex;
            flex-flow: column;
            justify-content: space-between;

            h3 {
              font-size: 28px;
              color: #333333;
              line-height: 34px;
              font-weight: normal;
            }

            p {
              font-size: 24px;
              color: #999999;

              span {
                margin-right: 20px;
              }
            }
          }

          .img {
            margin-left: 28px;
            flex-shrink: 0;
            width: 240px;
            height: 100%;
            background-position: center;
            background-repeat: no-repeat;
            border-radius: 10px;
            background-size: cover;
          }

          &:first-child {
            position: relative;
            height: 350px;
            z-index: 1;

            .cont {
              position: absolute;
              bottom: 0;
              left: 0;
              width: 100%;
              height: 60px;
              z-index: 3;

              h3 {
                background-color: rgba(0, 0, 0, 0.6);
                height: 100%;
                width: 100%;
                line-height: 60px;
                padding: 0 25px;
                box-sizing: border-box;
                color: #ffffff;
              }

              p {
                display: none;
              }
            }

            .img {
              z-index: 2;
              position: absolute;
              margin: 0;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }

    /*唐博简介*/
    .brief-box {
      overflow: hidden;
      margin-top: 14px;

      .brief-img {
        margin: 52px 24px 21px;
        /*width: 100%;*/
      }

      p {
        margin: 0 24px 34px;
        font-size: 26px;
        color: #333333;
        line-height: 40px;
        text-indent: 2em;
        text-align: justify;
      }
    }
  }
</style>
