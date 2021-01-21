<template>
  <div class="pay">
    <p>{{tip}}</p>
  </div>
</template>

<script>
  export default {
    data() {
      return { tip: '' };
    },
    mounted() {
      if (typeof WeixinJSBridge == "undefined") {
        this.tip = '请前往微信浏览器支付'
      } else {
        let pay_order_sn = this.$route.query.pay_order_sn;
        console.log(localStorage.getItem('wx_openid'));
        if (!localStorage.getItem('wx_openid')) {
          let params = this.utils.get_params();
          if (!params['code']) {
            this.utils.auth(this.$route.fullPath)
          } else {
            this.utils.ajax(this, 'weixin/bindWeixin', { code: params['code'] }).then(res => {
              localStorage.setItem('wx_openid', res.wx_openid);
              console.log(res);
              this.wx_pay(pay_order_sn);
            });
          }
        } else {
          this.wx_pay(pay_order_sn);
        }
      }
    },
    methods: {
      wx_pay(pay_order_sn) {
        this.utils.ajax(this, 'pay/acorder_pay', { pay_order_sn: pay_order_sn }).then((res) => {
          WeixinJSBridge.invoke('getBrandWCPayRequest', {
            debug: true,
            appId: res.appId, // 公众号名称，由商户传入
            timeStamp: res.timeStamp, // 时间戳，自1970年以来的秒数
            nonceStr: res.nonceStr, // 随机串
            package: res.package,
            signType: 'MD5', // 微信签名方式：
            paySign: res.paySign // 微信签名
          }, (res) => {
            if (res.err_msg === 'get_brand_wcpay_request:ok') {
              // 使用以上方式判断前端返回,微信团队郑重提示：
              // res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
              const toast = this.$toast({
                duration: 0,       // 持续展示 toast
                forbidClick: true, // 禁用背景点击
                mask: true,
                message: '支付成功\n3秒后跳转'
              });

              let second = 3;
              const timer = setInterval(() => {
                second--;
                if (second) {
                  toast.message = `支付成功\n${second}秒后跳转`
                } else {
                  clearInterval(timer);
                  this.$toast.clear();
                  this.jump_back();
                }
              }, 1000);
            } else {
              this.$dialog.alert({
                message: '支付失败',
                confirmButtonColor: '#b38146'
              }).then(() => {
                this.$router.go(-1);
              });
            }
          });
        });
      },
      jump_back() {
        if (this.$route.query.id) {
          this.$router.replace({ name: 'activity_input', query: { id: this.$route.query.id, tip: 3, } })
        } else {
          this.$router.replace({ name: 'mine', query: { on: 2 } });
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  .pay {
    p {
      font-size: 38px;
      text-align: center;
      margin-top: 150px;
    }
  }
</style>
