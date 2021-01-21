<template>
  <div class="news no-footer-page">

    <div class="tab-box">
      <div class="tab" :class="tab===0?'active':''" @click="tab_click(0)">全部</div>
      <div class="tab" :class="tab===1?'active':''" @click="tab_click(1)">新闻</div>
      <div class="tab" :class="tab===2?'active':''" @click="tab_click(2)">公告</div>
      <div class="tab" :class="tab===3?'active':''" @click="tab_click(3)">展览</div>
      <div class="tab" :class="tab===4?'active':''" @click="tab_click(4)">活动</div>
    </div>

    <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad">
      <ul class="com-news-list">
        <li v-for="(item,index) in news" :key="index" @click="to_new_detail(item.id)">
          <div class="img" :style="'background-image: url('+item.pic+')'"></div>
          <div class="cont">
            <h3 class="two-line-ellipsis">{{item.title}}</h3>
            <p>{{item.create_time}}</p>
            <span :class="'bg'+item.type">{{item.type_name}}</span>
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
        tab: 0,
        news: [],

        page: 0,
        loading: false,
        finished: false,
        count: 0,
      };
    },
    methods: {
      // 切换动态分类
      tab_click(num) {
        this.tab = parseInt(num);
        this.page = 0;
        this.loading = false;
        this.finished = false;
        this.count = 0;
        this.news = [];
        this.onLoad();
      },
      onLoad() {
        this.page++;
        this.getArticleList(this.tab, this.page, () => {
          this.loading = false;
          if (this.news.length >= this.count) {
            this.finished = true
          }
        })
      },

      to_new_detail(id) {
        this.$router.push({ name: 'detail_news', query: { id: id } });
      },

      //获取新闻资讯列表
      getArticleList(type, page, callback) {
        let post = {
          type: type,
          page: page,
          perpage: 10
        };
        this.utils.ajax(this, 'api/articleList', post).then(obj => {
          this.count = obj.count;
          this.utils.aliyun_format(obj.list, 'pic');
          for (let i = 0; i < obj.list.length; i++) {
            obj.list[i].create_time = this.utils.date_format(new Date(obj.list[i].create_time).getTime(), 'yyyy-MM-dd');
            this.news.push(obj.list[i]);
          }
        }).then(() => {
          callback();
        });
      },
    }
  };
</script>

<style lang="scss" scoped>
  .news {
    overflow: hidden;

    .tab-box {
      background-color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100px;
      margin-top: 2px;

      .tab {
        padding: 0 26px;
        margin: 0 20px;
        cursor: pointer;
        background-image: url("../assets/border/tab-left.png"), url("../assets/border/tab-right.png");
        background-repeat: no-repeat;
        background-position: left, right;
        background-size: 12px 25px;
        font-size: 28px;
        color: #666666;

        &.active {
          color: #cf903a;
          background-image: url("../assets/border/tab-left-select.png"), url("../assets/border/tab-right-select.png");
        }
      }
    }
  }
</style>
