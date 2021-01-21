<template>
  <div class="detail-study-article page">
    <div class="cont white">
      <h3>{{detail.title}}</h3>
      <p><span>发布时间：{{detail.create_time}}</span><span>浏览量：{{detail.views}}</span></p>
      <div class="rich-box" v-html="detail.content"></div>

      <div class="share">分享至
        <div class="icon sina" @click="share"></div>
        <div class="icon wechat"></div>
        <div class="icon qq"></div>
      </div>

      <div class="page-box" v-if="study_article_list.length>0">
        <p v-if="prev_i === study_article_list.length-1" @click="prev_pages(study_article_list[prev_i].id)">
          上一篇：没有上一篇了</p>
        <p class="one-line-ellipsis" v-else @click="prev_pages(study_article_list[prev_i].id)">
          上一篇：{{study_article_list[prev_i].title}}</p>

        <p v-if="next_i===0" @click="next_pages(study_article_list[next_i].id)">下一篇：没有下一篇了</p>
        <p class="one-line-ellipsis" v-else @click="next_pages(study_article_list[next_i].id)">
          下一篇：{{study_article_list[next_i].title}}</p>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        id: 0,
        prev_i: 0,
        next_i: 2,

        detail: {},
        study_article_list: []
      };
    },
    mounted() {
      this.id = parseInt(this.$route.query.id);
      this.getStudyArticleDetail();
    },

    // 跳转本页时参数变化后重新调取新闻公告详情数据
    beforeRouteUpdate(to, from, next) {
      this.id = parseInt(to.query.id);
      this.getStudyArticleDetail();
      window.scrollTo({
        top: 0,
        behavior: "instant"
      });
      next()
    },

    methods: {
      share() {
        var sharesinastring = 'http://v.t.sina.com.cn/share/share.php?title=' + this.detail.title + '&url=' + window.location.href + '&content=utf-8&sourceUrl=' + this.detail.desc + '&pic=' + this.detail.pic;
        window.open(sharesinastring);
      },

      // 上一篇新闻
      prev_pages(id) {
        this.id = id;
        if (this.prev_i !== this.study_article_list.length - 1) {
          this.$router.replace({ name: '', query: { id: id } });
        } else {
          this.$toast('没有上一篇了')
        }
      },
      // 下一篇新闻
      next_pages(id) {
        this.id = id;
        if (this.next_i !== 0) {
          this.$router.replace({ name: '', query: { id: id } });
        } else {
          this.$toast('没有下一篇了')
        }
      },

      getStudyArticleDetail() {
        this.utils.ajax(this, 'study/studyArticleDetail', { article_id: this.id }).then(obj => {
          // console.log(obj);
          obj.create_time = this.utils.date_format(new Date(obj.create_time), 'yyyy.MM.dd');
          this.detail = obj;
        }).then(() => {
          this.getStudyArticleList();
        });
      },

      //获取新闻资讯列表
      getStudyArticleList() {
        let post = {
          // type: this.detail.type,
          page: 1,
          perpage: 1000
        };
        this.utils.ajax(this, 'study/studyArticleList', post).then(obj => {
          this.study_article_list = obj.list;
        }).then(() => {
          let obj = this.study_article_list;
          for (let i = 0; i < obj.length; i++) {
            if (obj[i].id === this.detail.id) {
              if ((i + 1) === obj.length) {
                this.prev_i = i - 1;
                this.next_i = 0;
              } else if (i === 0) {
                this.prev_i = obj.length - 1;
                this.next_i = i + 1;
              } else {
                this.prev_i = i - 1;
                this.next_i = i + 1;
              }
            }
          }
        });
      },
    }
  };
</script>

<style lang="scss" scoped>
  .detail-study-article {

    .cont {
      padding: 0 24px 60px;
      margin-top: 5px;
      margin-bottom: 14px;
      overflow: hidden;

      h3 {
        font-weight: 400;
        color: #000000;
        opacity: 0.9;
        font-size: 34px;
        margin: 40px 0;
      }

      p {
        font-size: 24px;
        color: #999999;

        span {
          margin-right: 81px;
        }
      }

      .rich-box {
        margin-top: 79px;
        font-size: 28px;
        text-align: justify;
        line-height: 42px;
        color: #666666;

        /deep/ img {
          max-width: 100%;
        }
      }

      .share {
        display: flex;
        align-items: center;
        font-size: 26px;
        color: #333333;

        .icon {
          margin-left: 40px;
          width: 55px;
          height: 55px;
          background-image: url("../assets/icons/sina.png");
          background-repeat: no-repeat;
          background-position: center;
          background-size: 100% 100%;

          &:first-child {
            margin-left: 29px;
          }

          &.wechat {
            background-image: url("../assets/icons/wechat.png");
          }

          &.qq {
            background-image: url("../assets/icons/qq.png");
          }
        }

      }

      .page-box {
        margin: 59px 0 0;

        p {
          font-size: 26px;
          color: #333333;
          margin-top: 41px;
          font-weight: bold;
        }
      }
    }
  }
</style>
