<template>
  <div class="ticket page">
    <div class="img"><img :src="banner"/></div>
    <div class="content">
      <div class="btn" @click="fn_booking">门票预约</div>
      <!--<router-link tag="div" to="/booking" class="btn">门票预约</router-link>-->
      <div class="btn" @click="to_history">历史订单/退票</div>
      <div class="login-count" v-if="tel">登录账号：{{tel}}</div>
      <div class="notice">{{notice}}</div>
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
        banner: this.config.aliyun + 'ts-static/ticket-banner.jpg',

        notice: this.config.notice,//游客须知
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
          this.$router.push({
            name: 'history'
          })
        } else {
          this.$router.push({
            name: "login",
            query: {
              url: this.$route.path,
              params: this.$route.query
            }
          })
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .ticket {
    img {
      width: 100%;
      min-height: 250px;
    }

    .content {
      margin: 0 67px;
      overflow: hidden;

      .btn {
        width: 100%;
        font-size: 34px;
        line-height: 78px;
        color: #ffffff;
        text-align: center;
        height: 78px;
        background-color: #b38146;
        box-shadow: 0 10px 25px 0 rgba(179, 129, 70, 0.35);
        border-radius: 10px;
        margin: 46px auto;
      }

      .login-count {
        margin-top: 60px;
        font-size: 28px;
        color: #999999;
      }

    }

    .notice {
      margin: 67px 0;
      text-align: justify;
      font-size: 30px;
      color: #584e43;
      white-space: pre-line;
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
