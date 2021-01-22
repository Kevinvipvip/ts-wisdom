<template>
  <div class="service page">
    <!--参观须知-->
    <div class="notice white">
      <div class="title"><h1>参观须知</h1></div>
      <div class="notice-cont">{{notice}}</div>
      <div class="btn-box">
        <div class="more explain">
          <router-link to="/explain">讲解预约说明</router-link>
        </div>
        <div class="more ticket">
          <router-link to="/ticket">门票预约</router-link>
        </div>
      </div>
    </div>
    <!--活动预约-->
    <div class="active white">
      <div class="title"><h1>活动预约</h1></div>
      <ul>
        <li v-for="(item,index) in active" :key="'active'+index" @click="to_active_detail(item.id)">
          <div class="item-cont">
            <h3 :class="index===0?'one-line-ellipsis':'two-line-ellipsis'"> {{item.title}}</h3>
            <span>{{item.start_time}} - {{item.end_time}}</span>
            <p>{{item.address}}</p>
          </div>
          <div class="img" :style="'background-image: url('+item.pic+')'">
            <div class="tip" v-if="item.type===1">{{item.state}}</div>
          </div>
        </li>
      </ul>
      <div class="more service-more">
        <router-link to="/activity">查看更多</router-link>
      </div>
    </div>
    <!--交通路线-->
    <div class="traffic white" ref="traffic">
      <div class="title"><h1>交通路线</h1></div>
      <p>唐山博物馆坐落在美丽的凤凰山公园内，东临龙泽路，北临北新道。</p>
      <p>公交线路有5路、15路、16路、27路、37路、77路可达，站点名称：唐山博物馆。</p>
      <p>2020年唐山建成纵贯整个城市的超级绿道，途经唐山博物馆。唐山博物馆设有免费停车场供观众使用。</p>
      <div class="navigation">
        <div class="logo"><img src="../assets/map-logo.png"/></div>
        <div class="p-box">
          <h3>唐山博物馆</h3>
          <span>唐山市路北区龙泽南路22号</span>
        </div>
        <div class="btn-navigation">
          <router-link to="/bd_map" class="map">导航</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        notice: '',//参观须知
        active: [],//活动预约
      };
    },
    beforeRouteUpdate(to, from, next) {
      if (parseInt(to.query.id) === 2) {
        window.scrollTo({
          top: this.$refs.traffic.offsetTop,
          behavior: "smooth"
        });
      } else {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      }
      this.getNotice();
      this.getActivityList();
      next();
    },
    mounted() {
      if (parseInt(this.$route.query.id) === 2) {
        window.scrollTo({
          top: this.$refs.traffic.offsetTop,
          behavior: "smooth"
        });
      } else {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
      }
      this.getNotice();
      this.getActivityList();
    },
    methods: {
      // 点击前往活动预约详情
      to_active_detail(id) {
        this.$router.push({ name: 'detail_activity', query: { id: id } });
      },

      // 获取参观须知
      getNotice() {
        this.utils.ajax(this, 'api/aboutUs').then(res => {
          this.notice = res.notice;
        });
      },

      // 获取活动预约列表
      getActivityList() {
        this.utils.ajax(this, 'activity/activityList', { page: 1, perpage: 4 }).then(res => {
          this.utils.aliyun_format(res.list);
          for (let i = 0; i < res.list.length; i++) {
            res.list[i].start_time = this.utils.date_format(res.list[i].start_time, 'yyyy.MM.dd');
            res.list[i].end_time = this.utils.date_format(res.list[i].end_time, 'yyyy.MM.dd');
          }
          this.active = res.list;
        });
      },
    }
  };
</script>

<style lang="scss" scoped>
  .service {
    padding-bottom: 14px;

    .service-more {
      margin: 60px auto 40px;
    }

    /*参观须知*/
    .notice {
      margin-top: 12px;
      overflow: hidden;

      .notice-cont {
        font-size: 26px;
        color: #666666;
        margin: 12px 25px 0;
        white-space: pre-line;
        text-align: justify;
      }

      .btn-box {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 63px 0 40px;

        .more {
          margin: 0 35px;

          &.explain {
            background-image: url("../assets/bgs/btn-white-yellow-260.png");

            a {
              color: #cf903a;
            }
          }

          &.ticket {
            background-image: url("../assets/bgs/btn-yellow-260.png");

            a {
              color: #ffffff;
            }
          }
        }
      }
    }

    /*活动预约*/
    .active {
      overflow: hidden;
      margin-top: 14px;
      padding: 0 24px;

      ul {
        li {
          display: flex;
          justify-content: flex-end;
          margin-top: 20px;

          &:first-child {
            position: relative;
            height: 468px;

            .img {
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              margin: 0;
              z-index: 1;
            }

            .item-cont {
              position: absolute;
              bottom: 0;
              left: 0;
              width: 100%;
              height: 60px;
              z-index: 2;
              background-color: rgba(0, 0, 0, 0.8);
              border-radius: 0px 0px 10px 10px;

              h3 {
                color: #ffffff;
                line-height: 60px;
                margin: 0 29px;
              }

              span, p {
                display: none;
              }
            }
          }

          .item-cont {
            flex-grow: 1;
            display: flex;
            flex-flow: column;
            justify-content: space-between;
            font-size: 24px;
            color: #999999;

            h3 {
              font-size: 28px;
              color: #333333;
              font-weight: normal;
            }
          }

          .img {
            margin-left: 34px;
            width: 240px;
            height: 160px;
            flex-shrink: 0;
            border-radius: 10px;
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
            display: flex;
            justify-content: flex-end;

            .tip {
              width: 87px;
              height: 38px;
              text-align: center;
              line-height: 38px;
              margin: 10px;
              background-color: rgba(0, 0, 0, 0.6);
              border-radius: 5px;
              font-size: 20px;
              color: #ffffff;
            }
          }
        }
      }
    }

    /*交通路线*/
    .traffic {
      margin-top: 14px;
      padding: 0 24px;
      overflow: hidden;

      p {
        font-size: 28px;
        color: #666666;
        margin-top: 40px;
      }

      .navigation {
        margin: 55px 0 60px;
        height: 124px;
        background-image: linear-gradient(270deg, #db9c47 0%, #cf903a 100%);
        border-radius: 10px;
        padding: 0 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .logo {
          width: 80px;
          height: 80px;
          flex-shrink: 0;
        }

        .p-box {
          color: #ffffff;
          flex-grow: 1;
          display: flex;
          flex-flow: column;
          justify-content: center;
          margin-left: 14px;

          h3 {
            font-weight: normal;
            font-size: 34px;
            margin-bottom: 15px;
          }

          span {
            font-size: 26px;
          }
        }

        .btn-navigation {
          width: 180px;
          height: 80px;
          border-radius: 40px;
          border: solid 2px #ffffff;
          overflow: hidden;

          a {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #ffffff;
            font-size: 28px;

            &:before {
              content: '';
              display: block;
              width: 24px;
              height: 29px;
              background-image: url('../assets/icons/gps.png');
              background-position: center;
              background-repeat: no-repeat;
              background-size: 100% 100%;
              margin-right: 15px;
            }
          }
        }
      }
    }
  }
</style>
