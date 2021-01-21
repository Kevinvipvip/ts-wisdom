<template>
  <div class="exhibit-plan no-footer-page">
    <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad">
      <ul class="white" v-if="plan_list.length">
        <li v-for="(item,index) in plan_list" :key="'plan'+index" @click="to_plan_detail(item.id)">
          <div class="date">
            <span class="day">{{item.day}}</span>
            <span>{{item.date}}</span>
          </div>
          <div class="item-cont">
            <h3 class="one-line-ellipsis">{{item.title}}</h3>
            <p class="two-line-ellipsis">{{item.desc}}</p>
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
        plan_list: [],

        page: 0,
        loading: false,
        finished: false,
        count: 0,
      };
    },
    mounted() {
    },
    methods: {
// 点击跳转展览计划详情页
      to_plan_detail(id) {
        this.$router.push({ path: '/detail_plan', query: { id: id } });
      },
      onLoad() {
        this.page++;
        this.getDisplayArticleList(this.page, () => {
          this.loading = false;
          if (this.plan_list.length >= this.count) {
            this.finished = true
          }
        })
      },
      //获取新闻资讯列表
      getDisplayArticleList(page, callback) {
        let post = { page: page, perpage: 10 };
        this.utils.ajax(this, 'api/displayArticleList', post).then(obj => {
          this.count = obj.count;
          for (let i = 0; i < obj.list.length; i++) {
            obj.list[i].day = this.utils.date_format(new Date(obj.list[i].create_time), 'dd');
            obj.list[i].date = this.utils.date_format(new Date(obj.list[i].create_time), 'yyyy.MM');
            this.plan_list.push(obj.list[i]);
          }
        }).then(() => {
          callback();
        });
      },
    }
  };
</script>

<style lang="scss" scoped>
  .exhibit-plan {
    ul {
      margin-top: 5px;
      padding: 40px 24px;

      li {
        border: solid 1px #d0a34d;
        height: 160px;
        margin-left: 36px;
        margin-bottom: 24px;
        display: flex;

        .date {
          position: relative;
          left: -36px;
          margin-top: 20px;
          height: 111px;
          min-width: 100px;
          background-color: #d0a34d;
          display: flex;
          flex-flow: column;
          justify-content: center;
          flex-shrink: 0;
          margin-right: 21px;

          span {
            display: block;
            font-size: 20px;
            color: #ffffff;
            margin: 0 20px;

            &.day {
              font-size: 46px;
            }
          }
        }

        .item-cont {
          margin-left: -36px;
          height: 100%;
          overflow: hidden;
          text-align: justify;
          margin-right: 15px;

          h3 {
            font-size: 30px;
            font-weight: normal;
            margin-top: 15px;
            color: #333333;
          }

          p {
            margin-top: 10px;
            font-size: 26px;
            color: #666666;
          }
        }
      }
    }
  }
</style>
