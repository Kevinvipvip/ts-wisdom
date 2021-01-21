<template>
  <div class="academic-article no-footer-page">
    <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad">
      <ul class="white">
        <router-link :to="{path:'/detail_study_article',query:{id:item.id}}" tag="li"
                     v-for="(item,index) in article" :key="index" @click="to_new_detail(item.id)">
          <h3 class="two-line-ellipsis">{{item.title}}</h3>
          <p>{{item.create_time}}</p>
        </router-link>
      </ul>
    </van-list>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        article: [],

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
        this.getStudyArticleList(this.page, () => {
          this.loading = false;
          if (this.article.length >= this.count) {
            this.finished = true
          }
        })
      },

      // 点击前往详情
      to_study_article_detail(id) {
        this.$router.push({ name: 'detail_study_article', query: { id: id, from_type: 2 } })
      },

      // 获取学术资讯列表
      getStudyArticleList(page, callback) {
        let post = { page: page, perpage: 10 };
        this.utils.ajax(this, 'study/studyArticleList', post).then(res => {
          this.count = res.count;
          for (let i = 0; i < res.list.length; i++) {
            res.list[i].create_time = this.utils.date_format(new Date(res.list[i].create_time), 'yyyy.MM.dd');
            this.article.push(res.list[i]);
          }
        }).then(() => {
          callback();
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .academic-article {
    ul {
      margin-top: 5px;

      li {
        padding: 24px 0;
        margin: 0 24px;
        border-top: 2px solid #efefef;

        &:first-child {
          border: none;
        }

        h3 {
          font-size: 28px;
          color: #333333;
          font-weight: normal;
        }

        p {
          font-size: 20px;
          color: #999999;
          margin-top: 24px;
        }
      }
    }
  }
</style>
