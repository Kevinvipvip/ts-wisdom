<template>
  <div class="ticket page">
    <div class="banner" :style="'background-image: url('+banner+')'">
      <div class="img"><img :src="logo"/></div>
    </div>
    <div class="content">
      <div class="btn" @click="fn_booking">门票预约</div>
      <!--<router-link tag="div" to="/booking" class="btn">门票预约</router-link>-->
      <div class="btn history" @click="to_history">查看订单</div>
      <div class="login-count" v-if="tel">登录账号：{{tel}}</div>
      <div class="notice white">
        <h2>唐山博物馆采取限流预约措施参观，请观众仔细阅读：</h2>{{notice}}
      </div>
    </div>

    <div class="mask" v-if="show_notice">
      <div class="mask-cont mask-notice">
        <h3><span>预约须知</span><i @click="show_notice = false"><img src="../assets/icon-x.png" alt=""></i></h3>
        <div class="notice">{{notice}}</div>
        <div class="btn" @click="fn_to_booking" v-if="can_click">我已阅读并同意</div>
        <div class="btn none-click" v-else>我已阅读并同意（{{clock}}s）</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        banner: this.config.aliyun + 'ts-static/wap/ticket-banner.jpg',
        logo: this.config.aliyun + 'ts-static/wap/logo-ticket.png',

        notice: '',//游客须知
        show_notice: false,
        can_click: false,
        clock: 3,
        interval: 0,
        tel: '',
        token: ''
      };
    },
    mounted() {
      this.tel = localStorage.getItem('tel');
      this.token = localStorage.getItem('token');
      this.getNotice();
    },
    methods: {
      // // 点击门票预约
      fn_booking() {
        this.show_notice = true;
        this.can_click = false;
        this.interval = setInterval(() => {
          this.clock -= 1;
          console.log(this.clock);
          if (this.clock === 0) {
            this.clock = 3;
            this.can_click = true;
            window.clearInterval(this.interval)
          }
        }, 1000);
      },

      // 点击我已阅读
      fn_to_booking() {
        this.$router.push({ name: "booking" })
      },
      // 点击历史订单
      to_history() {
        if (this.token) {
          this.$router.push({ name: 'mine', query: { on: 1 } });
        } else {
          this.$router.push({
            name: "login",
            query: {
              url: this.$route.path,
              params: this.$route.query
            }
          })
        }
      },

      // 获取参观须知
      getNotice() {
        this.utils.ajax(this, 'api/aboutUs').then(res => {
          this.notice = res.notice;
        });
      },
    }
  };
</script>

<style lang="scss" scoped>
  .ticket {
    .banner {
      height: 500px;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;

      .img {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: rgba(207, 144, 58, 0.6);

        img {
          width: 233px;
          height: 191px;
        }
      }
    }

    .content {
      .btn {
        font-size: 36px;
        line-height: 88px;
        color: #ffffff;
        text-align: center;
        height: 88px;
        background-color: #cf903a;
        box-shadow: 0 5px 10px 0 rgba(179, 129, 70, 0.35);
        border-radius: 10px;
        margin: 46px 31px;
        box-sizing: border-box;

        &.history {
          background-color: #ffffff;
          border: solid 2px #cf903a;
          color: #cf903a;
        }
      }

      .login-count {
        margin: 50px 0;
        font-size: 28px;
        color: #999999;
        text-align: center;
      }

    }

    .notice {
      padding: 57px 24px 47px;
      text-align: justify;
      font-size: 28px;
      color: #333333;
      white-space: pre-line;
      line-height: 51px;

      h2 {
        font-size: 34px;
        color: #333333;
        font-weight: normal;
        margin-bottom: 30px;
      }
    }

    .mask-notice {
      width: 85vw;
      height: 60vh;
      padding: 30px 25px;
      display: flex;
      flex-flow: column;

      h3 {
        flex-shrink: 0;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 28px;
        font-weight: normal;

        i {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          height: 60px;

          img {
            width: 50%;
            min-height: unset;
          }
        }
      }

      .btn {
        margin: 0 auto;
        width: 80%;
        height: 120px;
        border-radius: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #b38146;
        color: #ffffff;
        font-size: 30px;
      }

      .notice {
        overflow: auto;
        flex-grow: 1;
        margin: 20px auto;
      }
    }
  }
</style>
