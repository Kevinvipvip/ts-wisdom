<template>
  <div class="mine no-footer-page">
    <div class="tab">
      <div class="tab-item" :class="tab_on===1?'tab-on':''" @click="click_tab(1)">门票预约</div>
      <div class="tab-item" :class="tab_on===2?'tab-on':''" @click="click_tab(2)">活动预约</div>
      <div class="tab-item" :class="tab_on===3?'tab-on':''" @click="click_tab(3)">常用联系人</div>
    </div>
    <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad">
      <div class="mine-ticket" v-if="tab_on===1">
        <div class="ticket-item" v-for="(item,index) in ticket_list" :key="'ticket'+index"
             @click="to_mine_detail(1,item.id)">
          <div class="tip" :style="'color:'+item.status_color">{{item.status_tip}}</div>
          <div class="text">
            <span>预约编号</span>
            ：<p>{{item.pay_order_sn}}</p></div>
          <div class="text">
            <span>预约时间</span>
            ：<p>{{item.create_time}}</p>
          </div>
          <div class="text">
            <span>参观日期</span>
            ：<p>{{item.use_date}}</p>
          </div>
          <div class="text">
            <span>票价</span>
            ：<p>{{item.total_price==='0.00'?'免费':'￥'+item.total_price}}</p>
          </div>
          <div class="learn-more">
            了解详情<i></i>
          </div>
        </div>
      </div>
      <div class="mine-activity" v-if="tab_on===2">
        <div class="activity-item" v-for="(item,index) in activity_list" :key="'activity'+index"
             @click="to_mine_detail(2,item.id)">
          <div class="tip" :style="'color:'+item.status_color">{{item.status_tip}}</div>
          <div class="text"><span>预约编号</span>：<p>{{item.pay_order_sn}}</p></div>
          <div class="text"><span>活动名称</span>：<p>{{item.title}}</p></div>
          <div class="text"><span>预约时间</span>：<p>{{item.create_time}}</p></div>
          <div class="text"><span>活动日期</span>：<p>{{item.start_time}}</p></div>
          <div class="text"><span>总金额</span>：<p>{{item.total_price==='0.00'?'免费':'￥'+item.total_price}}</p></div>
          <div class="learn-more">
            了解详情<i></i>
          </div>
        </div>
      </div>
      <div class="mine-contacts" v-if="tab_on===3">
        <div class="contacts-item" v-for="(item,index) in contacts_list" :key="'contacts'+index">
          <div class="tip" @click="delete_contacts(item.name,item.idcard)">删除</div>
          <div class="text"><span>姓名</span>：<p>{{item.name}}</p></div>
          <div class="text"><span>证件类型</span>：<p>身份证</p></div>
          <div class="text"><span>证件编号</span>：<p>{{item.idcard}}</p></div>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tab_on: 1,
        ticket_list: [],
        activity_list: [],
        contacts_list: [],

        page: 0,
        loading: false,
        finished: false,
        count: 0,
      };
    },
    mounted() {
      this.tab_on = parseInt(this.$route.query.on) || 1;
    },
    beforeRouteUpdate(to, from, next) {
      this.tab_on = parseInt(to.query.on) || 1;
      next();
    },
    methods: {
      click_tab(tab) {
        this.$router.replace({ name: 'center', query: { on: tab } });
      },
      // 删除常用人
      delete_contacts(name, IDcard) {
        this.$dialog.confirm({
          message: '确定删除常用联系人：' + name,
        }).then(() => {
          this.utils.ajax(this, 'ticket2/visitorDelete', { idcard: IDcard }).then(() => {
            this.$dialog.alert({
              message: '删除成功'
            }).then(() => {
              this.$router.push({ name: 'center', query: { on: this.tab_on } });
            });
          })
        });
      },

      // 点击前往门票或者活动订单详情页:
      // type=1跳转门票订单详情页；
      // type=2跳转活动订单详情
      to_mine_detail(type, id) {
        if (type === 1) {
          this.$router.push({ name: 'detail_ticket', query: { id: id } });
        } else {
          this.$router.push({ name: 'mine_activity', query: { id: id } });
        }
      },
      onLoad() {
        this.page++;
        switch (this.tab_on) {
          case 1:
            this.getTicketOrderList(this.page, () => {
              this.loading = false;
              if (this.ticket_list.length >= this.count) {
                this.finished = true
              }
            });
            break;
          case 2:
            this.getAcorderList(this.page, () => {
              this.loading = false;
              if (this.activity_list.length >= this.count) {
                this.finished = true
              }
            });
            break;
          case 3:
            this.getVisitorList(this.page, () => {
              this.loading = false;
              if (this.contacts_list.length >= this.count) {
                this.finished = true
              }
            });
            break;
        }
      },
      // 获取门票订单列表
      getTicketOrderList(page, callback) {
        let post = { page: page, perpage: 10 };
        this.utils.ajax(this, 'my/ticketOrderList', post).then(list => {
          this.count = list.count;
          for (let i = 0; i < list.list.length; i++) {
            list.list[i].status_tip = this.utils.get_status(list.list[i].refund, list.list[i].check, list.list[i].expire, 'tip');
            list.list[i].status_color = this.utils.get_status(list.list[i].refund, list.list[i].check, list.list[i].expire, 'color');
            list.list[i].create_time = this.utils.date_format(list.list[i].create_time, 'yyyy-MM-dd hh:mm:ss');
            this.ticket_list.push(list.list[i]);
          }
        }).then(() => {
          callback();
        });
      },
      // 获取活动订单列表
      getAcorderList(page, callback) {
        let post = { page: page, perpage: 10 };
        this.utils.ajax(this, 'my/acorderList', post).then(list => {
          this.count = list.count;
          console.log(list)
          for (let i = 0; i < list.list.length; i++) {
            list.list[i].create_time = this.utils.date_format(list.list[i].create_time, 'yyyy-MM-dd hh:mm:ss');
            list.list[i].start_time = this.utils.date_format(list.list[i].start_time, 'yyyy-MM-dd');
            if (list.list[i].status === 1) {
              if (list.list[i].expire === 0) {
                if (list.list[i].refund === 0) {
                  if (list.list[i].check === 0) {
                    list.list[i].status_tip = '待核销';
                    list.list[i].status_color = '#29ac83';
                  } else {
                    list.list[i].status_color = '#999999';
                    list.list[i].status_tip = '已核销';
                  }
                } else {
                  list.list[i].status_color = '#999999';
                  list.list[i].status_tip = '已退票';
                }
              } else {
                list.list[i].status_tip = '已过期';
                list.list[i].status_color = '#999999';
              }
            } else {
              list.list[i].status_tip = '待支付';
              list.list[i].status_color = '#cf903a';
            }
            this.activity_list.push(list.list[i]);
          }
        }).then(() => {
          callback();
        });
      },
      // 获取常用人列表
      getVisitorList(page, callback) {
        let post = { page: page, perpage: 10 };
        this.utils.ajax(this, 'ticket2/visitorList', post).then(list => {
          this.count = list.length;
          for (let i = 0; i < list.length; i++) {
            this.contacts_list.push(list[i]);
          }
        }).then(() => {
          callback();
        });
      },
    }
  };
