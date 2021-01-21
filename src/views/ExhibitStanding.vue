<template>
  <div class="exhibit-standing page">

    <!--冀东三枝花-->
    <div class="three-box white">
      <div class="title"><h1>冀东三枝花</h1></div>
      <div class="tab-box">
        <div class="tab" :class="tab===0?'on':''" @click="tab_click(0)">唐山皮影</div>
        <div class="tab" :class="tab===1?'on':''" @click="tab_click(1)">评剧百年</div>
        <div class="tab" :class="tab===2?'on':''" @click="tab_click(2)">乐亭大鼓</div>
      </div>

      <div class="swiper-box">
        <swiper class='three-swiper' :options="threeSwiper" v-if="three.length>1">

          <swiper-slide v-for="(item, index) in three" :key="index" class="three-swiper-item"
                        :class="tab===index?'show':''">
            <div class="cont" :style="'background-image: url('+item.pic+')'">
              <div class="cont-top">
                <h3>{{item.title}}</h3>
                <span>展览地点：{{item.address}}</span>
                <p>{{item.desc}}</p>
                <div class="p-box" v-if="item.poetry.length">
                  <p v-for="(v,i) in item.poetry" :key="'poetry'+i">{{v}}</p>
                </div>
              </div>
              <div class="more three-more">
                <router-link :to="{path:'/detail_exhibit',query:{id:1}}">查看详情</router-link>
              </div>
            </div>
          </swiper-slide>

        </swiper>
      </div>

    </div>
    <!--唐山历史-->
    <div class="history white">
      <div class="title"><h1>唐山历史</h1></div>
      <span>展览地点：唐山博物馆B馆一、二层</span>
      <div class="history-img"><img :src="history_img"/></div>
      <p>历史静下来。</p>
      <p>时间在这里凝固。</p>
      <p>让我们的目光穿越古老的时空，从石器的打磨痕迹，陶罐的简朴纹饰，青铜的斑斑锈蚀中，追溯和感悟先民们曾经拥有怎样美丽的怀想，书写出岁月的华彩篇章。</p>
      <p>《唐山历史文化陈列》仿佛一部徐徐展开的立体史书——它以13472平方公里的土地为背景，山地、平原、大海铺展开辽阔的地理版图；它以4万年的悠长岁月为主题，古代、近代、当代记录下遥远的日落日出。</p>
      <p>认识自己，就从认识我们脚下的土地开始；</p>
      <p>认识未来，就从认识我们的历史开始……</p>
      <div class="more standing-more">
        <router-link :to="{path:'/detail_exhibit',query:{id:4}}">查看详情</router-link>
      </div>
    </div>
    <!--馆藏艺术品-->
    <div class="art white">
      <div class="title"><h1>馆藏艺术品</h1></div>
      <div class="minit-title">《馆藏艺术品》陈列共分为《潘绍棠捐赠雕塑作品陈列》、《凌寒轩珍藏书画选》、《李远、陈大远先生书画作品》以及国内知名书画家捐赠的作品四部分组成。</div>

      <ul>
        <li :class="art_on===1?'on':''" @click="art_on=1">
          <h3><p><span>第一部分</span>《潘绍棠捐赠雕塑作品陈列》</p><i></i></h3>
          <div class="p-bg" :style="'background-image:url('+art_bg+')'">
            <p>展品均为著名雕塑家、广州美术学院教授潘绍棠先生创作的雕塑、绘画等。</p>
          </div>
        </li>
        <li :class="art_on===2?'on':''" @click="art_on=2">
          <h3><p><span>第二部分</span>《凌寒轩珍藏书画选》</p><i></i></h3>
          <div class="p-bg" :style="'background-image:url('+art_bg+')'">
            <p>此部分展出新华社记者、高级编辑贾靖宏先生捐赠的中国当代知名书画家作品。</p>
          </div>
        </li>
        <li :class="art_on===3?'on':''" @click="art_on=3">
          <h3><p><span>第三部分</span>《李远、陈大远先生书画作品》</p><i></i></h3>
          <div class="p-bg" :style="'background-image:url('+art_bg+')'">
            <p>由唐山书画院前院长李远先生绘画，著名书法家、作家陈大远先生撰写诗词，是诗、书、画的完美组合。</p>
          </div>
        </li>
        <li :class="art_on===4?'on':''" @click="art_on=4">
          <h3><p><span>第四部分</span>国内知名书画家捐赠的作品</p><i></i></h3>
          <div class="p-bg" :style="'background-image:url('+art_bg+')'">
            <p>如杨再春、唐勇力、陶然、祁海峰等。</p>
          </div>
        </li>
      </ul>
      <div class="more standing-more">
        <router-link :to="{path:'/detail_exhibit',query:{id:5}}">查看详情</router-link>
      </div>
    </div>
  </div>
