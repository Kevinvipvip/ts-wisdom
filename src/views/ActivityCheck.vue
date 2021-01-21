<template>
  <div class="activity-check no-footer-page">
    <div class="common-title">活动订单详情</div>
    <div>
      <div class="detail">
        <div class="status">{{detail.check===0?'待核销':'已核销'}}</div>
        <p>预约编号：{{detail.pay_order_sn}}</p>
        <p>活动名称：{{detail.title}}</p>
        <p>预约时间：{{detail.create_time}}</p>
        <p>活动日期：{{detail.start_time}}</p>
        <p>总金额：￥{{detail.total_price}}</p>
      </div>
      <ul>
        <li>
          <div class="cont">
            <p>参与人：{{detail.name}}</p>
            <p>身份证：{{detail.idcard}}</p>
            <p>联系方式：{{detail.tel}}</p>
            <!--<div class="has-checkbox">-->
            <!--<div class="p-box">-->
            <!--<p>免费参观凭证</p>-->
            <!--&lt;!&ndash;<p class="status">{{detail.status}}</p>&ndash;&gt;-->
            <!--</div>-->
            <!--</div>-->
          </div>
        </li>
      </ul>
      <div class="hexiao" @click="fn_check(detail.id)" v-if="detail.check_btn">立即核销</div>
      <div class="hexiao" v-else>活动尚未开始</div>
      <div class="check-history">
        <router-link to="/activity_check_history">我的核销历史</router-link>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        detail: {},

        hexiao_text: '核销',
      };
    },
    mounted() {
      this.getOrderDetail(this.$route.query.key);
    },
    methods: {
      fn_check(id) {
        console.log(id);
        this.$dialog.confirm({
          message: '确认核销',
          confirmButtonColor: '#b38146'
        }).then(() => {
          this.utils.ajax(this, 'my/acorderCheck', { order_id: this.detail.id }).then(() => {
            this.$toast('核销成功');
            this.getOrderDetail();
          });
        });
      },
      // 获取订单详情
      getOrderDetail(key) {
        this.utils.ajax(this, 'my/acorderCheckDetail', { key: key }).then(res => {
          console.log(res);
          // detail.status = this.utils.get_status(detail.refund, detail.check, detail.expire);
          res.create_time = this.utils.date_format(res.create_time, 'yyyy-MM-dd hh:mm:ss');
          res.start_time = this.utils.date_format(res.start_time, 'yyyy-MM-dd');
          // for (let i = 0; i < detail.list.length; i++) {
          //   detail.list[i].is_checked = false;
          //   if (detail.list[i].expire === 0) {
          //     if (detail.list[i].refund === 0) {
          //       if (detail.list[i].check === 0) {
          //         detail.list[i].status = '待检票';
          //         detail.list[i].status_type = 1;
          //       } else {
          //         detail.list[i].status_type = 2;
          //         detail.list[i].status = '已核销';
          //       }
          //     } else {
          //       detail.list[i].status_type = 2;
          //       detail.list[i].status = '已退票';
          //     }
          //   } else {
          //     detail.list[i].status = '已过期';
          //     detail.list[i].status_type = 2;
          //   }
          // }
          this.detail = res;
          // console.log(this.detail)
        })
      },
    }
  }
  ;
</script>

<style lang="scss" scoped>
  .activity-check {
    .detail {
      margin: 0 0 24px;
      background-color: #ffffff;
      box-shadow: 0 1px 4px 0 rgba(179, 129, 70, 0.3);
      padding: 34px 24px;
      box-sizing: border-box;
      position: relative;

      .status {
        font-size: 24px;
        color: #b38146;
        position: absolute;
        top: 30px;
        right: 24px;
      }

      p {
        font-size: 24px;
        color: #333333;
        line-height: 45px;
      }
    }

    ul {
      padding: 24px 24px 0;
      background-color: #ffffff;

      li {
        margin-bottom: 24px;
        /*box-shadow: 0 1px 4px 0 rgba(179, 129, 70, 0.3);*/
        padding: 34px 24px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;


        p {
          font-size: 24px;
          color: #333333;
          line-height: 45px;
        }

        .has-checkbox {
          display: flex;
          align-items: center;

          i {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 0;
            height: 24px;
            transition: 0.5s;

            img {
              width: 80%;
            }

            &.show {
              margin-right: 15px;
              border: 2px solid #b38146;
              width: 24px;
            }
          }

          .p-box {

            .status {
              color: #b38146;
              margin-top: 20px;
            }
          }
        }
      }
    }

    .hexiao {
      height: 80px;
      background-color: #29ac83;
      font-size: 26px;
      color: #ffffff;
      line-height: 80px;
      text-align: center;
      user-select: none;
    }

    .check-history {
      height: 80px;
      box-shadow: 0 1px 4px 0 rgba(179, 129, 70, 0.3);
      width: 80%;
      margin: 0 auto;
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      border-radius: 10px;
      overflow: hidden;

      a {
        width: 100%;
        height: 100%;
        background-color: #b38146;
        color: #ffffff;
        font-size: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
</style>
