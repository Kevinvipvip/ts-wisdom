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
        <router-link to="/collection" class="btn more">查看更多<img src="../assets/icon-right.png"></router-link>
      </div>
      <div class="collect-swiper-box">
        <swiper class='collect-swiper' :options="collectSwiper" v-if="collection.length>1">

          <swiper-slide v-for="(item, index) in collection" :key="index" class="collect-swiper-item">
            <router-link :to="{path:'/collect-detail',query:{id:item.id}}" tag="div" class="collect-item">
              <div class="img" :style="'background-image: url('+item.cover+')'"></div>
              <p class="one-line-ellipsis">{{item.title}}</p>
            </router-link>
          </swiper-slide>

        </swiper>
      </div>
    </div>

    <!--新闻资讯-->
    <div class="news-box white">
      <div class="home-title"><span>新闻资讯</span>
        <router-link to="/news" class="btn more">查看更多<img src="../assets/icon-right.png"></router-link>
      </div>
      <ul>
        <router-link :to="{path:'/new-detail',query:{id:item.id}}" tag="li" v-for="(item,index) in news" :key="index">
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
        <!--<router-link to="/about" class="btn more">查看更多<img src="../assets/icon-right.png"></router-link>-->
      </div>
      <div class="brief-img"><img :src="about.brief_img" alt=""></div>
      <p>{{about.intro_desc}}</p>
    </div>

    <!--footer-->
    <div class="footer">
      <div class="logo"><img :src="about.logo" alt=""></div>
      <div class="cont">
        <p>地址：{{about.address}}</p>
        <p>官网：<a href="http://www.tsmuseum.com">http://www.tsmuseum.com</a></p>
        <p>电话：{{about.tel}}</p>
      </div>
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

        collection: [],
        //首页馆藏轮播图配置
        collectSwiper: {
          slidesPerView: 2.4,
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
          // console.log(obj.count);
          // console.log(obj.list);
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
          obj.brief_img = this.config.aliyun + 'ts-static/img-brief-home.jpg';
          this.about = obj;
          // console.log(obj)
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

        &.more {
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
        height: 250px;
        margin: 0 0 30px 24px;

        .collect-swiper {
          width: 100%;
          height: 100%;

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

    /*footer*/
    .footer {
      height: 300px;
      display: flex;
      justify-content: center;
      align-items: center;

      .logo {
        width: 156px;
        margin-right: 71px;
      }

      .cont {
        p {
          font-size: 24px;
          margin: 30px 0;
          color: #333333;
        }
      }
    }
  }
</style>
