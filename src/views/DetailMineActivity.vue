<template>
  <div class="mine-activity no-footer-page">
    <div class="detail-title" :style="'background-image: url('+title_bg+')'">
      <h2>{{detail.status_tip}}</h2>
    </div>
    <div class="cont white">
      <p><span>姓名</span>：{{detail.name}}</p>
      <p><span>证件类型</span>：身份证</p>
      <p><span>证件编号</span>：{{detail.idcard}}</p>
      <p><span>手机号</span>：{{detail.tel}}</p>
      <p v-if="detail.check_time"><span>核销时间</span>：{{detail.check_time}}</p>
      <p><span>票价</span>：{{detail.total_price==='0.00'?'免费':'￥'+detail.total_price}}</p>
    </div>
    <div class="btn-code" v-if="detail.status==0">
      <router-link :to="{path:'/pay',query:{pay_order_sn:detail.pay_order_sn}}">去支付</router-link>
    </div>
    <div class="btn-code" @click="createCode" v-else-if="detail.status_type===1">查看入馆二维码</div>
    <!--<div class="btn-code" v-else style="background-color: #cf903a">{{detail.status_tip}}</div>-->
    <div class="btn-code" v-if="detail.cancel_btn" style="margin-top:20px;background-color: #cf903a"
         @click="refundAcorderCancel(detail.id)">取消订单
    </div>
    <div class="btn-fixed" v-if="detail.refund_btn" @click="refund(detail.id)">取消预约</div>

    <!--显示生成的二维码-->
    <div class="qr-code" @click="close_qrcode" :class="show_qrcode?'show':''">
      <div class="code-box">
        <img :src="code_bg">
        <div class="qrcode">
          <div id="qrCode" class="code" ref="qrCodeDiv"></div>
        </div>
        <div class="tip-bg">
          <p>请保持屏幕亮度</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import QRCode from 'qrcodejs2'

  export default {
    data() {
      return {
        title_bg: this.config.aliyun + 'ts-static/wap/bg-activity-title.png',
        id: 0,
        detail: {},

        show_qrcode: false,//显示二维码
        code_bg: this.config.aliyun + 'ts-static/wap/ticket-code-bg.png',

        clock: 0,
        check_list_clock: 0,//列表中一分钟内可以重复调出二维码
        setTimeout: 0,
        closeTimeout: 120

      };
    },
    mounted() {
      this.initCode();
      this.id = parseInt(this.$route.query.id);
      this.getAcorderDetail();
    },
    destroyed() {
      window.clearTimeout(this.clock);
    },
    methods: {
      // 生成二维码
      createCode() {
        this.utils.ajax(this, 'my/acorderQrcode', { order_id: this.detail.id }).then((res) => {
          // console.log(res);
          this.show_qrcode = true;
          this.fn_createCode(res);
          this.lookOrderStatus()
        });
      },
      fn_createCode(str) {
        this.qrcode.clear();
        this.qrcode.makeCode(str);
      },
      lookOrderStatus() {
        this.utils.ajax(this, 'my/acorderStatus', { order_id: this.detail.id }).then((res) => {
          console.log(res);
          if (res.check === 0) {
            window.clearTimeout(this.clock);
            this.setTimeout += 2;
            if (this.setTimeout < this.closeTimeout) {
              this.clock = setTimeout(() => {
                this.lookOrderStatus()
              }, 2000);
            }
          } else {
            this.show_qrcode = false;
            window.clearTimeout(this.clock);
            this.$dialog.alert({
              message: '核销成功,\n核销时间' + this.utils.date_format(res.check_time, 'yyyy-MM-dd hh:mm:ss'),
              confirmButtonColor: '#b38146'
            }).then(() => {
              this.getAcorderDetail();
            });
          }
        });
      },
      // 点击关闭二维码
      close_qrcode() {
        this.show_qrcode = false;
        this.setTimeout = 0;
        this.getAcorderDetail();
      },
      // 点击取消支付
      refundAcorderCancel(id) {
        this.$dialog.confirm({
          message: '确认取消预约吗？',
          confirmButtonColor: '#b38146'
        }).then(() => {
          this.utils.ajax(this, 'my/acorderCancel', { order_id: id }).then(() => {
            this.$dialog.alert({
              message: '取消预约成功',
              confirmButtonColor: '#b38146'
            }).then(() => {
              this.$router.go(-1);
            });
          });
        });
      },
      // 点击取消预约
      refund(id) {
        this.$dialog.confirm({
          message: '确认取消预约吗？',
          confirmButtonColor: '#b38146'
        }).then(() => {
          this.utils.ajax(this, 'my/acorderRefund', { order_id: id }).then(() => {
            this.$dialog.alert({
              message: '取消预约成功',
              confirmButtonColor: '#b38146'
            }).then(() => {
              this.getAcorderDetail();
            });
          });
        });
      },
      initCode() {
        this.qrcode = new QRCode(this.$refs.qrCodeDiv, {
          text: '',
          width: 200,
          height: 200,
          colorDark: '#333333', // 二维码颜色
          colorLight: '#ffffff', // 二维码背景色
          correctLevel: QRCode.CorrectLevel.L // 容错率，L/M/H
        });
      },
      getAcorderDetail() {
        this.utils.ajax(this, 'my/acorderDetail', { order_id: this.id }).then(res => {
          res.check_time = this.utils.date_format(res.check_time, 'yyyy-MM-dd hh:mm:ss');
          if (res.status === 1) {
            if (res.expire === 0) {
              if (res.refund === 0) {
                if (res.check === 0) {
                  res.status_type = 1;
                  res.status_tip = '待核销';
                } else {
                  res.status_tip = '已核销';
                  res.status_type = 2;
                }
              } else {
                res.status_tip = '已退票';
                res.status_type = 2;
              }
            } else {
              res.status_tip = '已过期';
              res.status_type = 2;
            }
          } else {
            res.status_tip = '待支付';
          }
          console.log(res);
          this.detail = res;
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .mine-activity {
    .detail-title {
      height: 200px;
      background-repeat: no-repeat;
      background-position: bottom;
      background-size: cover;
      display: flex;
      align-items: center;
      justify-content: center;

      h2 {
        color: #ffffff;
        font-size: 34px;
        font-weight: normal;
      }
    }

    .cont {
      padding: 30px;
      margin-top: 14px;
      position: relative;

      /*&:before {*/
      /*content: '';*/
      /*position: absolute;*/
      /*top: 50%;*/
      /*//transform: translateY(-50%);*/
      /*display: block;*/
      /*width: 32px;*/
      /*height: 32px;*/
      /*border-radius: 50%;*/
      /*border: 2px solid rgb(201, 201, 201);*/
      /*}*/

      p {
        font-size: 26px;
        color: #333333;
        line-height: 42px;
        margin-bottom: 10px;
        margin-left: 30px;
        display: flex;

        span {
          display: block;
          width: 115px;
          flex-shrink: 0;
          text-align-last: justify;
        }
      }
    }

    .btn-code {
      height: 80px;
      background-color: #29ac83;
      font-size: 26px;
      color: #ffffff;
      line-height: 80px;
      text-align: center;
      user-select: none;

      a {
        color: #ffffff;
        display: block;
        width: 100%;
        height: 100%;
      }
    }

    .btn-fixed {
      font-size: 34px;
      color: #ffffff;
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      text-align: center;
      line-height: 100px;
      z-index: 33;
      height: 100px;
      background-color: #cf903a;
    }
  }
</style>
