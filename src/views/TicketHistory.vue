<template>
  <div class="history page">
    <div class="common-title">历史订单</div>
    <div class="tip" v-if="count === 0">您还没有预约门票，
      <router-link to="/booking">立即预约</router-link>
    </div>
    <ul v-else>
      <router-link tag="li" :to="{path:'/ticket_detail',query:{id:item.id}}" v-for="item in history" :key="item.id">
        <div class="item">
          <div class="img"><img :src="item.status_pic" alt=""></div>
          <div class="item-right">
            <i class="before-t"></i>
            <i class="before-b"></i>
            <i class="after"></i>
            <div class="item-cont">
              <p>预约编号：{{item.pay_order_sn}}</p>
              <p>预约时间：{{item.create_time}}</p>
              <p>参观日期：{{item.use_date}}</p>
              <p>总金额：{{item.total_price==='0.00'?0:item.total_price}}</p>
            </div>
            <div class="icon"><img :src="right"/></div>
          </div>
        </div>
      </router-link>
    </ul>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        right: this.config.aliyun + '/ts-static/ticket-right.png',
        count: 0,
        history: []
      };
    },
    mounted() {
      let token = localStorage.getItem('token');
      if (token) {
        this.utils.ajax(this, 'my/ticketOrderList').then((list) => {
          this.count = list.count;
          for (let i = 0; i < list.list.length; i++) {
            // list.list[i].status = this.utils.get_status(list.list[i].refund, list.list[i].check, list.list[i].expire);
            list.list[i].status_pic = this.utils.get_status(list.list[i].refund, list.list[i].check, list.list[i].expire, 'img');
            list.list[i].create_time = this.utils.date_format(list.list[i].create_time, 'yyyy-MM-dd hh:mm:ss')
          }

          this.history = list.list;
          // console.log(list)
        });
      } else {
        this.$router.push({ name: 'login', query: { url: this.$route.path, params: this.$route.query } });
      }
    },
    methods: {}
  };
</script>

<style lang="scss" scoped>
  .history {
    overflow: hidden;

    .tip {
      font-size: 28px;
      width: 80%;
      margin: 50px auto;
      text-align: center;

      a {
        color: #b38146;
        font-size: 28px;
      }
    }

    ul {
      margin: 30px 24px;

      li {
        height: 200px;
        margin-bottom: 35px;
        box-shadow: 0 1px 4px 0 rgba(179, 129, 70, 0.3);

        .item {
          height: 100%;
          display: flex;
          align-items: center;
          position: relative;
          z-index: 4;
          justify-content: space-between;

          .img {
            height: 100%;
            flex-shrink: 0;

            img {
              width: auto;
              height: 100%;
            }
          }

          .item-right {
            z-index: 5;
            background-color: #ffffff;
            height: 100%;
            flex-grow: 1;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            position: relative;
            overflow: hidden;

            i {
              z-index: 6;
              position: absolute;
              width: 12px;
              height: 12px;
              display: flex;
              border-radius: 50%;
              background-color: rgb(254, 249, 244);

              &.before-t {
                top: 0;
                left: 0;
                transform: translate(-50%, -50%);
              }

              &.before-b {
                bottom: 0;
                left: 0;
                transform: translate(-50%, 50%);
              }

              &.after {
                width: 24px;
                height: 24px;
                right: 0;
                transform: translate(50%, 0);
              }
            }

            .item-cont {
              flex-grow: 1;
              margin-left: 25px;

              p {
                line-height: 40px;
                font-size: 24px;
                color: #333333;
              }
            }

            .icon {
              width: 16px;
              margin-right: 24px;
              flex-shrink: 0;
              height: 27px;
            }
          }
        }
      }
    }
  }
</style>