</script>

<style lang="scss" scoped>
  .mine {
    .tab {
      margin: 40px 0 0;
      display: flex;
      justify-content: center;
      align-items: center;

      .tab-item {
        margin: 0 30px;
        font-size: 28px;
        color: #666666;
        padding-bottom: 24px;
        position: relative;

        &.tab-on {
          color: #000000;

          &:after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background-color: #ddaf71;
            border-radius: 2px;
          }
        }
      }
    }

    /*我的门票预约记录*/
    .mine-ticket {
      .ticket-item {
        background-color: #ffffff;
        padding: 30px 24px;
        margin-bottom: 23px;
        position: relative;

        .tip {
          position: absolute;
          top: 30px;
          right: 24px;
          font-size: 26px;
        }

        .text {
          font-size: 26px;
          color: #333333;
          line-height: 42px;
          margin-bottom: 15px;
          display: flex;
          align-items: flex-start;

          span {
            display: block;
            width: 115px;
            flex-shrink: 0;
            text-align-last: justify;
          }

          p {
            flex-grow: 1;
          }
        }

        .learn-more {
          margin-top: 30px;
          border-top: 4px solid #f0f0f0;
          padding-top: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          color: #666666;

          i {
            display: block;
            width: 24px;
            margin-left: 10px;
            height: 24px;
            background-image: url("../assets/icons/icon-right.png");
            background-size: auto 100%;
            background-repeat: no-repeat;
            background-position: center;
          }
        }
      }
    }

    /*我的活动预约记录*/
    .mine-activity {
      .activity-item {
        background-color: #ffffff;
        padding: 30px 24px;
        margin-bottom: 23px;
        position: relative;

        .tip {
          position: absolute;
          top: 30px;
          right: 24px;
          font-size: 26px;
        }

        .text {
          font-size: 26px;
          color: #333333;
          line-height: 42px;
          margin-bottom: 15px;
          display: flex;
          align-items: flex-start;

          span {
            flex-shrink: 0;
            display: block;
            width: 115px;
            text-align-last: justify;
          }

          p {
            flex-grow: 1;
          }
        }

        .learn-more {
          margin-top: 30px;
          border-top: 4px solid #f0f0f0;
          padding-top: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 26px;
          color: #666666;

          i {
            display: block;
            width: 24px;
            margin-left: 10px;
            height: 24px;
            background-image: url("../assets/icons/icon-right.png");
            background-size: auto 100%;
            background-repeat: no-repeat;
            background-position: center;
          }
        }
      }
    }

    /*我的常用人*/
    .mine-contacts {
      .contacts-item {
        background-color: #ffffff;
        padding: 30px 24px;
        margin-bottom: 23px;
        position: relative;

        .tip {
          position: absolute;
          top: 0;
          right: 0;
          padding: 30px 24px;
          font-size: 26px;
          color: #ac2929;
        }

        .text {
          font-size: 26px;
          color: #333333;
          line-height: 42px;
          margin-bottom: 15px;
          display: flex;
          align-items: flex-start;

          span {
            display: block;
            width: 115px;
            flex-shrink: 0;
            text-align-last: justify;
          }

          p {
            flex-grow: 1;
          }
        }
      }
    }
  }
</style>