</template>

<script>
  import { Swiper, SwiperSlide } from 'vue-awesome-swiper'
  import 'swiper/css/swiper.css'

  var _self, swiper, flag = false;

  export default {
    components: {
      'swiper': Swiper,
      'swiper-slide': SwiperSlide
    },
    data() {
      return {
        tab: 0,
        threeSwiper: {
          loop: true,
          centeredSlides: true,
          slidesPerView: 'auto',
          speed: 1000,
          spaceBetween: 20,
          on: {
            init() {
              swiper = this;
            }, slideChange() {
              if (flag)
                _self.tab = this.realIndex;
              flag = true;
            }
          }
        },
        three: [
          {
            title: '《唐山皮影》',
            address: "唐山博物馆A馆东半区",
            desc: '皮影是一种集民间美术、音乐、舞蹈、说唱为一体的傀儡戏剧表演艺术。全国很多地区都有分布，并且各具特色，异彩纷呈。唐山皮影是其中影响较大的一支。著名戏剧史学家周贻白先生曾经这样评价唐山皮影：“因为熟在人口的关系，几乎成为一般影戏的代称。”足见其在中国皮影戏中的影响和地位。唐山皮影也被称为“乐亭影”、“滦州影”、“驴皮影”等，与评剧、乐亭大鼓并称为“冀东文艺三枝花”。2006年被列入国家非物质文化遗产。有道是：\n\n',
            poetry: ['滦河水 越千秋', '驴皮影伴它岁岁流', '五尺影窗唱千古', '唱的名声贯九州'],
            pic: this.config.aliyun + 'ts-static/wap/bg-standing1.png',
          }, {
            title: '《评剧百年》',
            address: "唐山博物馆A馆内西部偏南",
            desc: '评剧是我国戏曲百花园中一朵靓丽的奇葩。她根系唐山这片沃土，从梆子、皮影、大鼓、秧歌等异彩纷呈的民间艺术中汲取营养、萌芽和发展。她从莲花落的音韵中流转至今，历经风雨百年。她以淳朴的声腔、悠扬的管弦演绎人生百态；她以动听的旋律、曲折的故事述说世间悲欢。\n\n',
            poetry: ['《评剧百年》，追溯评剧历史；', '《评剧百年》，关注评剧传承；', '《评剧百年》，祝福评剧辉煌！'],
            pic: this.config.aliyun + 'ts-static/wap/bg-standing2.png',
          }, {
            title: '《乐亭大鼓》',
            address: "唐山博物馆",
            desc: '乐亭大鼓原名“乐亭腔”，也叫“乐亭调”，是中国北方的一个主要曲种，因产生于河北省乐亭县而得名。对此，傅惜华在《曲艺论丛》中有如下记载:“乐亭大鼓简称乐亭调，为北方俗曲鼓词之一种，产生于乐亭县，故名。”乐亭大鼓以唱词典雅，演唱规范，曲牌丰富，腔调优美，板式灵活，表演细腻著称曲坛。由于它具有较高的艺术价值，特色鲜明，流传广泛，影响较大，2006年被列入首批国家非物质文化遗产名录，成为重点保护对象。',
            poetry: [],
            pic: this.config.aliyun + 'ts-static/wap/bg-standing3.png',
          },
        ],

        history_img: this.config.aliyun + 'ts-static/wap/img-history.png',
        art_bg: this.config.aliyun + 'ts-static/wap/bg-nav.jpg',
        art_on: 1//当前馆藏艺术品显示标志
      };
    },
    mounted() {
      _self = this;
    },
    methods: {
      tab_click(index) {
        this.tab = index;
        swiper.slideToLoop(index);
      }
    }
  };
</script>

