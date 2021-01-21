<template>
  <div class="activity no-footer-page">
    <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad">
      <ul class="com-active">
        <li v-for="(item,index) in activity" :key="index" @click="to_detail(item.id)">
          <div class="img" :style="'background-image: url('+item.pic+')'">
            <div class="type">{{item.state}}</div>
          </div>
          <div class="cont">
            <h3 class="two-line-ellipsis">{{item.title}}</h3>
            <p>活动时间：{{item.start_time}} | 剩余名额：{{item.num}}人</p>
            <p>活动地点：{{item.address}}
              <span v-if="item.price==='0.00'" style="color:#33b089;">免费</span>
              <span v-else>￥{{item.price}}</span>
            </p>
          </div>
        </li>
      </ul>
    </van-list>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        activity: [],

        page: 0,
        loading: false,
        finished: false,
        count: 0,
      };
    },
    methods: {
      onLoad() {
        this.page++;
        this.getActivityList(this.page, () => {
          this.loading = false;
          if (this.activity.length >= this.count) {
            this.finished = true
          }
        })
      },

      to_detail(id) {
        this.$router.push({ name: 'detail_activity', query: { id: id } });
      },
      //获取活动预约数据
      getActivityList(page, callback) {
        let post = { page: page, perpage: 10 };
        this.utils.ajax(this, 'activity/activityList', post).then(obj => {
          this.count = obj.count;
          this.utils.aliyun_format(obj.list, 'pic');
          for (let i = 0; i < obj.list.length; i++) {
            obj.list[i].start_time = this.utils.date_format(obj.list[i].start_time, 'yyyy-MM-dd');
            this.activity.push(obj.list[i]);
          }
        }).then(() => {
          callback();
        });
      },
    }
  };
</script>

<style lang="scss" scoped>
  .activity {
  }
</style>
