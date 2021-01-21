<template>
  <div class="ticket-detail no-footer-page">
    <div class="detail-title" :style="'background-image: url('+title_bg+')'">
      <h2>{{detail.status_tip}}</h2>
    </div>
    <div class="detail" v-if="detail.list">
      <p><span>预约编号</span>：{{detail.pay_order_sn}}</p>
      <p><span>预约时间</span>：{{detail.create_time}}</p>
      <p><span>参观日期</span>：{{detail.use_date}}</p>
      <p><span>总金额</span>：{{detail.total_price==='0.00'?'免费':'￥'+detail.total_price}}</p>
    </div>
    <ul>
      <li v-for="(item,index) in detail.list" :key="item.id">
        <div class="cont" @click="fn_choose_checkbox(index)">
          <div class="icon">
            <img :src="item.is_checked?require('../assets/icons/checkBox-checked1.png'):require('../assets/icons/checkBox.png')">
          </div>
          <div>
            <p>姓名：{{item.name}}</p>
            <p>门票类型：普通门票</p>
            <p>证件类型：身份证</p>
            <p>证件编号：{{item.idcard}}</p>
            <p>票价：{{detail.total_price==='0.00'?'免费':'￥'+detail.total_price}}</p>
          </div>
        </div>
        <span v-if="item.status_type===1" @click="createCode(index)">查看入馆二维码</span>
        <!--<span v-else style="background-color: #cf903a">{{item.status}}</span>-->
      </li>
    </ul>
    <div class="fill-bottom"></div>
    <!--<div class="btn" v-if="detail.btn_type === 1">-->
    <!--<p @click="show_checkbox = !show_checkbox" v-if="detail.refund_btn">退票</p>-->
    <!--<p v-else class="none-click">退票</p>-->
    <!--</div>-->

    <div class="btn-refund">
      <!--<span>退款总计：￥{{refund_price}}</span>-->
      <p v-if="detail.refund_btn" @click="fn_refund">取消预约</p>
      <p v-else class="none-click">取消预约</p>
    </div>
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
        inactiveIcon: this.config.aliyun + 'ts-static/wap/ticket-checked.png',
        id: 0,
        detail: {},

        show_checkbox: false,
        last_refund: false,
        refund_ticket: [],//选中的要退的票

        refund_price: '0.00',//退款总计
        show_qrcode: false,//显示二维码
        code_bg: this.config.aliyun + 'ts-static/wap/ticket-code-bg.png',

        clock: 0,
        ckeck_clock: 0,//一分钟以内可重复扫码
        check_list_clock: 0,//列表中一分钟内可以重复调出二维码
        setTimeout: 0,
        closeTimeout: 120
      };
    },
    mounted() {
      this.initCode();
      this.id = parseInt(this.$route.query.id);
      this.getOrderDetail();
    },
    destroyed() {
      window.clearTimeout(this.clock);
      window.clearTimeout(this.check_clock);
      window.clearTimeout(this.check_list_clock);
    },
    methods: {
      // 点击退票按钮
      fn_refund() {
        let post = { order_id: this.id, list_id: this.refund_ticket };
        this.$dialog.confirm({
          message: '确认退票吗？',
          confirmButtonColor: '#b38146'
        }).then(() => {
          this.utils.ajax(this, 'my/ticketOrderRefund', post).then(() => {
            this.$dialog.alert({
              message: '退票成功',
              confirmButtonColor: '#b38146'
            }).then(() => {
              this.last_refund = false;
              this.getOrderDetail();
            });
          });
        }).catch(() => {
        })
      },
      // 选择要退的票
      fn_choose_checkbox(index) {
        if (this.detail.refund_btn) {
          if (this.detail.list[index].refund !== 1) {
            let arr = [];
            this.detail.list[index].is_checked = !this.detail.list[index].is_checked;
            for (let i = 0; i < this.detail.list.length; i++) {
              if (this.detail.list[i].is_checked) {
                arr.push(this.detail.list[i].id);
              }
            }
            this.refund_ticket = arr;
            if (this.refund_ticket.length > 0) {
              this.last_refund = true;
            } else {
              this.last_refund = false;
            }
          }
        } else {
          if (this.detail.list[index].status_type === 1) {
            this.$dialog.alert({ message: '已超过可退票时间', confirmButtonColor: '#b38146' });
          } else {
            this.$dialog.alert({ message: this.detail.list[index].status, confirmButtonColor: '#b38146' });
          }
        }
      },

      // 点击关闭二维码
      close_qrcode() {
        this.show_qrcode = false;
        this.setTimeout = 0;
        window.clearTimeout(this.clock);
        window.clearTimeout(this.ckeck_clock);
        this.getOrderDetail();
      },

      // 获取订单详情
      getOrderDetail() {
        this.utils.ajax(this, 'my/ticketOrderDetail', { order_id: this.id }).then((detail) => {
          detail.status_tip = this.utils.get_status(detail.refund, detail.check, detail.expire);
          detail.create_time = this.utils.date_format(detail.create_time, 'yyyy-MM-dd hh:mm:ss');
          detail.btn_type = this.utils.get_status(detail.refund, detail.check, detail.expire, 'type');
          for (let i = 0; i < detail.list.length; i++) {
            detail.list[i].is_checked = false;
            if (detail.list[i].expire === 0) {
              if (detail.list[i].refund === 0) {
                if (detail.list[i].check === 0) {
                  detail.list[i].status = '待检票';
                  detail.list[i].status_type = 1;
                } else {
                  let now_timestamp = Math.ceil(new Date().getTime() / 1000);
                  let check_timestamp = detail.list[i].check_time;
                  detail.list[i].check_time = this.utils.date_format(detail.list[i].check_time, 'yyyy-MM-dd hh:mm:ss');
                  if ((now_timestamp - check_timestamp) <= 60) {
                    detail.list[i].status_type = 1;
                    if (detail.list[i].diff_time !== 1) {
                      this.check_list_clock = setTimeout(() => {
                        this.detail.list[i].status_type = 2;
                        console.log(this.detail.list[i].status_type);
                        window.clearTimeout(this.check_list_clock);
                      }, detail.list[i].diff_time);
                    }
                  } else {
                    detail.list[i].status_type = 2;
                  }
                  detail.list[i].status = '已核销';
                }
              } else {
                detail.list[i].status_type = 2;
                detail.list[i].status = '已退票';
              }
            } else {
              detail.list[i].status = '已过期';
              detail.list[i].status_type = 2;
            }
          }
          this.detail = detail;
          // console.log(this.detail)
        })
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
      createCode(index) {
        this.utils.ajax(this, 'my/genQrcodeStr', { list_id: this.detail.list[index].id }, [44]).then((res) => {
          // console.log(res);
          this.show_qrcode = true;
          this.fn_createCode(res);
          this.lookOrderStatus(index)
        }).catch(() => {
          this.$dialog.alert({ message: '仅在入馆当天方可生成入馆二维码', confirmButtonColor: '#b38146' })
        });
      },
      fn_createCode(str) {
        this.qrcode.clear();
        this.qrcode.makeCode(str);
      },

      lookOrderStatus(index) {
        this.utils.ajax(this, 'my/ticketOrderStatus', { list_id: this.detail.list[index].id }).then((res) => {
          if (res.check === 0) {
            this.setTimeout += 2;
            if (this.setTimeout < this.closeTimeout) {
              this.clock = setTimeout(() => {
                this.lookOrderStatus(index)
              }, 2000);
            }
          } else {
            this.ckeck_clock = setTimeout(() => {
              this.show_qrcode = false;
              this.getOrderDetail();
            }, res.diff_time);
          }
        });
      }
    }
  }
  ;