<style lang="scss" scoped>
  .exhibit-standing {
    overflow: hidden;

    .standing-more {
      margin: 66px auto 48px;
    }

    .three-box {
      margin-top: 2px;
      padding: 6px 0 0;
      overflow: hidden;

      .tab-box {
        margin-top: 15px;
        display: flex;
        justify-content: center;
        align-items: center;

        .tab {
          font-size: 28px;
          color: #666666;
          margin: 0 25px;
          padding-bottom: 24px;

          &.on {
            position: relative;
            color: #ddaf71;

            &:before {
              content: '';
              display: block;
              width: 100%;
              height: 4px;
              background-color: #ddaf71;
              border-radius: 2px;
              position: absolute;
              bottom: 0;
              left: 0;
            }
          }
        }
      }

      .swiper-box {
        width: 100%;
        height: 1018px;
        margin: 40px 0 0;

        .three-swiper {
          width: 100%;
          height: 100%;

          .three-swiper-item {
            width: 600px;
            height: 929px;
            display: flex;
            align-items: center;

            &.show {
              box-shadow: 0 10px 25px 0 rgba(182, 182, 182, 0.46);
              border-radius: 10px;

              .cont {
                background-color: #ffffff;
                height: 100%;
              }
            }

            .cont {
              height: 843px;
              padding: 0 34px;
              display: flex;
              flex-flow: column;
              align-items: center;
              background-color: #eeeeee;
              justify-content: space-between;
              background-position: right bottom;
              background-repeat: no-repeat;
              background-size: 185px;
              transition: 1s;

              .cont-top {
                display: flex;
                flex-flow: column;
                align-items: center;
              }

              h3 {
                font-size: 34px;
                color: #333333;
                margin-top: 51px;
              }

              span {
                display: block;
                margin: 38px 0;
                font-size: 28px;
                color: #cf903a;
              }

              p {
                font-size: 26px;
                color: #666666;
                text-align: justify;
                text-indent: 2em;
                white-space: pre-line;
              }

              .p-box {
                p {
                  text-indent: unset;
                  text-align: center;
                }
              }

              .three-more {
                margin-bottom: 40px;
                background-image: url("../assets/bgs/btn-white-yellow-260.png");

                a {
                  color: #cf903a;
                }
              }
            }
          }
        }
      }
    }

    .history {
      margin-top: 14px;
      padding: 0 24px;
      overflow: hidden;

      span {
        display: block;
        text-align: center;
        margin: 6px 0 39px;
        font-size: 28px;
        color: #666666;
      }

      .history-img {
        margin-bottom: 39px;
        transition: 0.5s;
      }

      p {
        font-size: 26px;
        color: #666666;
        line-height: 39px;
        text-align: center;
      }
    }

    .art {
      margin: 14px 0;
      padding: 0 24px;
      overflow: hidden;

      .minit-title {
        text-indent: 2em;
        font-size: 26px;
        color: #666666;
      }

      ul {
        margin-top: 49px;
        li {
          border: solid 2px #cf903a;
          margin-bottom: 24px;
          height: 100px;
          overflow: hidden;
          transition: 0.5s;

          h3 {
            height: 100px;
            padding: 0 20px 0 24px;
            display: flex;
            align-items: center;
            font-weight: 400;
            transition: 0.5s;
            justify-content: space-between;

            p {
              transition: 0.5s;
              font-size: 28px;
              color: #333333;

              span {
                display: block;
                font-size: 26px;
              }
            }

            i {
              width: 41px;
              height: 26px;
              background-image: url("../assets/icons/s-nav-open.png");
              background-size: 100% 100%;
              background-repeat: no-repeat;
            }
          }

          .p-bg {
            height: calc(100% - 100px);

            p {
              height: 100%;
              font-size: 26px;
              color: #cf903a;
              padding: 39px 25px;
              box-sizing: border-box;
              background-image: url("../assets/border/border-bottom.png");
              background-position: bottom;
              background-repeat: no-repeat;
              background-size: 100%;
            }
          }

          &.on {
            height: 310px;

            h3 {
              background-color: #cf903a;

              p {
                color: #ffffff;
              }
              i{
                background-image: url("../assets/icons/arrow-white.png");
              }
            }
          }
        }
      }
    }
  }
</style>
