<template>
  <div class="ticket-detail page">
    <div class="common-title">订单详情</div>
    <div class="detail">
      <div class="status">{{detail.status}}</div>
      <p>预约编号：{{detail.pay_order_sn}}</p>
      <p>预约时间：{{detail.create_time}}</p>
      <p>参观日期：{{detail.use_date}}</p>
      <p>总金额：￥{{detail.total_price}}</p>
    </div>
    <ul>
      <li v-for="(item,index) in detail.list" :key="item.id">
        <div class="cont">
          <p>{{item.name}}</p>
          <p>身份证：{{item.idcard}}</p>
          <div class="has-checkbox">
            <div class="p-box">
              <p>免费参观凭证</p>
              <p class="status">{{item.status}}</p>
            </div>
          </div>
        </div>
        <div class="hexiao" @click="fn_check(item.id,index)" v-if="item.status_type === 1">{{item.status}}</div>
        <div class="hexiao none-click" v-else>{{item.status}}</div>
      </li>
    </ul>
    <div class="check-history">
      <router-link to="/check_history">我的核销历史</router-link>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        id: 0,
        detail: {},

        hexiao_text: '核销',
      };
    },
    mounted() {
      this.id = parseInt(this.$route.query.id);
      this.getOrderDetail();
    },
    methods: {
      fn_check(id, index) {
        console.log(id);
        this.$dialog.confirm({
          message: '确认核销',
          confirmButtonColor: '#b38146'
        }).then(() => {
          this.utils.ajax(this, 'my/checkTicket', { order_id: this.id, list_id: id }).then(() => {
            this.$toast('核销成功');
            this.detail.list[index].status = '已核销';
            this.detail.list[index].status_type = 2;
            let num = 0;
            for (let i = 0; i < this.detail.list.length; i++) {
              if (this.detail.list[i].status_type === 2) {
                num += 1;
              }
            }
            if (num === this.detail.list.length) {
              this.getOrderDetail();
            }
          });
        }).catch(() => {
        });
      },
      // 获取订单详情
      getOrderDetail() {
        this.utils.ajax(this, 'my/checkOrderDetail', { order_id: this.id }).then((detail) => {
          detail.status = this.utils.get_status(detail.refund, detail.check, detail.expire);
          detail.create_time = this.utils.date_format(detail.create_time, 'yyyy-MM-dd hh:mm:ss');
          for (let i = 0; i < detail.list.length; i++) {
            detail.list[i].is_checked = false;
            if (detail.list[i].expire === 0) {
              if (detail.list[i].refund === 0) {
                if (detail.list[i].check === 0) {
                  detail.list[i].status = '待检票';
                  detail.list[i].status_type = 1;
                } else {
                  detail.list[i].status_type = 2;
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
          console.log(this.detail)
        })
      },
    }
  }
  ;
</script>

<style lang="scss" scoped>
  .ticket-detail {
    .detail {
      margin: 30px 24px;
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
      margin: 24px 24px 120px;

      li {
        background-color: #ffffff;
        margin-bottom: 24px;
        box-shadow: 0 1px 4px 0 rgba(179, 129, 70, 0.3);
        padding: 34px 24px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .hexiao {
          font-size: 30px;
          margin-right: 24px;
          background-color: #b38146;
          color: #ffffff;
          padding: 10px 20px;
          border-radius: 10px;
        }

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
