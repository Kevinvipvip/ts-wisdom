<template>
  <div class="academic page">
    <!--学术资讯-->
    <div class="article white">
      <div class="title"><h1>学术资讯</h1></div>
      <div class="cont">
        <div class="item" v-for="(item,index) in article" :key="'article'+index"
             @click="choise_standing(item.id,index)">
          <h3 class="two-line-ellipsis">{{item.title}}</h3>
          <p>{{item.create_time}}</p>
        </div>
      </div>
      <div class="more academic-more">
        <router-link to="/study_article">查看更多</router-link>
      </div>
    </div>

    <!--出版书籍-->
    <div class="books white">
      <div class="title"><h1>出版书籍</h1></div>
      <div class="books-swiper-box">
        <swiper class='books-swiper' :options="booksSwiper" v-if="books.length>1">

          <swiper-slide v-for="(item, index) in books" :key="index" class="books-swiper-item">
            <div class="books-item">
              <div class="img" :style="'background-image: url('+item.pic+')'"></div>
              <p class="one-line-ellipsis">{{item.title}}</p>
            </div>
          </swiper-slide>

        </swiper>
      </div>
      <div class="more academic-more">
        <router-link to="/books">查看更多</router-link>
      </div>
    </div>

    <!--学术委员会-->
    <div class="study-council white">
      <div class="title"><h1>学术委员会</h1></div>
      <div class="cont" :style="'background-image: url('+study_img+')'">
        <p>
          唐山博物馆学术委员会是唐山博物馆为实现学术发展宗旨而设立的专业性学术指导机构。学术委员会由馆内在职高级职称职工及外聘馆外高水平专家、学者组成，具体负责学会学术科研发展规划、工作计划的组织实施；学术科研活动的组织、指导、咨询和监督；教育科学研究成果的鉴定、评审、推广普及工作。</p>
        <div class="more academic-more study">
          <router-link to="/committee">查看更多</router-link>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
  import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
  import 'swiper/css/swiper.css'

  export default {
    components: {
      'swiper': Swiper,
      'swiper-slide': SwiperSlide
    },
    data() {
      return {
        study_img: this.config.aliyun + 'ts-static/wap/bg-study-council.png',
        article: [],//学术资讯
        books: [],//出版书籍
        //出版书籍轮播图配置
        booksSwiper: {
          autoHeight: true,
          slidesPerView: 3.5,
          spaceBetween: 15
        },
      };
    },
    mounted() {
      this.getStudyArticleList();
      this.getStudyBookList();
    },
    methods: {
      // 获取学术资讯列表
      getStudyArticleList() {
        this.utils.ajax(this, 'study/studyArticleList', { page: 1, perpage: 4 }).then(res => {
          for (let i = 0; i < res.list.length; i++) {
            res.list[i].create_time = this.utils.date_format(new Date(res.list[i].create_time), 'yyyy.MM.dd');
          }
          this.article = res.list;
        });
      },

      // 获取出版书籍列表
      getStudyBookList() {
        this.utils.ajax(this, 'study/studyBookList').then(res => {
          this.utils.aliyun_format(res.list);
          this.books = res.list;
        });
      },
    }
  };
</script>

<style lang="scss" scoped>
  .academic {
    overflow: hidden;

    .academic-more {
      margin: 60px auto 40px;

      &.study {
        background-image: url("../assets/bgs/btn-yellow-260.png");
        margin-top: 109px;

        a {
          color: #ffffff;
        }
      }
    }

    /*学术资讯*/
    .article {
      overflow: hidden;
      margin-top: 12px;
      padding: 0 24px;

      .cont {
        margin-left: 42px;

        .item {
          margin-top: 40px;
          border-bottom: 2px solid #cf903a;
          position: relative;

          &:first-child {
            margin-top: 6px;
          }

          &:before {
            content: '';
            position: absolute;
            top: 6px;
            left: -42px;
            display: block;
            width: 17px;
            height: 28px;
            background-image: url("../assets/icons/arrow-right.png");
            background-position: center;
            background-repeat: no-repeat;
            background-size: 100% 100%;
          }

          h3 {
            font-size: 28px;
            color: #333333;
            font-weight: normal;
          }

          p {
            font-size: 20px;
            color: #999999;
            margin: 29px 0 24px;
          }
        }
      }
    }

    /*出版书籍*/
    .books {
      overflow: hidden;
      margin-top: 14px;

      .books-swiper-box {
        margin: 0 0 30px 24px;

        .books-swiper {
          width: 100%;

          .books-swiper-item {
            &:last-child {
              .books-item {
                margin-right: 24px;
              }
            }

            .books-item {
              .img {
                background-size: cover;
                background-position: center;
                background-repeat: no-repeat;
                height: 255px;
                border-radius: 10px;
              }

              p {
                text-align: center;
                margin-top: 16px;
                color: #333333;
                font-size: 28px;
              }
            }
          }
        }
      }
    }

    /*学术委员会*/
    .study-council {
      margin-top: 14px;
      overflow: hidden;
      padding: 0 24px 43px;

      .cont {
        margin-top: 13px;
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: bottom;
        overflow: hidden;

        p {
          font-size: 26px;
          color: #666666;
          margin: 39px 25px;
        }
      }
    }
  }
</style>