</script>

<style lang="scss" scoped>
  .ticket-detail {
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

    .detail {
      background-color: #ffffff;
      box-shadow: 0 1px 4px 0 rgba(179, 129, 70, 0.3);
      padding: 34px 24px;
      box-sizing: border-box;

      p {
        font-size: 24px;
        color: #333333;
        line-height: 45px;
        display: flex;
        align-items: center;

        span {
          display: block;
          width: 100px;
          text-align-last: justify;
        }
      }
    }

    ul {
      margin-top: 14px;

      li {
        background-color: #ffffff;
        margin-bottom: 24px;
        /*padding: 34px 24px;*/
        /*box-sizing: border-box;*/
        overflow: hidden;

        .cont {
          margin: 30px;
          display: flex;
          align-items: center;

          .icon {
            width: 34px;
            height: 34px;
            flex-shrink: 0;
            margin-right: 46px;
          }

          p {
            font-size: 26px;
            color: #333333;
            margin-bottom: 10px;
            line-height: 39px;
          }
        }

        span {
          width: 100%;
          height: 80px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #29ac83;
          color: #ffffff;
          font-size: 26px;
        }
      }
    }

    .fill-bottom {
      height: 114px;
    }

    .btn {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 50px;
      display: flex;
      justify-content: center;

      p {
        margin: 0 27px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 300px;
        height: 64px;
        background-color: #b38146;
        box-shadow: 0 10px 25px 0 rgba(179, 129, 70, 0.35);
        border-radius: 10px;
        font-size: 28px;
        color: #ffffff;
      }
    }

    .btn-refund {
      position: fixed;
      background-color: #cf903a;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100px;
      left: 0;
      right: 0;
      //bottom: -114px;
      z-index: 9;
      transition: 0.2s;

      /*&.show {*/
      bottom: 0;
      /*}*/

      /*span {*/
      /*font-size: 28px;*/
      /*color: #333333;*/
      /*margin-left: 24px;*/
      /*}*/

      p {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        font-size: 34px;
        color: #ffffff;
        box-sizing: border-box;
      }
    }

  }
</style>
