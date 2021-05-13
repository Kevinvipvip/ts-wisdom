<template>
  <div class="detail-activity no-footer-page">
    <div class="banner"><img :src="detail.pic"/></div>
    <div class="attr white">
      <h3>{{detail.title}}</h3>
      <p v-if="detail.limit_age===1">面向人群：<span>{{detail.min_age}} ~ {{detail.max_age}}岁</span></p>
      <p v-else>面向人群：<span>年龄不限</span></p>
      <p>活动名额：<span>{{detail.limit_num}}人</span></p>
      <p>剩余名额：<span>{{detail.num}}人</span></p>
      <p>活动时间：<span>{{detail.start_time}} ~ {{detail.end_time}}</span></p>
      <p>预约时间：<span>{{detail.start_order_time}} ~ {{detail.end_order_time}}</span></p>
      <p>活动地点：<span>{{detail.address}}</span></p>
      <p>参与费用：
        <span v-if="detail.price==='0.00'" style="color:#33b089;">免费</span>
        <span v-else class="price">￥{{detail.price}}</span></p>
    </div>
    <div class="rich-box white">
      <h2>活动详情</h2>
      <div class="rich-text" v-html="detail.content"></div>
    </div>
    <div class="btn-fixed" v-if="detail.join_btn">
      <router-link :to="{path:'/activity_input',query:{id:id}}">预约参加</router-link>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        id: 0,
        detail: {}
      };
    },
    mounted() {
      this.id = parseInt(this.$route.query.id);
      this.getActivityDetail();
    },
    methods: {
      getActivityDetail() {
        let post = { activity_id: this.id };
        this.utils.ajax(this, 'activity/activityDetail', post).then(res => {
          this.utils.aliyun_format(res);
          res.start_time = this.utils.date_format(res.start_time, 'yyyy/MM/dd周w hh:mm');
          res.end_time = this.utils.date_format(res.end_time, 'yyyy/MM/dd周w hh:mm');
          res.start_order_time = this.utils.date_format(res.start_order_time, 'yyyy/MM/dd hh:mm:ss');
          res.end_order_time = this.utils.date_format(res.end_order_time, 'yyyy/MM/dd hh:mm:ss');
          this.detail = res;
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .detail-activity {
    padding-bottom: 100px;
    overflow: hidden;

    .attr {
      padding: 0 24px;
      overflow: hidden;

      h3 {
        font-weight: 400;
        font-size: 34px;
        color: #333333;
        opacity: 0.9;
        margin: 40px 0 60px;
      }

      p {
        font-size: 26px;
        color: rgba(102, 102, 102, 0.9);
        margin-bottom: 15px;

        span {
          color: rgba(51, 51, 51, 0.9);

          &.price {
            color: rgba(200, 142, 69, 0.9);
          }
        }
      }
    }

    .rich-box {
      margin: 14px 0;
      overflow: hidden;
      padding: 0 24px;

      h2 {
        font-size: 40px;
        color: #333333;
        margin: 29px 0 48px;
      }

      .rich-text {
        font-size: 28px;
        color: #666666;
        line-height: 42px;
        margin-bottom: 67px;

        /deep/ p {
          margin: 0;
        }
      }
    }

    .btn-fixed {
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 3;
      width: 100%;
      height: 100px;
      background-color: #cf903a;

      a {
        display: flex;
        width: 100%;
        height: 100%;
        justify-content: center;
        align-items: center;
        user-select: none;
        font-size: 34px;
        color: #ffffff;
      }
    }
  }
</style>
