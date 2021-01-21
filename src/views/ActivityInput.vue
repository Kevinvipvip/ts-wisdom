<template>
  <div class="activity-input no-footer-page">
    <div class="input-title" :style="'background-image: url('+title_bg+')'">
      <div class="tip">
        <div class="tip-item" :class="operate1?'on':''"><span>1</span>
          <p>填写信息</p></div>
        <div class="line"></div>
        <div class="tip-item" :class="operate2?'on':''"><span>2</span>
          <p>预约确认</p></div>
        <div class="line"></div>
        <div class="tip-item" :class="operate3?'on':''"><span>3</span>
          <p>预约结果</p></div>
      </div>
    </div>

    <div class="content">
      <div class="activity-cont white" v-if="tip_on<3">
        <h3>{{activity.title}}</h3>
        <p>活动时间：{{activity.start_time}}</p>
        <p>活动地点：{{activity.address}}</p>
      </div>
      <div class="one white" v-if="tip_on === 1" ref="ipt_name" @click="blur_name()">
        <h4>填写预约信息</h4>
        <div class="ipt-box">
          <label for="name">姓名</label>
          <div class="input"><input type="text" id="name" v-model="name" placeholder="请输入您的姓名">
          </div>
        </div>
        <div class="ipt-box">
          <label for="card_type">证件类型</label>
          <div class="input"><input type="text" id="card_type" value="身份证" disabled></div>
        </div>
        <div class="ipt-box">
          <label for="IDcard">证件号码</label>
          <div class="input">
            <input type="text" id="IDcard" v-model="IDcard" placeholder="请输入您的证件号码"></div>
        </div>
        <div class="ipt-box">
          <label for="tel">手机号码</label>
          <div class="input">
            <input type="text" id="tel" v-model="tel" placeholder="请输入您的手机号码"
                   maxlength="11" oninput="value=value.replace(/[^\d]/g,'')">
          </div>
        </div>
        <div class="ipt-box">
          <label>预约费用</label>
          <p v-if="activity.price==='0.00'" style="color: #33b089;">免费</p>
          <p v-else>￥{{activity.price}}</p>
        </div>
      </div>
      <div class="two white" v-else-if="tip_on===2">
        <h4>填写预约信息</h4>
        <p><span>姓名</span>{{name}}</p>
        <p><span>证件类型</span>身份证</p>
        <p><span>证件号码</span>{{IDcard}}</p>
        <p><span>手机号码</span>{{tel}}</p>
        <p v-if="activity.price==='0.00'" style="color: #33b089"><span>预约费用</span>免费</p>
        <p v-else><span>预约费用</span>￥{{activity.price}}</p>
      </div>
      <div class="three white" v-else-if="tip_on===3">
        <div class="icon"><img src="../assets/icons/orders-succ.png" alt=""></div>
        <span>您已成功预约</span>
        <h3>{{activity.title}}</h3>
        <div class="p-box">
          <p>活动时间：{{activity.start_time}}</p>
          <p>活动地点：{{activity.address}}</p>
          <p>活动请当日凭预约时填写的证件到馆参加</p>
        </div>
      </div>
      <router-link tag="div" :to="{path:'/mine',query:{on:2}}" class="btn-order" v-if="tip_on===3">查看订单</router-link>
    </div>
    <div class="fill-btn"></div>
    <div class="btn-next" v-if="tip_on<3">
      <div v-if="tip_on===1" class="btn btn-one" @click="next">下一步</div>
      <div v-else class="btn btn-two">
        <p @click="prev">返回修改</p>
        <p @click="submit">{{activity.price==='0.00'?'提交':'提交并支付'}}</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        title_bg: this.config.aliyun + 'ts-static/wap/bg-activity-title.png',
        activity: {},
        tip_on: 1,
        operate1: true,
        operate2: false,
        operate3: false,

        name: '',
        IDcard: '',
        tel: '',

        uper_clock: 0,

        submit_click: true
      };
    },
    mounted() {
      this.getActivityDetail(parseInt(this.$route.query.id));
      this.tip_on = parseInt(this.$route.query.tip) || 1;
      this.fn_tip();
      if (this.$route.query.data) {
        let input_data = JSON.parse(decodeURI(this.$route.query.data));
        this.name = input_data.name;
        this.IDcard = input_data.IDcard;
        this.tel = input_data.tel;
      }
    },
    destroyed() {
      localStorage.removeItem('input');
      window.clearTimeout(this.uper_clock);
    },
    // 跳转本页时参数变化后重新调取新闻公告详情数据
    beforeRouteUpdate(to, from, next) {
      this.getActivityDetail(parseInt(to.query.id));
      this.tip_on = parseInt(to.query.tip);
      this.fn_tip();
      next();
    },
    methods: {
      blur_name() {
        this.uper_clock = setTimeout(() => {
          window.scrollTo({
            top: this.$refs.ipt_name.offsetTop,
            behavior: "smooth"
          });
        }, 500);
      },

      // 点击下一步
      next() {
        if (!this.name.trim()) {
          // this.ipt_tip = '请输入你的姓名';
          this.$toast('请输入您的姓名');
        } else if (!this.IDcard.trim()) {
          // this.ipt_tip = '请输入你的手机号';
          this.$toast('请输入您的身份证号码');
        } else if (!this.tel.trim()) {
          // this.ipt_tip = '请输入你的手机号';
          this.$toast('请输入您的手机号');
        } else if (!this.config.tel_reg.test(this.tel)) {
          this.tel = '';
          this.$toast('请输入正确的手机号');
        } else {
          let post = {
            name: this.name,
            tel: this.tel,
            IDcard: this.IDcard
          };
          console.log(post);
          this.$router.push({
            name: 'activity_input',
            query: { id: this.$route.query.id, tip: 2, data: encodeURI(JSON.stringify(post)) }
          });
        }
      },
      prev() {
        let post = {
          name: this.name,
          tel: this.tel,
          IDcard: this.IDcard
        };
        this.$router.push({
          name: 'activity_input',
          query: { id: this.$route.query.id, tip: 1, data: encodeURI(JSON.stringify(post)) }
        });
      },
      submit() {
        let token = localStorage.getItem('token');
        if (token) {
          if (this.submit_click) {
            this.submit_click = false;
            let post = {
              token: token, activity_id: this.activity.id, name: this.name, idcard: this.IDcard, tel: this.tel
            };
            console.log(post);
            this.utils.ajax(this, 'activity/activityApply', post).then(res => {
              if (res.status) {
                this.submit_click = true;
                this.$router.push({
                  name: 'activity_input',
                  query: { id: this.$route.query.id, tip: 3 }
                });
              } else {
                this.$router.push({ name: 'pay', query: { id: this.activity.id, pay_order_sn: res.pay_order_sn } });
              }
            });
          }
        } else {
          this.$router.push({
            name: 'login',
            query: {
              url: this.$route.path,
              params: this.$route.query
            }
          });
        }
      },
      // blur_reg_tel() {
      //   if (!this.tel.trim()) {
      //     this.ipt_tip = '';
      //   } else if (!this.config.tel_reg.test(this.tel)) {
      //     this.ipt_tip = '请输入正确的手机号';
      //   } else {
      //     this.ipt_tip = '';
      //   }
      // },

      fn_tip() {
        switch (this.tip_on) {
          case 1:
            this.operate1 = true;
            this.operate2 = false;
            this.operate3 = false;
            break;
          case 2:
            this.operate1 = true;
            this.operate2 = true;
            this.operate3 = false;
            break;
          case 3:
            this.operate1 = true;
            this.operate2 = true;
            this.operate3 = true;
            break;
        }
      },
      // 获取活动详情
      getActivityDetail(id) {
        let post = { activity_id: id };
        this.utils.ajax(this, 'activity/activityDetail', post).then(res => {
          res.start_time = this.utils.date_format(res.start_time, 'yyyy-MM-dd 周w');
          this.activity = res;
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .activity-input {
    .content {
      margin-bottom: 24px;

      .activity-cont {
        margin-top: 14px;
        overflow: hidden;
        padding: 0 24px;

        h3 {
          font-size: 34px;
          color: #333333;
          margin: 30px 0 40px;
        }

        p {
          font-size: 28px;
          color: #666666;
          margin-bottom: 30px;
        }
      }

      h4 {
        font-size: 34px;
        color: #333333;
        margin: 40px 0 50px;
      }

      .one {
        margin-top: 24px;
        padding: 0 24px;
        overflow: hidden;


        .ipt-box {
          display: flex;
          align-items: center;
          height: 80px;
          margin-bottom: 20px;

          label {
            display: block;
            font-size: 28px;
            color: #333333;
            width: 120px;
            margin-right: 43px;
            flex-shrink: 0;
          }

          p {
            font-size: 28px;
            color: #333333;
          }

          .input {
            height: 100%;
            flex-grow: 1;
            border-radius: 10px;
            border: solid 1px #cccccc;
            padding: 0 31px;

            input {
              font-size: 28px;
              color: #333333;
              background: none;
              outline: none;
              display: block;
              width: 100%;
              height: 100%;
              border: none;

              &:-webkit-autofill {
                box-shadow: 0 0 0 1000px #ffffff inset
              }

              &#card_type {
                padding-right: 19px;
                background-image: url("../assets/icons/triangle.png");
                background-position: right;
                background-repeat: no-repeat;
                background-size: 19px 10px;
                box-sizing: border-box;
              }
            }
          }
        }
      }

      .two {
        margin-top: 24px;
        padding: 0 24px;
        overflow: hidden;

        p {
          font-size: 28px;
          color: #333333;
          display: flex;
          align-items: center;
          margin-bottom: 40px;

          span {
            display: block;
            margin-right: 35px;
            color: #333333;

            &:first-child {
              width: 120px;
            }
          }
        }
      }

      .three {
        margin-top: 5px;
        display: flex;
        flex-flow: column;
        align-items: center;

        .icon {
          margin: 69px 0 37px;
          width: 70px;
          height: 70px;
        }

        span {
          font-size: 26px;
          color: #cf903a;
        }

        h3 {
          font-size: 28px;
          color: #333333;
          margin: 40px 0 23px;
        }

        .p-box {
          padding: 23px 54px;
          border-radius: 10px;
          border: solid 1px #cf903a;
          margin-bottom: 63px;

          p {
            font-size: 26px;
            color: #666666;
            line-height: 42px;
          }
        }
      }

      .btn-order {
        margin: 100px auto 0;
        font-size: 28px;
        color: #ffffff;
        line-height: 80px;
        text-align: center;
        user-select: none;
        width: 640px;
        height: 80px;
        background-color: #cf903a;
        border-radius: 10px;
      }
    }

    .fill-btn {
      height: 100px;
    }

    .btn-next {
      position: fixed;
      width: 100%;
      height: 100px;
      background-color: #cf903a;
      bottom: 0;
      left: 0;
      z-index: 3;
      display: flex;
      justify-content: center;
      align-items: center;

      .btn {
        width: 100%;
        height: 100%;
        color: #ffffff;
        font-size: 34px;
        text-align: center;
        line-height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;

        &.btn-one {
          width: 100%;
          height: 100%;
        }

        p {
          width: 50%;

          &:first-child {
            height: calc(100% - 2px);
            background-color: #ffffff;
            color: #cf903a;
          }
        }
      }
    }
  }
</style>
