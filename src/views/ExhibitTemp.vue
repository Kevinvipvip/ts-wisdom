<template>
  <div class="exhibit-temp no-footer-page">
    <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad">
      <ul class="temp-list white" v-if="temp_list.length">
        <router-link tag="li" :to="{path:'/detail_exhibit',query:{id:item.id}}"
                     v-for="(item,index) in temp_list" :key="index">
          <div class="img" :style="'background-image: url('+item.cover+')'">
            <div class="tag" :class="'bg'+item.cate_id">{{item.tag}}</div>
          </div>
          <h3 class="one-line-ellipsis">{{item.title}}{{item.title}}</h3>
        </router-link>
      </ul>
    </van-list>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        temp_list: [],

        page: 0,
        loading: false,
        finished: false,
        count: 0,
      };
    },
    mounted() {
    },
    methods: {
      onLoad() {
        this.page++;
        this.getDisplayList(this.page, () => {
          this.loading = false;
          if (this.temp_list.length >= this.count) {
            this.finished = true
          }
        })
      },
      // 获取展览列表
      getDisplayList(page, complete) {
        let post = {
          type: 1,//1为临时展览；2为常设展览；0为全部
          page: page, perpage: 5
        };
        this.utils.ajax(this, 'api/displayList', post).then(res => {
          this.count = res.count;
          this.utils.aliyun_format(res.list, 'cover');
          for (let i = 0; i < res.list.length; i++) {
            //   res.list[i].start_time = this.utils.date_format(res.list[i].start_time, 'yyyy/MM/dd');
            //   res.list[i].end_time = this.utils.date_format(res.list[i].end_time, 'yyyy/MM/dd');
            this.temp_list.push(res.list[i]);
          }
        }).then(() => {
          complete()
        });
      },
    }
  };
</script>

<style lang="scss" scoped>
  .exhibit-temp {
  }
</style>
